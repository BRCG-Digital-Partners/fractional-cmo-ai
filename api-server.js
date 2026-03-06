// Simple Express API Server for Demo
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Helper function to fetch and parse HTML
async function fetchHTML(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return cheerio.load(response.data);
    } catch (error) {
        console.error('Error fetching HTML:', error);
        return null;
    }
}

// Real SEO Analysis Endpoint
app.post('/api/analyze/seo', async (req, res) => {
    const { url } = req.body;
    const $ = await fetchHTML(url);
    
    if (!$) {
        return res.status(400).json({ error: 'Could not fetch website' });
    }
    
    const analysis = {
        title: $('title').text() || 'No title found',
        metaDescription: $('meta[name="description"]').attr('content') || 'No description found',
        h1Count: $('h1').length,
        h2Count: $('h2').length,
        imageCount: $('img').length,
        imagesWithoutAlt: $('img:not([alt])').length,
        internalLinks: $('a[href^="/"]').length,
        externalLinks: $('a[href^="http"]:not([href*="' + new URL(url).hostname + '"])').length,
        hasRobotsMeta: $('meta[name="robots"]').length > 0,
        hasCanonical: $('link[rel="canonical"]').length > 0,
        hasOGTags: $('meta[property^="og:"]').length > 0,
        hasTwitterCards: $('meta[name^="twitter:"]').length > 0,
        hasSchema: $('script[type="application/ld+json"]').length > 0
    };
    
    // Calculate SEO score
    let score = 100;
    if (!analysis.metaDescription) score -= 15;
    if (analysis.h1Count === 0) score -= 10;
    if (analysis.h1Count > 1) score -= 5;
    if (analysis.imagesWithoutAlt > 0) score -= 10;
    if (!analysis.hasCanonical) score -= 5;
    if (!analysis.hasOGTags) score -= 5;
    if (!analysis.hasSchema) score -= 10;
    
    res.json({
        url,
        score: Math.max(0, score),
        analysis,
        recommendations: generateSEORecommendations(analysis)
    });
});

// Performance Analysis Endpoint
app.post('/api/analyze/performance', async (req, res) => {
    const { url } = req.body;
    
    // In production, this would use Google PageSpeed API or WebPageTest
    // For demo, we'll do basic checks
    try {
        const start = Date.now();
        const response = await axios.get(url);
        const loadTime = Date.now() - start;
        const $ = cheerio.load(response.data);
        
        const analysis = {
            loadTimeMs: loadTime,
            htmlSize: response.data.length,
            cssFiles: $('link[rel="stylesheet"]').length,
            jsFiles: $('script[src]').length,
            totalRequests: $('link, script[src], img, iframe').length,
            hasCompression: response.headers['content-encoding'] === 'gzip',
            hasCaching: !!response.headers['cache-control']
        };
        
        res.json({
            url,
            analysis,
            score: calculatePerformanceScore(analysis),
            recommendations: generatePerformanceRecommendations(analysis)
        });
    } catch (error) {
        res.status(400).json({ error: 'Could not analyze performance' });
    }
});

// Social Media Discovery Endpoint
app.post('/api/analyze/social', async (req, res) => {
    const { domain } = req.body;
    
    // Check for social media links on the website
    const url = `https://${domain}`;
    const $ = await fetchHTML(url);
    
    if (!$) {
        return res.status(400).json({ error: 'Could not fetch website' });
    }
    
    const socialPlatforms = {
        facebook: $('a[href*="facebook.com"]').first().attr('href'),
        twitter: $('a[href*="twitter.com"], a[href*="x.com"]').first().attr('href'),
        instagram: $('a[href*="instagram.com"]').first().attr('href'),
        linkedin: $('a[href*="linkedin.com"]').first().attr('href'),
        youtube: $('a[href*="youtube.com"]').first().attr('href'),
        tiktok: $('a[href*="tiktok.com"]').first().attr('href')
    };
    
    const foundPlatforms = Object.entries(socialPlatforms)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({ platform, url }));
    
    res.json({
        domain,
        foundPlatforms,
        totalFound: foundPlatforms.length,
        recommendations: generateSocialRecommendations(foundPlatforms.length)
    });
});

// Helper functions
function generateSEORecommendations(analysis) {
    const recommendations = [];
    
    if (!analysis.metaDescription) {
        recommendations.push({
            priority: 'high',
            issue: 'Missing meta description',
            action: 'Add unique meta descriptions to all pages (150-160 characters)'
        });
    }
    
    if (analysis.h1Count === 0) {
        recommendations.push({
            priority: 'high',
            issue: 'No H1 tag found',
            action: 'Add one H1 tag per page with your main keyword'
        });
    }
    
    if (analysis.imagesWithoutAlt > 0) {
        recommendations.push({
            priority: 'medium',
            issue: `${analysis.imagesWithoutAlt} images missing alt text`,
            action: 'Add descriptive alt text to all images for better accessibility and SEO'
        });
    }
    
    if (!analysis.hasSchema) {
        recommendations.push({
            priority: 'medium',
            issue: 'No structured data found',
            action: 'Implement schema markup for rich snippets in search results'
        });
    }
    
    return recommendations;
}

function calculatePerformanceScore(analysis) {
    let score = 100;
    
    if (analysis.loadTimeMs > 3000) score -= 20;
    if (analysis.loadTimeMs > 5000) score -= 20;
    if (analysis.totalRequests > 100) score -= 15;
    if (!analysis.hasCompression) score -= 10;
    if (!analysis.hasCaching) score -= 10;
    
    return Math.max(0, score);
}

function generatePerformanceRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.loadTimeMs > 3000) {
        recommendations.push({
            priority: 'high',
            issue: 'Slow page load time',
            action: 'Optimize server response time and reduce page weight'
        });
    }
    
    if (!analysis.hasCompression) {
        recommendations.push({
            priority: 'high',
            issue: 'Gzip compression not enabled',
            action: 'Enable gzip compression to reduce file sizes by up to 70%'
        });
    }
    
    if (analysis.totalRequests > 50) {
        recommendations.push({
            priority: 'medium',
            issue: `Too many HTTP requests (${analysis.totalRequests})`,
            action: 'Combine CSS/JS files and use image sprites to reduce requests'
        });
    }
    
    return recommendations;
}

function generateSocialRecommendations(platformCount) {
    const recommendations = [];
    
    if (platformCount < 3) {
        recommendations.push({
            priority: 'high',
            issue: 'Limited social media presence',
            action: 'Expand to at least 3-4 major platforms where your audience is active'
        });
    }
    
    recommendations.push({
        priority: 'medium',
        issue: 'Social proof not visible on website',
        action: 'Add social media feeds or follower counts to build trust'
    });
    
    return recommendations;
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});

module.exports = app;