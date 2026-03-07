// Alex² Functional Frontend Application
function alexSquared() {
    return {
        // UI State
        mobileMenuOpen: false,
        showDemo: false,
        demoUrl: '',
        analyzing: false,
        currentStep: 0,
        showResults: false,
        scrolled: false,
        error: null,
        
        // Analysis Data
        analysisData: null,
        competitorData: null,
        strategyData: null,
        
        // Initialize
        init() {
            window.addEventListener('scroll', () => {
                this.scrolled = window.pageYOffset > 50;
            });
            
            // Check API health on load
            this.checkAPIHealth();
        },
        
        // Check if API is running
        async checkAPIHealth() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                console.log('API Health:', data);
            } catch (error) {
                console.error('API not running. Start with: npm start');
            }
        },
        
        // Main analysis function
        async startAnalysis() {
            if (!this.demoUrl || this.analyzing) return;
            
            this.showDemo = true;
            this.analyzing = true;
            this.showResults = false;
            this.currentStep = 0;
            this.error = null;
            
            try {
                // Step 1: Scanning
                this.currentStep = 1;
                await this.delay(1500);
                
                // Make real API call
                const analysisResponse = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: this.demoUrl })
                });
                
                if (!analysisResponse.ok) {
                    throw new Error('Analysis failed');
                }
                
                this.analysisData = await analysisResponse.json();
                
                // Step 2: Competitive Analysis
                this.currentStep = 2;
                await this.delay(1000);
                
                // If we found competitors, analyze them
                if (this.analysisData.competitors && this.analysisData.competitors.length > 0) {
                    const competitorResponse = await fetch('/api/analyze/competitors', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            domain: this.analysisData.websiteData.domain,
                            competitors: this.analysisData.competitors.slice(0, 3)
                        })
                    });
                    
                    if (competitorResponse.ok) {
                        this.competitorData = await competitorResponse.json();
                    }
                }
                
                // Step 3: Building Strategy
                this.currentStep = 3;
                await this.delay(1000);
                
                // Show results
                this.analyzing = false;
                this.showResults = true;
                
            } catch (error) {
                console.error('Analysis error:', error);
                this.error = 'Unable to analyze website. Please check the URL and try again.';
                this.analyzing = false;
                this.currentStep = 0;
            }
        },
        
        // Get score color
        getScoreColor(score) {
            if (score >= 80) return '#10b981';
            if (score >= 60) return '#f59e0b';
            return '#ef4444';
        },
        
        // Get priority color
        getPriorityColor(priority) {
            const colors = {
                'high': '#ef4444',
                'medium': '#f59e0b',
                'low': '#10b981',
                1: '#ef4444',
                2: '#ec4899',
                3: '#f59e0b',
                4: '#3b82f6',
                5: '#10b981'
            };
            return colors[priority] || '#6b7280';
        },
        
        // Format recommendation for display
        formatRecommendation(rec) {
            if (rec.priority && typeof rec.priority === 'number') {
                return {
                    ...rec,
                    priorityText: `Priority ${rec.priority}`,
                    color: this.getPriorityColor(rec.priority)
                };
            }
            return {
                ...rec,
                priorityText: rec.impact || 'Medium Impact',
                color: this.getPriorityColor(rec.impact || 'medium')
            };
        },
        
        // Calculate potential value
        calculatePotentialValue() {
            if (!this.analysisData) return '$0';
            
            const score = this.analysisData.marketingScore.overall;
            const improvement = 100 - score;
            const baseValue = 50000; // Base monthly value
            const multiplier = improvement / 100;
            
            return '$' + Math.round(baseValue * multiplier).toLocaleString();
        },
        
        // Generate strategy
        async generateStrategy(goals, budget, timeline) {
            try {
                const response = await fetch('/api/generate/strategy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        analysis: this.analysisData,
                        goals,
                        budget,
                        timeline
                    })
                });
                
                if (!response.ok) throw new Error('Strategy generation failed');
                
                this.strategyData = await response.json();
                return this.strategyData;
                
            } catch (error) {
                console.error('Strategy generation error:', error);
                return null;
            }
        },
        
        // Schedule a call (demo)
        scheduleCall() {
            // In production, this would integrate with Calendly or similar
            alert('Demo: In production, this would open a scheduling widget');
        },
        
        // Export analysis (demo)
        exportAnalysis() {
            if (!this.analysisData) return;
            
            const exportData = {
                analysisDate: new Date().toISOString(),
                website: this.analysisData.websiteData,
                scores: this.analysisData.marketingScore,
                recommendations: this.analysisData.recommendations,
                opportunities: this.analysisData.opportunities
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `alex2-analysis-${this.analysisData.websiteData.domain}-${Date.now()}.json`;
            a.click();
        },
        
        // Utility: delay function
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        // Get formatted domain
        getFormattedDomain() {
            if (!this.analysisData || !this.analysisData.websiteData) return '';
            return this.analysisData.websiteData.domain;
        }
    };
}