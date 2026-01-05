import React, { useState, useEffect, useRef } from 'react';
import BentoGrid from './components/BentoGrid';
import OfflineMode from './components/OfflineMode';
import OfflinePolice from './components/OfflinePolice';
import AiAssistant from './components/AiAssistant';
import SosTools from './components/SosTools';
import Profile from './components/Profile';
import Pricing from './components/Pricing';
import Checkout from './components/Checkout';
import { ViewState, UserProfile } from './types';
import { INITIAL_PROFILE } from './constants';
import { SubscriptionService } from './services/subscriptionService';
import { SubscriptionPlanId, SubscriptionState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [subscription, setSubscription] = useState<SubscriptionState>({ status: 'none' });
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('personal');

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
    // Load profile from local storage
    const saved = localStorage.getItem('resq_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Profile parse error', e);
      }
    }

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
    // Initialize history with two entries so that pressing back from the
    // dashboard does not immediately exit the app (common in Android WebViews).
    window.history.replaceState({ view: ViewState.DASHBOARD }, '');
    window.history.pushState({ view: ViewState.DASHBOARD }, '');
    navStackRef.current = [ViewState.DASHBOARD, ViewState.DASHBOARD];

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
        // Remove our popstate listener guard and go back one step in history to exit.
        // Some environments may close the app on history.back(); this attempts that.
        window.removeEventListener('popstate', onPop);
        window.history.go(-1);
        return;
      }

      // First back: show prompt and re-push a dashboard state to stay in-app
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

      window.history.pushState({ view: ViewState.DASHBOARD }, '');
      navStackRef.current.push(ViewState.DASHBOARD);
      popNavigationRef.current = true;
      setView(ViewState.DASHBOARD);
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
    localStorage.setItem('resq_profile', JSON.stringify(profile));
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