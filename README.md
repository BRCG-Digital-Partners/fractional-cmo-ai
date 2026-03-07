# Alex² - AI-Powered Fractional CMO Platform

> Revolutionary AI platform that delivers enterprise-grade marketing leadership at a fraction of the cost.

## Overview

Alex² (Alex Squared) is an AI-powered fractional CMO platform designed to provide startups and growing companies with sophisticated marketing strategy and execution capabilities without the cost of a full-time executive.

## Features

### 🎯 Strategic Planning
- Comprehensive marketing strategies tailored to business goals
- 3-year roadmaps with quarterly OKRs
- Market positioning and competitive analysis

### 📊 Campaign Execution
- End-to-end campaign management
- Multi-channel orchestration
- A/B testing and optimization

### 🚀 Growth Analytics
- Real-time performance dashboards
- Predictive analytics and forecasting
- ROI tracking and attribution

### 💡 Creative Direction
- Brand strategy development
- Content calendar management
- Creative asset oversight

### 👥 Team Leadership
- Vendor and agency coordination
- Internal team alignment
- Process optimization

### 📈 Board Reporting
- Executive-ready insights
- Monthly performance reports
- Strategic recommendations

## Tech Stack

- **Frontend**: HTML5, CSS3 (Mobile-first), Alpine.js
- **Backend**: Node.js, Express
- **Analysis**: OpenAI API, Web scraping
- **Design**: Custom CSS with glassmorphism, gradients, and texture effects
- **Deployment**: Vercel

## Mobile-First Design

The platform is built with a mobile-first approach featuring:
- Responsive design that looks stunning on all devices
- Touch-optimized interactions
- Progressive enhancement for desktop
- Sophisticated visual effects with depth and texture
- Non-AI aesthetic with human touches

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI analysis features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BRCG-Digital-Partners/fractional-cmo-ai.git
cd fractional-cmo-ai
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3001`

## API Endpoints

### SEO Analysis
```
POST /api/analyze/seo
Body: { "url": "https://example.com" }
```

### Performance Analysis
```
POST /api/analyze/performance
Body: { "url": "https://example.com" }
```

### Social Media Discovery
```
POST /api/analyze/social
Body: { "domain": "example.com" }
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Manual Deployment

Build the static files:
```bash
npm run build
```

The application can be served from any static hosting provider.

## Design Philosophy

Alex² embraces a sophisticated, non-AI aesthetic with:
- **Depth & Dimension**: Multiple layers, shadows, and glassmorphism effects
- **Rich Textures**: Gradients, noise overlays, and animated elements
- **Human Touch**: Warm colors, organic shapes, and thoughtful micro-interactions
- **Mobile Excellence**: Every interaction optimized for touch devices

## Pricing Tiers

1. **Starter** ($2,500/month): Perfect for startups
2. **Growth** ($5,000/month): For scaling companies
3. **Enterprise** (Custom): Full-service solution

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

Copyright 2026 BRCG Digital Partners. All rights reserved.

## Contact

For questions or support, contact: kodie@brcg.co

---

Built with ❤️ by BRCG Digital Partners