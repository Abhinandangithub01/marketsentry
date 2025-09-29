import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  fileIcon,
  bellIcon,
  searchIcon,
  folderIcon,
  chartLineIcon,
  clockIcon,
  caretAltUpIcon,
  caretAltDownIcon,
  arrowRightIcon,
  dollarIcon,
  chartPieIcon,
  infoCircleIcon
} from '@progress/kendo-svg-icons';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  category: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  url: string;
  imageUrl?: string;
}

interface MarketAlert {
  id: string;
  type: 'PRICE' | 'VOLUME' | 'NEWS' | 'EARNINGS';
  title: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: Date;
  symbol?: string;
}

export const MarketNews: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [newSubscription, setNewSubscription] = useState({ type: 'NEWS', keywords: '', symbol: '' });

  useEffect(() => {
    // Sample news data
    const sampleNews: NewsArticle[] = [
      {
        id: '1',
        title: 'Federal Reserve Signals Potential Rate Cut in Q4',
        summary: 'The Federal Reserve indicated in their latest meeting minutes that they may consider cutting interest rates in the fourth quarter if inflation continues to decline.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        category: 'Federal Reserve',
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: '#',
        imageUrl: 'https://via.placeholder.com/300x200?text=Fed+News'
      },
      {
        id: '2',
        title: 'Tech Stocks Rally on Strong Earnings Reports',
        summary: 'Major technology companies reported better-than-expected earnings, driving the NASDAQ to new highs. Apple, Microsoft, and Google all beat analyst expectations.',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        category: 'Technology',
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: '#',
        imageUrl: 'https://via.placeholder.com/300x200?text=Tech+Rally'
      },
      {
        id: '3',
        title: 'Oil Prices Surge on Middle East Tensions',
        summary: 'Crude oil prices jumped 4% following reports of increased tensions in the Middle East, raising concerns about supply disruptions.',
        source: 'CNBC',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        category: 'Energy',
        sentiment: 'NEGATIVE',
        impact: 'MEDIUM',
        url: '#',
        imageUrl: 'https://via.placeholder.com/300x200?text=Oil+Prices'
      },
      {
        id: '4',
        title: 'Unemployment Rate Drops to 3.5%',
        summary: 'The latest jobs report shows unemployment falling to 3.5%, the lowest level in decades, with 250,000 new jobs added last month.',
        source: 'Wall Street Journal',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        category: 'Employment',
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: '#',
        imageUrl: 'https://via.placeholder.com/300x200?text=Jobs+Report'
      },
      {
        id: '5',
        title: 'Cryptocurrency Market Shows Mixed Signals',
        summary: 'Bitcoin and Ethereum show divergent trends as regulatory clarity improves in some regions while concerns persist in others.',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        category: 'Cryptocurrency',
        sentiment: 'NEUTRAL',
        impact: 'MEDIUM',
        url: '#',
        imageUrl: 'https://via.placeholder.com/300x200?text=Crypto+News'
      },
      {
        id: '6',
        title: 'Housing Market Shows Signs of Cooling',
        summary: 'Home sales declined 2.3% month-over-month as higher mortgage rates begin to impact buyer demand across major metropolitan areas.',
        source: 'MarketWatch',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        category: 'Real Estate',
        sentiment: 'NEGATIVE',
        impact: 'MEDIUM',
        url: '#',
        imageUrl: 'https://via.placeholder.com/300x200?text=Housing+Market'
      }
    ];

    const sampleAlerts: MarketAlert[] = [
      {
        id: '1',
        type: 'PRICE',
        title: 'AAPL Price Alert',
        message: 'Apple (AAPL) has crossed above $180.00',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        symbol: 'AAPL'
      },
      {
        id: '2',
        type: 'VOLUME',
        title: 'Unusual Volume Alert',
        message: 'Tesla (TSLA) showing 300% above average volume',
        severity: 'MEDIUM',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        symbol: 'TSLA'
      },
      {
        id: '3',
        type: 'NEWS',
        title: 'Breaking News Alert',
        message: 'Federal Reserve announces emergency meeting',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: '4',
        type: 'EARNINGS',
        title: 'Earnings Alert',
        message: 'Microsoft reports Q3 earnings after market close',
        severity: 'MEDIUM',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        symbol: 'MSFT'
      }
    ];

    setNews(sampleNews);
    setAlerts(sampleAlerts);

    // Load subscriptions from localStorage
    const savedSubscriptions = localStorage.getItem('marketNewsSubscriptions');
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
  }, []);

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || article.category === categoryFilter;
    const matchesSentiment = sentimentFilter === 'ALL' || article.sentiment === sentimentFilter;
    return matchesSearch && matchesCategory && matchesSentiment;
  });

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE': return '#10b981';
      case 'NEGATIVE': return '#ef4444';
      case 'NEUTRAL': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const categoryOptions = [
    { text: 'All Categories', value: 'ALL' },
    { text: 'Federal Reserve', value: 'Federal Reserve' },
    { text: 'Technology', value: 'Technology' },
    { text: 'Energy', value: 'Energy' },
    { text: 'Employment', value: 'Employment' },
    { text: 'Cryptocurrency', value: 'Cryptocurrency' },
    { text: 'Real Estate', value: 'Real Estate' }
  ];

  const sentimentOptions = [
    { text: 'All Sentiment', value: 'ALL' },
    { text: 'Positive', value: 'POSITIVE' },
    { text: 'Negative', value: 'NEGATIVE' },
    { text: 'Neutral', value: 'NEUTRAL' }
  ];

  const positiveNews = news.filter(n => n.sentiment === 'POSITIVE').length;
  const negativeNews = news.filter(n => n.sentiment === 'NEGATIVE').length;
  const highImpactNews = news.filter(n => n.impact === 'HIGH').length;

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'rgba(30, 33, 57, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #374151',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, marginBottom: '8px' }}>
              Market News
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
              Stay updated with the latest market news and alerts
            </p>
          </div>
          <Button 
            className="nextgen-btn nextgen-btn-primary"
            onClick={() => setShowSubscribeModal(true)}
          >
            <SvgIcon icon={bellIcon} style={{ marginRight: '8px' }} />
            Subscribe to Alerts
          </Button>
        </div>

        {/* News Statistics */}
        <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px' }}>
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total Articles</div>
            <div className="nextgen-metric-value">{news.length}</div>
            <div className="nextgen-metric-change">Today's news</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Positive News</div>
            <div className="nextgen-metric-value" style={{ color: '#10b981' }}>
              {positiveNews}
            </div>
            <div className="nextgen-metric-change nextgen-metric-positive">Bullish sentiment</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Negative News</div>
            <div className="nextgen-metric-value" style={{ color: '#ef4444' }}>
              {negativeNews}
            </div>
            <div className="nextgen-metric-change nextgen-metric-negative">Bearish sentiment</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">High Impact</div>
            <div className="nextgen-metric-value" style={{ color: '#f59e0b' }}>
              {highImpactNews}
            </div>
            <div className="nextgen-metric-change">Market moving</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)}>
        <TabStripTab title="Latest News">
          <div style={{ padding: '24px 0' }}>
            {/* Filters */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#f1f5f9', 
                  marginBottom: '4px' 
                }}>
                  Filter News
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#94a3b8', 
                  margin: 0 
                }}>
                  Search and filter market news by category and sentiment
                </p>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#f1f5f9'
                  }}>
                    <SvgIcon icon={searchIcon} size="small" style={{ marginRight: '4px' }} />
                    Search
                  </label>
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.value)}
                    placeholder="Search news articles..."
                    style={{ 
                      width: '100%',
                      background: 'rgba(51, 65, 85, 0.6)',
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#f1f5f9'
                  }}>
                    <SvgIcon icon={folderIcon} size="small" style={{ marginRight: '4px' }} />
                    Category
                  </label>
                  <DropDownList
                    data={categoryOptions}
                    textField="text"
                    dataItemKey="value"
                    value={categoryOptions.find(option => option.value === categoryFilter)}
                    onChange={(e) => setCategoryFilter(e.value)}
                    style={{ 
                      width: '100%',
                      background: 'rgba(51, 65, 85, 0.6)',
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#f1f5f9'
                  }}>
                    <SvgIcon icon={chartLineIcon} size="small" style={{ marginRight: '4px' }} />
                    Sentiment
                  </label>
                  <DropDownList
                    data={sentimentOptions}
                    textField="text"
                    dataItemKey="value"
                    value={sentimentOptions.find(option => option.value === sentimentFilter)}
                    onChange={(e) => setSentimentFilter(e.value)}
                    style={{ 
                      width: '100%',
                      background: 'rgba(51, 65, 85, 0.6)',
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                
                <div>
                  <button style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('ALL');
                    setSentimentFilter('ALL');
                  }}>
                    <SvgIcon icon={arrowRightIcon} size="small" style={{ marginRight: '4px' }} />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              {filteredNews.map((article) => (
                <div key={article.id} className="market-news-card">
                  {/* Impact indicator bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: article.impact === 'HIGH' ? '#ef4444' :
                               article.impact === 'MEDIUM' ? '#f59e0b' : '#10b981'
                  }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`sentiment-badge ${
                        article.sentiment === 'POSITIVE' ? 'positive' :
                        article.sentiment === 'NEGATIVE' ? 'negative' : 'neutral'
                      }`}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <SvgIcon icon={article.sentiment === 'POSITIVE' ? caretAltUpIcon : article.sentiment === 'NEGATIVE' ? caretAltDownIcon : arrowRightIcon} size="small" />
                          {article.sentiment === 'POSITIVE' ? 'BULLISH' : article.sentiment === 'NEGATIVE' ? 'BEARISH' : 'NEUTRAL'}
                        </span>
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#a5b4fc',
                        border: '1px solid #6366f140',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <SvgIcon icon={folderIcon} size="small" style={{ marginRight: '4px' }} />
                        {article.category}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#94a3b8',
                      background: 'rgba(148, 163, 184, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                        <SvgIcon icon={clockIcon} size="small" style={{ marginRight: '4px' }} />
                        {getTimeAgo(article.publishedAt)}
                    </span>
                  </div>

                  <h3>
                    {article.title}
                  </h3>

                  <p style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.6', 
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.summary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="source">
                      <SvgIcon icon={fileIcon} size="small" style={{ marginRight: '4px' }} />
                      <span style={{ fontSize: '0.875rem' }}>
                        {article.source}
                      </span>
                    </div>
                    <Button 
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <SvgIcon icon={arrowRightIcon} size="small" style={{ marginRight: '4px' }} />
                      Read More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Market Alerts">
          <div style={{ padding: '24px 0' }}>
            <div style={{
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: '#f1f5f9', 
                  marginBottom: '8px' 
                }}>
                  Real-Time Market Alerts
                </h2>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#94a3b8', 
                  margin: 0 
                }}>
                  Latest market movements and notifications
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {alerts.map((alert) => (
                  <div key={alert.id} style={{
                    padding: '24px',
                    background: 'rgba(51, 65, 85, 0.6)',
                    borderRadius: '12px',
                    border: '1px solid #475569',
                    borderLeft: `4px solid ${
                      alert.severity === 'HIGH' ? '#ef4444' :
                      alert.severity === 'MEDIUM' ? '#f59e0b' : '#10b981'
                    }`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: alert.type === 'PRICE' ? 'rgba(6, 182, 212, 0.2)' :
                                     alert.type === 'VOLUME' ? 'rgba(245, 158, 11, 0.2)' :
                                     alert.type === 'NEWS' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: alert.type === 'PRICE' ? '#06b6d4' :
                                alert.type === 'VOLUME' ? '#f59e0b' :
                                alert.type === 'NEWS' ? '#ef4444' : '#10b981',
                          border: `1px solid ${alert.type === 'PRICE' ? '#06b6d4' :
                                              alert.type === 'VOLUME' ? '#f59e0b' :
                                              alert.type === 'NEWS' ? '#ef4444' : '#10b981'}40`
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <SvgIcon icon={alert.type === 'PRICE' ? dollarIcon : alert.type === 'VOLUME' ? chartPieIcon : alert.type === 'NEWS' ? fileIcon : chartLineIcon} size="small" />
                            {alert.type}
                          </span>
                        </span>
                        {alert.symbol && (
                          <span style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '700', 
                            color: '#6366f1',
                            fontFamily: 'JetBrains Mono, monospace',
                            background: 'rgba(99, 102, 241, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}>
                            {alert.symbol}
                          </span>
                        )}
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#94a3b8',
                        background: 'rgba(148, 163, 184, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}>
                        {getTimeAgo(alert.timestamp)}
                      </span>
                    </div>

                    <h4 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700', 
                      color: '#f1f5f9', 
                      marginBottom: '8px',
                      letterSpacing: '-0.025em'
                    }}>
                      {alert.title}
                    </h4>

                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#cbd5e1', 
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      {alert.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Market Sentiment">
          <div style={{ padding: '24px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
              {/* Sentiment Overview */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #374151',
                borderRadius: '16px',
                padding: '32px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#f1f5f9', 
                    marginBottom: '8px' 
                  }}>
                    Overall Market Sentiment
                  </h2>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: '#94a3b8', 
                    margin: 0 
                  }}>
                    Based on news analysis
                  </p>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{ 
                    fontSize: '4rem', 
                    fontWeight: '900', 
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                  }}>
                    📈 Bullish
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    color: '#cbd5e1',
                    fontWeight: '500'
                  }}>
                    Market sentiment is positive
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.25rem' }}>📈</span>
                        <span style={{ color: '#10b981', fontWeight: '600', fontSize: '1rem' }}>Positive</span>
                      </div>
                      <span style={{ 
                        color: '#10b981', 
                        fontWeight: '700',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}>
                        {positiveNews} articles
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(positiveNews / news.length) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.25rem' }}>➡️</span>
                        <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '1rem' }}>Neutral</span>
                      </div>
                      <span style={{ 
                        color: '#f59e0b', 
                        fontWeight: '700',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}>
                        {news.filter(n => n.sentiment === 'NEUTRAL').length} articles
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(news.filter(n => n.sentiment === 'NEUTRAL').length / news.length) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.25rem' }}>📉</span>
                        <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '1rem' }}>Negative</span>
                      </div>
                      <span style={{ 
                        color: '#ef4444', 
                        fontWeight: '700',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}>
                        {negativeNews} articles
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(negativeNews / news.length) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trending Topics */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #374151',
                borderRadius: '16px',
                padding: '32px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#f1f5f9', 
                    marginBottom: '8px' 
                  }}>
                    Trending Topics
                  </h2>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: '#94a3b8', 
                    margin: 0 
                  }}>
                    Most discussed topics today
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Federal Reserve', 'Technology', 'Energy', 'Employment', 'Cryptocurrency'].map((topic, index) => (
                    <div key={topic} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'rgba(51, 65, 85, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid #475569',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          color: 'white'
                        }}>
                          #{index + 1}
                        </div>
                        <span style={{ 
                          fontWeight: '600', 
                          color: '#f1f5f9',
                          fontSize: '1rem'
                        }}>
                          {topic}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          color: '#94a3b8',
                          background: 'rgba(148, 163, 184, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '8px'
                        }}>
                          {news.filter(n => n.category === topic).length} articles
                        </span>
                        <SvgIcon icon={caretAltUpIcon} size="medium" style={{ color: '#ef4444' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabStripTab>
      </TabStrip>

      {/* Subscribe to Alerts Modal */}
      {showSubscribeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(30, 33, 57, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid #374151',
            borderRadius: '24px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                <SvgIcon icon={bellIcon} style={{ marginRight: '8px' }} />
              Subscribe to Market Alerts
              </h2>
              <button
                onClick={() => setShowSubscribeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
              Get notified about market news, price movements, and important events
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#f1f5f9'
                }}>
                  Alert Type
                </label>
                <select
                  value={newSubscription.type}
                  onChange={(e) => setNewSubscription({...newSubscription, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(51, 65, 85, 0.6)',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="NEWS">News Alerts</option>
                  <option value="PRICE">Price Alerts</option>
                  <option value="VOLUME">Volume Alerts</option>
                  <option value="EARNINGS">Earnings Alerts</option>
                </select>
              </div>

              {newSubscription.type === 'NEWS' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#f1f5f9'
                  }}>
                    Keywords (comma-separated)
                  </label>
                  <Input
                    value={newSubscription.keywords}
                    onChange={(e) => setNewSubscription({...newSubscription, keywords: e.value})}
                    placeholder="e.g., Federal Reserve, inflation, earnings"
                    style={{
                      width: '100%',
                      background: 'rgba(51, 65, 85, 0.6)',
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}

              {(newSubscription.type === 'PRICE' || newSubscription.type === 'VOLUME' || newSubscription.type === 'EARNINGS') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#f1f5f9'
                  }}>
                    Stock Symbol
                  </label>
                  <Input
                    value={newSubscription.symbol}
                    onChange={(e) => setNewSubscription({...newSubscription, symbol: e.value.toUpperCase()})}
                    placeholder="e.g., AAPL, MSFT, TSLA"
                    style={{
                      width: '100%',
                      background: 'rgba(51, 65, 85, 0.6)',
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <Button
                  onClick={() => setShowSubscribeModal(false)}
                  style={{
                    background: 'rgba(148, 163, 184, 0.2)',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const subscriptionKey = newSubscription.type === 'NEWS' 
                      ? `${newSubscription.type}:${newSubscription.keywords}`
                      : `${newSubscription.type}:${newSubscription.symbol}`;
                    
                    if (!subscriptions.includes(subscriptionKey)) {
                      const updatedSubscriptions = [...subscriptions, subscriptionKey];
                      setSubscriptions(updatedSubscriptions);
                      localStorage.setItem('marketNewsSubscriptions', JSON.stringify(updatedSubscriptions));
                    }
                    
                    setNewSubscription({ type: 'NEWS', keywords: '', symbol: '' });
                    setShowSubscribeModal(false);
                    
                    // Show success notification
                    alert('✅ Successfully subscribed to alerts!');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
