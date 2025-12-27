import React, { useState, useEffect } from 'react';
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

  const renderView = () => {
    switch (view) {
      case ViewState.OFFLINE_MEDICAL:
        return <OfflineMode onBack={() => setView(ViewState.DASHBOARD)} userProfile={userProfile} />;
      case ViewState.OFFLINE_POLICE:
        return (
          <OfflinePolice
            onBack={() => setView(ViewState.DASHBOARD)}
          />
        );
      case ViewState.AI_CENTER:
        if (subscription.status !== 'active') {
          return (
            <Pricing
              onBack={() => setView(ViewState.DASHBOARD)}
              onSelectPlan={handleSelectPlan}
              subscription={subscription}
              onCancelSubscription={handleCancelSubscription}
            />
          );
        }
        return <AiAssistant onBack={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.SOS_TOOLS:
        return <SosTools onBack={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.PROFILE:
        return (
          <Profile
            onBack={() => setView(ViewState.DASHBOARD)}
            currentProfile={userProfile}
            onSave={handleProfileSave}
            subscription={subscription}
            onCancelSubscription={handleCancelSubscription}
          />
        );
      case ViewState.PRICING:
        return (
          <Pricing
            onBack={() => setView(ViewState.DASHBOARD)}
            onSelectPlan={handleSelectPlan}
            subscription={subscription}
            onCancelSubscription={handleCancelSubscription}
          />
        );
      case ViewState.CHECKOUT:
        return (
          <Checkout
            planId={selectedPlanId}
            onBack={() => setView(ViewState.PRICING)}
            onSuccess={handleCheckoutSuccess}
          />
        );
      case ViewState.DASHBOARD:
      default:
        return <BentoGrid onNavigate={setView} isOnline={isOnline} hasSubscription={subscription.status === 'active'} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto relative overflow-hidden shadow-2xl bg-[#f0f2f5]">
      
      {/* --- Glassmorphism Background Blobs --- */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[50%] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[50%] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute inset-0 bg-white/20 z-0"></div> {/* Noise/Texture overlay could go here */}

      {/* Main Content Area */}
      <div className="relative z-10 h-full">
         {renderView()}
      </div>
    </div>
  );
};

export default App;