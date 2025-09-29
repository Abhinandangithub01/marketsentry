import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import { Badge } from '@progress/kendo-react-indicators';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Input } from '@progress/kendo-react-inputs';
import { SvgIcon } from '@progress/kendo-react-common';
import { chartLineIcon } from '@progress/kendo-svg-icons';

interface AIInsight {
  id: string;
  type: 'PREDICTION' | 'SENTIMENT' | 'PATTERN' | 'RISK' | 'OPPORTUNITY' | 'FUNDAMENTAL' | 'EARNINGS' | 'VALUATION';
  title: string;
  description: string;
  confidence: number;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  symbol?: string;
  targetPrice?: number;
  timeframe?: string;
  analysisType?: 'TECHNICAL' | 'FUNDAMENTAL' | 'MIXED';
}

interface MarketPrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  direction: 'UP' | 'DOWN' | 'SIDEWAYS';
  timeframe: string;
  reasoning: string;
}

interface RiskAssessment {
  category: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  score: number;
  description: string;
  mitigation: string;
}

interface FundamentalData {
  symbol: string;
  companyName: string;
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  priceToBook: number;
  debtToEquity: number;
  roe: number;
  revenueGrowth: number;
  earningsGrowth: number;
  freeCashFlow: number;
  dividendYield: number;
  analystRating: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  fairValue: number;
  upside: number;
}

interface EarningsAnalysis {
  symbol: string;
  nextEarningsDate: string;
  estimatedEPS: number;
  actualEPS?: number;
  surprise?: number;
  revenueEstimate: number;
  actualRevenue?: number;
  guidance: string;
  analystSentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export const AIAnalysis: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<MarketPrediction[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [fundamentalData, setFundamentalData] = useState<FundamentalData[]>([]);
  const [earningsData, setEarningsData] = useState<EarningsAnalysis[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [analysisType, setAnalysisType] = useState<'TECHNICAL' | 'FUNDAMENTAL' | 'MIXED'>('MIXED');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Sample AI insights
    const sampleInsights: AIInsight[] = [
      {
        id: '1',
        type: 'PREDICTION',
        title: 'Strong Bullish Signal for AAPL',
        description: 'Technical analysis combined with sentiment data suggests Apple stock is likely to break above $185 resistance level within the next 2 weeks.',
        confidence: 87,
        impact: 'HIGH',
        recommendation: 'Consider long position with stop-loss at $175',
        symbol: 'AAPL',
        targetPrice: 190,
        timeframe: '2 weeks'
      },
      {
        id: '2',
        type: 'SENTIMENT',
        title: 'Positive Market Sentiment Surge',
        description: 'Social media sentiment analysis shows 78% positive mentions across major tech stocks, indicating strong retail investor confidence.',
        confidence: 92,
        impact: 'MEDIUM',
        recommendation: 'Monitor for continuation of positive trend in tech sector'
      },
      {
        id: '3',
        type: 'PATTERN',
        title: 'Cup and Handle Formation Detected',
        description: 'MSFT is forming a classic cup and handle pattern with 82% historical success rate for similar formations.',
        confidence: 78,
        impact: 'MEDIUM',
        recommendation: 'Wait for breakout confirmation above $350',
        symbol: 'MSFT',
        targetPrice: 365,
        timeframe: '1 month'
      },
      {
        id: '4',
        type: 'RISK',
        title: 'Elevated Volatility Warning',
        description: 'VIX levels and options flow suggest increased market volatility expected around upcoming Fed announcement.',
        confidence: 85,
        impact: 'HIGH',
        recommendation: 'Consider reducing position sizes or implementing hedging strategies'
      },
      {
        id: '5',
        type: 'OPPORTUNITY',
        title: 'Oversold Condition in Energy Sector',
        description: 'RSI and other momentum indicators suggest energy stocks are oversold, presenting potential buying opportunity.',
        confidence: 73,
        impact: 'MEDIUM',
        recommendation: 'Consider selective positions in quality energy names'
      },
      {
        id: '6',
        type: 'FUNDAMENTAL',
        title: 'AAPL Strong Fundamental Metrics',
        description: 'Apple shows excellent fundamental health with P/E of 28.5, ROE of 147%, and strong cash flow generation of $99.8B annually.',
        confidence: 91,
        impact: 'HIGH',
        recommendation: 'Fundamentals support long-term bullish outlook',
        symbol: 'AAPL',
        analysisType: 'FUNDAMENTAL'
      },
      {
        id: '7',
        type: 'EARNINGS',
        title: 'MSFT Earnings Beat Expected',
        description: 'Microsoft likely to beat Q4 earnings estimates by 8-12% based on cloud revenue acceleration and AI product adoption.',
        confidence: 84,
        impact: 'HIGH',
        recommendation: 'Position ahead of earnings announcement',
        symbol: 'MSFT',
        analysisType: 'FUNDAMENTAL'
      },
      {
        id: '8',
        type: 'VALUATION',
        title: 'GOOGL Undervalued vs Peers',
        description: 'Google trades at 22x forward P/E vs sector average of 28x, despite superior growth prospects and market position.',
        confidence: 79,
        impact: 'MEDIUM',
        recommendation: 'Value opportunity with 25% upside to fair value',
        symbol: 'GOOGL',
        targetPrice: 165,
        analysisType: 'FUNDAMENTAL'
      }
    ];

    const samplePredictions: MarketPrediction[] = [
      {
        symbol: 'AAPL',
        currentPrice: 178.50,
        predictedPrice: 190.00,
        confidence: 87,
        direction: 'UP',
        timeframe: '2 weeks',
        reasoning: 'Strong earnings momentum, positive sentiment, technical breakout pattern'
      },
      {
        symbol: 'MSFT',
        currentPrice: 342.75,
        predictedPrice: 365.00,
        confidence: 82,
        direction: 'UP',
        timeframe: '1 month',
        reasoning: 'Cloud growth acceleration, AI integration benefits, institutional buying'
      },
      {
        symbol: 'GOOGL',
        currentPrice: 138.20,
        predictedPrice: 145.00,
        confidence: 75,
        direction: 'UP',
        timeframe: '3 weeks',
        reasoning: 'Search revenue stability, YouTube growth, cost optimization'
      },
      {
        symbol: 'TSLA',
        currentPrice: 248.50,
        predictedPrice: 235.00,
        confidence: 68,
        direction: 'DOWN',
        timeframe: '2 weeks',
        reasoning: 'Production concerns, increased competition, valuation pressure'
      }
    ];

    const sampleRiskAssessments: RiskAssessment[] = [
      {
        category: 'Market Risk',
        level: 'MEDIUM',
        score: 65,
        description: 'Overall market conditions show moderate risk due to Fed policy uncertainty',
        mitigation: 'Diversify across sectors and maintain cash reserves'
      },
      {
        category: 'Sector Concentration',
        level: 'HIGH',
        score: 78,
        description: 'Portfolio heavily weighted in technology sector increases volatility risk',
        mitigation: 'Rebalance to include defensive sectors like utilities and healthcare'
      },
      {
        category: 'Liquidity Risk',
        level: 'LOW',
        score: 25,
        description: 'Current holdings maintain high liquidity with tight bid-ask spreads',
        mitigation: 'Continue focusing on large-cap, high-volume stocks'
      },
      {
        category: 'Currency Risk',
        level: 'LOW',
        score: 30,
        description: 'Limited exposure to foreign currency fluctuations',
        mitigation: 'Monitor international positions for currency hedging needs'
      },
      {
        category: 'Interest Rate Risk',
        level: 'MEDIUM',
        score: 55,
        description: 'Rising rate environment may impact growth stock valuations',
        mitigation: 'Consider value stocks and shorter duration investments'
      }
    ];

    const sampleFundamentalData: FundamentalData[] = [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        marketCap: 2800000000000,
        peRatio: 28.5,
        pegRatio: 2.1,
        priceToBook: 39.8,
        debtToEquity: 1.73,
        roe: 147.4,
        revenueGrowth: 2.8,
        earningsGrowth: 13.4,
        freeCashFlow: 99800000000,
        dividendYield: 0.44,
        analystRating: 'BUY',
        fairValue: 195.0,
        upside: 9.2
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        marketCap: 2650000000000,
        peRatio: 32.1,
        pegRatio: 1.8,
        priceToBook: 12.4,
        debtToEquity: 0.47,
        roe: 38.9,
        revenueGrowth: 12.1,
        earningsGrowth: 18.7,
        freeCashFlow: 65600000000,
        dividendYield: 0.72,
        analystRating: 'STRONG_BUY',
        fairValue: 385.0,
        upside: 12.3
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        marketCap: 1750000000000,
        peRatio: 22.3,
        pegRatio: 1.2,
        priceToBook: 5.8,
        debtToEquity: 0.11,
        roe: 25.7,
        revenueGrowth: 8.4,
        earningsGrowth: 15.2,
        freeCashFlow: 69500000000,
        dividendYield: 0.0,
        analystRating: 'BUY',
        fairValue: 165.0,
        upside: 19.4
      }
    ];

    const sampleEarningsData: EarningsAnalysis[] = [
      {
        symbol: 'AAPL',
        nextEarningsDate: '2024-02-01',
        estimatedEPS: 2.18,
        revenueEstimate: 117500000000,
        guidance: 'Management expects continued growth in Services and steady iPhone demand',
        analystSentiment: 'POSITIVE'
      },
      {
        symbol: 'MSFT',
        nextEarningsDate: '2024-01-24',
        estimatedEPS: 2.78,
        revenueEstimate: 60800000000,
        guidance: 'Strong Azure growth expected, AI integration driving enterprise adoption',
        analystSentiment: 'POSITIVE'
      },
      {
        symbol: 'GOOGL',
        nextEarningsDate: '2024-01-30',
        estimatedEPS: 1.33,
        revenueEstimate: 76100000000,
        guidance: 'Search revenue stabilizing, YouTube and Cloud showing acceleration',
        analystSentiment: 'NEUTRAL'
      }
    ];

    setInsights(sampleInsights);
    setPredictions(samplePredictions);
    setRiskAssessments(sampleRiskAssessments);
    setFundamentalData(sampleFundamentalData);
    setEarningsData(sampleEarningsData);
  }, []);

  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let newInsight: AIInsight;
      
      if (analysisType === 'FUNDAMENTAL') {
        // Generate fundamental analysis
        const fundamentalTypes = ['FUNDAMENTAL', 'EARNINGS', 'VALUATION'] as const;
        const randomType = fundamentalTypes[Math.floor(Math.random() * fundamentalTypes.length)];
        
        const fundamentalTitles = {
          FUNDAMENTAL: `${selectedSymbol} Fundamental Health Check`,
          EARNINGS: `${selectedSymbol} Earnings Outlook`,
          VALUATION: `${selectedSymbol} Valuation Analysis`
        };
        
        const fundamentalDescriptions = {
          FUNDAMENTAL: `Comprehensive fundamental analysis shows ${selectedSymbol} has ${Math.random() > 0.6 ? 'strong' : 'mixed'} financial metrics including revenue growth, profitability ratios, and balance sheet strength.`,
          EARNINGS: `Earnings analysis indicates ${selectedSymbol} is ${Math.random() > 0.5 ? 'likely to beat' : 'expected to meet'} consensus estimates based on business momentum and guidance.`,
          VALUATION: `Valuation models suggest ${selectedSymbol} is ${Math.random() > 0.5 ? 'undervalued' : 'fairly valued'} compared to industry peers and historical multiples.`
        };
        
        newInsight = {
          id: Date.now().toString(),
          type: randomType,
          title: fundamentalTitles[randomType],
          description: fundamentalDescriptions[randomType],
          confidence: Math.floor(Math.random() * 25) + 75,
          impact: 'HIGH',
          recommendation: `Based on fundamental analysis: ${Math.random() > 0.5 ? 'Strong buy recommendation' : 'Hold with positive outlook'}`,
          symbol: selectedSymbol,
          targetPrice: Math.floor(Math.random() * 50) + 150,
          timeframe: '3-6 months',
          analysisType: 'FUNDAMENTAL'
        };
      } else if (analysisType === 'TECHNICAL') {
        // Generate technical analysis
        newInsight = {
          id: Date.now().toString(),
          type: 'PATTERN',
          title: `${selectedSymbol} Technical Pattern Analysis`,
          description: `Technical indicators show ${Math.random() > 0.5 ? 'bullish' : 'bearish'} momentum with key support/resistance levels identified.`,
          confidence: Math.floor(Math.random() * 30) + 70,
          impact: 'MEDIUM',
          recommendation: `Technical analysis suggests ${Math.random() > 0.5 ? 'upward momentum' : 'consolidation phase'}`,
          symbol: selectedSymbol,
          targetPrice: Math.floor(Math.random() * 50) + 150,
          timeframe: '1-2 weeks',
          analysisType: 'TECHNICAL'
        };
      } else {
        // Mixed analysis
        newInsight = {
          id: Date.now().toString(),
          type: 'PREDICTION',
          title: `${selectedSymbol} Comprehensive AI Analysis`,
          description: `Combined technical and fundamental analysis indicates ${Math.random() > 0.5 ? 'positive' : 'neutral'} outlook with multiple confirming signals.`,
          confidence: Math.floor(Math.random() * 20) + 80,
          impact: 'HIGH',
          recommendation: `Multi-factor analysis supports ${Math.random() > 0.5 ? 'accumulation strategy' : 'cautious optimism'}`,
          symbol: selectedSymbol,
          targetPrice: Math.floor(Math.random() * 50) + 150,
          timeframe: '2-4 weeks',
          analysisType: 'MIXED'
        };
      }

      setInsights([newInsight, ...insights.slice(0, 7)]);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const symbolOptions = [
    { text: 'Apple Inc. (AAPL)', value: 'AAPL' },
    { text: 'Microsoft Corp. (MSFT)', value: 'MSFT' },
    { text: 'Alphabet Inc. (GOOGL)', value: 'GOOGL' },
    { text: 'Tesla Inc. (TSLA)', value: 'TSLA' },
    { text: 'Amazon.com Inc. (AMZN)', value: 'AMZN' },
    { text: 'NVIDIA Corp. (NVDA)', value: 'NVDA' }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'EXTREME': return '#dc2626';
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const confidenceData = insights.map(insight => ({
    type: insight.type,
    confidence: insight.confidence
  }));

  const riskScoreData = riskAssessments.map(risk => ({
    category: risk.category,
    score: risk.score
  }));

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
              AI Analysis
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
              Advanced AI-powered market analysis and predictions
            </p>
          </div>
          <Button 
            className="nextgen-btn nextgen-btn-primary"
            onClick={generateAIAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '🔄 Analyzing...' : '🤖 Generate Analysis'}
          </Button>
        </div>

        {/* AI Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Analyze Symbol
            </label>
            <DropDownList
              data={symbolOptions}
              textField="text"
              dataItemKey="value"
              value={symbolOptions.find(option => option.value === selectedSymbol)}
              onChange={(e) => setSelectedSymbol(e.value)}
              style={{ width: '200px' }}
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
              Analysis Type
            </label>
            <DropDownList
              data={[
                { text: 'Mixed Analysis', value: 'MIXED' },
                { text: 'Technical Only', value: 'TECHNICAL' },
                { text: 'Fundamental Only', value: 'FUNDAMENTAL' }
              ]}
              textField="text"
              dataItemKey="value"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.value)}
              style={{ width: '160px' }}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Custom Analysis Query
            </label>
            <Input
              value={analysisQuery}
              onChange={(e) => setAnalysisQuery(e.value)}
              placeholder="Ask AI about fundamentals, technicals, earnings, valuation..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)}>
        <TabStripTab title="AI Insights">
          <div style={{ padding: '24px 0' }}>
            <div className="nextgen-grid nextgen-grid-2" style={{ gap: '32px' }}>
              {/* AI Insights List */}
              <div className="nextgen-card">
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">Latest AI Insights</div>
                  <div className="nextgen-card-subtitle">Machine learning powered market analysis</div>
                </div>
                <div className="nextgen-card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {insights.map((insight) => (
                      <div key={insight.id} style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid #374151',
                        borderLeft: `4px solid ${getImpactColor(insight.impact)}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className={`nextgen-badge nextgen-badge-${
                              insight.type === 'PREDICTION' ? 'info' :
                              insight.type === 'SENTIMENT' ? 'success' :
                              insight.type === 'PATTERN' ? 'warning' :
                              insight.type === 'RISK' ? 'error' : 'info'
                            }`}>
                              {insight.type}
                            </span>
                            {insight.symbol && (
                              <span style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: '600', 
                                color: '#6366f1',
                                fontFamily: 'JetBrains Mono, monospace'
                              }}>
                                {insight.symbol}
                              </span>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6366f1' }}>
                              {insight.confidence}%
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Confidence
                            </div>
                          </div>
                        </div>
                        
                        <h4 style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '700', 
                          color: '#ffffff', 
                          marginBottom: '8px' 
                        }}>
                          {insight.title}
                        </h4>
                        
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#e2e8f0', 
                          lineHeight: '1.5', 
                          marginBottom: '16px' 
                        }}>
                          {insight.description}
                        </p>

                        {insight.targetPrice && (
                          <div style={{ 
                            display: 'flex', 
                            gap: '16px', 
                            marginBottom: '12px',
                            fontSize: '0.875rem'
                          }}>
                            <span style={{ color: '#94a3b8' }}>
                              Target: <strong style={{ color: '#10b981' }}>
                                {formatCurrency(insight.targetPrice)}
                              </strong>
                            </span>
                            {insight.timeframe && (
                              <span style={{ color: '#94a3b8' }}>
                                Timeframe: <strong style={{ color: '#f59e0b' }}>
                                  {insight.timeframe}
                                </strong>
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div style={{
                          padding: '12px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6366f1', marginBottom: '4px' }}>
                            AI Recommendation
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: '500' }}>
                            {insight.recommendation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confidence Chart */}
              <div className="nextgen-card">
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">AI Confidence Levels</div>
                  <div className="nextgen-card-subtitle">Confidence by analysis type</div>
                </div>
                <div className="nextgen-card-body">
                  {/* Custom SVG Chart */}
                  <div className="nextgen-chart-container" style={{ 
                    height: '300px',
                    background: 'rgba(30, 33, 57, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    position: 'relative'
                  }}>
                    {confidenceData.length > 0 ? (
                      <svg width="100%" height="100%" viewBox="0 0 400 260">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                          <line
                            key={`hgrid-${i}`}
                            x1={60}
                            y1={20 + (i * 48)}
                            x2={380}
                            y2={20 + (i * 48)}
                            stroke="#374151"
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        ))}
                        
                        {/* Bars */}
                        {confidenceData.map((data, index) => {
                          const barHeight = (data.confidence / 100) * 180;
                          const x = 80 + (index * 60);
                          const y = 200 - barHeight;
                          return (
                            <g key={index}>
                              <rect
                                x={x}
                                y={y}
                                width="40"
                                height={barHeight}
                                fill="#6366f1"
                                rx="4"
                              />
                              <text
                                x={x + 20}
                                y={y - 8}
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="12"
                                fontWeight="600"
                              >
                                {data.confidence}%
                              </text>
                              <text
                                x={x + 20}
                                y={230}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="10"
                                fontWeight="500"
                              >
                                {data.type}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Y-axis labels */}
                        {[0, 25, 50, 75, 100].map((value, i) => (
                          <text
                            key={i}
                            x={50}
                            y={205 - (i * 45)}
                            textAnchor="end"
                            fill="#94a3b8"
                            fontSize="11"
                            fontWeight="500"
                          >
                            {value}%
                          </text>
                        ))}
                      </svg>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%',
                        color: '#94a3b8',
                        textAlign: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '48px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                            <SvgIcon icon={chartLineIcon} size="large" />
                          </div>
                          <div>No confidence data available</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Price Predictions">
          <div style={{ padding: '24px 0' }}>
            <div className="nextgen-card">
              <div className="nextgen-card-header">
                <div className="nextgen-card-title">AI Price Predictions</div>
                <div className="nextgen-card-subtitle">Machine learning price forecasts</div>
              </div>
                <div className="nextgen-card-body" style={{ padding: 0 }}>
                  <table className="nextgen-table">
                  <thead className="nextgen-table-header">
                    <tr>
                      <th>Symbol</th>
                      <th>Current Price</th>
                      <th>Predicted Price</th>
                      <th>Direction</th>
                      <th>Confidence</th>
                      <th>Timeframe</th>
                      <th>Reasoning</th>
                    </tr>
                  </thead>
                  <tbody className="nextgen-table-body">
                    {predictions.map((prediction) => (
                      <tr key={prediction.symbol}>
                        <td>
                          <span style={{ 
                            fontWeight: '600',
                            fontFamily: 'JetBrains Mono, monospace'
                          }}>
                            {prediction.symbol}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {formatCurrency(prediction.currentPrice)}
                        </td>
                        <td style={{ 
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: '600',
                          color: prediction.predictedPrice > prediction.currentPrice ? '#10b981' : '#ef4444'
                        }}>
                          {formatCurrency(prediction.predictedPrice)}
                        </td>
                        <td>
                          <span className={`nextgen-badge nextgen-badge-${
                            prediction.direction === 'UP' ? 'success' :
                            prediction.direction === 'DOWN' ? 'error' : 'warning'
                          }`}>
                            {prediction.direction === 'UP' ? '📈 UP' :
                             prediction.direction === 'DOWN' ? '📉 DOWN' : '➡️ SIDEWAYS'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1' }}>
                              {prediction.confidence}%
                            </span>
                            <ProgressBar 
                              value={prediction.confidence} 
                              style={{ width: '60px', height: '6px' }}
                            />
                          </div>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                          {prediction.timeframe}
                        </td>
                        <td style={{ fontSize: '0.875rem', maxWidth: '200px' }}>
                          {prediction.reasoning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Fundamental Analysis">
          <div style={{ padding: '24px 0' }}>
            <div className="nextgen-grid nextgen-grid-2" style={{ gap: '32px' }}>
              {/* Fundamental Metrics */}
              <div className="nextgen-card">
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">Key Financial Metrics</div>
                  <div className="nextgen-card-subtitle">Comprehensive fundamental analysis</div>
                </div>
                <div className="nextgen-card-body" style={{ padding: 0 }}>
                    <table className="nextgen-table">
                    <thead className="nextgen-table-header">
                      <tr>
                        <th>Symbol</th>
                        <th>P/E Ratio</th>
                        <th>PEG Ratio</th>
                        <th>ROE</th>
                        <th>Revenue Growth</th>
                        <th>Rating</th>
                        <th>Upside</th>
                      </tr>
                    </thead>
                    <tbody className="nextgen-table-body">
                      {fundamentalData.map((data) => (
                        <tr key={data.symbol}>
                          <td>
                            <span style={{ 
                              fontWeight: '600',
                              fontFamily: 'JetBrains Mono, monospace'
                            }}>
                              {data.symbol}
                            </span>
                          </td>
                          <td style={{ 
                            fontFamily: 'JetBrains Mono, monospace',
                            color: data.peRatio < 25 ? '#10b981' : data.peRatio < 35 ? '#f59e0b' : '#ef4444'
                          }}>
                            {data.peRatio.toFixed(1)}
                          </td>
                          <td style={{ 
                            fontFamily: 'JetBrains Mono, monospace',
                            color: data.pegRatio < 1.5 ? '#10b981' : data.pegRatio < 2.0 ? '#f59e0b' : '#ef4444'
                          }}>
                            {data.pegRatio.toFixed(1)}
                          </td>
                          <td style={{ 
                            fontFamily: 'JetBrains Mono, monospace',
                            color: data.roe > 20 ? '#10b981' : data.roe > 15 ? '#f59e0b' : '#ef4444'
                          }}>
                            {data.roe.toFixed(1)}%
                          </td>
                          <td style={{ 
                            fontFamily: 'JetBrains Mono, monospace',
                            color: data.revenueGrowth > 10 ? '#10b981' : data.revenueGrowth > 5 ? '#f59e0b' : '#ef4444'
                          }}>
                            {data.revenueGrowth.toFixed(1)}%
                          </td>
                          <td>
                            <span className={`nextgen-badge nextgen-badge-${
                              data.analystRating === 'STRONG_BUY' ? 'success' :
                              data.analystRating === 'BUY' ? 'success' :
                              data.analystRating === 'HOLD' ? 'warning' : 'error'
                            }`}>
                              {data.analystRating.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ 
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: '600',
                            color: data.upside > 15 ? '#10b981' : data.upside > 5 ? '#f59e0b' : '#ef4444'
                          }}>
                            +{data.upside.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                </div>
              </div>

              {/* Valuation Analysis */}
              <div className="nextgen-card">
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">Valuation Analysis</div>
                  <div className="nextgen-card-subtitle">AI-powered fair value estimates</div>
                </div>
                <div className="nextgen-card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {fundamentalData.map((data) => (
                      <div key={data.symbol} style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid #374151'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                              {data.companyName}
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
                              {data.symbol} • Market Cap: ${(data.marketCap / 1e12).toFixed(2)}T
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366f1' }}>
                              ${data.fairValue.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Fair Value
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                              Free Cash Flow
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                              ${(data.freeCashFlow / 1e9).toFixed(1)}B
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                              Debt/Equity
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '600', 
                              color: data.debtToEquity < 0.5 ? '#10b981' : data.debtToEquity < 1.0 ? '#f59e0b' : '#ef4444'
                            }}>
                              {data.debtToEquity.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                              Dividend Yield
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1' }}>
                              {data.dividendYield.toFixed(2)}%
                            </div>
                          </div>
                        </div>

                        <div style={{
                          padding: '12px',
                          background: data.upside > 10 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          borderRadius: '8px',
                          border: `1px solid ${data.upside > 10 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                        }}>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: data.upside > 10 ? '#10b981' : '#f59e0b', 
                            marginBottom: '4px' 
                          }}>
                            AI Valuation Assessment
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: '500' }}>
                            {data.upside > 15 ? 'Significantly undervalued with strong upside potential' :
                             data.upside > 5 ? 'Moderately undervalued, good entry opportunity' :
                             'Fairly valued at current levels'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Earnings Analysis">
          <div style={{ padding: '24px 0' }}>
            <div className="nextgen-card">
              <div className="nextgen-card-header">
                <div className="nextgen-card-title">Upcoming Earnings</div>
                <div className="nextgen-card-subtitle">AI-powered earnings predictions and analysis</div>
              </div>
              <div className="nextgen-card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {earningsData.map((earnings) => (
                    <div key={earnings.symbol} style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      border: '1px solid #374151',
                      borderLeft: `4px solid ${
                        earnings.analystSentiment === 'POSITIVE' ? '#10b981' :
                        earnings.analystSentiment === 'NEGATIVE' ? '#ef4444' : '#f59e0b'
                      }`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: 0, marginBottom: '4px' }}>
                            {earnings.symbol} Earnings Preview
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
                            Earnings Date: {new Date(earnings.nextEarningsDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`nextgen-badge nextgen-badge-${
                          earnings.analystSentiment === 'POSITIVE' ? 'success' :
                          earnings.analystSentiment === 'NEGATIVE' ? 'error' : 'warning'
                        }`}>
                          {earnings.analystSentiment}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                            EPS Estimates
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Estimated EPS:</span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1' }}>
                                ${earnings.estimatedEPS.toFixed(2)}
                              </span>
                            </div>
                            {earnings.actualEPS && (
                              <>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Actual EPS:</span>
                                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff' }}>
                                    ${earnings.actualEPS.toFixed(2)}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Surprise:</span>
                                  <span style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: '600', 
                                    color: (earnings.surprise || 0) > 0 ? '#10b981' : '#ef4444'
                                  }}>
                                    {earnings.surprise && earnings.surprise > 0 ? '+' : ''}{earnings.surprise?.toFixed(1)}%
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                            Revenue Estimates
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Estimated Revenue:</span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1' }}>
                                ${(earnings.revenueEstimate / 1e9).toFixed(1)}B
                              </span>
                            </div>
                            {earnings.actualRevenue && (
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Actual Revenue:</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff' }}>
                                  ${(earnings.actualRevenue / 1e9).toFixed(1)}B
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        padding: '16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#6366f1', marginBottom: '8px', fontWeight: '600' }}>
                          Management Guidance & AI Analysis
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#ffffff', lineHeight: '1.5' }}>
                          {earnings.guidance}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabStripTab>

        <TabStripTab title="Risk Assessment">
          <div style={{ padding: '24px 0' }}>
            <div className="nextgen-grid nextgen-grid-2" style={{ gap: '32px' }}>
              {/* Risk Overview Chart */}
              <div className="nextgen-card">
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">Risk Score Analysis</div>
                  <div className="nextgen-card-subtitle">AI-powered risk assessment</div>
                </div>
                <div className="nextgen-card-body">
                  {/* Custom SVG Risk Chart */}
                  <div className="nextgen-chart-container" style={{ 
                    height: '300px',
                    background: 'rgba(30, 33, 57, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    position: 'relative'
                  }}>
                    {riskScoreData.length > 0 ? (
                      <svg width="100%" height="100%" viewBox="0 0 500 260">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                          <line
                            key={`hgrid-${i}`}
                            x1={80}
                            y1={20 + (i * 48)}
                            x2={480}
                            y2={20 + (i * 48)}
                            stroke="#374151"
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        ))}
                        
                        {/* Bars */}
                        {riskScoreData.map((data, index) => {
                          const barHeight = (data.score / 100) * 180;
                          const x = 100 + (index * 70);
                          const y = 200 - barHeight;
                          return (
                            <g key={index}>
                              <rect
                                x={x}
                                y={y}
                                width="50"
                                height={barHeight}
                                fill="#ef4444"
                                rx="4"
                              />
                              <text
                                x={x + 25}
                                y={y - 8}
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="12"
                                fontWeight="600"
                              >
                                {data.score}
                              </text>
                              <text
                                x={x + 25}
                                y={230}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="9"
                                fontWeight="500"
                              >
                                {data.category.replace(' Risk', '')}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Y-axis labels */}
                        {[0, 25, 50, 75, 100].map((value, i) => (
                          <text
                            key={i}
                            x={70}
                            y={205 - (i * 45)}
                            textAnchor="end"
                            fill="#94a3b8"
                            fontSize="11"
                            fontWeight="500"
                          >
                            {value}
                          </text>
                        ))}
                      </svg>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%',
                        color: '#94a3b8',
                        textAlign: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                          <div>No risk data available</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Risk Details */}
              <div className="nextgen-card">
                <div className="nextgen-card-header">
                  <div className="nextgen-card-title">Risk Categories</div>
                  <div className="nextgen-card-subtitle">Detailed risk breakdown</div>
                </div>
                <div className="nextgen-card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {riskAssessments.map((risk) => (
                      <div key={risk.category} style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid #374151',
                        borderLeft: `4px solid ${getRiskColor(risk.level)}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                            {risk.category}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`nextgen-badge nextgen-badge-${
                              risk.level === 'EXTREME' || risk.level === 'HIGH' ? 'error' :
                              risk.level === 'MEDIUM' ? 'warning' : 'success'
                            }`}>
                              {risk.level}
                            </span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: getRiskColor(risk.level) }}>
                              {risk.score}/100
                            </span>
                          </div>
                        </div>
                        
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#e2e8f0', 
                          lineHeight: '1.4', 
                          marginBottom: '12px' 
                        }}>
                          {risk.description}
                        </p>
                        
                        <div style={{
                          padding: '8px 12px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: '6px',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '2px' }}>
                            Mitigation Strategy
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#ffffff' }}>
                            {risk.mitigation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabStripTab>
      </TabStrip>
    </div>
  );
};
