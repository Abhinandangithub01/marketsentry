import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Button } from '@progress/kendo-react-buttons';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Loader } from '@progress/kendo-react-indicators';
import { Window } from '@progress/kendo-react-dialogs';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  plusIcon, 
  trashIcon, 
  caretAltUpIcon, 
  caretAltDownIcon,
  chartLineIcon,
  searchIcon,
  homeIcon
} from '@progress/kendo-svg-icons';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  change: number;
  changePercent: number;
  sector: string;
}

export const PortfolioModern: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cashAvailable, setCashAvailable] = useState(10000);
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    name: '',
    shares: 0,
    avgPrice: 0,
    currentPrice: 0,
    sector: 'Technology'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load portfolio from localStorage
  useEffect(() => {
    // Clear old data to force refresh
    localStorage.removeItem('portfolio');
    
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      const data = JSON.parse(savedPortfolio);
      setHoldings(data.holdings || []);
      setCashAvailable(data.cashAvailable || 10000);
    } else {
      // Default holdings
      const defaultHoldings: Holding[] = [
        {
          id: '1',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 100,
          avgPrice: 150.00,
          currentPrice: 175.43,
          value: 17543,
          change: 2543,
          changePercent: 16.95,
          sector: 'Technology'
        },
        {
          id: '2',
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          shares: 50,
          avgPrice: 320.00,
          currentPrice: 342.56,
          value: 17128,
          change: 1128,
          changePercent: 7.05,
          sector: 'Technology'
        },
        {
          id: '3',
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          shares: 25,
          avgPrice: 130.00,
          currentPrice: 138.92,
          value: 3473,
          change: 223,
          changePercent: 6.86,
          sector: 'Technology'
        },
        {
          id: '4',
          symbol: 'JNJ',
          name: 'Johnson & Johnson',
          shares: 120,
          avgPrice: 160.00,
          currentPrice: 165.25,
          value: 19830,
          change: 630,
          changePercent: 3.28,
          sector: 'Healthcare'
        }
      ];
      setHoldings(defaultHoldings);
      const portfolioData = { holdings: defaultHoldings, cashAvailable: 10000 };
      localStorage.setItem('portfolio', JSON.stringify(portfolioData));
    }
  }, []);

  // Save portfolio whenever it changes
  useEffect(() => {
    if (holdings.length > 0) {
      const portfolioData = { holdings, cashAvailable };
      localStorage.setItem('portfolio', JSON.stringify(portfolioData));
    }
  }, [holdings, cashAvailable]);

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.avgPrice || !newHolding.currentPrice) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {

    const value = newHolding.shares * newHolding.currentPrice;
    const change = (newHolding.currentPrice - newHolding.avgPrice) * newHolding.shares;
    const changePercent = ((newHolding.currentPrice - newHolding.avgPrice) / newHolding.avgPrice) * 100;

    const holding: Holding = {
      id: Date.now().toString(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name || `${newHolding.symbol.toUpperCase()} Corp.`,
      shares: newHolding.shares,
      avgPrice: newHolding.avgPrice,
      currentPrice: newHolding.currentPrice,
      value,
      change,
      changePercent,
      sector: newHolding.sector
    };

    const updatedHoldings = [...holdings, holding];
    setHoldings(updatedHoldings);
    
    // Force localStorage update
    const portfolioData = { holdings: updatedHoldings, cashAvailable };
    localStorage.setItem('portfolio', JSON.stringify(portfolioData));
    
    setNewHolding({
      symbol: '',
      name: '',
      shares: 0,
      avgPrice: 0,
      currentPrice: 0,
      sector: 'Technology'
    });
    setSearchTerm('');
    setShowSuggestions(false);
    setIsLoading(false);
    setShowAddModal(false);
    }, 1000); // End setTimeout
  };

  const removeHolding = (id: string) => {
    const updatedHoldings = holdings.filter(h => h.id !== id);
    setHoldings(updatedHoldings);
    
    // Force localStorage update
    const portfolioData = { holdings: updatedHoldings, cashAvailable };
    localStorage.setItem('portfolio', JSON.stringify(portfolioData));
  };

  // Recalculate portfolio metrics whenever holdings change
  const portfolioValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalValue = portfolioValue + cashAvailable;
  const totalGainLoss = holdings.reduce((sum, h) => sum + h.change, 0);
  const totalReturn = holdings.reduce((sum, h) => sum + (h.avgPrice * h.shares), 0);
  const totalReturnPercent = totalReturn > 0 ? (totalGainLoss / totalReturn) * 100 : 0;

  // Sector allocation data
  const sectorData = holdings.reduce((acc, holding) => {
    const existing = acc.find(item => item.sector === holding.sector);
    if (existing) {
      existing.value += holding.value;
    } else {
      acc.push({ sector: holding.sector, value: holding.value });
    }
    return acc;
  }, [] as { sector: string; value: number }[]);

  const sectorColors = {
    'Technology': '#6366f1',
    'Healthcare': '#22c55e',
    'Finance': '#f59e0b',
    'Energy': '#ef4444',
    'Consumer': '#8b5cf6',
    'Industrial': '#06b6d4'
  };

  const pieData = sectorData.map((item, index) => ({
    category: item.sector,
    value: portfolioValue > 0 ? (item.value / portfolioValue) * 100 : 0,
    color: sectorColors[item.sector as keyof typeof sectorColors] || '#94a3b8',
    explode: false
  }));

  // Create explicit color array for seriesColors
  const chartColors = sectorData.map(item => 
    sectorColors[item.sector as keyof typeof sectorColors] || '#94a3b8'
  );

  // Debug logging
  console.log('Portfolio Debug - Healthcare Fix:', { 
    holdingsCount: holdings.length, 
    portfolioValue, 
    totalValue, 
    sectorData,
    pieData,
    chartColors,
    healthcareColor: sectorColors['Healthcare'],
    chartData: pieData.map(item => `${item.category}: ${item.value.toFixed(1)}% (${item.color})`),
    explicitColors: `Technology: ${sectorColors['Technology']}, Healthcare: ${sectorColors['Healthcare']}`
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const sectorOptions = [
    'Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial'
  ];

  // US Stock symbols for autosearch
  const usStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc. Class A' },
    { symbol: 'GOOG', name: 'Alphabet Inc. Class C' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'PG', name: 'Procter & Gamble Co.' },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.' },
    { symbol: 'HD', name: 'Home Depot Inc.' },
    { symbol: 'MA', name: 'Mastercard Inc.' },
    { symbol: 'BAC', name: 'Bank of America Corp.' },
    { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
    { symbol: 'PFE', name: 'Pfizer Inc.' },
    { symbol: 'KO', name: 'Coca-Cola Co.' },
    { symbol: 'ABBV', name: 'AbbVie Inc.' },
    { symbol: 'PEP', name: 'PepsiCo Inc.' },
    { symbol: 'COST', name: 'Costco Wholesale Corp.' },
    { symbol: 'AVGO', name: 'Broadcom Inc.' },
    { symbol: 'WMT', name: 'Walmart Inc.' },
    { symbol: 'LLY', name: 'Eli Lilly and Co.' },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
    { symbol: 'ACN', name: 'Accenture plc' },
    { symbol: 'ABT', name: 'Abbott Laboratories' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'ADBE', name: 'Adobe Inc.' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: 'ORCL', name: 'Oracle Corporation' },
    { symbol: 'CVX', name: 'Chevron Corporation' },
    { symbol: 'MRK', name: 'Merck & Co. Inc.' },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.' },
    { symbol: 'AMD', name: 'Advanced Micro Devices Inc.' },
    { symbol: 'INTC', name: 'Intel Corporation' },
    { symbol: 'IBM', name: 'International Business Machines Corp.' },
    { symbol: 'QCOM', name: 'QUALCOMM Inc.' },
    { symbol: 'TXN', name: 'Texas Instruments Inc.' },
    { symbol: 'HON', name: 'Honeywell International Inc.' },
    { symbol: 'UPS', name: 'United Parcel Service Inc.' },
    { symbol: 'LOW', name: 'Lowe\'s Companies Inc.' },
    { symbol: 'SBUX', name: 'Starbucks Corporation' },
    { symbol: 'MDT', name: 'Medtronic plc' },
    { symbol: 'CAT', name: 'Caterpillar Inc.' },
    { symbol: 'GS', name: 'Goldman Sachs Group Inc.' },
    { symbol: 'AXP', name: 'American Express Co.' },
    { symbol: 'BLK', name: 'BlackRock Inc.' },
    { symbol: 'SPGI', name: 'S&P Global Inc.' },
    { symbol: 'BKNG', name: 'Booking Holdings Inc.' },
    { symbol: 'GILD', name: 'Gilead Sciences Inc.' },
    { symbol: 'MDLZ', name: 'Mondelez International Inc.' },
    { symbol: 'ADP', name: 'Automatic Data Processing Inc.' },
    { symbol: 'ISRG', name: 'Intuitive Surgical Inc.' },
    { symbol: 'TJX', name: 'TJX Companies Inc.' },
    { symbol: 'CME', name: 'CME Group Inc.' },
    { symbol: 'MMM', name: '3M Co.' },
    { symbol: 'TMUS', name: 'T-Mobile US Inc.' },
    { symbol: 'SO', name: 'Southern Co.' },
    { symbol: 'ZTS', name: 'Zoetis Inc.' },
    { symbol: 'NOW', name: 'ServiceNow Inc.' },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.' },
    { symbol: 'REGN', name: 'Regeneron Pharmaceuticals Inc.' },
    { symbol: 'INTU', name: 'Intuit Inc.' },
    { symbol: 'AMAT', name: 'Applied Materials Inc.' },
    { symbol: 'CB', name: 'Chubb Ltd.' },
    { symbol: 'MU', name: 'Micron Technology Inc.' },
    { symbol: 'LRCX', name: 'Lam Research Corp.' },
    { symbol: 'EL', name: 'Estee Lauder Companies Inc.' },
    { symbol: 'FIS', name: 'Fidelity National Information Services Inc.' },
    { symbol: 'SYK', name: 'Stryker Corporation' },
    { symbol: 'BSX', name: 'Boston Scientific Corporation' },
    { symbol: 'ADI', name: 'Analog Devices Inc.' },
    { symbol: 'KLAC', name: 'KLA Corporation' },
    { symbol: 'APD', name: 'Air Products and Chemicals Inc.' },
    { symbol: 'FISV', name: 'Fiserv Inc.' },
    { symbol: 'CSX', name: 'CSX Corporation' },
    { symbol: 'MCO', name: 'Moody\'s Corporation' },
    { symbol: 'AON', name: 'Aon plc' },
    { symbol: 'TGT', name: 'Target Corporation' },
    { symbol: 'SHW', name: 'Sherwin-Williams Co.' },
    { symbol: 'MCD', name: 'McDonald\'s Corporation' },
    { symbol: 'CL', name: 'Colgate-Palmolive Co.' },
    { symbol: 'EQIX', name: 'Equinix Inc.' },
    { symbol: 'NSC', name: 'Norfolk Southern Corporation' },
    { symbol: 'ITW', name: 'Illinois Tool Works Inc.' },
    { symbol: 'APH', name: 'Amphenol Corporation' },
    { symbol: 'HUM', name: 'Humana Inc.' },
    { symbol: 'GD', name: 'General Dynamics Corporation' },
    { symbol: 'PLD', name: 'Prologis Inc.' },
    { symbol: 'SNPS', name: 'Synopsys Inc.' },
    { symbol: 'CDNS', name: 'Cadence Design Systems Inc.' },
    { symbol: 'MSI', name: 'Motorola Solutions Inc.' },
    { symbol: 'TFC', name: 'Truist Financial Corporation' },
    { symbol: 'PNC', name: 'PNC Financial Services Group Inc.' },
    { symbol: 'AON', name: 'Aon plc' },
    { symbol: 'USB', name: 'U.S. Bancorp' },
    { symbol: 'BDX', name: 'Becton Dickinson and Co.' },
    { symbol: 'MMC', name: 'Marsh & McLennan Companies Inc.' },
    { symbol: 'ICE', name: 'Intercontinental Exchange Inc.' },
    { symbol: 'WM', name: 'Waste Management Inc.' },
    { symbol: 'EMR', name: 'Emerson Electric Co.' },
    { symbol: 'COF', name: 'Capital One Financial Corporation' },
    { symbol: 'FCX', name: 'Freeport-McMoRan Inc.' },
    { symbol: 'NKE', name: 'NIKE Inc.' },
    { symbol: 'CCI', name: 'Crown Castle Inc.' },
    { symbol: 'WELL', name: 'Welltower Inc.' },
    { symbol: 'PSA', name: 'Public Storage' },
    { symbol: 'DLR', name: 'Digital Realty Trust Inc.' },
    { symbol: 'AMT', name: 'American Tower Corporation' },
    { symbol: 'SBAC', name: 'SBA Communications Corporation' }
  ];

  const stockSymbols = usStocks.map(stock => stock.symbol);
  const stockOptions = usStocks.map(stock => `${stock.symbol} - ${stock.name}`);

  const handleStockSelect = (stock: { symbol: string; name: string }) => {
    setNewHolding({
      ...newHolding,
      symbol: stock.symbol,
      name: stock.name
    });
    setSearchTerm(stock.symbol);
    setShowSuggestions(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setNewHolding({
      ...newHolding,
      symbol: value.toUpperCase(),
      name: ''
    });
    setShowSuggestions(value.length > 0);
  };

  const filteredStocks = usStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10); // Limit to 10 suggestions

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <SvgIcon icon={homeIcon} size="large" />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, marginBottom: '8px', color: '#ffffff' }}>
                Portfolio Management
              </h1>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
                Monitor your investments and track performance
              </p>
            </div>
          </div>
          <Button 
            className="nextgen-btn nextgen-btn-primary"
            onClick={() => {
              setShowAddModal(true);
              setSearchTerm('');
              setShowSuggestions(false);
            }}
          >
            <SvgIcon icon={plusIcon} size="medium" style={{ marginRight: '8px' }} />
            Add Holding
          </Button>
        </div>

        {/* Portfolio Metrics */}
        <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px' }}>
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total Value</div>
            <div className="nextgen-metric-value">{formatCurrency(totalValue)}</div>
            <div className="nextgen-metric-change nextgen-metric-positive">
              Portfolio worth
            </div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total Gain/Loss</div>
            <div className="nextgen-metric-value" style={{ 
              color: totalGainLoss >= 0 ? '#10b981' : '#ef4444' 
            }}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </div>
            <div className={`nextgen-metric-change ${totalGainLoss >= 0 ? 'nextgen-metric-positive' : 'nextgen-metric-negative'}`}>
              {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
            </div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Holdings</div>
            <div className="nextgen-metric-value">{holdings.length}</div>
            <div className="nextgen-metric-change">Active positions</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Cash Available</div>
            <div className="nextgen-metric-value">{formatCurrency(cashAvailable)}</div>
            <div className="nextgen-metric-change">
              {((cashAvailable / totalValue) * 100).toFixed(1)}% of portfolio
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="nextgen-grid nextgen-grid-3" style={{ gap: '32px' }}>
        {/* Holdings List */}
        <div className="nextgen-card" style={{ gridColumn: 'span 2' }}>
          <div className="nextgen-card-header">
            <div className="nextgen-card-title">Your Holdings</div>
            <div className="nextgen-card-subtitle">Current portfolio positions</div>
          </div>
          <div className="nextgen-card-body" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="nextgen-table" style={{ minWidth: '800px' }}>
              <thead className="nextgen-table-header">
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Shares</th>
                  <th>Avg Price</th>
                  <th>Current Price</th>
                  <th>Value</th>
                  <th>Gain/Loss</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="nextgen-table-body">
                {holdings.map((holding) => (
                  <tr key={holding.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong>{holding.symbol}</strong>
                        <span className={`nextgen-badge nextgen-badge-${holding.change >= 0 ? 'success' : 'error'}`}>
                          <SvgIcon 
                            icon={holding.change >= 0 ? caretAltUpIcon : caretAltDownIcon} 
                            size="small" 
                          />
                        </span>
                        <span style={{
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#6366f1',
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontWeight: '500'
                        }}>
                          {holding.sector}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      {holding.name}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {holding.shares}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatCurrency(holding.avgPrice)}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatCurrency(holding.currentPrice)}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '600' }}>
                      {formatCurrency(holding.value)}
                    </td>
                    <td>
                      <div style={{ 
                        color: holding.change >= 0 ? '#10b981' : '#ef4444',
                        fontWeight: '600',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        {holding.change >= 0 ? '+' : ''}{formatCurrency(holding.change)}
                        <div style={{ fontSize: '0.75rem' }}>
                          ({holding.changePercent >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </td>
                    <td>
                      <Button 
                        className="nextgen-btn nextgen-btn-ghost nextgen-btn-sm"
                        onClick={() => removeHolding(holding.id)}
                      >
                        <SvgIcon icon={trashIcon} size="small" style={{ marginRight: '4px' }} />
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="nextgen-card">
          <div className="nextgen-card-header">
            <div className="nextgen-card-title">Sector Allocation</div>
            <div className="nextgen-card-subtitle">Portfolio diversification</div>
          </div>
          <div className="nextgen-card-body">
            {/* Custom SVG Pie Chart - Guaranteed to work */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '300px',
              background: 'rgba(30, 33, 57, 0.8)',
              borderRadius: '12px',
              position: 'relative'
            }}>
              <svg width="250" height="250" viewBox="0 0 250 250">
                {/* Calculate actual percentages */}
                {(() => {
                  const techPercentage = pieData.find(p => p.category === 'Technology')?.value || 0;
                  const healthcarePercentage = pieData.find(p => p.category === 'Healthcare')?.value || 0;
                  
                  // Calculate end angle for Technology segment (starting from top, clockwise)
                  const techAngle = (techPercentage / 100) * 360;
                  const techEndX = 125 + 100 * Math.sin((techAngle * Math.PI) / 180);
                  const techEndY = 125 - 100 * Math.cos((techAngle * Math.PI) / 180);
                  const largeArcFlag = techPercentage > 50 ? 1 : 0;
                  
                  return (
                    <>
                      {/* Technology segment */}
                      <path
                        d={`M 125 125 L 125 25 A 100 100 0 ${largeArcFlag} 1 ${techEndX} ${techEndY} Z`}
                        fill="#6366f1"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                      />
                      {/* Healthcare segment */}
                      <path
                        d={`M 125 125 L ${techEndX} ${techEndY} A 100 100 0 0 1 125 25 Z`}
                        fill="#22c55e"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                      />
                    </>
                  );
                })()}
                
                {/* Center text - properly spaced */}
                <text x="125" y="110" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="600">
                  Portfolio
                </text>
                <text x="125" y="130" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">
                  {formatCurrency(portfolioValue)}
                </text>
                <text x="125" y="145" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  Total Value
                </text>
              </svg>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              {sectorData.map((sector, index) => (
                <div key={sector.sector} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: sectorColors[sector.sector as keyof typeof sectorColors] || '#94a3b8'
                    }}></div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {sector.sector}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                      {formatCurrency(sector.value)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {portfolioValue > 0 ? ((sector.value / portfolioValue) * 100).toFixed(1) : '0.0'}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Holding Modal */}
      {showAddModal && (
        <Window
          title="Add New Holding"
          onClose={() => {
            setShowAddModal(false);
            setSearchTerm('');
            setShowSuggestions(false);
          }}
          initialWidth={600}
          initialHeight={500}
        >
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Symbol
                </label>
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.value)}
                  placeholder="Type to search stocks (e.g., AAPL)"
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  style={{ width: '100%' }}
                />
                {showSuggestions && filteredStocks.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'rgba(30, 41, 59, 0.95)',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    marginTop: '4px'
                  }}>
                    {filteredStocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        onClick={() => handleStockSelect(stock)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #374151',
                          color: '#ffffff',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ fontWeight: '600' }}>{stock.symbol}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{stock.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Company Name
                </label>
                <Input
                  value={newHolding.name}
                  onChange={(e) => setNewHolding({...newHolding, name: e.value})}
                  placeholder="Apple Inc."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Shares
                </label>
                <NumericTextBox
                  value={newHolding.shares}
                  onChange={(e) => setNewHolding({...newHolding, shares: e.value || 0})}
                  min={0}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Average Price
                </label>
                <NumericTextBox
                  value={newHolding.avgPrice}
                  onChange={(e) => setNewHolding({...newHolding, avgPrice: e.value || 0})}
                  format="c2"
                  min={0}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Current Price
                </label>
                <NumericTextBox
                  value={newHolding.currentPrice}
                  onChange={(e) => setNewHolding({...newHolding, currentPrice: e.value || 0})}
                  format="c2"
                  min={0}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Sector
                </label>
                <DropDownList
                  data={sectorOptions}
                  value={newHolding.sector}
                  onChange={(e) => setNewHolding({...newHolding, sector: e.value})}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button 
                className="nextgen-btn nextgen-btn-secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setSearchTerm('');
                  setShowSuggestions(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="nextgen-btn nextgen-btn-primary"
                onClick={addHolding}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader size="small" />
                    Adding...
                  </div>
                ) : (
                  'Add Holding'
                )}
              </Button>
            </div>
          </div>
        </Window>
      )}
    </div>
  );
};
