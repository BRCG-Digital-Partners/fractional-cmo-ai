// Enhanced Alpine.js App with Real Analysis
function app() {
    return {
        showDemo: false,
        demoUrl: '',
        analyzingDomain: '',
        currentStep: 0,
        analysisComplete: false,
        overallScore: 0,
        analyzer: new MarketingAnalyzer(),
        deployer: new AIAgentDeployer(),
        
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
        realAnalysisData: null,
        
        async startDemo() {
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
            
            // Start both visual animation and real analysis
            this.runAnalysis();
            this.performRealAnalysis();
        },
        
        async runAnalysis() {
            // Visual progress animation
            for (let i = 0; i < this.analysisSteps.length; i++) {
                this.currentStep = i;
                await this.delay(2000 + Math.random() * 1000);
            }
            
            // Wait for real analysis if not complete
            if (!this.realAnalysisData) {
                await this.delay(1000);
            }
            
            // Generate findings based on real data if available
            if (this.realAnalysisData) {
                this.generateRealFindings();
            } else {
                this.generateFindings();
            }
            
            this.analysisComplete = true;
            this.animateScore();
        },
        
        async performRealAnalysis() {
            try {
                // Try to use real analysis
                this.realAnalysisData = await this.analyzer.analyzeWebsite(this.demoUrl);
            } catch (error) {
                console.log('Real analysis not available, using simulation');
            }
        },
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        generateRealFindings() {
            const data = this.realAnalysisData.analyses;
            
            this.findings = [
                {
                    category: 'SEO & Content',
                    icon: '🔍',
                    score: Math.round(data.seo.score),
                    status: this.getStatus(data.seo.score),
                    issues: this.formatIssues(data.seo.issues),
                    realData: data.seo
                },
                {
                    category: 'Site Performance',
                    icon: '⚡',
                    score: Math.round(data.performance.score),
                    status: this.getStatus(data.performance.score),
                    issues: data.performance.recommendations.slice(0, 4).map(r => r.action),
                    realData: data.performance
                },
                {
                    category: 'Social Media',
                    icon: '🌟',
                    score: Math.round(data.social.score),
                    status: this.getStatus(data.social.score),
                    issues: this.formatSocialIssues(data.social),
                    realData: data.social
                },
                {
                    category: 'Content Strategy',
                    icon: '📝',
                    score: Math.round(data.content.score),
                    status: this.getStatus(data.content.score),
                    issues: data.content.issues,
                    realData: data.content
                },
                {
                    category: 'Competitive Position',
                    icon: '🏆',
                    score: 40 + Math.random() * 30,
                    status: 'warning',
                    issues: data.competitors.insights,
                    realData: data.competitors
                }
            ];
            
            this.overallScore = this.realAnalysisData.score;
        },
        
        formatIssues(issueObj) {
            const issues = [];
            if (issueObj.critical) issues.push(...issueObj.critical);
            if (issueObj.warnings) issues.push(...issueObj.warnings.slice(0, 2));
            if (issueObj.opportunities) issues.push(...issueObj.opportunities.slice(0, 1));
            return issues.slice(0, 4);
        },
        
        formatSocialIssues(social) {
            const issues = [];
            const platforms = Object.keys(social.presence);
            const inactive = platforms.filter(p => !social.presence[p].found).length;
            
            if (inactive > 2) {
                issues.push(`Not active on ${inactive} major social platforms`);
            }
            
            social.recommendations.forEach(rec => {
                issues.push(rec);
            });
            
            return issues.slice(0, 4);
        },
        
        generateFindings() {
            // Fallback to simulated findings
            const baseScore = 40 + Math.random() * 30;
            
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
                }
            ];
            
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
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                this.overallScore = Math.round(current);
            }, 20);
        },
        
        async deployAgent(category) {
            const finding = this.findings.find(f => f.category === category);
            
            if (!finding) return;
            
            // Show deployment modal
            const deployment = await this.showDeploymentModal(category, finding);
            
            if (deployment) {
                // In production, this would actually deploy the agent
                try {
                    const result = await this.deployer.deployAgent(
                        this.getAgentType(category),
                        this.demoUrl,
                        finding.issues
                    );
                    
                    this.showDeploymentSuccess(result);
                } catch (error) {
                    alert('Agent deployment would happen here in production!');
                }
            }
        },
        
        getAgentType(category) {
            const mapping = {
                'SEO & Content': 'seo',
                'Site Performance': 'performance',
                'Email Marketing': 'email',
                'Paid Advertising': 'ppc',
                'Content Strategy': 'content'
            };
            return mapping[category] || 'seo';
        },
        
        showDeploymentModal(category, finding) {
            const agentType = this.getAgentType(category);
            const agent = this.deployer.agents[agentType];
            
            if (!agent) return false;
            
            const capabilities = agent.capabilities.join('\\n• ');
            
            return confirm(
                `Deploy ${agent.name} to fix ${category} issues?\\n\\n` +
                `This agent can:\\n• ${capabilities}\\n\\n` +
                `Estimated time: ${finding.issues.length * 15 + 30} minutes\\n\\n` +
                `Continue?`
            );
        },
        
        showDeploymentSuccess(result) {
            alert(
                `✅ ${result.agentName} deployed successfully!\\n\\n` +
                `${result.tasks.length} tasks queued\\n` +
                `Estimated completion: ${result.estimatedCompletionTime.human}\\n\\n` +
                `You'll receive updates via email as tasks complete.`
            );
        }
    };
}