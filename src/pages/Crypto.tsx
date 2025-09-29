import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Loader } from '@progress/kendo-react-indicators';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  bellIcon,
  searchIcon,
  chartLineIcon,
  caretAltUpIcon,
  caretAltDownIcon,
  starIcon,
  dollarIcon,
  fileIcon,
  clockIcon,
  arrowRightIcon
} from '@progress/kendo-svg-icons';

interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  market_cap: number | null;
  total_volume: number | null;
  image: string;
  market_cap_rank: number;
  price_change_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
}

interface MarketData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number };
  market_cap_change_percentage_24h_usd: number;
}

interface CryptoNews {
  id: string;
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  urlToImage: string;
}

const Crypto: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [isLoading, setIsLoading] = useState(true);
  const [cryptoCoins, setCryptoCoins] = useState<CryptoCoin[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [cryptoNews, setCryptoNews] = useState<CryptoNews[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch live crypto data
  const fetchCryptoData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch coins data
      const coinsResponse = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h'
      );
      
      if (!coinsResponse.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      
      const coinsData = await coinsResponse.json();
      setCryptoCoins(coinsData);
      
      // Fetch global market data
      const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
      if (globalResponse.ok) {
        const globalData = await globalResponse.json();
        setMarketData(globalData.data);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching crypto data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch crypto news
  const fetchCryptoNews = async () => {
    try {
      const response = await fetch(
        'https://newsapi.org/v2/everything?q=cryptocurrency OR bitcoin OR ethereum&sortBy=publishedAt&pageSize=20&apiKey=YOUR_NEWS_API_KEY'
      );
      
      if (response.ok) {
        const data = await response.json();
        setCryptoNews(data.articles || []);
      }
    } catch (err) {
      console.error('Error fetching crypto news:', err);
      // Use fallback news data
      setCryptoNews([
        {
          id: '1',
          title: 'Bitcoin Continues Strong Performance',
          description: 'Bitcoin shows resilience as institutional adoption increases.',
          url: '#',
          source: { name: 'CoinDesk' },
          publishedAt: new Date().toISOString(),
          urlToImage: ''
        }
      ]);
    }
  };
  
  useEffect(() => {
    fetchCryptoData();
    fetchCryptoNews();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get market sentiment based on market cap change
  const getMarketSentiment = () => {
    if (!marketData || marketData.market_cap_change_percentage_24h_usd === undefined) {
      return { text: 'Loading...', color: '#94a3b8' };
    }
    
    const change = marketData.market_cap_change_percentage_24h_usd;
    if (change > 5) return { text: 'Extreme Greed', color: '#10b981' };
    if (change > 2) return { text: 'Greed', color: '#10b981' };
    if (change > -2) return { text: 'Neutral', color: '#f59e0b' };
    if (change > -5) return { text: 'Fear', color: '#ef4444' };
    return { text: 'Extreme Fear', color: '#ef4444' };
  };

  // Get coin icon based on symbol
  const getCoinIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'BNB': '🟡',
      'SOL': '◎',
      'ADA': '₳',
      'DOT': '●',
      'MATIC': '🔷',
      'AVAX': '🔺',
      'LINK': '🔗',
      'UNI': '🦄'
    };
    return icons[symbol.toUpperCase()] || '🪙';
  };

  // Sort coins based on selected criteria
  const sortedCoins = useMemo(() => {
    return [...cryptoCoins].sort((a, b) => {
      switch (sortBy) {
        case 'market_cap_rank':
          return a.market_cap_rank - b.market_cap_rank;
        case 'current_price':
          return (b.current_price ?? 0) - (a.current_price ?? 0);
        case 'price_change_percentage_24h':
          return (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0);
        case 'total_volume':
          return (b.total_volume ?? 0) - (a.total_volume ?? 0);
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
  }, [cryptoCoins, sortBy]);

  const sortOptions = [
    { text: 'Market Cap Rank', value: 'market_cap_rank' },
    { text: 'Price (High to Low)', value: 'current_price' },
    { text: '24h Change', value: 'price_change_percentage_24h' },
    { text: 'Volume', value: 'total_volume' }
  ];

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || isNaN(price)) return '$0.00';
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap: number | null | undefined) => {
    if (marketCap === null || marketCap === undefined || isNaN(marketCap)) return '$0';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`;
    return `$${marketCap.toLocaleString()}`;
  };
  
  const formatVolume = (volume: number | null | undefined) => {
    if (volume === null || volume === undefined || isNaN(volume)) return '$0';
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toLocaleString()}`;
  };

  const formatPercentage = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined || isNaN(percentage)) return '0.00%';
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const filteredCoins = sortedCoins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sentiment = getMarketSentiment();

  return (
    <div className="nextgen-container">
      {/* Header Container */}
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
              ₿ Crypto Prices & News
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
              Real-time cryptocurrency prices and latest crypto news
            </p>
          </div>
          <Button className="nextgen-btn nextgen-btn-primary">
            <SvgIcon icon={bellIcon} style={{ marginRight: '8px' }} />
            Set Price Alerts
          </Button>
        </div>

        {/* Market Overview Grid */}
        <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px' }}>
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total Market Cap</div>
            <div className="nextgen-metric-value">
              {marketData ? formatMarketCap(marketData.total_market_cap.usd) : 'Loading...'}
            </div>
            <div className={`nextgen-metric-change ${(marketData?.market_cap_change_percentage_24h_usd ?? 0) >= 0 ? 'nextgen-metric-positive' : 'nextgen-metric-negative'}`}>
              {marketData && marketData.market_cap_change_percentage_24h_usd !== undefined 
                ? formatPercentage(marketData.market_cap_change_percentage_24h_usd)
                : 'Loading...'}
            </div>
          </div>
          
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">24h Volume</div>
            <div className="nextgen-metric-value">
              {marketData ? formatVolume(marketData.total_volume.usd) : 'Loading...'}
            </div>
            <div className="nextgen-metric-change">Live Data</div>
          </div>
          
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">BTC Dominance</div>
            <div className="nextgen-metric-value">
              {marketData && marketData.market_cap_percentage?.btc ? `${marketData.market_cap_percentage.btc.toFixed(1)}%` : 'Loading...'}
            </div>
            <div className="nextgen-metric-change">Market Share</div>
          </div>
          
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Market Sentiment</div>
            <div className="nextgen-metric-value" style={{ color: sentiment.color }}>
              {sentiment.text}
            </div>
            <div className="nextgen-metric-change">Live Analysis</div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)}>
        <TabStripTab title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SvgIcon icon={dollarIcon} size="small" />
            Price Tracker
          </span>
        }>
          <div style={{ padding: '24px 0' }}>
            
            {/* Error Display */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                color: '#ef4444'
              }}>
                ⚠️ {error}
                <Button 
                  onClick={fetchCryptoData}
                  style={{ marginLeft: '12px', fontSize: '0.875rem' }}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Filters Container */}
            <div className="nextgen-card" style={{ marginBottom: '32px' }}>
              <div className="nextgen-card-header">
                <div className="nextgen-card-title">Filter & Sort</div>
                <div className="nextgen-card-subtitle">Search and organize cryptocurrency data</div>
              </div>
              <div className="nextgen-card-body">
                <div className="nextgen-grid nextgen-grid-2" style={{ gap: '20px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#f1f5f9' }}>
                    <SvgIcon icon={searchIcon} size="small" style={{ marginRight: '4px' }} />
                    Search Coins
                  </label>
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.value)}
                    placeholder="Search by name or symbol..."
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#f1f5f9' }}>
                    <SvgIcon icon={chartLineIcon} size="small" style={{ marginRight: '4px' }} />
                    Sort By
                  </label>
                  <DropDownList
                    data={sortOptions}
                    textField="text"
                    dataItemKey="value"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                </div>
              </div>
            </div>

            {/* Crypto Cards Container */}
            <div className="nextgen-card">
              <div className="nextgen-card-header">
                <div className="nextgen-card-title">Live Cryptocurrency Prices</div>
                <div className="nextgen-card-subtitle">
                  {filteredCoins.length} coins • Updated every 60 seconds
                </div>
              </div>
              <div className="nextgen-card-body" style={{ padding: '24px' }}>
                {isLoading ? (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '300px',
                    width: '100%'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <Loader size="large" />
                      <div style={{ color: '#94a3b8', marginTop: '16px' }}>
                        Loading live crypto data...
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="nextgen-grid nextgen-grid-3" style={{ gap: '24px' }}>
                    {filteredCoins.map((coin) => (
                      <Card key={coin.id} style={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid #374151',
                        borderRadius: '16px',
                        padding: '0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '100%'
                      }}>
                        <CardBody style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '1.8rem' }}>{getCoinIcon(coin.symbol)}</span>
                            <div>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
                                {coin.name}
                              </h3>
                              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                {coin.symbol.toUpperCase()} • #{coin.market_cap_rank}
                              </p>
                            </div>
                            <span style={{
                              marginLeft: 'auto',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: (coin.price_change_percentage_24h ?? 0) >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: (coin.price_change_percentage_24h ?? 0) >= 0 ? '#10b981' : '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <SvgIcon icon={(coin.price_change_percentage_24h ?? 0) >= 0 ? caretAltUpIcon : caretAltDownIcon} size="small" />
                              {formatPercentage(coin.price_change_percentage_24h)}
                            </span>
                          </div>
                          
                          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f1f5f9', marginBottom: '16px' }}>
                            {formatPrice(coin.current_price)}
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div>
                              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 4px 0' }}>Market Cap</p>
                              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
                                {formatMarketCap(coin.market_cap)}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 4px 0' }}>24h Volume</p>
                              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
                                {formatVolume(coin.total_volume)}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              flex: 1
                            }}>
                              <SvgIcon icon={caretAltUpIcon} size="small" style={{ marginRight: '4px' }} />
                              Buy
                            </Button>
                            <Button style={{
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              flex: 1
                            }}>
                              <SvgIcon icon={starIcon} size="small" style={{ marginRight: '4px' }} />
                              Watch
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SvgIcon icon={fileIcon} size="small" />
            Crypto News
          </span>
        }>
          <div style={{ padding: '24px 0' }}>
            {/* Crypto News Container */}
            <div className="nextgen-card">
              <div className="nextgen-card-header">
                <div className="nextgen-card-title">Latest Crypto News</div>
                <div className="nextgen-card-subtitle">Stay updated with cryptocurrency market news</div>
              </div>
              <div className="nextgen-card-body" style={{ padding: '24px' }}>
                <div className="nextgen-grid nextgen-grid-2" style={{ gap: '24px' }}>
                  {cryptoNews.map((news, index) => (
                    <Card key={news.id || index} style={{
                      background: 'rgba(30, 41, 59, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid #374151',
                      borderRadius: '16px',
                      padding: '0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      <CardBody style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <SvgIcon icon={fileIcon} size="small" />
                            News
                          </span>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: '#94a3b8',
                            background: 'rgba(148, 163, 184, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <SvgIcon icon={clockIcon} size="small" />
                            {getTimeAgo(news.publishedAt)}
                          </span>
                        </div>

                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: '#f1f5f9', 
                          marginBottom: '12px',
                          lineHeight: '1.4'
                        }}>
                          {news.title}
                        </h3>

                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#cbd5e1',
                          lineHeight: '1.6', 
                          marginBottom: '20px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {news.description || 'No description available'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                            <SvgIcon icon={fileIcon} size="small" />
                            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{news.source.name}</span>
                          </div>
                          <Button 
                            onClick={() => window.open(news.url, '_blank')}
                            style={{
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              color: 'white',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            Read More
                            <SvgIcon icon={arrowRightIcon} size="small" />
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabStripTab>
      </TabStrip>
    </div>
  );
};

export default Crypto;
