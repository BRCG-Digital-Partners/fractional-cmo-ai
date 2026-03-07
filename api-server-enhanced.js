require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Helper function to extract domain from URL
function extractDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

// Helper function to fetch and parse HTML
async function fetchWebsiteData(url) {
    try {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await axios.get(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        
        // Extract key content
        const title = $('title').text() || '';
        const description = $('meta[name="description"]').attr('content') || '';
        const h1s = $('h1').map((i, el) => $(el).text()).get().join(' ');
        const h2s = $('h2').map((i, el) => $(el).text()).get().slice(0, 5).join(' ');
        
        // Extract main content (paragraphs)
        const paragraphs = $('p').map((i, el) => $(el).text()).get()
            .filter(p => p.length > 50)
            .slice(0, 10)
            .join(' ');
        
        // Extract navigation/menu items
        const navItems = $('nav a, header a').map((i, el) => $(el).text()).get()
            .filter(item => item.length > 0 && item.length < 30)
            .slice(0, 10);
        
        // Social links
        const socialLinks = {
            facebook: $('a[href*="facebook.com"]').length > 0,
            twitter: $('a[href*="twitter.com"], a[href*="x.com"]').length > 0,
            instagram: $('a[href*="instagram.com"]').length > 0,
            linkedin: $('a[href*="linkedin.com"]').length > 0,
            youtube: $('a[href*="youtube.com"]').length > 0
        };
        
        return {
            url: fullUrl,
            domain: extractDomain(fullUrl),
            title,
            description,
            h1s,
            h2s,
            content: paragraphs,
            navigation: navItems,
            socialPresence: socialLinks,
            hasContactForm: $('form').length > 0,
            hasEmail: response.data.includes('@') && response.data.includes('.com'),
            hasPhone: /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(response.data)
        };
    } catch (error) {
        console.error('Error fetching website:', error.message);
        throw new Error('Could not analyze website');
    }
}

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    try {
        // Step 1: Fetch website data
        const websiteData = await fetchWebsiteData(url);
        
        // Step 2: Use OpenAI to analyze the business and marketing
        const analysisPrompt = `You are a world-class CMO analyzing a company's website and digital presence. Based on the following website data, provide a comprehensive marketing analysis.

Website: ${websiteData.domain}
Title: ${websiteData.title}
Description: ${websiteData.description}
Main Headlines: ${websiteData.h1s}
Subheadings: ${websiteData.h2s}
Content Sample: ${websiteData.content.substring(0, 1000)}
Navigation: ${websiteData.navigation.join(', ')}
Social Presence: ${Object.entries(websiteData.socialPresence).filter(([_, has]) => has).map(([platform]) => platform).join(', ') || 'None detected'}

Provide a JSON response with the following structure:
{
    "companyAnalysis": {
        "industry": "identified industry",
        "businessModel": "B2B/B2C/D2C/etc",
        "targetAudience": "primary audience",
        "valueProposition": "core value prop",
        "marketPosition": "leader/challenger/niche"
    },
    "marketingScore": {
        "overall": 0-100,
        "messaging": 0-100,
        "digitalPresence": 0-100,
        "contentStrategy": 0-100,
        "brandConsistency": 0-100,
        "userExperience": 0-100
    },
    "opportunities": [
        {
            "title": "Opportunity title",
            "impact": "high/medium/low",
            "effort": "high/medium/low",
            "description": "Detailed description",
            "potentialROI": "2-3x",
            "implementation": "How to implement"
        }
    ],
    "competitors": ["competitor1", "competitor2", "competitor3"],
    "immediatePriorities": [
        {
            "action": "Specific action",
            "reason": "Why this matters",
            "expectedResult": "What will happen"
        }
    ],
    "growthPotential": {
        "revenueIncrease": "estimated %",
        "timeToImpact": "X months",
        "investmentRequired": "low/medium/high"
    }
}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "You are an expert CMO providing actionable marketing analysis. Always respond with valid JSON."
                },
                {
                    role: "user",
                    content: analysisPrompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 2000
        });
        
        const analysis = JSON.parse(completion.choices[0].message.content);
        
        // Step 3: Generate specific recommendations
        const recommendationPrompt = `Based on this marketing analysis, provide 5 specific, actionable recommendations that could be implemented within 30 days.

Company: ${websiteData.domain}
Industry: ${analysis.companyAnalysis.industry}
Current Score: ${analysis.marketingScore.overall}/100

Format as JSON array with each recommendation having:
- title: Clear action title
- priority: 1-5 (1 is highest)
- implementation: Step-by-step how to do it
- expectedImpact: Specific measurable outcome
- tools: Specific tools/platforms to use
- budget: Estimated cost
- timeline: Days to implement`;

        const recsCompletion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "You are a pragmatic CMO focused on quick wins and measurable results."
                },
                {
                    role: "user",
                    content: recommendationPrompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 1500
        });
        
        const recommendations = JSON.parse(recsCompletion.choices[0].message.content);
        
        // Combine everything into final response
        const finalAnalysis = {
            ...analysis,
            websiteData: {
                url: websiteData.url,
                domain: websiteData.domain,
                hasContactInfo: websiteData.hasEmail || websiteData.hasPhone,
                socialChannels: Object.entries(websiteData.socialPresence)
                    .filter(([_, has]) => has)
                    .map(([platform]) => platform)
            },
            recommendations: recommendations.recommendations || recommendations,
            analysisTimestamp: new Date().toISOString()
        };
        
        res.json(finalAnalysis);
        
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ 
            error: 'Analysis failed', 
            details: error.message 
        });
    }
});

// Competitor analysis endpoint
app.post('/api/analyze/competitors', async (req, res) => {
    const { domain, competitors } = req.body;
    
    try {
        const competitorPromises = competitors.map(comp => fetchWebsiteData(comp).catch(() => null));
        const competitorData = await Promise.all(competitorPromises);
        const validCompetitors = competitorData.filter(c => c !== null);
        
        const prompt = `Compare ${domain} against these competitors and provide strategic insights:
${validCompetitors.map(c => `- ${c.domain}: ${c.title}`).join('\n')}

Provide positioning recommendations and differentiation strategies.`;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: "You are a competitive strategy expert." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });
        
        res.json({
            analysis: completion.choices[0].message.content,
            competitors: validCompetitors.map(c => ({
                domain: c.domain,
                title: c.title,
                hasContent: c.content.length > 0
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Competitor analysis failed' });
    }
});

// Generate marketing strategy endpoint
app.post('/api/generate/strategy', async (req, res) => {
    const { analysis, goals, budget, timeline } = req.body;
    
    try {
        const prompt = `Create a detailed marketing strategy based on:
- Current state: ${JSON.stringify(analysis.marketingScore)}
- Business goals: ${goals}
- Budget: ${budget}
- Timeline: ${timeline}

Include specific tactics, channels, metrics, and milestones.`;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: "You are creating an executable marketing strategy." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });
        
        res.json({
            strategy: completion.choices[0].message.content,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Strategy generation failed' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        openaiConfigured: !!process.env.OPENAI_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`Alex² API server running on port ${PORT}`);
    console.log(`OpenAI configured: ${!!process.env.OPENAI_API_KEY}`);
});

module.exports = app;