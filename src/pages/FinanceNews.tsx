import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { DatePicker, Calendar } from '@progress/kendo-react-dateinputs';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  bellIcon,
  caretAltUpIcon,
  caretAltDownIcon,
  arrowRightIcon,
  fileIcon,
  clockIcon,
  globeIcon,
  chartLineIcon,
  infoCircleIcon,
  calendarIcon,
  caretAltLeftIcon,
  caretAltRightIcon
} from '@progress/kendo-svg-icons';

interface FinanceNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  category: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  url: string;
  tags: string[];
}

interface EconomicEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  country: string;
  currency: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  description: string;
}

export const FinanceNews: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [financeNews, setFinanceNews] = useState<FinanceNews[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('ALL');
  const [eventImpactFilter, setEventImpactFilter] = useState('ALL');
  const [eventCountryFilter, setEventCountryFilter] = useState('ALL');

  useEffect(() => {
    // Sample finance news
    const sampleFinanceNews: FinanceNews[] = [
      {
        id: '1',
        title: 'Federal Reserve Maintains Hawkish Stance on Inflation',
        summary: 'Fed Chair Jerome Powell emphasized the central bank\'s commitment to bringing inflation down to the 2% target, signaling potential for more rate hikes.',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        category: 'Monetary Policy',
        sentiment: 'NEGATIVE',
        impact: 'HIGH',
        url: '#',
        tags: ['Federal Reserve', 'Interest Rates', 'Inflation']
      },
      {
        id: '2',
        title: 'Banking Sector Shows Resilience Despite Credit Concerns',
        summary: 'Major banks report stronger-than-expected earnings, with improved net interest margins offsetting credit loss provisions.',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        category: 'Banking',
        sentiment: 'POSITIVE',
        impact: 'MEDIUM',
        url: '#',
        tags: ['Banking', 'Earnings', 'Credit']
      },
      {
        id: '3',
        title: 'Corporate Bond Yields Reach Multi-Year Highs',
        summary: 'Investment-grade corporate bond yields surge as investors demand higher premiums amid economic uncertainty.',
        source: 'Wall Street Journal',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        category: 'Fixed Income',
        sentiment: 'NEGATIVE',
        impact: 'MEDIUM',
        url: '#',
        tags: ['Bonds', 'Yields', 'Corporate Debt']
      },
      {
        id: '4',
        title: 'Emerging Markets See Capital Inflows Return',
        summary: 'Developing market funds attract $2.3 billion in fresh capital as investors seek higher yields and growth opportunities.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        category: 'Emerging Markets',
        sentiment: 'POSITIVE',
        impact: 'MEDIUM',
        url: '#',
        tags: ['Emerging Markets', 'Capital Flows', 'Investment']
      },
      {
        id: '5',
        title: 'Cryptocurrency Regulation Framework Takes Shape',
        summary: 'New regulatory guidelines provide clarity for digital asset trading and custody, boosting institutional adoption.',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        category: 'Cryptocurrency',
        sentiment: 'POSITIVE',
        impact: 'HIGH',
        url: '#',
        tags: ['Cryptocurrency', 'Regulation', 'Digital Assets']
      },
      {
        id: '6',
        title: 'Global Trade Tensions Impact Supply Chains',
        summary: 'Ongoing trade disputes between major economies continue to disrupt global supply chains and increase costs.',
        source: 'CNBC',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        category: 'International Trade',
        sentiment: 'NEGATIVE',
        impact: 'HIGH',
        url: '#',
        tags: ['Trade', 'Supply Chain', 'Global Economy']
      }
    ];

    // Sample economic events
    const sampleEconomicEvents: EconomicEvent[] = [
      {
        id: '1',
        title: 'Non-Farm Payrolls',
        date: new Date(),
        time: '08:30',
        impact: 'HIGH',
        country: 'United States',
        currency: 'USD',
        actual: '263K',
        forecast: '200K',
        previous: '236K',
        description: 'Monthly change in the number of employed people during the previous month, excluding the farming industry.'
      },
      {
        id: '2',
        title: 'Federal Reserve Interest Rate Decision',
        date: new Date(Date.now() + 86400000), // Tomorrow
        time: '14:00',
        impact: 'HIGH',
        country: 'United States',
        currency: 'USD',
        forecast: '5.25%',
        previous: '5.00%',
        description: 'The Federal Reserve announces its decision on interest rates, which affects borrowing costs and economic activity.'
      },
      {
        id: '3',
        title: 'Consumer Price Index (CPI)',
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        time: '08:30',
        impact: 'HIGH',
        country: 'United States',
        currency: 'USD',
        forecast: '3.2%',
        previous: '3.0%',
        description: 'Measures the change in the price of goods and services purchased by consumers.'
      },
      {
        id: '4',
        title: 'European Central Bank Interest Rate Decision',
        date: new Date(Date.now() + 259200000), // 3 days from now
        time: '12:45',
        impact: 'HIGH',
        country: 'European Union',
        currency: 'EUR',
        forecast: '4.50%',
        previous: '4.25%',
        description: 'The ECB announces its decision on interest rates for the Eurozone.'
      },
      {
        id: '5',
        title: 'GDP Growth Rate',
        date: new Date(Date.now() + 345600000), // 4 days from now
        time: '08:30',
        impact: 'HIGH',
        country: 'United States',
        currency: 'USD',
        forecast: '2.1%',
        previous: '2.4%',
        description: 'The annualized change in the inflation-adjusted value of all goods and services produced by the economy.'
      },
      {
        id: '6',
        title: 'Bank of Japan Interest Rate Decision',
        date: new Date(Date.now() + 432000000), // 5 days from now
        time: '03:00',
        impact: 'MEDIUM',
        country: 'Japan',
        currency: 'JPY',
        forecast: '-0.10%',
        previous: '-0.10%',
        description: 'The Bank of Japan announces its decision on interest rates and monetary policy.'
      }
    ];

    setFinanceNews(sampleFinanceNews);
    setEconomicEvents(sampleEconomicEvents);
  }, []);

  const filteredNews = financeNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(newsSearchTerm.toLowerCase());
    const matchesCategory = newsCategoryFilter === 'ALL' || news.category === newsCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredEvents = economicEvents.filter(event => {
    const matchesImpact = eventImpactFilter === 'ALL' || event.impact === eventImpactFilter;
    const matchesCountry = eventCountryFilter === 'ALL' || event.country === eventCountryFilter;
    return matchesImpact && matchesCountry;
  });

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const newsCategoryOptions = [
    { text: 'All Categories', value: 'ALL' },
    { text: 'Monetary Policy', value: 'Monetary Policy' },
    { text: 'Banking', value: 'Banking' },
    { text: 'Fixed Income', value: 'Fixed Income' },
    { text: 'Emerging Markets', value: 'Emerging Markets' },
    { text: 'Cryptocurrency', value: 'Cryptocurrency' },
    { text: 'International Trade', value: 'International Trade' }
  ];

  const impactOptions = [
    { text: 'All Impact Levels', value: 'ALL' },
    { text: 'High Impact', value: 'HIGH' },
    { text: 'Medium Impact', value: 'MEDIUM' },
    { text: 'Low Impact', value: 'LOW' }
  ];

  const countryOptions = [
    { text: 'All Countries', value: 'ALL' },
    { text: 'United States', value: 'United States' },
    { text: 'European Union', value: 'European Union' },
    { text: 'Japan', value: 'Japan' },
    { text: 'United Kingdom', value: 'United Kingdom' },
    { text: 'China', value: 'China' }
  ];

  const positiveNews = financeNews.filter(n => n.sentiment === 'POSITIVE').length;
  const negativeNews = financeNews.filter(n => n.sentiment === 'NEGATIVE').length;
  const highImpactNews = financeNews.filter(n => n.impact === 'HIGH').length;
  const highImpactEvents = economicEvents.filter(e => e.impact === 'HIGH').length;

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
              Finance News & Economic Calendar
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
              Stay informed with financial news and economic events
            </p>
          </div>
          <Button className="nextgen-btn nextgen-btn-primary">
            🔔 Set Alerts
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px' }}>
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Finance News</div>
            <div className="nextgen-metric-value">{financeNews.length}</div>
            <div className="nextgen-metric-change">Today's articles</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Positive Sentiment</div>
            <div className="nextgen-metric-value" style={{ color: '#10b981' }}>
              {positiveNews}
            </div>
            <div className="nextgen-metric-change nextgen-metric-positive">Bullish news</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">High Impact Events</div>
            <div className="nextgen-metric-value" style={{ color: '#ef4444' }}>
              {highImpactEvents}
            </div>
            <div className="nextgen-metric-change">This week</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Market Moving</div>
            <div className="nextgen-metric-value" style={{ color: '#f59e0b' }}>
              {highImpactNews}
            </div>
            <div className="nextgen-metric-change">High impact news</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)}>
        <TabStripTab title="Finance News">
          <div style={{ padding: '24px 0' }}>
            {/* News Filters */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '24px',
              alignItems: 'center'
            }}>
              <Input
                value={newsSearchTerm}
                onChange={(e) => setNewsSearchTerm(e.value)}
                placeholder="Search finance news..."
                style={{ width: '300px' }}
              />
              <DropDownList
                data={newsCategoryOptions}
                textField="text"
                dataItemKey="value"
                value={newsCategoryOptions.find(option => option.value === newsCategoryFilter)}
                onChange={(e) => setNewsCategoryFilter(e.value)}
                style={{ width: '200px' }}
              />
            </div>

            {/* News Grid */}
            <div className="nextgen-grid nextgen-grid-2" style={{ gap: '24px' }}>
              {filteredNews.map((news) => (
                <div key={news.id} className="nextgen-card" style={{ cursor: 'pointer' }}>
                  <div className="nextgen-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className={`nextgen-badge nextgen-badge-${
                          news.sentiment === 'POSITIVE' ? 'success' :
                          news.sentiment === 'NEGATIVE' ? 'error' : 'warning'
                        }`}>
                          {news.sentiment === 'POSITIVE' ? (
                            <>
                              <SvgIcon icon={caretAltUpIcon} size="small" style={{ marginRight: '4px' }} />
                              BULLISH
                            </>
                          ) : news.sentiment === 'NEGATIVE' ? (
                            <>
                              <SvgIcon icon={caretAltDownIcon} size="small" style={{ marginRight: '4px' }} />
                              BEARISH
                            </>
                          ) : (
                            <>
                              <SvgIcon icon={arrowRightIcon} size="small" style={{ marginRight: '4px' }} />
                              NEUTRAL
                            </>
                          )}
                        </span>
                        <span className={`nextgen-badge nextgen-badge-${
                          news.impact === 'HIGH' ? 'error' :
                          news.impact === 'MEDIUM' ? 'warning' : 'info'
                        }`}>
                          {news.impact === 'HIGH' ? (
                            <>
                              <SvgIcon icon={caretAltUpIcon} size="small" style={{ marginRight: '4px' }} />
                              HIGH
                            </>
                          ) : news.impact === 'MEDIUM' ? (
                            <>
                              <SvgIcon icon={infoCircleIcon} size="small" style={{ marginRight: '4px' }} />
                              MEDIUM
                            </>
                          ) : (
                            <>
                              <SvgIcon icon={chartLineIcon} size="small" style={{ marginRight: '4px' }} />
                              LOW
                            </>
                          )}
                        </span>
                        <span className="nextgen-badge nextgen-badge-info">
                          <SvgIcon icon={fileIcon} size="small" style={{ marginRight: '4px' }} />
                          {news.category}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {getTimeAgo(news.publishedAt)}
                      </span>
                    </div>

                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: '#ffffff', 
                      marginBottom: '12px',
                      lineHeight: '1.4'
                    }}>
                      {news.title}
                    </h3>

                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#e2e8f0', 
                      lineHeight: '1.5', 
                      marginBottom: '16px' 
                    }}>
                      {news.summary}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {news.tags.map((tag) => (
                        <span key={tag} style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#a5b4fc',
                          borderRadius: '12px'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {news.source}
                      </span>
                      <Button className="nextgen-btn nextgen-btn-ghost nextgen-btn-sm">
                        📖 Read Full Article
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Economic Calendar">
          <div style={{ padding: '24px 0' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.5fr 1fr', 
              gap: '32px' 
            }}>
              {/* Calendar Widget */}
              <div className="nextgen-card">
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">Calendar</div>
                  <div className="nextgen-card-subtitle">Select date to view events</div>
                </div>
                <div className="nextgen-card-body">
                  {/* Kendo Calendar - Default Styling */}
                  <div style={{
                    width: '100%',
                    maxWidth: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Calendar
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.value || new Date())}
                    />
                  </div>
                  
                  {/* Event Filters */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '4px', 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        Impact Level
                      </label>
                      <DropDownList
                        data={impactOptions}
                        textField="text"
                        dataItemKey="value"
                        value={impactOptions.find(option => option.value === eventImpactFilter)}
                        onChange={(e) => setEventImpactFilter(e.value)}
                      />
                    </div>
                    
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '4px', 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        Country
                      </label>
                      <DropDownList
                        data={countryOptions}
                        textField="text"
                        dataItemKey="value"
                        value={countryOptions.find(option => option.value === eventCountryFilter)}
                        onChange={(e) => setEventCountryFilter(e.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Date Events */}
              <div className="nextgen-card" style={{ gridColumn: 'span 2' }}>
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">
                    Events for {formatDate(selectedDate)}
                  </div>
                  <div className="nextgen-card-subtitle">
                    {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
                  </div>
                </div>
                <div className="nextgen-card-body">
                  {selectedDateEvents.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '40px',
                      color: '#94a3b8'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                        No events scheduled
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        Select a different date to view events
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {selectedDateEvents.map((event) => (
                        <div key={event.id} style={{
                          padding: '20px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          border: '1px solid #374151',
                          borderLeft: `4px solid ${getImpactColor(event.impact)}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '700', 
                                color: '#ffffff', 
                                marginBottom: '4px' 
                              }}>
                                {event.title}
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <SvgIcon icon={clockIcon} size="small" />
                                  {event.time}
                                </span>
                                <span style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <SvgIcon icon={globeIcon} size="small" />
                                  {event.country}
                                </span>
                                <span className={`nextgen-badge nextgen-badge-${
                                  event.impact === 'HIGH' ? 'error' :
                                  event.impact === 'MEDIUM' ? 'warning' : 'success'
                                }`}>
                                  {event.impact === 'HIGH' ? (
                                    <>
                                      <SvgIcon icon={caretAltUpIcon} size="small" style={{ marginRight: '4px' }} />
                                      HIGH
                                    </>
                                  ) : event.impact === 'MEDIUM' ? (
                                    <>
                                      <SvgIcon icon={infoCircleIcon} size="small" style={{ marginRight: '4px' }} />
                                      MEDIUM
                                    </>
                                  ) : (
                                    <>
                                      <SvgIcon icon={chartLineIcon} size="small" style={{ marginRight: '4px' }} />
                                      LOW
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div style={{ fontSize: '1.5rem' }}>
                              {event.currency === 'USD' ? '🇺🇸' : 
                               event.currency === 'EUR' ? '🇪🇺' : 
                               event.currency === 'JPY' ? '🇯🇵' : '🌍'}
                            </div>
                          </div>
                          
                          <p style={{ 
                            fontSize: '0.875rem', 
                            color: '#e2e8f0', 
                            lineHeight: '1.5', 
                            marginBottom: '16px' 
                          }}>
                            {event.description}
                          </p>
                          
                          {(event.actual || event.forecast || event.previous) && (
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(3, 1fr)', 
                              gap: '12px',
                              padding: '12px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px'
                            }}>
                              {event.actual && (
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                                    Actual
                                  </div>
                                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>
                                    {event.actual}
                                  </div>
                                </div>
                              )}
                              {event.forecast && (
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                                    Forecast
                                  </div>
                                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#f59e0b' }}>
                                    {event.forecast}
                                  </div>
                                </div>
                              )}
                              {event.previous && (
                                <div style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                                    Previous
                                  </div>
                                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8' }}>
                                    {event.previous}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Upcoming Events">
          <div style={{ padding: '24px 0' }}>
            <div className="nextgen-card">
              <div className="nextgen-card-header">
                <div className="nextgen-card-title">Upcoming Economic Events</div>
                <div className="nextgen-card-subtitle">Next 7 days of scheduled events</div>
              </div>
              <div className="nextgen-card-body" style={{ padding: 0 }}>
                <table className="nextgen-table">
                  <thead className="nextgen-table-header">
                    <tr>
                      <th>Date & Time</th>
                      <th>Event</th>
                      <th>Country</th>
                      <th>Impact</th>
                      <th>Forecast</th>
                      <th>Previous</th>
                    </tr>
                  </thead>
                  <tbody className="nextgen-table-body">
                    {filteredEvents
                      .filter(event => event.date >= new Date())
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((event) => (
                        <tr key={event.id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: '600' }}>
                                {event.date.toLocaleDateString()}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {event.time}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: '600' }}>{event.title}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>
                                {event.currency === 'USD' ? '🇺🇸' : 
                                 event.currency === 'EUR' ? '🇪🇺' : 
                                 event.currency === 'JPY' ? '🇯🇵' : '🌍'}
                              </span>
                              <span>{event.country}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`nextgen-badge nextgen-badge-${
                              event.impact === 'HIGH' ? 'error' :
                              event.impact === 'MEDIUM' ? 'warning' : 'success'
                            }`}>
                              {event.impact === 'HIGH' ? (
                                <>
                                  <SvgIcon icon={caretAltUpIcon} size="small" style={{ marginRight: '4px' }} />
                                  HIGH
                                </>
                              ) : event.impact === 'MEDIUM' ? (
                                <>
                                  <SvgIcon icon={infoCircleIcon} size="small" style={{ marginRight: '4px' }} />
                                  MEDIUM
                                </>
                              ) : (
                                <>
                                  <SvgIcon icon={chartLineIcon} size="small" style={{ marginRight: '4px' }} />
                                  LOW
                                </>
                              )}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '600' }}>
                            {event.forecast || '-'}
                          </td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }}>
                            {event.previous || '-'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabStripTab>
      </TabStrip>
    </div>
  );
};
