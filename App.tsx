import React, { useState, useEffect, useRef } from 'react';
import BentoGrid from './components/BentoGrid';
import OfflineMode from './components/OfflineMode';
import OfflinePolice from './components/OfflinePolice';
import AiAssistant from './components/AiAssistant';
import SosTools from './components/SosTools';
import Profile from './components/Profile';
import Pricing from './components/Pricing';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import { ViewState, UserProfile } from './types';
import { INITIAL_PROFILE } from './constants';
import { SubscriptionService } from './services/subscriptionService';
import { SubscriptionPlanId, SubscriptionState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [subscription, setSubscription] = useState<SubscriptionState>({ status: 'none' });
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('personal');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);

  // Double-back to exit on dashboard
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const lastBackRef = useRef<number | null>(null);
  const exitPromptTimeoutRef = useRef<number | null>(null);

  // Control container background so incoming page background is painted before transition
  const viewBackground = (v: ViewState) => {
    switch (v) {
      case ViewState.DASHBOARD:
        return '#f0f2f5';
      default:
        return '#ffffff';
    }
  };
  const [containerBg, setContainerBg] = useState<string>(viewBackground(view));

  useEffect(() => {
    // Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load subscription state
    try {
      setSubscription(SubscriptionService.load());
    } catch (e) {
      console.error('Subscription load error:', e);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle hardware/browser back button: map history states to app views so
  // pressing back navigates between app screens instead of exiting immediately.
  const popNavigationRef = useRef(false);
  const navStackRef = useRef<ViewState[]>([ViewState.DASHBOARD]);

  useEffect(() => {
    // Initialize history with a single login entry; we'll handle double-back manually.
    window.history.replaceState({ view: ViewState.LOGIN }, '');
    navStackRef.current = [ViewState.LOGIN];

    const onPop = (_e: PopStateEvent) => {
      // If we have a previous view in our stack, pop and navigate to it.
      if (navStackRef.current.length > 1) {
        navStackRef.current.pop();
        const top = navStackRef.current[navStackRef.current.length - 1];
        popNavigationRef.current = true;
        setView(top);
        return;
      }

      // No previous view: implement double-back-to-exit on dashboard.
      const now = Date.now();
      const last = lastBackRef.current;
      const EXIT_THRESHOLD = 2000; // ms

      if (last && now - last < EXIT_THRESHOLD) {
        // Second back within threshold: allow native exit (navigate back in history)
        window.removeEventListener('popstate', onPop);
        window.history.back();
        return;
      }

      // First back: show prompt and re-insert a history entry to keep the app in place
      setShowExitPrompt(true);
      lastBackRef.current = now;
      if (exitPromptTimeoutRef.current) {
        window.clearTimeout(exitPromptTimeoutRef.current);
      }
      exitPromptTimeoutRef.current = window.setTimeout(() => {
        setShowExitPrompt(false);
        lastBackRef.current = null;
        exitPromptTimeoutRef.current = null;
      }, EXIT_THRESHOLD);

      // Push a transient state so user stays in-app; do not modify navStackRef (it's an internal stack of app views)
      window.history.pushState({ view: ViewState.LOGIN }, '');
      popNavigationRef.current = true;
    };

    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (exitPromptTimeoutRef.current) {
        window.clearTimeout(exitPromptTimeoutRef.current);
      }
    };
  }, []);

  // Push a history entry whenever the app view changes (unless the change
  // originates from a popstate navigation), enabling back navigation.
  useEffect(() => {
    if (popNavigationRef.current) {
      popNavigationRef.current = false;
      return;
    }

    // Normal navigation: push the new view and record it in our stack.
    window.history.pushState({ view }, '');
    navStackRef.current.push(view);
  }, [view]);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);

    // 将个人档案保存到用户账号中
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('resq_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);

      if (userIndex !== -1) {
        users[userIndex].profile = profile;
        localStorage.setItem('resq_users', JSON.stringify(users));
      }
    }
  };

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    setSelectedPlanId(planId);
    setView(ViewState.CHECKOUT);
  };

  const handleCheckoutSuccess = (planId: SubscriptionPlanId) => {
    const next = SubscriptionService.activate(planId);
    setSubscription(next);
    setView(ViewState.AI_CENTER);
  };

  const handleCancelSubscription = () => {
    const next = SubscriptionService.clear();
    setSubscription(next);
  };

  const handleLogin = async (email: string, password: string) => {
    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查本地存储中是否有用户数据
    const users = JSON.parse(localStorage.getItem('resq_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser({ email: user.email, name: user.name });

      // 加载用户绑定的个人档案
      if (user.profile) {
        setUserProfile(user.profile);
      } else {
        setUserProfile({ ...INITIAL_PROFILE, name: user.name });
      }

      setView(ViewState.DASHBOARD);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    // 模拟注册
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查邮箱是否已注册
    const users = JSON.parse(localStorage.getItem('resq_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }

    // 初始化用户个人档案
    const userProfile = { ...INITIAL_PROFILE, name };

    // 保存新用户
    const newUser = { email, password, name, createdAt: Date.now(), profile: userProfile };
    users.push(newUser);
    localStorage.setItem('resq_users', JSON.stringify(users));

    // 自动登录
    setIsAuthenticated(true);
    setCurrentUser({ email, name });
    setUserProfile(userProfile);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setView(ViewState.LOGIN);
  };

  // Slide transition state and logic (single animation)
  const [displayView, setDisplayView] = useState<ViewState>(view);
  const [transitioning, setTransitioning] = useState(false);
  const [animDirection, setAnimDirection] = useState<'forward' | 'back' | null>(null);
  const [overlayView, setOverlayView] = useState<ViewState | null>(null);
  const [overlayTransform, setOverlayTransform] = useState('translateX(0%)');
  const transitionDuration = 220; // ms

  useEffect(() => {
    if (view === displayView) return;

    const isBack = popNavigationRef.current;

    // Ensure target view background is rendered first
    setContainerBg(viewBackground(view));

    setTransitioning(true);
    setAnimDirection(isBack ? 'back' : 'forward');

    if (!isBack) {
      // Forward navigation: overlay is incoming view; slide it in from right
      setOverlayView(view);
      setOverlayTransform('translateX(100%)');
      // start animation next tick
      setTimeout(() => setOverlayTransform('translateX(0%)'), 20);
    } else {
      // Back navigation: overlay is current display view; slide it out to right
      setOverlayView(displayView);
      setOverlayTransform('translateX(0%)');
      setTimeout(() => setOverlayTransform('translateX(100%)'), 20);
    }

    const t = setTimeout(() => {
      setDisplayView(view);
      setOverlayView(null);
      setTransitioning(false);
      setAnimDirection(null);
      setOverlayTransform('translateX(0%)');
    }, transitionDuration + 40);

    return () => clearTimeout(t);
  }, [view]);

  const renderViewFor = (v: ViewState) => {
    switch (v) {
      case ViewState.LOGIN:
        return <Login onLogin={handleLogin} onRegister={() => setView(ViewState.REGISTER)} />;
      case ViewState.REGISTER:
        return <Register onBack={() => setView(ViewState.LOGIN)} onRegister={handleRegister} />;
      case ViewState.OFFLINE_MEDICAL:
        return <OfflineMode onBack={() => window.history.back()} userProfile={userProfile} />;
      case ViewState.OFFLINE_POLICE:
        return (
          <OfflinePolice
            onBack={() => window.history.back()}
          />
        );
      case ViewState.AI_CENTER:
        if (subscription.status !== 'active') {
          return (
            <Pricing
              onBack={() => window.history.back()}
              onSelectPlan={handleSelectPlan}
              subscription={subscription}
              onCancelSubscription={handleCancelSubscription}
            />
          );
        }
        return <AiAssistant onBack={() => window.history.back()} />;
      case ViewState.SOS_TOOLS:
        return <SosTools onBack={() => window.history.back()} />;
      case ViewState.PROFILE:
        return (
          <Profile
            onBack={() => window.history.back()}
            currentProfile={userProfile}
            onSave={handleProfileSave}
            subscription={subscription}
            onCancelSubscription={handleCancelSubscription}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );
      case ViewState.PRICING:
        return (
          <Pricing
            onBack={() => window.history.back()}
            onSelectPlan={handleSelectPlan}
            subscription={subscription}
            onCancelSubscription={handleCancelSubscription}
          />
        );
      case ViewState.CHECKOUT:
        return (
          <Checkout
            planId={selectedPlanId}
            onBack={() => window.history.back()}
            onSuccess={handleCheckoutSuccess}
          />
        );
      case ViewState.DASHBOARD:
      default:
        return <BentoGrid onNavigate={setView} isOnline={isOnline} hasSubscription={subscription.status === 'active'} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto relative overflow-hidden shadow-2xl" style={{ background: containerBg }}>
      
      {/* --- Glassmorphism Background Blobs --- */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[50%] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[50%] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute inset-0 bg-white/20 z-0"></div> {/* Noise/Texture overlay could go here */}

      {/* Main Content Area with slide transitions */}
      <div className="relative z-10 h-full overflow-hidden">
        {/* No transition: show display view */}
        {!transitioning && (
          <div className="absolute inset-0" style={{ zIndex: 10 }}>{renderViewFor(displayView)}</div>
        )}

        {/* Exit prompt */}
        {showExitPrompt && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50">
            <div className="bg-black/80 text-white text-sm px-4 py-2 rounded-full shadow-md">再按一次退出应用</div>
          </div>
        )}

        {/* Forward navigation: base = displayView (static), overlay = incoming slides in from right */}
        {transitioning && animDirection === 'forward' && (
          <>
            <div className="absolute inset-0" style={{ zIndex: 10 }}>{renderViewFor(displayView)}</div>
            {overlayView && (
              <div
                className="absolute inset-0"
                style={{
                  transform: overlayTransform,
                  transition: `transform ${transitionDuration}ms cubic-bezier(.22,.9,.36,1)`,
                  zIndex: 50,
                  pointerEvents: 'auto',
                  background: 'transparent',
                }}
              >
                {renderViewFor(overlayView)}
              </div>
            )}
          </>
        )}

        {/* Back navigation: base = view (target, static), overlay = current slides out to right */}
        {transitioning && animDirection === 'back' && (
          <>
            <div className="absolute inset-0" style={{ zIndex: 10 }}>{renderViewFor(view)}</div>
            {overlayView && (
              <div
                className="absolute inset-0"
                style={{
                  transform: overlayTransform,
                  transition: `transform ${transitionDuration}ms cubic-bezier(.22,.9,.36,1)`,
                  zIndex: 50,
                  pointerEvents: 'auto',
                  background: 'transparent',
                }}
              >
                {renderViewFor(overlayView)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;