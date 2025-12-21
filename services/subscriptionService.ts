import { SUBSCRIPTION_STORAGE_KEY, SUBSCRIPTION_PLANS } from '../constants';
import { OrgConfig, OrgAccount, SubscriptionPlanId, SubscriptionState } from '../types';

const isPlanId = (value: unknown): value is SubscriptionPlanId => {
  return value === 'personal' || value === 'enterprise' || value === 'government';
};

const safeParseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const isOrgAccount = (value: unknown): value is OrgAccount => {
  if (!value || typeof value !== 'object') return false;
  const v = value as any;
  return (
    typeof v.id === 'string' &&
    typeof v.displayName === 'string' &&
    (v.role === 'admin' || v.role === 'member') &&
    typeof v.createdAt === 'number'
  );
};

const isOrgConfig = (value: unknown): value is OrgConfig => {
  if (!value || typeof value !== 'object') return false;
  const v = value as any;
  const accountsOk = Array.isArray(v.accounts) && v.accounts.every(isOrgAccount);
  const settingsOk =
    v.settings &&
    typeof v.settings === 'object' &&
    typeof v.settings.aiChatEnabled === 'boolean' &&
    typeof v.settings.visionEnabled === 'boolean';
  const nameOk = v.orgName === undefined || typeof v.orgName === 'string';
  return accountsOk && settingsOk && nameOk;
};

const defaultOrgConfig = (): OrgConfig => ({
  accounts: [],
  settings: {
    aiChatEnabled: true,
    visionEnabled: true,
  },
});

export const SubscriptionService = {
  load(): SubscriptionState {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (!raw) return { status: 'none' };

    const parsed = safeParseJson(raw);
    if (!parsed || typeof parsed !== 'object') return { status: 'none' };

    const data = parsed as Partial<SubscriptionState>;
    if (data.status !== 'active') return { status: 'none' };
    if (!isPlanId(data.planId)) return { status: 'none' };

    return {
      status: 'active',
      planId: data.planId,
      planName: typeof data.planName === 'string' ? data.planName : undefined,
      startedAt: typeof data.startedAt === 'number' ? data.startedAt : undefined,
      renewAt: typeof data.renewAt === 'number' ? data.renewAt : undefined,
      orgConfig: isOrgConfig((data as any).orgConfig) ? (data as any).orgConfig : undefined,
    };
  },

  save(state: SubscriptionState) {
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Subscription save error:', e);
    }
  },

  activate(planId: SubscriptionPlanId): SubscriptionState {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    const now = Date.now();
    const nextMonth = now + 30 * 24 * 60 * 60 * 1000;

    const next: SubscriptionState = {
      status: 'active',
      planId,
      planName: plan?.name ?? planId,
      startedAt: now,
      renewAt: nextMonth,
    };

    if (planId !== 'personal') {
      next.orgConfig = defaultOrgConfig();
    }

    this.save(next);
    return next;
  },

  clear(): SubscriptionState {
    try {
      localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
    } catch (e) {
      console.error('Subscription clear error:', e);
    }
    return { status: 'none' };
  }
};
