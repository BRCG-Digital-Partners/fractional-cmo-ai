const axios = require('axios');
const cheerio = require('cheerio');

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
        
        // Extract main content
        const paragraphs = $('p').map((i, el) => $(el).text()).get()
            .filter(p => p.length > 50)
            .slice(0, 10)
            .join(' ');
        
        return {
            title,
            description,
            h1s,
            h2s,
            content: paragraphs.substring(0, 1500)
        };
    } catch (error) {
        throw new Error(`Failed to fetch website: ${error.message}`);
    }
}

// Mock AI analysis (replace with actual OpenAI call when API key is available)
function generateMockAnalysis(websiteData, url) {
    const hasTitle = websiteData.title.length > 0;
    const hasDescription = websiteData.description.length > 0;
    const hasH1 = websiteData.h1s.length > 0;
    
    const score = Math.floor(
        (hasTitle ? 25 : 0) + 
        (hasDescription ? 25 : 0) + 
        (hasH1 ? 25 : 0) + 
        (websiteData.content.length > 500 ? 25 : 10)
    );
    
    const issues = [];
    if (!hasTitle) issues.push("Missing title tag");
    if (!hasDescription) issues.push("Missing meta description");
    if (!hasH1) issues.push("No H1 tags found");
    if (websiteData.title.length > 60) issues.push("Title tag too long (60+ chars)");
    if (websiteData.description.length > 160) issues.push("Meta description too long (160+ chars)");
    
    const quickWins = [];
    if (!hasTitle) quickWins.push("Add a compelling title tag (50-60 chars)");
    if (!hasDescription) quickWins.push("Write a meta description (150-160 chars)");
    if (!hasH1) quickWins.push("Add an H1 tag with your main keyword");
    
    return `SEO Analysis for ${url}

Current SEO Score: ${score}/100

Top Critical Issues:
${issues.length > 0 ? issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n') : '• No critical issues found'}

Quick Wins:
${quickWins.length > 0 ? quickWins.map((win, i) => `${i + 1}. ${win}`).join('\n') : '• Site has good basic SEO structure'}

Strategic Recommendations:
1. Content Strategy: ${websiteData.content.length < 1000 ? 'Increase page content depth' : 'Content volume is good'}
2. Technical SEO: Implement schema markup for better rich snippets
3. User Experience: Ensure fast page load times and mobile responsiveness
4. Link Building: Develop a strategic backlink acquisition plan`;
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

        // Fetch website data
        const websiteData = await fetchWebsiteData(url);

        // Generate analysis (using mock for now)
        const analysis = generateMockAnalysis(websiteData, url);

        return res.status(200).json({
            status: 'success',
            data: {
                url,
                analysis: analysis,
                websiteData: {
                    title: websiteData.title,
                    description: websiteData.description,
                    hasH1: websiteData.h1s.length > 0
                }
            }
        });

    } catch (error) {
        console.error('SEO Analysis Error:', error);
        return res.status(500).json({
            status: 'error',
            error: error.message || 'Failed to analyze website'
        });
    }
};