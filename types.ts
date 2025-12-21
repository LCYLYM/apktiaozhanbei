export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  OFFLINE_MEDICAL = 'OFFLINE_MEDICAL',
  OFFLINE_POLICE = 'OFFLINE_POLICE',
  AI_CENTER = 'AI_CENTER',
  SOS_TOOLS = 'SOS_TOOLS',
  PROFILE = 'PROFILE',
  PRICING = 'PRICING',
  CHECKOUT = 'CHECKOUT'
}

export type SubscriptionPlanId = 'personal' | 'enterprise' | 'government';

export type SubscriptionStatus = 'none' | 'active';

export interface SubscriptionState {
  status: SubscriptionStatus;
  planId?: SubscriptionPlanId;
  planName?: string;
  startedAt?: number;
  renewAt?: number;
  orgConfig?: OrgConfig;
}

export type OrgAccountRole = 'admin' | 'member';

export interface OrgAccount {
  id: string;
  displayName: string;
  role: OrgAccountRole;
  createdAt: number;
}

export interface OrgConfig {
  orgName?: string;
  accounts: OrgAccount[];
  settings: {
    aiChatEnabled: boolean;
    visionEnabled: boolean;
  };
}

export enum AppLanguage {
  ZH = 'zh', // Chinese
  EN = 'en', // English
  ES = 'es', // Spanish
  FR = 'fr', // French
  DE = 'de', // German
  JP = 'ja', // Japanese
  KR = 'ko', // Korean
  RU = 'ru', // Russian
  IT = 'it', // Italian
  PT = 'pt', // Portuguese
  TH = 'th', // Thai
  AR = 'ar'  // Arabic
}

export interface UserProfile {
  name: string;
  bloodType: string;
  allergies: string;
  insuranceId: string;
  emergencyContact: string;
  medicalConditions: string;
}

export interface DictionaryItem {
  id: string;
  term: Record<string, string>; // language code -> text
  category: 'medical' | 'police' | 'general';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  translation?: string;
  medicalNote?: string;
  image?: string; // base64
  tag?: string;
}
