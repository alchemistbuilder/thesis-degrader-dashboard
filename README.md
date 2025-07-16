# Thesis Degrader Dashboard

An interactive demo of AI-powered portfolio intelligence for hedge funds that tracks investment thesis health in real-time.

## Overview

The Thesis Degrader Dashboard helps portfolio managers monitor their investment theses across multiple positions, providing real-time alerts when thesis drivers degrade and recommending specific actions to manage risk.

## Features

### 🎯 Core Functionality
- **Thesis Codification**: Input 3-5 structured drivers per position
- **Real-Time Monitoring**: AI agents track news, filings, and market data
- **Degradation Alerts**: Immediate notifications when thesis breaks
- **Action Recommendations**: Specific guidance on position management
- **Portfolio Heatmap**: Visual overview of thesis health across positions

### 📊 Dashboard Views

1. **Positions**: Grid view of all portfolio positions with health indicators
2. **Alerts**: Real-time feed of thesis-impacting news and events
3. **Actions**: AI-generated recommendations for position management
4. **Monitoring**: Status of data feeds and monitoring agents
5. **Heatmap**: Visual portfolio overview sized by risk/position

### ⚡ Demo Features

- **Pre-loaded Positions**: 5 sample positions across different sectors
- **Real-Time Simulation**: Live price updates and alert generation
- **Interactive Scenarios**: Click positions for detailed analysis
- **Thesis Degradation**: Automated simulation of thesis health changes

## How to Use

1. **Open the Dashboard**: Launch `index.html` in a web browser
2. **Explore Positions**: View the portfolio grid showing thesis health
3. **Monitor Alerts**: Check real-time notifications in the Alerts tab
4. **Review Actions**: See AI recommendations in the Actions tab
5. **Add Positions**: Click "Add Position" to create new watchlist items

## Demo Scenarios

### SBUX - Critical Degradation
- **Thesis**: China expansion, margin stability, coffee costs
- **Status**: Critical (multiple drivers failing)
- **Alert**: Q4 China same-store sales missed guidance
- **Action**: Consider full exit or protective hedging

### MSFT - Warning State
- **Thesis**: Azure growth, AI adoption, operating leverage
- **Status**: Warning (growth deceleration detected)
- **Alert**: Azure growth slowing vs competition
- **Action**: Trim position, monitor closely

### XOM - Healthy Position
- **Thesis**: Oil price stability, production growth, FCF yield
- **Status**: Healthy (all drivers intact)
- **Monitoring**: OPEC+ decisions, commodity markets

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with dark theme
- **Fonts**: Inter font family
- **Icons**: SVG icons and emoji indicators
- **Data**: Simulated real-time feeds

## File Structure

```
Thesis Degrader Dashboard/
├── index.html          # Main dashboard interface
├── styles.css          # Styling and theme
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Key Components

### Position Cards
- Ticker symbol and company name
- Position size and daily P&L
- Thesis driver health indicators
- Color-coded status (green/yellow/red)

### Alert System
- Real-time notifications
- Confidence scores and source attribution
- Impact assessment on thesis drivers
- Time-stamped updates

### Action Engine
- Risk-based recommendations
- Specific execution guidance
- Urgency classification
- Historical success tracking

### Smart Monitoring
- Multiple data source integration
- Processing status indicators
- Update frequency tracking
- Alert generation pipeline

## Customization

The demo can be extended with:
- Additional data sources
- Custom thesis templates
- Portfolio optimization features
- Risk management tools
- Historical backtesting

## Business Impact

This system addresses the core challenge in active portfolio management:
- **Problem**: Manual thesis monitoring across 20-100 positions
- **Solution**: Automated AI surveillance with actionable insights
- **Value**: Faster risk detection, systematic process, scalable monitoring

## Future Enhancements

1. **OMS Integration**: Auto-sync with order management systems
2. **Signal Backtesting**: Historical validation of degradation signals
3. **Multi-PM Platform**: Enterprise deployment across teams
4. **Advanced Analytics**: Correlation analysis and factor modeling

---

**Note**: This is a demonstration interface. Real implementation would require:
- Live data feeds (Bloomberg, Reuters, etc.)
- Machine learning models for thesis analysis
- Risk management system integration
- Compliance and audit trails