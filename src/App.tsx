import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import '@progress/kendo-theme-default/dist/all.css';
import './styles/emergency-complete-fix.css';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  fileIcon, 
  chartLineIcon,
  caretAltUpIcon,
  bellIcon,
  userIcon,
  calendarIcon,
  homeIcon,
  plusIcon,
  searchIcon,
  starIcon
} from '@progress/kendo-svg-icons';
import { PortfolioModern } from './pages/PortfolioModern';
import { Spending } from './pages/Spending';
import { MarketNews } from './pages/MarketNews';
import Crypto from './pages/Crypto';
import { AIAnalysis } from './pages/AIAnalysis';
import { FinanceNews } from './pages/FinanceNews';
import { TradingJournalModern } from './pages/TradingJournalModern';
import { EconomicCalendarModern } from './pages/EconomicCalendarModern';
import { KendoShowcase } from './pages/KendoShowcase';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Portfolio', icon: homeIcon },
    { path: '/spending', label: 'Spending', icon: fileIcon },
    { path: '/market-news', label: 'Market News', icon: fileIcon },
    { path: '/crypto-prices-news', label: 'Crypto Prices & News', icon: chartLineIcon },
    { path: '/ai-analysis', label: 'AI Analysis', icon: caretAltUpIcon },
    { path: '/finance-news', label: 'Finance News and Economic Calendar', icon: calendarIcon },
    { path: '/trading-journal', label: 'Trading Journal', icon: chartLineIcon },
    { path: '/kendo-showcase', label: 'Kendo Showcase', icon: starIcon }
  ];

  return (
    <nav className="nextgen-nav">
      <div style={{ padding: '24px' }}>
        <Link to="/" className="nextgen-nav-brand">
          <div className="nextgen-nav-brand-icon">
            <SvgIcon icon={chartLineIcon} size="large" />
          </div>
          MarketSentry
        </Link>
      </div>
      
      <div className="nextgen-nav-section">
        <div className="nextgen-nav-section-title">Main</div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nextgen-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="nextgen-nav-icon">
              <SvgIcon icon={item.icon} size="medium" />
            </div>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const Header: React.FC = () => {
  return (
    <header className="nextgen-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          padding: '8px 16px', 
          background: 'rgba(16, 185, 129, 0.2)', 
          borderRadius: '20px',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#10b981',
          fontSize: '0.875rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🟢 MARKET OPEN
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Portfolio: <span style={{ color: '#10b981', fontWeight: '600' }}>$67,974 +8.46%</span>
        </div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'rgba(99, 102, 241, 0.2)', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6366f1',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          <SvgIcon icon={bellIcon} size="medium" />
        </div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'rgba(99, 102, 241, 0.2)', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6366f1',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          <SvgIcon icon={userIcon} size="medium" />
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="nextgen-app">
        <Navigation />
        <div className="nextgen-main">
          <Header />
          <main className="nextgen-container">
            <Routes>
              <Route path="/" element={<PortfolioModern />} />
              <Route path="/spending" element={<Spending />} />
              <Route path="/market-news" element={<MarketNews />} />
              <Route path="/crypto-prices-news" element={<Crypto />} />
              <Route path="/ai-analysis" element={<AIAnalysis />} />
              <Route path="/finance-news" element={<FinanceNews />} />
              <Route path="/trading-journal" element={<TradingJournalModern />} />
              <Route path="/kendo-showcase" element={<KendoShowcase />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
