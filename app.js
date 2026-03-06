// Alpine.js App
function app() {
    return {
        showDemo: false,
        demoUrl: '',
        analyzingDomain: '',
        currentStep: 0,
        analysisComplete: false,
        overallScore: 0,
        
        analysisSteps: [
            {
                title: 'Discovering Digital Properties',
                detail: 'Finding website, social profiles, ad accounts, and more...'
            },
            {
                title: 'Analyzing Content & SEO',
                detail: 'Crawling pages, checking rankings, and content quality...'
            },
            {
                title: 'Examining Paid Campaigns',
                detail: 'Detecting Google Ads, Meta, LinkedIn campaigns...'
            },
            {
                title: 'Evaluating User Experience',
                detail: 'Testing site speed, mobile responsiveness, conversions...'
            },
            {
                title: 'Competitor Intelligence',
                detail: 'Comparing against top 5 competitors in your space...'
            },
            {
                title: 'Generating Insights',
                detail: 'Compiling findings and creating action plan...'
            }
        ],
        
        findings: [],
        
        startDemo() {
            if (!this.demoUrl) {
                this.demoUrl = 'https://example.com';
            }
            
            // Extract domain from URL
            try {
                const url = new URL(this.demoUrl.includes('://') ? this.demoUrl : 'https://' + this.demoUrl);
                this.analyzingDomain = url.hostname.replace('www.', '');
            } catch (e) {
                this.analyzingDomain = this.demoUrl;
            }
            
            this.showDemo = true;
            this.currentStep = 0;
            this.analysisComplete = false;
            this.runAnalysis();
        },
        
        async runAnalysis() {
            // Simulate analysis steps
            for (let i = 0; i < this.analysisSteps.length; i++) {
                this.currentStep = i;
                await this.delay(2000 + Math.random() * 1000); // 2-3 seconds per step
            }
            
            // Generate findings
            this.generateFindings();
            this.analysisComplete = true;
            
            // Animate score
            this.animateScore();
        },
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        generateFindings() {
            // Generate semi-random but realistic findings
            const baseScore = 40 + Math.random() * 30; // 40-70 base score
            
            this.findings = [
                {
                    category: 'SEO & Content',
                    icon: '🔍',
                    score: Math.round(baseScore + Math.random() * 20),
                    status: this.getStatus(baseScore + 10),
                    issues: [
                        'Missing meta descriptions on 45% of pages',
                        'No schema markup detected',
                        'Page speed needs improvement (3.2s load time)',
                        'Only 12 pages indexed in Google'
                    ]
                },
                {
                    category: 'Paid Advertising',
                    icon: '💰',
                    score: Math.round(baseScore - 10 + Math.random() * 20),
                    status: this.getStatus(baseScore - 10),
                    issues: [
                        'No retargeting pixels found',
                        'Missing Google Ads conversion tracking',
                        'No active campaigns detected',
                        'Competitor spending 5x more on ads'
                    ]
                },
                {
                    category: 'Email Marketing',
                    icon: '📧',
                    score: Math.round(baseScore + 5 + Math.random() * 20),
                    status: this.getStatus(baseScore + 5),
                    issues: [
                        'No email signup form on homepage',
                        'Missing welcome email sequence',
                        'No abandoned cart recovery',
                        'Email list growth under 1% monthly'
                    ]
                },
                {
                    category: 'User Experience',
                    icon: '🎯',
                    score: Math.round(baseScore + Math.random() * 20),
                    status: this.getStatus(baseScore),
                    issues: [
                        'Mobile conversion rate 60% lower',
                        'Checkout has 5 steps (industry avg: 3)',
                        'No live chat support',
                        'Trust signals missing on key pages'
                    ]
                },
                {
                    category: 'Analytics & Data',
                    icon: '📊',
                    score: Math.round(baseScore - 5 + Math.random() * 20),
                    status: this.getStatus(baseScore - 5),
                    issues: [
                        'GA4 not properly configured',
                        'No conversion goals set up',
                        'Missing enhanced ecommerce tracking',
                        'No custom dashboards'
                    ]
                },
                {
                    category: 'Social & Brand',
                    icon: '🌟',
                    score: Math.round(baseScore + 10 + Math.random() * 20),
                    status: this.getStatus(baseScore + 10),
                    issues: [
                        'Inconsistent posting schedule',
                        'Low engagement rates (0.5%)',
                        'No user-generated content strategy',
                        'Missing from 3 key platforms'
                    ]
                }
            ];
            
            // Calculate overall score
            const totalScore = this.findings.reduce((sum, f) => sum + f.score, 0);
            this.overallScore = Math.round(totalScore / this.findings.length);
        },
        
        getStatus(score) {
            if (score >= 70) return 'good';
            if (score >= 50) return 'warning';
            return 'error';
        },
        
        animateScore() {
            let current = 0;
            const target = this.overallScore;
            const increment = target / 50; // 50 steps
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                this.overallScore = Math.round(current);
            }, 20);
        },
        
        deployAgent(category) {
            alert(`Deploying AI agent to fix ${category} issues...\n\nIn the full version, this would:\n- Connect to your tools via API\n- Automatically implement fixes\n- Track improvements in real-time`);
        }
    };
}

// Smooth scroll for navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== '#demo') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Add parallax effect to hero background
let ticking = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-glow, .hero-grid');
    
    parallaxElements.forEach(el => {
        const speed = el.classList.contains('hero-glow') ? 0.5 : 0.3;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});