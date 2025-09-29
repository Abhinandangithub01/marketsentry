import React, { useState, useEffect } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Badge } from '@progress/kendo-react-indicators';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Window } from '@progress/kendo-react-dialogs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  chartLineIcon,
  trashIcon,
  fileExcelIcon,
  plusIcon,
  pencilIcon
} from '@progress/kendo-svg-icons';

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: Date;
  status: 'OPEN' | 'CLOSED';
  strategy: string;
  pnl?: number;
}

export const TradingJournalModern: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    symbol: '',
    type: 'BUY',
    quantity: 0,
    price: 0,
    date: new Date(),
    status: 'OPEN',
    strategy: '',
    pnl: 0
  });

  // Load trades from localStorage on mount
  useEffect(() => {
    const savedTrades = localStorage.getItem('tradingJournal');
    if (savedTrades) {
      const parsedTrades = JSON.parse(savedTrades).map((trade: any) => ({
        ...trade,
        date: new Date(trade.date)
      }));
      setTrades(parsedTrades);
    } else {
      // Default sample trades
      const defaultTrades: Trade[] = [
        {
          id: '1',
          symbol: 'AAPL',
          type: 'BUY',
          quantity: 100,
          price: 150.25,
          date: new Date('2024-01-15'),
          status: 'CLOSED',
          strategy: 'Growth',
          pnl: 2500
        },
        {
          id: '2',
          symbol: 'TSLA',
          type: 'BUY',
          quantity: 50,
          price: 245.80,
          date: new Date('2024-02-20'),
          status: 'OPEN',
          strategy: 'Momentum',
          pnl: 1200
        },
        {
          id: '3',
          symbol: 'MSFT',
          type: 'SELL',
          quantity: 75,
          price: 338.50,
          date: new Date('2024-03-10'),
          status: 'CLOSED',
          strategy: 'Value',
          pnl: -500
        }
      ];
      setTrades(defaultTrades);
      localStorage.setItem('tradingJournal', JSON.stringify(defaultTrades));
    }
  }, []);

  // Save trades to localStorage whenever trades change
  useEffect(() => {
    if (trades.length > 0) {
      localStorage.setItem('tradingJournal', JSON.stringify(trades));
    }
  }, [trades]);

  const addTrade = () => {
    if (!newTrade.symbol || !newTrade.quantity || !newTrade.price) {
      alert('Please fill in all required fields');
      return;
    }

    const trade: Trade = {
      id: Date.now().toString(),
      symbol: newTrade.symbol!.toUpperCase(),
      type: newTrade.type!,
      quantity: newTrade.quantity!,
      price: newTrade.price!,
      date: newTrade.date!,
      status: newTrade.status!,
      strategy: newTrade.strategy || 'General',
      pnl: newTrade.pnl || 0
    };

    setTrades([...trades, trade]);
    setNewTrade({
      symbol: '',
      type: 'BUY',
      quantity: 0,
      price: 0,
      date: new Date(),
      status: 'OPEN',
      strategy: '',
      pnl: 0
    });
    setShowAddModal(false);
  };

  const deleteTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const updateTrade = (updatedTrade: Trade) => {
    setTrades(trades.map(t => t.id === updatedTrade.id ? updatedTrade : t));
    setEditingTrade(null);
  };

  const filteredTrades = trades.filter(trade => 
    filterStatus === 'ALL' || trade.status === filterStatus
  );

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const openTrades = trades.filter(t => t.status === 'OPEN').length;
  const closedTrades = trades.filter(t => t.status === 'CLOSED').length;
  const winRate = closedTrades > 0 ? 
    (trades.filter(t => t.status === 'CLOSED' && (t.pnl || 0) > 0).length / closedTrades * 100) : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Chart data for P&L over time
  const chartData = trades
    .filter(t => t.status === 'CLOSED')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((trade, index) => ({
      date: formatDate(trade.date),
      pnl: trade.pnl || 0,
      cumulative: trades
        .filter(t => t.status === 'CLOSED' && t.date <= trade.date)
        .reduce((sum, t) => sum + (t.pnl || 0), 0)
    }));

  const statusOptions = [
    { text: 'All Trades', value: 'ALL' },
    { text: 'Open', value: 'OPEN' },
    { text: 'Closed', value: 'CLOSED' }
  ];

  const typeOptions = [
    { text: 'Buy', value: 'BUY' },
    { text: 'Sell', value: 'SELL' }
  ];

  const statusBadgeOptions = [
    { text: 'Open', value: 'OPEN' },
    { text: 'Closed', value: 'CLOSED' }
  ];

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
              Trading Journal
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
              Track and analyze your trading performance
            </p>
          </div>
          <Button 
            className="nextgen-btn nextgen-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            📝 Add Trade
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px' }}>
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total P&L</div>
            <div className="nextgen-metric-value" style={{ 
              color: totalPnL >= 0 ? '#10b981' : '#ef4444' 
            }}>
              {formatCurrency(totalPnL)}
            </div>
            <div className="nextgen-metric-change">
              {totalPnL >= 0 ? 'Profit' : 'Loss'}
            </div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Open Trades</div>
            <div className="nextgen-metric-value">{openTrades}</div>
            <div className="nextgen-metric-change">Active positions</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Closed Trades</div>
            <div className="nextgen-metric-value">{closedTrades}</div>
            <div className="nextgen-metric-change">Completed trades</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Win Rate</div>
            <div className="nextgen-metric-value">{winRate.toFixed(1)}%</div>
            <div className="nextgen-metric-change">Success rate</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="nextgen-grid nextgen-grid-3" style={{ gap: '32px' }}>
        {/* P&L Chart */}
        <div className="nextgen-card" style={{ gridColumn: 'span 2' }}>
          <div className="nextgen-card-header">
            <div className="nextgen-card-title">P&L Performance</div>
            <div className="nextgen-card-subtitle">Cumulative profit/loss over time</div>
          </div>
          <div className="nextgen-card-body">
            {/* Custom SVG P&L Chart */}
            <div style={{ 
              height: '300px',
              background: 'rgba(30, 33, 57, 0.8)',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative'
            }}>
              {chartData.length > 0 ? (
                <svg width="100%" height="100%" viewBox="0 0 600 260">
                  {/* Grid lines */}
                  {Array.from({ length: 6 }, (_, i) => (
                    <line
                      key={`hgrid-${i}`}
                      x1={60}
                      y1={20 + (i * 40)}
                      x2={580}
                      y2={20 + (i * 40)}
                      stroke="#374151"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  ))}
                  
                  {Array.from({ length: 8 }, (_, i) => (
                    <line
                      key={`vgrid-${i}`}
                      x1={60 + (i * 65)}
                      y1={20}
                      x2={60 + (i * 65)}
                      y2={220}
                      stroke="#374151"
                      strokeWidth="1"
                      opacity="0.2"
                    />
                  ))}
                  
                  {/* P&L Line */}
                  {chartData.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      points={chartData.map((data, index) => {
                        const x = 60 + (index * (520 / (chartData.length - 1)));
                        const maxPnL = Math.max(...chartData.map(d => d.cumulative));
                        const minPnL = Math.min(...chartData.map(d => d.cumulative));
                        const range = maxPnL - minPnL || 1;
                        const y = 220 - ((data.cumulative - minPnL) / range) * 180;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}
                  
                  {/* Data Points */}
                  {chartData.map((data, index) => {
                    const x = 60 + (index * (520 / Math.max(chartData.length - 1, 1)));
                    const maxPnL = Math.max(...chartData.map(d => d.cumulative));
                    const minPnL = Math.min(...chartData.map(d => d.cumulative));
                    const range = maxPnL - minPnL || 1;
                    const y = 220 - ((data.cumulative - minPnL) / range) * 180;
                    
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#6366f1"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="600"
                        >
                          ${Math.round(data.cumulative)}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Y-axis labels */}
                  {Array.from({ length: 6 }, (_, i) => {
                    const maxPnL = Math.max(...chartData.map(d => d.cumulative));
                    const minPnL = Math.min(...chartData.map(d => d.cumulative));
                    const range = maxPnL - minPnL || 1;
                    const value = minPnL + (range * (5 - i) / 5);
                    return (
                      <text
                        key={i}
                        x={50}
                        y={25 + (i * 40)}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="10"
                        fontWeight="500"
                      >
                        ${Math.round(value)}
                      </text>
                    );
                  })}
                  
                  {/* X-axis labels */}
                  {chartData.map((data, index) => {
                    if (index % Math.max(1, Math.floor(chartData.length / 6)) === 0) {
                      const x = 60 + (index * (520 / Math.max(chartData.length - 1, 1)));
                      return (
                        <text
                          key={index}
                          x={x}
                          y={240}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="500"
                        >
                          {data.date}
                        </text>
                      );
                    }
                    return null;
                  })}
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
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                      No P&L Data Available
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      Add some closed trades to see your performance chart
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="nextgen-card">
          <div className="nextgen-card-header">
            <div className="nextgen-card-title">Quick Actions</div>
          </div>
          <div className="nextgen-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button 
                className="nextgen-btn nextgen-btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ justifyContent: 'flex-start' }}
              >
                📝 Add New Trade
              </Button>
              <Button 
                className="nextgen-btn nextgen-btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => {
                  const dataStr = JSON.stringify(trades, null, 2);
                  const dataBlob = new Blob([dataStr], {type: 'application/json'});
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'trading-journal-export.json';
                  link.click();
                }}
              >
                <SvgIcon icon={fileExcelIcon} size="medium" style={{ marginRight: '8px' }} />
                Export Data
              </Button>
              <Button 
                className="nextgen-btn nextgen-btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => {
                  const report = `Trading Journal Report\n\nTotal P&L: ${formatCurrency(totalPnL)}\nOpen Trades: ${openTrades}\nClosed Trades: ${closedTrades}\nWin Rate: ${winRate.toFixed(1)}%\n\nTrade History:\n${trades.map(t => `${t.symbol} ${t.type} ${t.quantity}@${formatCurrency(t.price)} - ${formatCurrency(t.pnl || 0)}`).join('\n')}`;
                  const reportBlob = new Blob([report], {type: 'text/plain'});
                  const url = URL.createObjectURL(reportBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'trading-report.txt';
                  link.click();
                }}
              >
                📈 Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="nextgen-card" style={{ marginTop: '32px' }}>
        <div className="nextgen-card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="nextgen-card-title">Trading History</div>
              <div className="nextgen-card-subtitle">All your trades and positions</div>
            </div>
            <DropDownList
              data={statusOptions}
              textField="text"
              dataItemKey="value"
              value={statusOptions.find(option => option.value === filterStatus)}
              onChange={(e) => setFilterStatus(e.value)}
              style={{ width: '150px' }}
            />
          </div>
        </div>
        <div className="nextgen-card-body" style={{ padding: 0 }}>
          <table className="nextgen-table">
            <thead className="nextgen-table-header">
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th>Strategy</th>
                <th>P&L</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="nextgen-table-body">
              {filteredTrades.map((trade) => (
                <tr key={trade.id}>
                  <td style={{ fontWeight: '600' }}>{trade.symbol}</td>
                  <td>
                    <span className={`nextgen-badge nextgen-badge-${trade.type === 'BUY' ? 'success' : 'error'}`}>
                      {trade.type === 'BUY' ? '📈 BUY' : '📉 SELL'}
                    </span>
                  </td>
                  <td>{trade.quantity}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatCurrency(trade.price)}
                  </td>
                  <td>{formatDate(trade.date)}</td>
                  <td>
                    <span className={`nextgen-badge nextgen-badge-${trade.status === 'OPEN' ? 'warning' : 'info'}`}>
                      {trade.status === 'OPEN' ? '🔄 OPEN' : '✅ CLOSED'}
                    </span>
                  </td>
                  <td>{trade.strategy}</td>
                  <td style={{ 
                    color: (trade.pnl || 0) >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {formatCurrency(trade.pnl || 0)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        className="nextgen-btn nextgen-btn-ghost nextgen-btn-sm"
                        onClick={() => setEditingTrade(trade)}
                      >
                        <SvgIcon icon={pencilIcon} size="small" style={{ marginRight: '4px' }} />
                        Edit
                      </Button>
                      <Button 
                        className="nextgen-btn nextgen-btn-ghost nextgen-btn-sm"
                        onClick={() => deleteTrade(trade.id)}
                      >
                        <SvgIcon icon={trashIcon} size="small" style={{ marginRight: '4px' }} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Trade Modal */}
      {showAddModal && (
        <Window
          title="Add New Trade"
          onClose={() => setShowAddModal(false)}
          initialWidth={600}
          initialHeight={500}
        >
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Symbol
                </label>
                <Input
                  value={newTrade.symbol || ''}
                  onChange={(e) => setNewTrade({...newTrade, symbol: e.value.toUpperCase()})}
                  placeholder="AAPL"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Type
                </label>
                <DropDownList
                  data={typeOptions}
                  textField="text"
                  dataItemKey="value"
                  value={typeOptions.find(option => option.value === newTrade.type)}
                  onChange={(e) => setNewTrade({...newTrade, type: e.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Quantity
                </label>
                <NumericTextBox
                  value={newTrade.quantity}
                  onChange={(e) => setNewTrade({...newTrade, quantity: e.value || 0})}
                  min={0}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Price
                </label>
                <NumericTextBox
                  value={newTrade.price}
                  onChange={(e) => setNewTrade({...newTrade, price: e.value || 0})}
                  format="c2"
                  min={0}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Date
                </label>
                <DatePicker
                  value={newTrade.date}
                  onChange={(e) => setNewTrade({...newTrade, date: e.value || new Date()})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Status
                </label>
                <DropDownList
                  data={statusBadgeOptions}
                  textField="text"
                  dataItemKey="value"
                  value={statusBadgeOptions.find(option => option.value === newTrade.status)}
                  onChange={(e) => setNewTrade({...newTrade, status: e.value})}
                />
              </div>
              
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Strategy
                </label>
                <Input
                  value={newTrade.strategy || ''}
                  onChange={(e) => setNewTrade({...newTrade, strategy: e.value})}
                  placeholder="Growth, Value, Momentum, etc."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  P&L
                </label>
                <NumericTextBox
                  value={newTrade.pnl}
                  onChange={(e) => setNewTrade({...newTrade, pnl: e.value || 0})}
                  format="c2"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button 
                className="nextgen-btn nextgen-btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="nextgen-btn nextgen-btn-primary"
                onClick={addTrade}
              >
                Add Trade
              </Button>
            </div>
          </div>
        </Window>
      )}
    </div>
  );
};
