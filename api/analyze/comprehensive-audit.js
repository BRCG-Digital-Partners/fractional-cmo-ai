const axios = require('axios');
const cheerio = require('cheerio');

// Comprehensive website data extraction
async function fetchComprehensiveData(url) {
    try {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await axios.get(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000,
            maxRedirects: 5
        });
        
        const $ = cheerio.load(response.data);
        const html = response.data;
        
        // SEO Data
        const title = $('title').text() || '';
        const description = $('meta[name="description"]').attr('content') || '';
        const keywords = $('meta[name="keywords"]').attr('content') || '';
        const canonical = $('link[rel="canonical"]').attr('href') || '';
        const robots = $('meta[name="robots"]').attr('content') || '';
        const ogTitle = $('meta[property="og:title"]').attr('content') || '';
        const ogDescription = $('meta[property="og:description"]').attr('content') || '';
        const ogImage = $('meta[property="og:image"]').attr('content') || '';
        
        // Content Structure
        const h1s = $('h1').map((i, el) => $(el).text().trim()).get();
        const h2s = $('h2').map((i, el) => $(el).text().trim()).get();
        const h3s = $('h3').map((i, el) => $(el).text().trim()).get();
        
        // Links
        const internalLinks = $('a[href^="/"], a[href^="' + fullUrl + '"]').length;
        const externalLinks = $('a[href^="http"]:not([href^="' + fullUrl + '"])').length;
        const images = $('img').length;
        const imagesWithoutAlt = $('img:not([alt]), img[alt=""]').length;
        
        // Forms and CTAs
        const forms = $('form').length;
        const phoneNumbers = (html.match(/(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || []).length;
        const emails = (html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).length;
        const ctaButtons = $('button, a.button, a.btn, .cta').length;
        
        // Technical
        const hasViewport = $('meta[name="viewport"]').length > 0;
        const hasCharset = $('meta[charset]').length > 0;
        const hasJsonLd = $('script[type="application/ld+json"]').length > 0;
        const hasAnalytics = html.includes('google-analytics.com') || html.includes('gtag') || html.includes('analytics.js');
        const hasPixel = html.includes('facebook.com/tr') || html.includes('fbq');
        
        // Content
        const paragraphs = $('p').map((i, el) => $(el).text()).get()
            .filter(p => p.length > 50)
            .join(' ');
        const wordCount = paragraphs.split(' ').length;
        
        // Navigation
        const hasNav = $('nav, .nav, .navigation, #navigation').length > 0;
        const navLinks = $('nav a, .nav a, .navigation a').length;
        
        // Social
        const socialLinks = $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"], a[href*="youtube.com"]').map((i, el) => $(el).attr('href')).get();
        
        return {
            seo: {
                title,
                description,
                keywords,
                canonical,
                robots,
                ogTitle,
                ogDescription,
                ogImage,
                h1s,
                h2s,
                h3s
            },
            content: {
                wordCount,
                paragraphs: paragraphs.substring(0, 2000),
                headingStructure: {
                    h1Count: h1s.length,
                    h2Count: h2s.length,
                    h3Count: h3s.length
                }
            },
            technical: {
                hasViewport,
                hasCharset,
                hasJsonLd,
                hasAnalytics,
                hasPixel,
                internalLinks,
                externalLinks,
                images,
                imagesWithoutAlt
            },
            conversion: {
                forms,
                phoneNumbers,
                emails,
                ctaButtons,
                hasNav,
                navLinks
            },
            social: {
                socialLinks,
                hasSocialLinks: socialLinks.length > 0
            },
            url: fullUrl,
            responseTime: response.headers['x-response-time'] || 'N/A'
        };
    } catch (error) {
        throw new Error(`Failed to fetch website: ${error.message}`);
    }
}

// Generate comprehensive analysis
function generateComprehensiveAnalysis(data) {
    const scores = calculateScores(data);
    const issues = identifyIssues(data);
    const opportunities = identifyOpportunities(data);
    const roadmap = generateRoadmap(issues, opportunities);
    
    return {
        overallScore: scores.overall,
        scores: scores,
        criticalIssues: issues.critical,
        warnings: issues.warnings,
        opportunities: opportunities,
        roadmap: roadmap,
        detailedAnalysis: {
            seo: generateSEOAnalysis(data),
            content: generateContentAnalysis(data),
            technical: generateTechnicalAnalysis(data),
            conversion: generateConversionAnalysis(data),
            userExperience: generateUXAnalysis(data),
            competitive: generateCompetitiveInsights(data)
        }
    };
}

function calculateScores(data) {
    const seoScore = calculateSEOScore(data.seo);
    const contentScore = calculateContentScore(data.content);
    const technicalScore = calculateTechnicalScore(data.technical);
    const conversionScore = calculateConversionScore(data.conversion);
    const uxScore = calculateUXScore(data);
    
    const overall = Math.round((seoScore + contentScore + technicalScore + conversionScore + uxScore) / 5);
    
    return {
        overall,
        seo: seoScore,
        content: contentScore,
        technical: technicalScore,
        conversion: conversionScore,
        userExperience: uxScore
    };
}

function calculateSEOScore(seo) {
    let score = 0;
    
    // Title (20 points)
    if (seo.title) {
        score += 10;
        if (seo.title.length >= 30 && seo.title.length <= 60) score += 10;
    }
    
    // Description (20 points)
    if (seo.description) {
        score += 10;
        if (seo.description.length >= 120 && seo.description.length <= 160) score += 10;
    }
    
    // H1 (20 points)
    if (seo.h1s.length === 1) score += 20;
    else if (seo.h1s.length > 0) score += 10;
    
    // Open Graph (20 points)
    if (seo.ogTitle) score += 10;
    if (seo.ogDescription) score += 10;
    
    // Structure (20 points)
    if (seo.h2s.length >= 3) score += 10;
    if (seo.canonical) score += 10;
    
    return score;
}

function calculateContentScore(content) {
    let score = 0;
    
    // Word count (40 points)
    if (content.wordCount >= 300) score += 10;
    if (content.wordCount >= 500) score += 10;
    if (content.wordCount >= 800) score += 10;
    if (content.wordCount >= 1500) score += 10;
    
    // Heading structure (30 points)
    if (content.headingStructure.h1Count > 0) score += 10;
    if (content.headingStructure.h2Count >= 2) score += 10;
    if (content.headingStructure.h3Count >= 2) score += 10;
    
    // Content quality indicators (30 points)
    if (content.wordCount > 0) score += 30; // Placeholder for actual quality analysis
    
    return score;
}

function calculateTechnicalScore(technical) {
    let score = 0;
    
    if (technical.hasViewport) score += 20;
    if (technical.hasCharset) score += 10;
    if (technical.hasJsonLd) score += 20;
    if (technical.hasAnalytics) score += 20;
    if (technical.images === 0 || technical.imagesWithoutAlt === 0) score += 20;
    if (technical.internalLinks >= 5) score += 10;
    
    return score;
}

function calculateConversionScore(conversion) {
    let score = 0;
    
    if (conversion.forms > 0) score += 25;
    if (conversion.phoneNumbers > 0) score += 20;
    if (conversion.emails > 0) score += 15;
    if (conversion.ctaButtons >= 3) score += 20;
    if (conversion.hasNav) score += 20;
    
    return score;
}

function calculateUXScore(data) {
    let score = 0;
    
    if (data.technical.hasViewport) score += 25;
    if (data.conversion.hasNav) score += 25;
    if (data.technical.internalLinks >= 10) score += 25;
    if (data.social.hasSocialLinks) score += 25;
    
    return score;
}

function identifyIssues(data) {
    const critical = [];
    const warnings = [];
    
    // Critical SEO issues
    if (!data.seo.title) critical.push({
        type: 'SEO',
        issue: 'Missing title tag',
        impact: 'Critical for search rankings and click-through rates'
    });
    
    if (!data.seo.description) critical.push({
        type: 'SEO',
        issue: 'Missing meta description',
        impact: 'Reduces click-through rates from search results'
    });
    
    if (data.seo.h1s.length === 0) critical.push({
        type: 'SEO',
        issue: 'No H1 tag found',
        impact: 'Search engines may struggle to understand main topic'
    });
    
    // Technical issues
    if (!data.technical.hasViewport) critical.push({
        type: 'Technical',
        issue: 'Missing viewport meta tag',
        impact: 'Site may not display correctly on mobile devices'
    });
    
    if (!data.technical.hasAnalytics) warnings.push({
        type: 'Analytics',
        issue: 'No analytics tracking detected',
        impact: 'Cannot measure website performance or user behavior'
    });
    
    // Conversion issues
    if (data.conversion.forms === 0) warnings.push({
        type: 'Conversion',
        issue: 'No contact forms found',
        impact: 'Missing lead capture opportunities'
    });
    
    if (data.conversion.phoneNumbers === 0 && data.conversion.emails === 0) warnings.push({
        type: 'Conversion',
        issue: 'No contact information found',
        impact: 'Visitors cannot easily contact you'
    });
    
    // Content issues
    if (data.content.wordCount < 300) warnings.push({
        type: 'Content',
        issue: 'Thin content (less than 300 words)',
        impact: 'May struggle to rank for competitive keywords'
    });
    
    return { critical, warnings };
}

function identifyOpportunities(data) {
    const opportunities = [];
    
    if (!data.technical.hasJsonLd) {
        opportunities.push({
            type: 'Technical SEO',
            opportunity: 'Implement structured data',
            impact: 'Enable rich snippets in search results',
            effort: 'Medium',
            priority: 'High'
        });
    }
    
    if (data.content.wordCount < 1500) {
        opportunities.push({
            type: 'Content',
            opportunity: 'Expand content depth',
            impact: 'Improve topical authority and rankings',
            effort: 'Medium',
            priority: 'High'
        });
    }
    
    if (!data.technical.hasPixel) {
        opportunities.push({
            type: 'Marketing',
            opportunity: 'Install Facebook Pixel',
            impact: 'Enable retargeting and conversion tracking',
            effort: 'Low',
            priority: 'Medium'
        });
    }
    
    if (data.conversion.forms === 0) {
        opportunities.push({
            type: 'Conversion',
            opportunity: 'Add lead capture forms',
            impact: 'Generate more qualified leads',
            effort: 'Low',
            priority: 'High'
        });
    }
    
    if (!data.social.hasSocialLinks) {
        opportunities.push({
            type: 'Social',
            opportunity: 'Add social media links',
            impact: 'Build social proof and engagement',
            effort: 'Low',
            priority: 'Low'
        });
    }
    
    return opportunities;
}

function generateRoadmap(issues, opportunities) {
    const roadmap = {
        immediate: [], // Within 1 week
        shortTerm: [], // Within 1 month
        mediumTerm: [], // Within 3 months
        longTerm: [] // 3+ months
    };
    
    // Prioritize critical issues
    issues.critical.forEach(issue => {
        roadmap.immediate.push({
            action: `Fix: ${issue.issue}`,
            category: issue.type,
            expectedImpact: issue.impact
        });
    });
    
    // Add high-priority, low-effort opportunities
    opportunities
        .filter(opp => opp.priority === 'High' && opp.effort === 'Low')
        .forEach(opp => {
            roadmap.immediate.push({
                action: opp.opportunity,
                category: opp.type,
                expectedImpact: opp.impact
            });
        });
    
    // Add remaining based on priority
    opportunities
        .filter(opp => !(opp.priority === 'High' && opp.effort === 'Low'))
        .forEach(opp => {
            const item = {
                action: opp.opportunity,
                category: opp.type,
                expectedImpact: opp.impact
            };
            
            if (opp.priority === 'High') {
                roadmap.shortTerm.push(item);
            } else if (opp.priority === 'Medium') {
                roadmap.mediumTerm.push(item);
            } else {
                roadmap.longTerm.push(item);
            }
        });
    
    return roadmap;
}

function generateSEOAnalysis(data) {
    const analysis = {
        summary: '',
        strengths: [],
        weaknesses: [],
        recommendations: []
    };
    
    // Strengths
    if (data.seo.title && data.seo.title.length >= 30 && data.seo.title.length <= 60) {
        analysis.strengths.push('Title tag is optimized length');
    }
    if (data.seo.description && data.seo.description.length >= 120 && data.seo.description.length <= 160) {
        analysis.strengths.push('Meta description is optimized length');
    }
    if (data.seo.canonical) {
        analysis.strengths.push('Canonical URL is specified');
    }
    
    // Weaknesses
    if (!data.seo.title) {
        analysis.weaknesses.push('Missing title tag');
    }
    if (data.seo.h1s.length === 0) {
        analysis.weaknesses.push('No H1 tags found');
    }
    if (data.seo.h1s.length > 1) {
        analysis.weaknesses.push('Multiple H1 tags found (should only have one)');
    }
    
    // Recommendations
    analysis.recommendations.push('Conduct keyword research to optimize title and headings');
    analysis.recommendations.push('Create unique, compelling meta descriptions for each page');
    analysis.recommendations.push('Implement schema markup for rich snippets');
    
    analysis.summary = `SEO foundation needs attention. ${analysis.strengths.length} strengths identified, ${analysis.weaknesses.length} critical issues to address.`;
    
    return analysis;
}

function generateContentAnalysis(data) {
    return {
        summary: `Current content depth: ${data.content.wordCount} words. ${data.content.wordCount < 800 ? 'Below optimal for competitive rankings.' : 'Good foundation for SEO.'}`,
        metrics: {
            wordCount: data.content.wordCount,
            headings: `${data.content.headingStructure.h1Count} H1, ${data.content.headingStructure.h2Count} H2, ${data.content.headingStructure.h3Count} H3`,
            readability: 'Analysis pending'
        },
        recommendations: [
            data.content.wordCount < 800 ? 'Expand content to 800+ words for better rankings' : 'Content length is good',
            'Add more subheadings to improve scannability',
            'Include relevant keywords naturally throughout content'
        ]
    };
}

function generateTechnicalAnalysis(data) {
    return {
        summary: 'Technical foundation assessment complete',
        checklist: {
            mobileReady: data.technical.hasViewport,
            characterEncoding: data.technical.hasCharset,
            structuredData: data.technical.hasJsonLd,
            analytics: data.technical.hasAnalytics,
            imageOptimization: data.technical.images === 0 || data.technical.imagesWithoutAlt === 0
        },
        recommendations: [
            !data.technical.hasJsonLd ? 'Implement JSON-LD structured data' : null,
            !data.technical.hasAnalytics ? 'Install Google Analytics 4' : null,
            data.technical.imagesWithoutAlt > 0 ? `Add alt text to ${data.technical.imagesWithoutAlt} images` : null
        ].filter(Boolean)
    };
}

function generateConversionAnalysis(data) {
    return {
        summary: `Found ${data.conversion.forms} forms, ${data.conversion.ctaButtons} CTAs`,
        elements: {
            forms: data.conversion.forms,
            phoneNumbers: data.conversion.phoneNumbers,
            emails: data.conversion.emails,
            ctaButtons: data.conversion.ctaButtons,
            navigation: data.conversion.hasNav
        },
        recommendations: [
            data.conversion.forms === 0 ? 'Add contact/lead capture forms' : null,
            data.conversion.ctaButtons < 3 ? 'Add more clear call-to-action buttons' : null,
            'A/B test CTA button colors and copy'
        ].filter(Boolean)
    };
}

function generateUXAnalysis(data) {
    return {
        summary: 'User experience evaluation',
        mobileReady: data.technical.hasViewport,
        navigation: {
            hasNavigation: data.conversion.hasNav,
            linkCount: data.conversion.navLinks
        },
        recommendations: [
            'Test site on multiple devices and browsers',
            'Implement lazy loading for images',
            'Add breadcrumb navigation for better UX'
        ]
    };
}

function generateCompetitiveInsights(data) {
    return {
        summary: 'Competitive positioning insights',
        contentDepth: data.content.wordCount < 800 ? 'Below industry average' : 'Competitive',
        technicalReadiness: data.technical.hasJsonLd && data.technical.hasAnalytics ? 'Well-equipped' : 'Needs improvement',
        recommendations: [
            'Analyze top 3 competitors for content gaps',
            'Monitor competitor backlink profiles',
            'Track competitor keyword rankings'
        ]
    };
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Fetch comprehensive website data
        const websiteData = await fetchComprehensiveData(url);

        // Generate comprehensive analysis
        const analysis = generateComprehensiveAnalysis(websiteData);

        return res.status(200).json({
            status: 'success',
            data: {
                url: websiteData.url,
                timestamp: new Date().toISOString(),
                analysis: analysis,
                rawData: {
                    title: websiteData.seo.title,
                    description: websiteData.seo.description,
                    wordCount: websiteData.content.wordCount
                }
            }
        });

    } catch (error) {
        console.error('Comprehensive Audit Error:', error);
        return res.status(500).json({
            status: 'error',
            error: error.message || 'Failed to analyze website'
        });
    }
};