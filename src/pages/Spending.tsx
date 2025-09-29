import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import { Badge } from '@progress/kendo-react-indicators';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Window } from '@progress/kendo-react-dialogs';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  chartLineIcon,
  dollarIcon,
  carIcon,
  filmIcon,
  cartIcon,
  boldIcon,
  heartIcon,
  bookIcon,
  paperPlaneIcon,
  homeIcon,
  folderIcon,
  calculatorIcon,
  caretAltUpIcon,
  allIcon
} from '@progress/kendo-svg-icons';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  type: 'EXPENSE' | 'INCOME';
}

interface Budget {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

export const Spending: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH');
  const [newExpense, setNewExpense] = useState({
    category: 'Food',
    description: '',
    amount: 0,
    date: new Date(),
    type: 'EXPENSE' as const
  });

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses).map((expense: any) => ({
        ...expense,
        date: new Date(expense.date)
      }));
      setExpenses(parsedExpenses);
      // Update budgets based on loaded expenses
      setTimeout(() => updateBudgets(parsedExpenses), 0);
    } else {
      // Default sample expenses
      const defaultExpenses: Expense[] = [
        {
          id: '1',
          category: 'Food',
          description: 'Grocery shopping',
          amount: 150.00,
          date: new Date('2024-01-15'),
          type: 'EXPENSE'
        },
        {
          id: '2',
          category: 'Transportation',
          description: 'Gas',
          amount: 60.00,
          date: new Date('2024-01-16'),
          type: 'EXPENSE'
        },
        {
          id: '3',
          category: 'Entertainment',
          description: 'Movie tickets',
          amount: 25.00,
          date: new Date('2024-01-17'),
          type: 'EXPENSE'
        },
        {
          id: '4',
          category: 'Income',
          description: 'Salary',
          amount: 5000.00,
          date: new Date('2024-01-01'),
          type: 'INCOME'
        }
      ];
      setExpenses(defaultExpenses);
      localStorage.setItem('expenses', JSON.stringify(defaultExpenses));
      // Update budgets based on default expenses
      setTimeout(() => updateBudgets(defaultExpenses), 0);
    }
  }, []);

  // Save expenses whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date,
      type: newExpense.type
    };

    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    
    // Update budgets if it's an expense
    if (newExpense.type === 'EXPENSE') {
      updateBudgets(updatedExpenses);
    }
    
    setNewExpense({
      category: 'Food',
      description: '',
      amount: 0,
      date: new Date(),
      type: 'EXPENSE'
    });
    setShowAddModal(false);
  };

  // Function to update budgets based on actual expenses
  const updateBudgets = (currentExpenses: Expense[]) => {
    const defaultBudgetAmounts = {
      'Food': 500,
      'Transportation': 200,
      'Entertainment': 150,
      'Shopping': 300,
      'Utilities': 250,
      'Healthcare': 200
    };

    const expensesByCategory = currentExpenses
      .filter(e => e.type === 'EXPENSE')
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

    const updatedBudgets: Budget[] = Object.keys(defaultBudgetAmounts).map(category => {
      const budgeted = defaultBudgetAmounts[category as keyof typeof defaultBudgetAmounts];
      const spent = expensesByCategory[category] || 0;
      const remaining = budgeted - spent;
      
      return {
        category,
        budgeted,
        spent,
        remaining
      };
    });

    setBudgets(updatedBudgets);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(e => e.id !== id);
    setExpenses(updatedExpenses);
    updateBudgets(updatedExpenses);
  };

  const totalExpenses = expenses
    .filter(e => e.type === 'EXPENSE')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = expenses
    .filter(e => e.type === 'INCOME')
    .reduce((sum, e) => sum + e.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const totalBudget = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  // Chart data for spending by category
  const categoryData = expenses
    .filter(e => e.type === 'EXPENSE')
    .reduce((acc, expense) => {
      const existing = acc.find(item => item.category === expense.category);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ category: expense.category, amount: expense.amount });
      }
      return acc;
    }, [] as { category: string; amount: number }[]);

  // Monthly spending trend - calculate from actual expenses
  const monthlyData = React.useMemo(() => {
    const monthlySpending = expenses
      .filter(e => e.type === 'EXPENSE')
      .reduce((acc, expense) => {
        const monthKey = expense.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

    // Get last 6 months
    const months = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const shortMonth = date.toLocaleDateString('en-US', { month: 'short' });
      months.push({
        month: shortMonth,
        amount: monthlySpending[monthKey] || 0
      });
    }
    return months;
  }, [expenses]);

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

  const categoryOptions = [
    { text: 'Food', value: 'Food' },
    { text: 'Transportation', value: 'Transportation' },
    { text: 'Entertainment', value: 'Entertainment' },
    { text: 'Shopping', value: 'Shopping' },
    { text: 'Utilities', value: 'Utilities' },
    { text: 'Healthcare', value: 'Healthcare' },
    { text: 'Income', value: 'Income' }
  ];

  const typeOptions = [
    { text: 'Expense', value: 'EXPENSE' },
    { text: 'Income', value: 'INCOME' }
  ];

  const periodOptions = [
    { text: 'This Month', value: 'THIS_MONTH' },
    { text: 'Last Month', value: 'LAST_MONTH' },
    { text: 'This Year', value: 'THIS_YEAR' },
    { text: 'All Time', value: 'ALL_TIME' }
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
              Spending Tracker
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
              Track your expenses and manage your budget
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <DropDownList
              data={periodOptions}
              textField="text"
              dataItemKey="value"
              value={periodOptions.find(option => option.value === selectedPeriod)}
              onChange={(e) => setSelectedPeriod(e.value)}
              style={{ width: '150px' }}
            />
            <Button 
              className="nextgen-btn nextgen-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px' }}>
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total Income</div>
            <div className="nextgen-metric-value" style={{ color: '#10b981' }}>
              {formatCurrency(totalIncome)}
            </div>
            <div className="nextgen-metric-change nextgen-metric-positive">Monthly income</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total Expenses</div>
            <div className="nextgen-metric-value" style={{ color: '#ef4444' }}>
              {formatCurrency(totalExpenses)}
            </div>
            <div className="nextgen-metric-change nextgen-metric-negative">Monthly spending</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Net Income</div>
            <div className="nextgen-metric-value" style={{ 
              color: netIncome >= 0 ? '#10b981' : '#ef4444' 
            }}>
              {formatCurrency(netIncome)}
            </div>
            <div className="nextgen-metric-change">
              {netIncome >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Budget Used</div>
            <div className="nextgen-metric-value">
              {((totalSpent / totalBudget) * 100).toFixed(1)}%
            </div>
            <div className="nextgen-metric-change">
              {formatCurrency(totalBudget - totalSpent)} remaining
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '32px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Spending by Category Chart */}
        <div className="nextgen-card" style={{ width: '100%' }}>
          <div className="nextgen-card-header">
            <div className="nextgen-card-title">Spending by Category</div>
            <div className="nextgen-card-subtitle">Current month breakdown</div>
          </div>
          <div className="nextgen-card-body">
            {/* Custom SVG Pie Chart for Spending Categories */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.2fr 0.8fr',
              alignItems: 'center', 
              height: '320px',
              background: 'rgba(30, 33, 57, 0.8)',
              borderRadius: '12px',
              position: 'relative',
              padding: '20px',
              gap: '20px'
            }}>
              {categoryData.length > 0 ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <svg width="260" height="260" viewBox="0 0 260 260">
                  {(() => {
                    const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
                    let currentAngle = 0;
                    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
                    
                    return (
                      <>
                        {categoryData.map((item, index) => {
                          const percentage = (item.amount / total) * 100;
                          const angle = (percentage / 100) * 360;
                          const startX = 125 + 100 * Math.sin((currentAngle * Math.PI) / 180);
                          const startY = 125 - 100 * Math.cos((currentAngle * Math.PI) / 180);
                          const endX = 125 + 100 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                          const endY = 125 - 100 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                          const largeArcFlag = angle > 180 ? 1 : 0;
                          
                          const path = `M 125 125 L ${startX} ${startY} A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                          currentAngle += angle;
                          
                          return (
                            <path
                              key={item.category}
                              d={path}
                              fill={colors[index % colors.length]}
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="2"
                            />
                          );
                        })}
                        
                        {/* Center text */}
                        <text x="130" y="120" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="600">
                          Total Spent
                        </text>
                        <text x="130" y="135" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">
                          {formatCurrency(total)}
                        </text>
                        <text x="130" y="150" textAnchor="middle" fill="#94a3b8" fontSize="11">
                          This Month
                        </text>
                      </>
                    );
                  })()}
                </svg>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <SvgIcon icon={chartLineIcon} size="large" />
                  </div>
                  <div>No expenses to display</div>
                </div>
              )}
              
              {/* Legend - Second Column */}
              {categoryData.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  gap: '16px',
                  height: '100%',
                  paddingLeft: '8px'
                }}>
                {categoryData.map((item, index) => {
                  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
                  const total = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
                  const percentage = ((item.amount / total) * 100).toFixed(1);
                  
                  // Category icons mapping
                  const getCategoryIcon = (category: string) => {
                    const iconMap: { [key: string]: any } = {
                      'Food': dollarIcon,
                      'Transportation': carIcon,
                      'Entertainment': filmIcon,
                      'Shopping': cartIcon,
                      'Utilities': boldIcon,
                      'Healthcare': heartIcon,
                      'Education': bookIcon,
                      'Travel': paperPlaneIcon,
                      'Other': allIcon
                    };
                    return iconMap[category] || dollarIcon;
                  };
                  
                  return (
                    <div key={item.category} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px 16px',
                      background: `linear-gradient(135deg, ${colors[index % colors.length]}15, ${colors[index % colors.length]}08)`,
                      borderRadius: '12px',
                      border: `1px solid ${colors[index % colors.length]}30`,
                      transition: 'all 0.3s ease'
                    }}>
                      {/* Icon and color indicator */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${colors[index % colors.length]}, ${colors[index % colors.length]}CC)`,
                        boxShadow: `0 4px 12px ${colors[index % colors.length]}40`
                      }}>
                        <SvgIcon 
                          icon={getCategoryIcon(item.category)} 
                          size="medium" 
                          style={{ color: '#ffffff' }}
                        />
                      </div>
                      
                      {/* Category info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: '600', 
                          color: '#ffffff',
                          marginBottom: '2px'
                        }}>
                          {item.category}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: colors[index % colors.length],
                          fontWeight: '500'
                        }}>
                          {formatCurrency(item.amount)} ({percentage}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="nextgen-card" style={{ width: '100%' }}>
          <div className="nextgen-card-header">
            <div className="nextgen-card-title">Budget Overview</div>
            <div className="nextgen-card-subtitle">Monthly budget status</div>
          </div>
          <div className="nextgen-card-body" style={{ padding: '24px' }}>
            <div style={{ 
              display: 'grid', 
              gap: '24px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
            }}>
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.budgeted) * 100;
                const isOverBudget = budget.spent > budget.budgeted;
                const getBudgetCategoryIcon = (category: string) => {
                  const iconMap: { [key: string]: any } = {
                    'Food': dollarIcon,
                    'Transportation': carIcon,
                    'Entertainment': filmIcon,
                    'Shopping': cartIcon,
                    'Utilities': boldIcon,
                    'Healthcare': heartIcon,
                    'Education': bookIcon,
                    'Travel': paperPlaneIcon
                  };
                  return iconMap[category] || dollarIcon;
                };
                
                return (
                  <div key={budget.category} style={{
                    padding: '24px',
                    background: 'rgba(30, 33, 57, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: `1px solid ${isOverBudget ? '#ef4444' : '#374151'}`,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Background gradient */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${isOverBudget ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)'}, transparent)`,
                      pointerEvents: 'none'
                    }}></div>
                    
                    {/* Header with icon and category */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: `linear-gradient(135deg, ${isOverBudget ? '#ef4444' : '#6366f1'}, ${isOverBudget ? '#dc2626' : '#8b5cf6'})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}>
                          <SvgIcon 
                            icon={getBudgetCategoryIcon(budget.category)} 
                            size="large" 
                            style={{ color: '#ffffff' }}
                          />
                        </div>
                        <div>
                          <div style={{ 
                            fontWeight: '700', 
                            color: '#ffffff',
                            fontSize: '1.125rem',
                            marginBottom: '4px'
                          }}>
                            {budget.category}
                          </div>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            color: '#94a3b8'
                          }}>
                            {percentage.toFixed(1)}% used
                          </div>
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: isOverBudget ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isOverBudget ? '#ef4444' : '#10b981',
                        border: `1px solid ${isOverBudget ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {isOverBudget ? 'Over Budget' : 'On Track'}
                      </div>
                    </div>
                    
                    {/* Amount display */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'baseline',
                      marginBottom: '16px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '1.75rem', 
                          fontWeight: '900', 
                          color: '#ffffff',
                          lineHeight: 1
                        }}>
                          {formatCurrency(budget.spent)}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#94a3b8',
                          marginTop: '4px'
                        }}>
                          of {formatCurrency(budget.budgeted)} budgeted
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700',
                          color: budget.remaining >= 0 ? '#10b981' : '#ef4444'
                        }}>
                          {budget.remaining >= 0 ? '+' : ''}{formatCurrency(budget.remaining)}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: '#94a3b8',
                          marginTop: '2px'
                        }}>
                          {budget.remaining >= 0 ? 'remaining' : 'over budget'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced progress bar */}
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 1,
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{
                        width: `${Math.max(Math.min(percentage, 100), 5)}%`,
                        height: '100%',
                        background: isOverBudget 
                          ? 'linear-gradient(90deg, #ef4444, #dc2626) !important' 
                          : 'linear-gradient(90deg, #22c55e, #16a34a) !important',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 8px ${isOverBudget ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                        minWidth: '8px'
                      }}></div>
                      
                      {/* Progress indicator */}
                      {percentage > 5 && (
                        <div style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#ffffff',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                        }}>
                          {percentage.toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="nextgen-card" style={{ marginTop: '32px' }}>
        <div className="nextgen-card-header">
          <div className="nextgen-card-title">Spending Trend</div>
          <div className="nextgen-card-subtitle">Monthly spending over time</div>
        </div>
        <div className="nextgen-card-body">
          {/* Custom SVG Line Chart */}
          <div style={{ 
            height: '300px',
            background: 'rgba(30, 33, 57, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative'
          }}>
            {monthlyData.length > 0 ? (
              <svg width="100%" height="100%" viewBox="0 0 800 260">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <line
                    key={`grid-${i}`}
                    x1={100 + (i * 120)}
                    y1={20}
                    x2={100 + (i * 120)}
                    y2={200}
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                ))}
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={`hgrid-${i}`}
                    x1={80}
                    y1={20 + (i * 45)}
                    x2={720}
                    y2={20 + (i * 45)}
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}
                
                {/* Chart line */}
                {(() => {
                  const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1);
                  const points = monthlyData.map((data, index) => {
                    const x = 100 + (index * 120);
                    const y = 200 - ((data.amount / maxAmount) * 160);
                    return `${x},${y}`;
                  }).join(' ');
                  
                  return (
                    <>
                      {/* Line */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points */}
                      {monthlyData.map((data, index) => {
                        const x = 100 + (index * 120);
                        const y = 200 - ((data.amount / maxAmount) * 160);
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#6366f1"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </>
                  );
                })()}
                
                {/* X-axis labels (months) */}
                {monthlyData.map((data, index) => (
                  <text
                    key={index}
                    x={100 + (index * 120)}
                    y={230}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="500"
                  >
                    {data.month}
                  </text>
                ))}
                
                {/* Y-axis labels (amounts) */}
                {(() => {
                  const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1);
                  return [0, 1, 2, 3, 4].map(i => {
                    const value = (maxAmount / 4) * (4 - i);
                    return (
                      <text
                        key={i}
                        x={70}
                        y={25 + (i * 45)}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="11"
                        fontWeight="500"
                      >
                        ${Math.round(value)}
                      </text>
                    );
                  });
                })()}
                
                {/* Chart title */}
                <text x="400" y="15" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="600">
                  Monthly Spending Trend
                </text>
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
                  <div>No spending data to display</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="nextgen-card" style={{ marginTop: '32px' }}>
        <div className="nextgen-card-header">
          <div className="nextgen-card-title">Recent Transactions</div>
          <div className="nextgen-card-subtitle">Latest income and expenses</div>
        </div>
        <div className="nextgen-card-body" style={{ padding: 0 }}>
          <table className="nextgen-table">
            <thead className="nextgen-table-header">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="nextgen-table-body">
              {expenses.slice().reverse().map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td style={{ fontWeight: '600' }}>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>
                    <span className={`nextgen-badge nextgen-badge-${
                      expense.type === 'INCOME' ? 'success' : 'error'
                    }`}>
                      {expense.type}
                    </span>
                  </td>
                  <td style={{ 
                    color: expense.type === 'INCOME' ? '#10b981' : '#ef4444',
                    fontWeight: '600',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {expense.type === 'INCOME' ? '+' : '-'}{formatCurrency(expense.amount)}
                  </td>
                  <td>
                    <Button 
                      className="nextgen-btn nextgen-btn-ghost nextgen-btn-sm"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <Window
          title="Add Transaction"
          onClose={() => setShowAddModal(false)}
          initialWidth={600}
          initialHeight={500}
        >
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Type
                </label>
                <DropDownList
                  data={typeOptions}
                  textField="text"
                  dataItemKey="value"
                  value={typeOptions.find(option => option.value === newExpense.type)}
                  onChange={(e) => setNewExpense({...newExpense, type: e.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Category
                </label>
                <DropDownList
                  data={categoryOptions}
                  textField="text"
                  dataItemKey="value"
                  value={categoryOptions.find(option => option.value === newExpense.category)}
                  onChange={(e) => setNewExpense({...newExpense, category: e.value})}
                />
              </div>
              
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Description
                </label>
                <Input
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.value})}
                  placeholder="Enter description..."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Amount
                </label>
                <NumericTextBox
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.value || 0})}
                  format="c2"
                  min={0}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#ffffff', fontWeight: '600' }}>
                  Date
                </label>
                <DatePicker
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.value || new Date()})}
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
                onClick={addExpense}
              >
                Add Transaction
              </Button>
            </div>
          </div>
        </Window>
      )}
    </div>
  );
};
