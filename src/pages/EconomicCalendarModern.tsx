import React, { useState, useEffect } from 'react';
import { Calendar } from '@progress/kendo-react-dateinputs';
import { Card, CardBody, CardHeader, CardTitle } from '@progress/kendo-react-layout';
import { Badge } from '@progress/kendo-react-indicators';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';

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

export const EconomicCalendarModern: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EconomicEvent[]>([]);
  const [impactFilter, setImpactFilter] = useState('ALL');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Generate sample economic events
    const sampleEvents: EconomicEvent[] = [
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
        title: 'GDP Growth Rate',
        date: new Date(Date.now() + 259200000), // 3 days from now
        time: '08:30',
        impact: 'HIGH',
        country: 'United States',
        currency: 'USD',
        forecast: '2.1%',
        previous: '2.4%',
        description: 'The annualized change in the inflation-adjusted value of all goods and services produced by the economy.'
      },
      {
        id: '5',
        title: 'European Central Bank Interest Rate Decision',
        date: new Date(Date.now() + 345600000), // 4 days from now
        time: '12:45',
        impact: 'HIGH',
        country: 'European Union',
        currency: 'EUR',
        forecast: '4.50%',
        previous: '4.25%',
        description: 'The ECB announces its decision on interest rates for the Eurozone.'
      },
      {
        id: '6',
        title: 'Unemployment Rate',
        date: new Date(Date.now() + 432000000), // 5 days from now
        time: '08:30',
        impact: 'MEDIUM',
        country: 'United States',
        currency: 'USD',
        forecast: '3.7%',
        previous: '3.5%',
        description: 'The percentage of the total workforce that is unemployed and actively seeking employment.'
      },
      {
        id: '7',
        title: 'Retail Sales',
        date: new Date(Date.now() + 518400000), // 6 days from now
        time: '08:30',
        impact: 'MEDIUM',
        country: 'United States',
        currency: 'USD',
        forecast: '0.3%',
        previous: '0.7%',
        description: 'Measures the change in the total value of sales at the retail level.'
      },
      {
        id: '8',
        title: 'Manufacturing PMI',
        date: new Date(Date.now() + 604800000), // 1 week from now
        time: '09:45',
        impact: 'MEDIUM',
        country: 'United States',
        currency: 'USD',
        forecast: '49.2',
        previous: '48.7',
        description: 'A leading indicator of economic health - businesses react quickly to market conditions.'
      }
    ];

    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by impact
    if (impactFilter !== 'ALL') {
      filtered = filtered.filter(event => event.impact === impactFilter);
    }

    // Filter by country
    if (countryFilter !== 'ALL') {
      filtered = filtered.filter(event => event.country === countryFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, impactFilter, countryFilter, searchTerm]);

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

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
    { text: 'United Kingdom', value: 'United Kingdom' },
    { text: 'Japan', value: 'Japan' },
    { text: 'China', value: 'China' }
  ];

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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const upcomingEvents = filteredEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const highImpactEvents = filteredEvents.filter(event => event.impact === 'HIGH').length;
  const todayEvents = getEventsForDate(new Date()).length;
  const thisWeekEvents = filteredEvents.filter(event => {
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return event.date >= new Date() && event.date <= weekFromNow;
  }).length;

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
              Economic Calendar
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: 0 }}>
              Track important economic events and market-moving announcements
            </p>
          </div>
          <Button className="nextgen-btn nextgen-btn-primary">
            📅 Export Calendar
          </Button>
        </div>

        {/* Statistics */}
        <div className="nextgen-grid nextgen-grid-4" style={{ gap: '20px' }}>
          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Total Events</div>
            <div className="nextgen-metric-value">{filteredEvents.length}</div>
            <div className="nextgen-metric-change">Tracked events</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">High Impact</div>
            <div className="nextgen-metric-value" style={{ color: '#ef4444' }}>
              {highImpactEvents}
            </div>
            <div className="nextgen-metric-change">Critical events</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">This Week</div>
            <div className="nextgen-metric-value">{thisWeekEvents}</div>
            <div className="nextgen-metric-change">Upcoming events</div>
          </div>

          <div className="nextgen-metric">
            <div className="nextgen-metric-label">Today</div>
            <div className="nextgen-metric-value" style={{ color: '#10b981' }}>
              {todayEvents}
            </div>
            <div className="nextgen-metric-change">Events today</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="nextgen-grid nextgen-grid-3" style={{ gap: '32px' }}>
        {/* Calendar */}
        <div className="nextgen-card">
          <div className="nextgen-card-header">
            <div className="nextgen-card-title">Calendar</div>
            <div className="nextgen-card-subtitle">Select a date to view events</div>
          </div>
          <div className="nextgen-card-body">
            <div style={{ width: '100%', maxWidth: '100%' }}>
              <Calendar
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value || new Date())}
              />
            </div>
            
            {/* Filters */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#ffffff'
                }}>
                  Search Events
                </label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.value)}
                  placeholder="Search events..."
                />
              </div>
              
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
                  value={impactFilter}
                  onChange={(e) => setImpactFilter(e.value)}
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
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.value)}
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
              {isToday(selectedDate) && (
                <Badge className="nextgen-badge nextgen-badge-success" style={{ marginLeft: '8px' }}>
                  Today
                </Badge>
              )}
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
                          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                            🕐 {event.time}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                            🌍 {event.country}
                          </span>
                          <Badge className={`nextgen-badge nextgen-badge-${
                            event.impact === 'HIGH' ? 'error' :
                            event.impact === 'MEDIUM' ? 'warning' : 'success'
                          }`}>
                            {event.impact}
                          </Badge>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.5rem' }}>
                        {event.currency === 'USD' ? '🇺🇸' : 
                         event.currency === 'EUR' ? '🇪🇺' : '🌍'}
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

      {/* Upcoming Events */}
      <div className="nextgen-card" style={{ marginTop: '32px' }}>
        <div className="nextgen-card-header">
          <div className="nextgen-card-title">Upcoming Events</div>
          <div className="nextgen-card-subtitle">Next 5 scheduled economic events</div>
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
              {upcomingEvents.map((event) => (
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
                         event.currency === 'EUR' ? '🇪🇺' : '🌍'}
                      </span>
                      <span>{event.country}</span>
                    </div>
                  </td>
                  <td>
                    <Badge className={`nextgen-badge nextgen-badge-${
                      event.impact === 'HIGH' ? 'error' :
                      event.impact === 'MEDIUM' ? 'warning' : 'success'
                    }`}>
                      {event.impact}
                    </Badge>
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
  );
};
