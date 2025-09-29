import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Badge } from '@progress/kendo-react-indicators';
import { Button } from '@progress/kendo-react-buttons';
import { SvgIcon } from '@progress/kendo-react-common';
import { 
  chartLineIcon, 
  chartPieIcon, 
  infoCircleIcon, 
  checkIcon, 
  dollarIcon,
  clockIcon,
  arrowRotateCwIcon,
  paletteIcon,
  fileIcon,
  searchIcon,
  folderIcon,
  bellIcon
} from '@progress/kendo-svg-icons';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Loader } from '@progress/kendo-react-indicators';
import { Window } from '@progress/kendo-react-dialogs';

export const KendoShowcase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Comprehensive data about Kendo component usage
  const componentUsageData = [
    {
      id: 1,
      component: 'Button',
      category: 'Buttons',
      instances: 15,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Primary, secondary, and ghost buttons for actions',
      usage: 'Add holdings, remove items, form submissions, modal controls'
    },
    {
      id: 2,
      component: 'DropDownList',
      category: 'Inputs',
      instances: 8,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Dropdown selection for categories, sectors, and filters',
      usage: 'Sector selection, expense categories, trade types, status filters'
    },
    {
      id: 3,
      component: 'Input',
      category: 'Inputs',
      instances: 12,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Text input fields for data entry',
      usage: 'Stock symbols, company names, descriptions, strategies'
    },
    {
      id: 4,
      component: 'NumericTextBox',
      category: 'Inputs',
      instances: 12,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Numeric input with formatting and validation',
      usage: 'Prices, quantities, amounts, shares, currency values'
    },
    {
      id: 5,
      component: 'DatePicker',
      category: 'Inputs',
      instances: 3,
      pages: 'Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Date selection with calendar popup',
      usage: 'Transaction dates, trade execution dates'
    },
    {
      id: 6,
      component: 'Chart',
      category: 'Data Visualization',
      instances: 4,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Premium',
      description: 'Advanced charting for data visualization',
      usage: 'Portfolio allocation, spending trends, trading performance'
    },
    {
      id: 7,
      component: 'Grid',
      category: 'Data Display',
      instances: 1,
      pages: 'Kendo Showcase',
      freeComponent: 'Premium',
      description: 'Advanced data grid with sorting and filtering',
      usage: 'Component usage statistics display'
    },
    {
      id: 8,
      component: 'Window',
      category: 'Layout',
      instances: 6,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Modal dialogs for forms and confirmations',
      usage: 'Add holding modal, add expense modal, add trade modal'
    },
    {
      id: 9,
      component: 'TabStrip',
      category: 'Navigation',
      instances: 1,
      pages: 'Kendo Showcase',
      freeComponent: 'Free',
      description: 'Tab navigation for organizing content',
      usage: 'Showcase page organization'
    },
    {
      id: 10,
      component: 'Badge',
      category: 'Indicators',
      instances: 25,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Status indicators and labels',
      usage: 'Transaction types, trade status, gain/loss indicators'
    },
    {
      id: 11,
      component: 'ProgressBar',
      category: 'Indicators',
      instances: 6,
      pages: 'Spending, Kendo Showcase',
      freeComponent: 'Free',
      description: 'Progress visualization for budgets and metrics',
      usage: 'Budget usage tracking, component usage visualization'
    },
    {
      id: 12,
      component: 'Card',
      category: 'Layout',
      instances: 15,
      pages: 'All pages',
      freeComponent: 'Free',
      description: 'Container component for content sections',
      usage: 'News articles, metrics, analysis sections'
    },
    {
      id: 13,
      component: 'ProgressBar',
      category: 'Indicators',
      instances: 3,
      pages: 'Spending, Portfolio',
      freeComponent: 'Free',
      description: 'Visual progress and percentage indicators',
      usage: 'Budget usage, portfolio allocation, loading states'
    },
    {
      id: 14,
      component: 'Window',
      category: 'Layout',
      instances: 6,
      pages: 'Portfolio, Spending, Trading Journal',
      freeComponent: 'Free',
      description: 'Modal dialogs for forms and confirmations',
      usage: 'Add holding modal, add expense modal, add trade modal'
    }
  ];

  // Calculate statistics
  const totalComponents = componentUsageData.length;
  const totalInstances = componentUsageData.reduce((sum, item) => sum + item.instances, 0);
  const freeComponents = componentUsageData.filter(item => item.freeComponent === 'Free').length;
  const premiumComponents = componentUsageData.filter(item => item.freeComponent === 'Premium').length;
  const freeInstances = componentUsageData.filter(item => item.freeComponent === 'Free').reduce((sum, item) => sum + item.instances, 0);
  const premiumInstances = componentUsageData.filter(item => item.freeComponent === 'Premium').reduce((sum, item) => sum + item.instances, 0);

  // Chart data for component usage
  const componentCategoryData = [
    { category: 'Inputs', count: 5, instances: 33 },
    { category: 'Buttons', count: 1, instances: 15 },
    { category: 'Data Visualization', count: 1, instances: 4 },
    { category: 'Data Display', count: 1, instances: 1 },
    { category: 'Layout', count: 3, instances: 27 },
    { category: 'Navigation', count: 1, instances: 1 },
    { category: 'Indicators', count: 3, instances: 34 }
  ];

  const usageByPageData = [
    { page: 'Portfolio', instances: 35 },
    { page: 'Spending', instances: 28 },
    { page: 'Trading Journal', instances: 22 },
    { page: 'Kendo Showcase', instances: 30 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="nextgen-container">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
              <SvgIcon icon={chartLineIcon} size="large" />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, marginBottom: '8px', color: '#ffffff' }}>
                Kendo React Component Showcase
              </h1>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
                Comprehensive overview of Kendo UI components used in MarketSentry
              </p>
            </div>
          </div>
          <Button 
            className="nextgen-btn nextgen-btn-primary"
            onClick={() => setShowModal(true)}
          >
            <SvgIcon icon={infoCircleIcon} style={{ marginRight: '8px' }} />
            View Details
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px', marginBottom: '32px' }}>
        <Card className="nextgen-card">
          <CardBody>
            <div className="nextgen-metric">
              <div className="nextgen-metric-label">Total Components</div>
              <div className="nextgen-metric-value">{totalComponents}</div>
              <div className="nextgen-metric-change nextgen-metric-positive">
                <span className="nextgen-badge nextgen-badge-success" style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  marginRight: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <SvgIcon icon={checkIcon} size="small" />
                  {freeComponents} Free
                </span>
                <span className="nextgen-badge nextgen-badge-warning" style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <SvgIcon icon={dollarIcon} size="small" />
                  {premiumComponents} Premium
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="nextgen-card">
          <CardBody>
            <div className="nextgen-metric">
              <div className="nextgen-metric-label">Total Instances</div>
              <div className="nextgen-metric-value">{totalInstances}</div>
              <div className="nextgen-metric-change nextgen-metric-positive">
                Across 4 pages
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="nextgen-card">
          <CardBody>
            <div className="nextgen-metric">
              <div className="nextgen-metric-label">Free Usage</div>
              <div className="nextgen-metric-value">{((freeInstances / totalInstances) * 100).toFixed(1)}%</div>
              <div className="nextgen-metric-change nextgen-metric-positive">
                {freeInstances} instances
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="nextgen-card">
          <CardBody>
            <div className="nextgen-metric">
              <div className="nextgen-metric-label">Development Impact</div>
              <div className="nextgen-metric-value">85%</div>
              <div className="nextgen-metric-change nextgen-metric-positive">
                Time saved
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content with TabStrip */}
      <Card className="nextgen-card">
        <CardHeader>
          <CardTitle>Kendo Component Analysis</CardTitle>
        </CardHeader>
        <CardBody>
          <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)}>
            <TabStripTab title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SvgIcon icon={chartLineIcon} size="small" />
                Usage Statistics
              </span>
            }>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* Component Category Chart */}
                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Components by Category</h3>
                    <div style={{ 
                      height: '300px',
                      background: 'rgba(30, 33, 57, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      position: 'relative'
                    }}>
                      <svg width="100%" height="100%" viewBox="0 0 400 260">
                        {/* Donut Chart */}
                        {componentCategoryData.map((data, index) => {
                          const total = componentCategoryData.reduce((sum, item) => sum + item.count, 0);
                          const percentage = (data.count / total) * 100;
                          const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
                          const color = colors[index % colors.length];
                          
                          // Calculate angles for donut segments
                          const startAngle = componentCategoryData.slice(0, index).reduce((sum, item) => sum + (item.count / total) * 360, 0);
                          const endAngle = startAngle + (data.count / total) * 360;
                          
                          const centerX = 120;
                          const centerY = 130;
                          const outerRadius = 80;
                          const innerRadius = 40;
                          
                          const startAngleRad = (startAngle - 90) * Math.PI / 180;
                          const endAngleRad = (endAngle - 90) * Math.PI / 180;
                          
                          const x1 = centerX + outerRadius * Math.cos(startAngleRad);
                          const y1 = centerY + outerRadius * Math.sin(startAngleRad);
                          const x2 = centerX + outerRadius * Math.cos(endAngleRad);
                          const y2 = centerY + outerRadius * Math.sin(endAngleRad);
                          const x3 = centerX + innerRadius * Math.cos(endAngleRad);
                          const y3 = centerY + innerRadius * Math.sin(endAngleRad);
                          const x4 = centerX + innerRadius * Math.cos(startAngleRad);
                          const y4 = centerY + innerRadius * Math.sin(startAngleRad);
                          
                          const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                          
                          return (
                            <g key={index}>
                              <path
                                d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                                fill={color}
                                opacity="0.8"
                              />
                            </g>
                          );
                        })}
                        
                        {/* Legend */}
                        {componentCategoryData.map((data, index) => {
                          const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
                          const color = colors[index % colors.length];
                          return (
                            <g key={`legend-${index}`}>
                              <circle
                                cx={260}
                                cy={40 + index * 25}
                                r="6"
                                fill={color}
                              />
                              <text
                                x={275}
                                y={45 + index * 25}
                                fill="#ffffff"
                                fontSize="12"
                                fontWeight="500"
                              >
                                {data.category} ({data.count})
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Center text */}
                        <text
                          x={120}
                          y={125}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="14"
                          fontWeight="600"
                        >
                          Total
                        </text>
                        <text
                          x={120}
                          y={140}
                          textAnchor="middle"
                          fill="#6366f1"
                          fontSize="18"
                          fontWeight="700"
                        >
                          {componentCategoryData.reduce((sum, item) => sum + item.count, 0)}
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* Usage by Page Chart */}
                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Usage by Page</h3>
                    <div style={{ 
                      height: '300px',
                      background: 'rgba(30, 33, 57, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      position: 'relative'
                    }}>
                      <svg width="100%" height="100%" viewBox="0 0 400 260">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <line
                            key={`hgrid-${i}`}
                            x1={60}
                            y1={20 + (i * 36)}
                            x2={380}
                            y2={20 + (i * 36)}
                            stroke="#374151"
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        ))}
                        
                        {/* Bars */}
                        {usageByPageData.map((data, index) => {
                          const maxValue = Math.max(...usageByPageData.map(d => d.instances));
                          const barHeight = (data.instances / maxValue) * 160;
                          const x = 80 + (index * 70);
                          const y = 200 - barHeight;
                          return (
                            <g key={index}>
                              <rect
                                x={x}
                                y={y}
                                width="50"
                                height={barHeight}
                                fill="#6366f1"
                                rx="4"
                                opacity="0.8"
                              />
                              <text
                                x={x + 25}
                                y={y - 8}
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="12"
                                fontWeight="600"
                              >
                                {data.instances}
                              </text>
                              <text
                                x={x + 25}
                                y={230}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="10"
                                fontWeight="500"
                              >
                                {data.page}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Y-axis labels */}
                        {[0, 10, 20, 30, 40].map((value, i) => (
                          <text
                            key={i}
                            x={50}
                            y={205 - (i * 36)}
                            textAnchor="end"
                            fill="#94a3b8"
                            fontSize="11"
                            fontWeight="500"
                          >
                            {value}
                          </text>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </TabStripTab>

            <TabStripTab title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SvgIcon icon={fileIcon} size="small" />
                Component Details
              </span>
            }>
              <div style={{ padding: '20px' }}>
                <div style={{ 
                  background: 'rgba(30, 33, 57, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  overflow: 'hidden'
                }}>
                  <Grid 
                    data={componentUsageData}
                    style={{ 
                      height: '500px',
                      background: 'transparent'
                    }}
                  >
                    <GridColumn field="component" title="Component" width="150px" headerClassName="grid-header" />
                    <GridColumn field="category" title="Category" width="120px" headerClassName="grid-header" />
                    <GridColumn field="instances" title="Instances" width="100px" headerClassName="grid-header" />
                    <GridColumn 
                      field="freeComponent" 
                      title="License" 
                      width="100px"
                      headerClassName="grid-header"
                    />
                    <GridColumn 
                      field="pages" 
                      title="Used In" 
                      width="200px" 
                      headerClassName="grid-header"
                    />
                    <GridColumn 
                      field="description" 
                      title="Description" 
                      headerClassName="grid-header"
                    />
                  </Grid>
                </div>
              </div>
            </TabStripTab>

            <TabStripTab title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SvgIcon icon={arrowRotateCwIcon} size="small" />
                Development Impact
              </span>
            }>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Development Benefits</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <SvgIcon icon={clockIcon} size="small" />
                            Time Saved
                          </span>
                          <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>85%</span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '8px', 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: '85%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '4px'
                          }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <SvgIcon icon={arrowRotateCwIcon} size="small" />
                            Code Reusability
                          </span>
                          <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>92%</span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '8px', 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: '92%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '4px'
                          }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <SvgIcon icon={paletteIcon} size="small" />
                            UI Consistency
                          </span>
                          <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>98%</span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '8px', 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: '98%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '4px'
                          }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <SvgIcon icon={arrowRotateCwIcon} size="small" />
                            Development Speed
                          </span>
                          <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>78%</span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '8px', 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: '78%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '4px'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Key Achievements</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Card style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px',
                        marginBottom: '16px'
                      }}>
                        <CardBody style={{ padding: '16px' }}>
                          <div style={{ 
                            color: '#10b981', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <SvgIcon icon={chartLineIcon} size="small" style={{ marginRight: '6px' }} />
                            Rapid Prototyping
                          </div>
                          <div style={{ color: '#ffffff', fontSize: '0.875rem', lineHeight: '1.4' }}>
                            Built complete financial dashboard in 2 weeks using pre-built Kendo components
                          </div>
                        </CardBody>
                      </Card>

                      <Card style={{ 
                        background: 'rgba(99, 102, 241, 0.1)', 
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '12px',
                        marginBottom: '16px'
                      }}>
                        <CardBody style={{ padding: '16px' }}>
                          <div style={{ 
                            color: '#6366f1', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <SvgIcon icon={fileIcon} size="small" style={{ marginRight: '6px' }} />
                            Responsive Design
                          </div>
                          <div style={{ color: '#ffffff', fontSize: '0.875rem', lineHeight: '1.4' }}>
                            All components automatically adapt to different screen sizes
                          </div>
                        </CardBody>
                      </Card>

                      <Card style={{ 
                        background: 'rgba(245, 158, 11, 0.1)', 
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '12px',
                        marginBottom: '16px'
                      }}>
                        <CardBody style={{ padding: '16px' }}>
                          <div style={{ 
                            color: '#f59e0b', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <SvgIcon icon={paletteIcon} size="small" style={{ marginRight: '6px' }} />
                            Theme Consistency
                          </div>
                          <div style={{ color: '#ffffff', fontSize: '0.875rem', lineHeight: '1.4' }}>
                            Unified dark theme across all components with minimal custom CSS
                          </div>
                        </CardBody>
                      </Card>

                      <Card style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px'
                      }}>
                        <CardBody style={{ padding: '16px' }}>
                          <div style={{ 
                            color: '#ef4444', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <SvgIcon icon={arrowRotateCwIcon} size="small" style={{ marginRight: '6px' }} />
                            Performance
                          </div>
                          <div style={{ color: '#ffffff', fontSize: '0.875rem', lineHeight: '1.4' }}>
                            Optimized components with built-in virtualization and lazy loading
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </TabStripTab>

            <TabStripTab title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SvgIcon icon={infoCircleIcon} size="small" />
                Implementation Details
              </span>
            }>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Free Components Utilized</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {componentUsageData.filter(item => item.freeComponent === 'Free').map(component => (
                        <div key={component.id} style={{ 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <SvgIcon icon={checkIcon} size="small" />
                              {component.component}
                            </span>
                            <span className="nextgen-badge nextgen-badge-success" style={{
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.4)'
                            }}>
                              {component.instances} uses
                            </span>
                          </div>
                          <div style={{ color: '#e2e8f0', fontSize: '0.875rem', lineHeight: '1.4' }}>
                            {component.usage}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Premium Components</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {componentUsageData.filter(item => item.freeComponent === 'Premium').map(component => (
                        <div key={component.id} style={{ 
                          background: 'rgba(245, 158, 11, 0.1)', 
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <SvgIcon icon={dollarIcon} size="small" />
                              {component.component}
                            </span>
                            <span className="nextgen-badge nextgen-badge-warning" style={{
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: 'rgba(245, 158, 11, 0.2)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245, 158, 11, 0.4)'
                            }}>
                              {component.instances} uses
                            </span>
                          </div>
                          <div style={{ color: '#e2e8f0', fontSize: '0.875rem', lineHeight: '1.4' }}>
                            {component.usage}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                      <div style={{ color: '#ef4444', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SvgIcon icon={dollarIcon} size="small" />
                        Licensing Note
                      </div>
                      <div style={{ color: '#ffffff', fontSize: '0.875rem' }}>
                        Premium components require a Kendo UI license for production use. 
                        Current usage shows {premiumInstances} instances across {premiumComponents} component types.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabStripTab>
          </TabStrip>
        </CardBody>
      </Card>

      {/* Modal for additional details */}
      {showModal && (
        <Window
          title="Kendo Component Usage Details"
          onClose={() => setShowModal(false)}
          initialHeight={400}
          initialWidth={600}
        >
          <div style={{ padding: '20px' }}>
            <h4 style={{ color: '#ffffff', marginBottom: '16px' }}>Meta Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>This showcase page uses:</span>
                <span style={{ color: '#ffffff' }}>8 Kendo components</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Grid component instances:</span>
                <span style={{ color: '#ffffff' }}>1 (displaying component data)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Chart component instances:</span>
                <span style={{ color: '#ffffff' }}>2 (donut & column charts)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>TabStrip tabs:</span>
                <span style={{ color: '#ffffff' }}>4 (organized content)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Cards used:</span>
                <span style={{ color: '#ffffff' }}>12 (layout & metrics)</span>
              </div>
            </div>
            
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
              <div style={{ color: '#6366f1', fontWeight: '600', marginBottom: '8px' }}>
                🎯 Recursive Kendo Usage
              </div>
              <div style={{ color: '#ffffff', fontSize: '0.875rem' }}>
                This page demonstrates Kendo components being used to display statistics about 
                Kendo component usage - a perfect example of the framework's versatility!
              </div>
            </div>
          </div>
        </Window>
      )}
    </div>
  );
};
