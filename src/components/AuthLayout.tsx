import React from 'react';
import {
  ChefHatIcon,
  UtensilsIcon,
  ChartBarsIcon,
  UsersGroupIcon,
  SettingsCogIcon,
} from './Icons';

interface AuthLayoutProps {
  currentView: 'login' | 'register';
  onChangeView: (view: 'login' | 'register') => void;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  currentView,
  onChangeView,
  children,
}) => {
  return (
    <div className="auth-page-wrapper">
      {/* Outer framing container styled like the reference */}
      <div className="app-frame-card">
        {/* Left Side: Dark Ambient Restaurant Visual */}
        <section className="restaurant-showcase-panel" aria-label="Restaurant Brand Showcase">
          <div className="showcase-overlay" />
          
          <div className="showcase-inner">
            {/* Top Brand Header */}
            <div className="showcase-brand">
              <div className="showcase-brand-icon">
                <ChefHatIcon size={34} />
              </div>
              <h1 className="showcase-brand-name">Savoria</h1>
              <p className="showcase-brand-sub">Restaurant Order Management System</p>
              <div className="brand-accent-line" />
            </div>

            {/* Middle Messaging */}
            <div className="showcase-headline-wrap">
              {currentView === 'login' ? (
                <>
                  <h2 className="showcase-title">
                    Good Food<br />
                    Better <span className="gold-text">Experiences</span>
                  </h2>
                  <p className="showcase-desc">
                    Manage orders, streamline operations, and create exceptional dining experiences — all in one place.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="showcase-title">
                    Join Our<br />
                    <span className="gold-text italic-serif">Restaurant Family</span>
                  </h2>
                  <p className="showcase-desc">
                    Create your account and be a part of Savoria. Whether you're a customer or part of our staff, we're excited to have you.
                  </p>
                </>
              )}
            </div>

            {/* Bottom 3 Circular Features */}
            <div className="showcase-features-row">
              {currentView === 'login' ? (
                <>
                  <div className="feature-circle-item">
                    <div className="feature-circle-icon">
                      <UtensilsIcon size={20} />
                    </div>
                    <span className="feature-circle-label">
                      Faster<br />Order Processing
                    </span>
                  </div>

                  <div className="feature-circle-item">
                    <div className="feature-circle-icon">
                      <ChefHatIcon size={20} />
                    </div>
                    <span className="feature-circle-label">
                      Smoother<br />Kitchen Operations
                    </span>
                  </div>

                  <div className="feature-circle-item">
                    <div className="feature-circle-icon">
                      <ChartBarsIcon size={20} />
                    </div>
                    <span className="feature-circle-label">
                      Happier<br />Customers
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="feature-circle-item">
                    <div className="feature-circle-icon">
                      <UsersGroupIcon size={20} />
                    </div>
                    <span className="feature-circle-label">
                      Work Together<br />as a Team
                    </span>
                  </div>

                  <div className="feature-circle-item">
                    <div className="feature-circle-icon">
                      <SettingsCogIcon size={20} />
                    </div>
                    <span className="feature-circle-label">
                      Efficient<br />Restaurant Operations
                    </span>
                  </div>

                  <div className="feature-circle-item">
                    <div className="feature-circle-icon">
                      <ChartBarsIcon size={20} />
                    </div>
                    <span className="feature-circle-label">
                      Better<br />Dining Experiences
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Cream Authentication Card */}
        <section className="auth-form-panel" aria-label="Authentication Form">
          {/* Quick interactive view switch toggle */}
          <div className="mobile-view-tabs">
            <button
              type="button"
              className={`tab-btn ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => onChangeView('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab-btn ${currentView === 'register' ? 'active' : ''}`}
              onClick={() => onChangeView('register')}
            >
              Register
            </button>
          </div>

          <div className="form-content-scroll">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
};
