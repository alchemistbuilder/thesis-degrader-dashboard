// Thesis Degrader Dashboard - Main JavaScript File

// Global State
let positions = [];
let alerts = [];
let currentView = 'positions';
let selectedPosition = null;

// Demo Data Generator
const sectors = ['Technology', 'Finance', 'Healthcare', 'Consumer', 'Energy', 'Industrial'];
const driverTypes = ['financial', 'operational', 'market', 'macro'];
const alertTypes = ['critical', 'warning', 'info'];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    initializeDemoData();
    renderCurrentView();
    startRealTimeSimulation();
    initializeStockDetailPage();
});

// Navigation Handler
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });
}

function switchView(view) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === view);
    });
    
    // Update content
    document.querySelectorAll('.view').forEach(v => {
        v.classList.toggle('active', v.id === `${view}-view`);
    });
    
    currentView = view;
    renderCurrentView();
}

// Modal Handlers
function initializeModals() {
    const addBtn = document.getElementById('addPositionBtn');
    const modal = document.getElementById('positionModal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('positionForm');
    
    addBtn.addEventListener('click', () => openPositionModal());
    closeBtn.addEventListener('click', () => closeModal(modal));
    cancelBtn.addEventListener('click', () => closeModal(modal));
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    // Form submission
    form.addEventListener('submit', handlePositionSubmit);
    
    // Add driver/trigger buttons
    document.getElementById('addDriverBtn').addEventListener('click', addThesisDriver);
    document.getElementById('addTriggerBtn').addEventListener('click', addRiskTrigger);
    
    // Close panel
    document.getElementById('closePanelBtn').addEventListener('click', closeSidePanel);
}

function openPositionModal(position = null) {
    const modal = document.getElementById('positionModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('positionForm');
    
    if (position) {
        title.textContent = 'Edit Position';
        // Populate form with position data
        form.ticker.value = position.ticker;
        form.company.value = position.company;
        form.positionSize.value = position.positionSize;
        form.sector.value = position.sector;
    } else {
        title.textContent = 'Add New Position';
        form.reset();
    }
    
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

function handlePositionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const drivers = Array.from(document.querySelectorAll('.driver-input')).map((input, index) => ({
        text: input.value,
        type: document.querySelectorAll('.driver-type')[index].value,
        status: 'healthy',
        health: 100
    }));
    
    const triggers = Array.from(document.querySelectorAll('.trigger-input')).map((input, index) => ({
        text: input.value,
        severity: document.querySelectorAll('.trigger-severity')[index].value,
        triggered: false
    }));
    
    const position = {
        id: Date.now(),
        ticker: formData.get('ticker'),
        company: formData.get('company'),
        positionSize: parseFloat(formData.get('positionSize')),
        sector: formData.get('sector'),
        drivers: drivers,
        triggers: triggers,
        status: 'healthy',
        currentPrice: 100 + Math.random() * 200,
        dailyChange: (Math.random() - 0.5) * 10,
        addedDate: new Date()
    };
    
    positions.push(position);
    closeModal(document.getElementById('positionModal'));
    showToast('Position added successfully', 'success');
    renderPositions();
}

function addThesisDriver() {
    const container = document.getElementById('thesisDrivers');
    const driverDiv = document.createElement('div');
    driverDiv.className = 'thesis-driver';
    driverDiv.innerHTML = `
        <input type="text" class="driver-input" placeholder="e.g., Revenue growth >20% YoY" required>
        <select class="driver-type">
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="market">Market</option>
            <option value="macro">Macro</option>
        </select>
    `;
    container.appendChild(driverDiv);
}

function addRiskTrigger() {
    const container = document.getElementById('riskTriggers');
    const triggerDiv = document.createElement('div');
    triggerDiv.className = 'risk-trigger';
    triggerDiv.innerHTML = `
        <input type="text" class="trigger-input" placeholder="e.g., Oil price > $100/barrel">
        <select class="trigger-severity">
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
        </select>
    `;
    container.appendChild(triggerDiv);
}

// Initialize Demo Data
function initializeDemoData() {
    // Create demo positions
    const demoPositions = [
        {
            ticker: 'MSFT',
            company: 'Microsoft Corporation',
            positionSize: 35.8,
            sector: 'Technology',
            drivers: [
                { text: 'Azure growth >25% YoY', type: 'financial', status: 'healthy', health: 92 },
                { text: 'AI adoption in enterprise', type: 'market', status: 'healthy', health: 98 },
                { text: 'Operating leverage expansion', type: 'financial', status: 'warning', health: 70 }
            ],
            triggers: [
                { text: 'Cloud growth deceleration', severity: 'warning', triggered: false }
            ],
            status: 'warning'
        },
        {
            ticker: 'NVDA',
            company: 'NVIDIA Corporation',
            positionSize: 42.1,
            sector: 'Technology',
            drivers: [
                { text: 'Data center growth >50%', type: 'financial', status: 'healthy', health: 95 },
                { text: 'AI chip market dominance', type: 'market', status: 'healthy', health: 90 },
                { text: 'Gross margins >70%', type: 'financial', status: 'healthy', health: 88 }
            ],
            triggers: [
                { text: 'Competition from hyperscalers', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'META',
            company: 'Meta Platforms',
            positionSize: 38.2,
            sector: 'Technology',
            drivers: [
                { text: 'Instagram Reels monetization >$10B run rate', type: 'financial', status: 'healthy', health: 85 },
                { text: 'Reality Labs losses narrowing', type: 'operational', status: 'warning', health: 55 },
                { text: 'AI-driven ad targeting improvements', type: 'market', status: 'healthy', health: 90 },
                { text: 'WhatsApp business revenue acceleration', type: 'financial', status: 'healthy', health: 82 }
            ],
            triggers: [
                { text: 'Apple privacy changes impact >5%', severity: 'warning', triggered: false },
                { text: 'TikTok ban reversal in key markets', severity: 'critical', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'AMZN',
            company: 'Amazon.com Inc',
            positionSize: 45.6,
            sector: 'Technology',
            drivers: [
                { text: 'AWS operating margin >30%', type: 'financial', status: 'healthy', health: 88 },
                { text: 'Prime membership growth >5% YoY', type: 'operational', status: 'healthy', health: 92 },
                { text: 'Advertising revenue >$50B annual', type: 'financial', status: 'healthy', health: 95 },
                { text: 'Retail margins expansion', type: 'financial', status: 'warning', health: 65 }
            ],
            triggers: [
                { text: 'AWS growth <15%', severity: 'critical', triggered: false },
                { text: 'Regulatory breakup threat', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'TSM',
            company: 'Taiwan Semiconductor',
            positionSize: 52.3,
            sector: 'Technology',
            drivers: [
                { text: '3nm node yield >90%', type: 'operational', status: 'healthy', health: 94 },
                { text: 'Pricing power with <5nm nodes', type: 'market', status: 'healthy', health: 96 },
                { text: 'US fab construction on schedule', type: 'operational', status: 'warning', health: 70 },
                { text: 'AI chip demand growth >40%', type: 'market', status: 'healthy', health: 98 }
            ],
            triggers: [
                { text: 'China invasion threat escalation', severity: 'critical', triggered: false },
                { text: 'Intel foundry competitiveness', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'CEG',
            company: 'Constellation Energy',
            positionSize: 18.7,
            sector: 'Energy',
            drivers: [
                { text: 'Nuclear capacity factor >94%', type: 'operational', status: 'healthy', health: 92 },
                { text: 'Data center power deals >5GW', type: 'market', status: 'healthy', health: 88 },
                { text: 'Green premium pricing >$5/MWh', type: 'financial', status: 'healthy', health: 85 }
            ],
            triggers: [
                { text: 'Nuclear incident at any plant', severity: 'critical', triggered: false },
                { text: 'Power price collapse <$30/MWh', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'SPOT',
            company: 'Spotify Technology',
            positionSize: 12.4,
            sector: 'Technology',
            drivers: [
                { text: 'Gross margin >30%', type: 'financial', status: 'healthy', health: 82 },
                { text: 'Podcast monetization scaling', type: 'operational', status: 'warning', health: 60 },
                { text: 'Price increases acceptance >90%', type: 'market', status: 'healthy', health: 88 },
                { text: 'User growth >15% YoY', type: 'operational', status: 'healthy', health: 85 }
            ],
            triggers: [
                { text: 'Apple Music aggressive pricing', severity: 'warning', triggered: false },
                { text: 'Artist boycott/exodus', severity: 'critical', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'NFLX',
            company: 'Netflix Inc',
            positionSize: 25.8,
            sector: 'Technology',
            drivers: [
                { text: 'Ad-tier subs >50M', type: 'operational', status: 'healthy', health: 78 },
                { text: 'Password sharing monetization', type: 'operational', status: 'healthy', health: 90 },
                { text: 'Content efficiency improving', type: 'financial', status: 'healthy', health: 85 },
                { text: 'Gaming traction meaningful', type: 'market', status: 'warning', health: 45 }
            ],
            triggers: [
                { text: 'Subscriber decline 2 quarters', severity: 'critical', triggered: false },
                { text: 'Content cost inflation >10%', severity: 'warning', triggered: false }
            ],
            status: 'warning'
        },
        {
            ticker: 'AVGO',
            company: 'Broadcom Inc',
            positionSize: 41.2,
            sector: 'Technology',
            drivers: [
                { text: 'AI revenue >$10B quarterly', type: 'financial', status: 'healthy', health: 92 },
                { text: 'VMware integration synergies', type: 'operational', status: 'healthy', health: 80 },
                { text: 'Custom silicon wins', type: 'market', status: 'healthy', health: 88 }
            ],
            triggers: [
                { text: 'Major hyperscaler defection', severity: 'critical', triggered: false },
                { text: 'VMware customer churn >20%', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'CRWD',
            company: 'CrowdStrike Holdings',
            positionSize: 14.3,
            sector: 'Technology',
            drivers: [
                { text: 'ARR growth >30%', type: 'financial', status: 'warning', health: 75 },
                { text: 'Falcon platform adoption >60%', type: 'operational', status: 'healthy', health: 85 },
                { text: 'Net retention rate >120%', type: 'financial', status: 'healthy', health: 88 },
                { text: 'Federal contract wins', type: 'market', status: 'critical', health: 40 }
            ],
            triggers: [
                { text: 'Major security breach by customer', severity: 'critical', triggered: false },
                { text: 'Microsoft bundling pressure', severity: 'warning', triggered: true }
            ],
            status: 'warning'
        },
        {
            ticker: 'BABA',
            company: 'Alibaba Group',
            positionSize: 8.9,
            sector: 'Technology',
            drivers: [
                { text: 'Cloud profitability achieved', type: 'financial', status: 'healthy', health: 78 },
                { text: 'Taobao GMV growth >5%', type: 'operational', status: 'warning', health: 55 },
                { text: 'International expansion traction', type: 'market', status: 'warning', health: 60 },
                { text: 'Regulatory pressure easing', type: 'macro', status: 'critical', health: 35 }
            ],
            triggers: [
                { text: 'New regulatory crackdown', severity: 'critical', triggered: false },
                { text: 'US delisting proceedings', severity: 'warning', triggered: false }
            ],
            status: 'critical'
        },
        {
            ticker: 'TSLA',
            company: 'Tesla Inc',
            positionSize: 31.5,
            sector: 'Technology',
            drivers: [
                { text: 'FSD adoption >30% take rate', type: 'operational', status: 'warning', health: 50 },
                { text: 'Energy storage growth >100%', type: 'financial', status: 'healthy', health: 95 },
                { text: 'Auto gross margins >25%', type: 'financial', status: 'critical', health: 45 },
                { text: 'Cybertruck production ramp', type: 'operational', status: 'warning', health: 65 }
            ],
            triggers: [
                { text: 'Major FSD safety incident', severity: 'critical', triggered: false },
                { text: 'China sales decline >20%', severity: 'warning', triggered: false }
            ],
            status: 'warning'
        },
        {
            ticker: 'BBIO',
            company: 'BridgeBio Pharma',
            positionSize: 6.2,
            sector: 'Healthcare',
            drivers: [
                { text: 'Acoramidis FDA approval', type: 'operational', status: 'healthy', health: 95 },
                { text: 'ATTR-CM market share >30%', type: 'market', status: 'healthy', health: 80 },
                { text: 'Pipeline asset progression', type: 'operational', status: 'healthy', health: 75 }
            ],
            triggers: [
                { text: 'Acoramidis safety signal', severity: 'critical', triggered: false },
                { text: 'Pfizer competitive response', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'RYTM',
            company: 'Rhythm Pharmaceuticals',
            positionSize: 4.8,
            sector: 'Healthcare',
            drivers: [
                { text: 'IMCIVREE label expansion', type: 'operational', status: 'healthy', health: 82 },
                { text: 'Genetic testing adoption', type: 'market', status: 'warning', health: 65 },
                { text: 'Reimbursement coverage >80%', type: 'financial', status: 'healthy', health: 78 }
            ],
            triggers: [
                { text: 'Competitive drug approval', severity: 'critical', triggered: false },
                { text: 'Reimbursement restrictions', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'LLY',
            company: 'Eli Lilly',
            positionSize: 68.4,
            sector: 'Healthcare',
            drivers: [
                { text: 'Mounjaro/Zepbound >$20B peak', type: 'financial', status: 'healthy', health: 96 },
                { text: 'Manufacturing capacity 3x expansion', type: 'operational', status: 'healthy', health: 88 },
                { text: 'Alzheimer\'s drug uptake', type: 'market', status: 'warning', health: 60 },
                { text: 'Obesity market growth >25% CAGR', type: 'market', status: 'healthy', health: 94 }
            ],
            triggers: [
                { text: 'GLP-1 safety concerns', severity: 'critical', triggered: false },
                { text: 'Medicare price negotiations', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'AMD',
            company: 'Advanced Micro Devices',
            positionSize: 29.7,
            sector: 'Technology',
            drivers: [
                { text: 'MI300 revenue >$4B annual', type: 'financial', status: 'healthy', health: 85 },
                { text: 'Data center share gains vs Intel', type: 'market', status: 'healthy', health: 90 },
                { text: 'Gross margin expansion >50%', type: 'financial', status: 'warning', health: 70 }
            ],
            triggers: [
                { text: 'NVIDIA allocation improvement', severity: 'warning', triggered: false },
                { text: 'Intel foundry breakthrough', severity: 'critical', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'GOOGL',
            company: 'Alphabet Inc',
            positionSize: 55.3,
            sector: 'Technology',
            drivers: [
                { text: 'Search AI integration success', type: 'operational', status: 'warning', health: 75 },
                { text: 'Cloud growth >30%', type: 'financial', status: 'healthy', health: 85 },
                { text: 'YouTube revenue >$40B', type: 'financial', status: 'healthy', health: 88 },
                { text: 'Waymo commercialization', type: 'market', status: 'healthy', health: 80 }
            ],
            triggers: [
                { text: 'Search market share <85%', severity: 'critical', triggered: false },
                { text: 'Regulatory breakup ruling', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'HOOD',
            company: 'Robinhood Markets',
            positionSize: 7.5,
            sector: 'Finance',
            drivers: [
                { text: 'Gold subscriber growth >1M/quarter', type: 'operational', status: 'healthy', health: 82 },
                { text: 'Crypto revenue diversification', type: 'financial', status: 'healthy', health: 88 },
                { text: 'International expansion', type: 'market', status: 'warning', health: 55 }
            ],
            triggers: [
                { text: 'Major trading outage/scandal', severity: 'critical', triggered: false },
                { text: 'Crypto regulatory crackdown', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'INSM',
            company: 'Insmed Inc',
            positionSize: 5.4,
            sector: 'Healthcare',
            drivers: [
                { text: 'Brensocatib Phase 3 success', type: 'operational', status: 'healthy', health: 90 },
                { text: 'ARIKAYCE peak sales >$1B', type: 'financial', status: 'healthy', health: 78 },
                { text: 'Pipeline diversification', type: 'operational', status: 'healthy', health: 75 }
            ],
            triggers: [
                { text: 'Brensocatib trial failure', severity: 'critical', triggered: false },
                { text: 'Manufacturing issues', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'PLTR',
            company: 'Palantir Technologies',
            positionSize: 16.8,
            sector: 'Technology',
            drivers: [
                { text: 'Commercial revenue >$1B annual', type: 'financial', status: 'healthy', health: 85 },
                { text: 'AIP adoption >500 customers', type: 'operational', status: 'healthy', health: 92 },
                { text: 'Government growth >20%', type: 'financial', status: 'healthy', health: 88 },
                { text: 'Operating margin >20%', type: 'financial', status: 'warning', health: 68 }
            ],
            triggers: [
                { text: 'Major government contract loss', severity: 'critical', triggered: false },
                { text: 'Data privacy scandal', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'TDG',
            company: 'TransDigm Group',
            positionSize: 21.2,
            sector: 'Industrial',
            drivers: [
                { text: 'Aftermarket growth >8%', type: 'financial', status: 'healthy', health: 88 },
                { text: 'EBITDA margins >50%', type: 'financial', status: 'healthy', health: 92 },
                { text: 'Boeing 737 MAX production', type: 'market', status: 'warning', health: 65 }
            ],
            triggers: [
                { text: 'Major aircraft grounding', severity: 'critical', triggered: false },
                { text: 'DOD pricing investigation', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'UBER',
            company: 'Uber Technologies',
            positionSize: 19.4,
            sector: 'Technology',
            drivers: [
                { text: 'Mobility take rate >25%', type: 'financial', status: 'healthy', health: 85 },
                { text: 'Delivery profitability sustained', type: 'financial', status: 'healthy', health: 78 },
                { text: 'Autonomous vehicle integration', type: 'operational', status: 'warning', health: 55 },
                { text: 'Driver supply stability', type: 'operational', status: 'healthy', health: 82 }
            ],
            triggers: [
                { text: 'Driver classification change', severity: 'critical', triggered: false },
                { text: 'Major market exit', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'COIN',
            company: 'Coinbase Global',
            positionSize: 11.3,
            sector: 'Finance',
            drivers: [
                { text: 'Subscription revenue >50% mix', type: 'financial', status: 'healthy', health: 75 },
                { text: 'Institutional custody growth', type: 'operational', status: 'healthy', health: 82 },
                { text: 'Regulatory clarity improving', type: 'macro', status: 'warning', health: 60 },
                { text: 'Base L2 adoption', type: 'market', status: 'healthy', health: 78 }
            ],
            triggers: [
                { text: 'SEC enforcement action', severity: 'critical', triggered: false },
                { text: 'Major security breach', severity: 'critical', triggered: false }
            ],
            status: 'warning'
        },
        {
            ticker: 'CRDO',
            company: 'Credo Technology',
            positionSize: 3.8,
            sector: 'Technology',
            drivers: [
                { text: '800G adoption cycle', type: 'market', status: 'healthy', health: 90 },
                { text: 'Hyperscaler design wins', type: 'operational', status: 'healthy', health: 85 },
                { text: 'Gross margins >60%', type: 'financial', status: 'warning', health: 68 }
            ],
            triggers: [
                { text: 'Technology transition delay', severity: 'warning', triggered: false },
                { text: 'Customer concentration loss', severity: 'critical', triggered: false }
            ],
            status: 'healthy'
        },
        {
            ticker: 'PRME',
            company: 'Prime Medicine (SHORT)',
            positionSize: -2.4,
            sector: 'Healthcare',
            positionType: 'short',
            drivers: [
                { text: 'Catalyst desert: No readouts >12 months', type: 'operational', status: 'healthy', health: 95 },
                { text: 'Runway <3 quarters until dilution', type: 'financial', status: 'healthy', health: 88 },
                { text: 'Premium valuation vs gene editing peers', type: 'market', status: 'healthy', health: 92 },
                { text: 'Clinical program delays mounting', type: 'operational', status: 'healthy', health: 85 }
            ],
            triggers: [
                { text: 'Positive clinical readout announced', severity: 'critical', triggered: false },
                { text: 'Strategic partnership/licensing deal', severity: 'warning', triggered: false },
                { text: 'Major financing at premium', severity: 'warning', triggered: false }
            ],
            status: 'healthy'
        }
    ];

    // Add demo data with additional properties
    demoPositions.forEach(pos => {
        positions.push({
            ...pos,
            id: Date.now() + Math.random(),
            currentPrice: 100 + Math.random() * 200,
            dailyChange: (Math.random() - 0.5) * 10,
            addedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        });
    });

    // Create initial alerts
    generateInitialAlerts();
}

function generateInitialAlerts() {
    const alertTemplates = [
        {
            ticker: 'MSFT',
            type: 'warning',
            message: 'Azure growth decelerated to 28% from 31% last quarter. AWS gaining share in enterprise.',
            drivers: ['Azure growth'],
            confidence: 85,
            source: 'Quarterly Filing'
        }
    ];

    alertTemplates.forEach(template => {
        alerts.push({
            ...template,
            id: Date.now() + Math.random(),
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            read: false
        });
    });
}

// Rendering Functions
function renderCurrentView() {
    switch(currentView) {
        case 'positions':
            renderPositions();
            break;
        case 'alerts':
            renderAlerts();
            break;
        case 'actions':
            renderActions();
            break;
        case 'monitoring':
            renderMonitoring();
            break;
        case 'heatmap':
            renderHeatmap();
            break;
    }
}

function renderPositions() {
    const grid = document.getElementById('positionsGrid');
    grid.innerHTML = '';
    
    positions.forEach(position => {
        const card = createPositionCard(position);
        grid.appendChild(card);
    });
}

function createPositionCard(position) {
    const card = document.createElement('div');
    card.className = `position-card ${position.status}`;
    card.onclick = () => showStockDetailPage(position);
    
    const isShort = position.positionType === 'short';
    const changeClass = position.dailyChange >= 0 ? 'positive' : 'negative';
    const changePrefix = position.dailyChange >= 0 ? '+' : '';
    
    // For short positions, invert the P&L color logic
    const shortChangeClass = isShort ? (position.dailyChange >= 0 ? 'negative' : 'positive') : changeClass;
    
    card.innerHTML = `
        <div class="card-header">
            <div>
                <div class="card-ticker">
                    ${position.ticker}
                    ${isShort ? '<span style="background: var(--accent-danger); color: white; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.625rem; margin-left: 0.5rem;">SHORT</span>' : ''}
                </div>
                <div class="card-company">${position.company}</div>
            </div>
            <span class="card-status ${position.status}">${position.status}</span>
        </div>
        
        <div class="card-metrics">
            <div class="metric">
                <span class="metric-label">Position</span>
                <span class="metric-value">${isShort ? '-' : ''}$${Math.abs(position.positionSize).toFixed(1)}M</span>
            </div>
            <div class="metric">
                <span class="metric-label">Daily P&L</span>
                <span class="metric-value ${shortChangeClass}">${changePrefix}${position.dailyChange.toFixed(2)}%</span>
            </div>
        </div>
        
        <div class="thesis-health">
            <div class="thesis-health-label">${isShort ? 'Short Thesis Health' : 'Thesis Health'}</div>
            <div class="thesis-drivers">
                ${position.drivers.map(driver => `
                    <div class="driver">
                        <span class="driver-indicator ${driver.status}"></span>
                        <span class="driver-text">${driver.text}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    return card;
}

function renderAlerts() {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = '';
    
    // Sort alerts by timestamp (newest first)
    const sortedAlerts = [...alerts].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedAlerts.forEach(alert => {
        const alertElement = createAlertElement(alert);
        container.appendChild(alertElement);
    });
}

function createAlertElement(alert) {
    const div = document.createElement('div');
    div.className = 'alert-item';
    div.style.cursor = 'pointer';
    
    const timeAgo = getTimeAgo(alert.timestamp);
    
    // Add click handler - single click opens side panel
    div.addEventListener('click', () => {
        const position = positions.find(p => p.ticker === alert.ticker);
        if (position) {
            showPositionDetails(position);
        }
    });
    
    // Add hover effect
    div.addEventListener('mouseenter', () => {
        div.style.backgroundColor = 'var(--bg-hover)';
    });
    
    div.addEventListener('mouseleave', () => {
        div.style.backgroundColor = 'var(--bg-card)';
    });
    
    div.innerHTML = `
        <div class="alert-icon ${alert.type}">
            ${getAlertIcon(alert.type)}
        </div>
        <div class="alert-content">
            <div class="alert-header">
                <span class="alert-ticker">${alert.ticker}</span>
                <span class="alert-time">${timeAgo}</span>
            </div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-impact">
                <span class="impact-item">
                    <span>📊</span> Confidence: ${alert.confidence}%
                </span>
                <span class="impact-item">
                    <span>📰</span> Source: ${alert.source}
                </span>
                <span class="impact-item">
                    <span>🎯</span> Impacts: ${alert.drivers.join(', ')}
                </span>
            </div>
        </div>
        <div style="position: absolute; top: 1rem; right: 1rem; opacity: 0.5; font-size: 0.75rem; color: var(--text-tertiary);">
            Click to view position
        </div>
    `;
    
    return div;
}

function renderActions() {
    const container = document.getElementById('actionsList');
    container.innerHTML = '';
    
    // Generate action recommendations based on position status
    const actions = generateActionRecommendations();
    
    actions.forEach(action => {
        const actionElement = createActionElement(action);
        container.appendChild(actionElement);
    });
}

function createActionElement(action) {
    const div = document.createElement('div');
    div.className = 'action-item';
    div.style.cssText = `
        background-color: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.2s;
    `;
    
    const actionIcon = getActionIcon(action.type);
    const urgencyClass = action.urgency === 'high' ? 'text-danger' : action.urgency === 'medium' ? 'text-warning' : 'text-muted';
    
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <div style="display: flex; gap: 1rem;">
                <div style="font-size: 1.5rem;">${actionIcon}</div>
                <div>
                    <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${action.title}</h4>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">
                        <span style="cursor: pointer; transition: color 0.2s;" onclick="event.stopPropagation(); ${action.ticker !== 'Portfolio' ? `navigateToPosition('${action.ticker}')` : 'void(0)'}" onmouseover="this.style.color='var(--accent-primary)'" onmouseout="this.style.color='var(--text-secondary)'">${action.ticker}</span> • ${action.type}
                    </div>
                </div>
            </div>
            <span class="${urgencyClass}" style="font-size: 0.875rem; font-weight: 500;">
                ${action.urgency.toUpperCase()}
            </span>
        </div>
        <div style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">
            ${action.description}
        </div>
        <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <div style="font-weight: 500; margin-bottom: 0.5rem;">Recommended Action:</div>
            <div style="color: var(--text-secondary);">${action.recommendation}</div>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button class="btn-primary" style="font-size: 0.875rem;">Execute</button>
            <button class="btn-secondary" style="font-size: 0.875rem;" onclick="event.stopPropagation(); ${action.ticker !== 'Portfolio' ? `navigateToPosition('${action.ticker}')` : 'void(0)'}">Details</button>
        </div>
    `;
    
    // Add click handler for the entire action div to open side panel
    if (action.ticker !== 'Portfolio') {
        div.addEventListener('click', () => {
            const position = positions.find(p => p.ticker === action.ticker);
            if (position) {
                showPositionDetails(position);
            }
        });
        
        // Add hover effect
        div.addEventListener('mouseenter', () => {
            div.style.transform = 'translateY(-2px)';
            div.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        });
        
        div.addEventListener('mouseleave', () => {
            div.style.transform = 'translateY(0)';
            div.style.boxShadow = 'none';
        });
    }
    
    return div;
}

function generateActionRecommendations() {
    const actions = [];
    
    positions.forEach(position => {
        if (position.status === 'critical') {
            actions.push({
                id: Date.now() + Math.random(),
                ticker: position.ticker,
                type: 'exit',
                urgency: 'high',
                title: 'Consider Full Exit',
                description: `Multiple thesis drivers have degraded significantly. Core investment thesis appears broken with ${position.drivers.filter(d => d.status !== 'healthy').length} of ${position.drivers.length} drivers failing.`,
                recommendation: `Reduce position by 100% or implement protective puts at $${(position.currentPrice * 0.95).toFixed(2)} strike.`
            });
        } else if (position.status === 'warning') {
            actions.push({
                id: Date.now() + Math.random(),
                ticker: position.ticker,
                type: 'trim',
                urgency: 'medium',
                title: 'Trim Position',
                description: `Thesis showing signs of degradation. Monitor closely for further deterioration.`,
                recommendation: `Reduce position by 30-50% to manage risk exposure. Set stop loss at $${(position.currentPrice * 0.92).toFixed(2)}.`
            });
        }
    });
    
    // Add some hedge recommendations
    actions.push({
        id: Date.now() + Math.random(),
        ticker: 'Portfolio',
        type: 'hedge',
        urgency: 'medium',
        title: 'Sector Hedge Recommended',
        description: 'High concentration in Technology sector (>40% of portfolio). Recent market volatility suggests hedging.', 
        recommendation: 'Consider QQQ puts or VIX calls to hedge technology exposure. Target 15-20% hedge ratio.'
    });
    
    return actions;
}

function renderMonitoring() {
    const container = document.getElementById('monitoringGrid');
    container.innerHTML = '';
    
    const monitoringCategories = [
        {
            title: 'Regulatory Filings',
            icon: '📄',
            status: 'active',
            lastUpdate: '2 min ago (15:21:15)',
            totalItems: 1247,
            subCategories: [
                { name: '10-K', description: 'Annual reports', count: 45, status: 'active' },
                { name: '10-Q', description: 'Quarterly reports', count: 178, status: 'active' },
                { name: '8-K', description: 'Current reports', count: 523, status: 'active' },
                { name: 'DEF 14A', description: 'Proxy statements', count: 89, status: 'active' },
                { name: 'S-1/S-4', description: 'Registration statements', count: 23, status: 'active' },
                { name: '20-F', description: 'Foreign annual reports', count: 34, status: 'active' },
                { name: '6-K', description: 'Foreign current reports', count: 67, status: 'active' }
            ]
        },
        {
            title: 'Insider & Institutional Activity',
            icon: '👥',
            status: 'active',
            lastUpdate: '45 sec ago (15:22:30)',
            totalItems: 892,
            subCategories: [
                { name: 'Form 4', description: 'Insider transactions', count: 234, status: 'active' },
                { name: 'Form 144', description: 'Proposed sales', count: 89, status: 'active' },
                { name: '13F', description: 'Institutional holdings', count: 156, status: 'active' },
                { name: '13D/G', description: 'Activist positions', count: 23, status: 'active' },
                { name: 'SC 13G/A', description: 'Passive amendments', count: 67, status: 'active' },
                { name: 'Schedule TO', description: 'Tender offers', count: 12, status: 'active' },
                { name: 'DEFM14A', description: 'M&A proxy statements', count: 8, status: 'active' }
            ]
        },
        {
            title: 'Corporate Communications',
            icon: '📢',
            status: 'active',
            lastUpdate: '1 min ago (15:22:15)',
            totalItems: 3456,
            subCategories: [
                { name: 'Earnings Calls', description: 'Transcripts & Q&A', count: 89, status: 'active' },
                { name: 'Investor Decks', description: 'Presentation materials', count: 134, status: 'active' },
                { name: 'Press Releases', description: 'PR Newswire/Business Wire', count: 1289, status: 'active' },
                { name: 'Corporate Blogs', description: 'Company updates', count: 567, status: 'active' },
                { name: 'Guidance Updates', description: 'Pre-announcements', count: 45, status: 'active' },
                { name: 'Conference Presentations', description: 'Industry events', count: 223, status: 'active' }
            ]
        },
        {
            title: 'Market Intelligence',
            icon: '📰',
            status: 'active',
            lastUpdate: '15 sec ago (15:23:00)',
            totalItems: 7476,
            subCategories: [
                { name: 'Bloomberg Terminal', description: 'Breaking news & alerts', count: 2341, status: 'active' },
                { name: 'Reuters', description: 'Breaking news & exclusives', count: 1876, status: 'active' },
                { name: 'WSJ/FT/Barrons', description: 'Investigative pieces', count: 456, status: 'active' },
                { name: 'Seeking Alpha', description: 'Analyst articles', count: 1234, status: 'active' },
                { name: 'The Information', description: 'Tech-specific coverage', count: 234, status: 'active' },
                { name: 'Industry Publications', description: 'Sector-specific news', count: 567, status: 'active' },
                { name: 'Trade Magazines', description: 'Deep sector analysis', count: 768, status: 'active' }
            ]
        },
        {
            title: 'Social Sentiment',
            icon: '📱',
            status: 'active',
            lastUpdate: '30 sec ago (15:22:45)',
            totalItems: 45821,
            subCategories: [
                { name: 'Twitter/X', description: 'Company mentions & FinTwit', count: 23456, status: 'active' },
                { name: 'Reddit', description: 'WSB & investing subs', count: 12345, status: 'active' },
                { name: 'LinkedIn', description: 'Employee sentiment', count: 3456, status: 'active' },
                { name: 'Glassdoor', description: 'Employee reviews', count: 2345, status: 'active' },
                { name: 'App Store Reviews', description: 'Product sentiment', count: 1234, status: 'active' },
                { name: 'Google/Yelp Reviews', description: 'Business reviews', count: 2985, status: 'active' }
            ]
        },
        {
            title: 'Alternative Data',
            icon: '🛰️',
            status: 'active',
            lastUpdate: '5 min ago (15:18:15)',
            totalItems: 458,
            subCategories: [
                { name: 'Satellite Imagery', description: 'Store traffic & inventory', count: 45, status: 'active' },
                { name: 'Web Traffic', description: 'SimilarWeb data', count: 89, status: 'active' },
                { name: 'Credit Card Data', description: 'Spend patterns', count: 67, status: 'active' },
                { name: 'App Analytics', description: 'Download/usage stats', count: 123, status: 'active' },
                { name: 'Supply Chain', description: 'ImportGenius tracking', count: 78, status: 'active' },
                { name: 'Patent Filings', description: 'Innovation tracking', count: 56, status: 'active' }
            ]
        },
        {
            title: 'Macro & Market Data',
            icon: '📊',
            status: 'active',
            lastUpdate: '10 min ago (15:13:15)',
            totalItems: 234,
            subCategories: [
                { name: 'Economic Calendar', description: 'FOMC/CPI/GDP releases', count: 45, status: 'active' },
                { name: 'Central Bank Comms', description: 'Fed communications', count: 23, status: 'active' },
                { name: 'Treasury Yields', description: 'Bond market movements', count: 34, status: 'active' },
                { name: 'Commodity Prices', description: 'Oil/metals/agriculture', count: 67, status: 'active' },
                { name: 'Currency Data', description: 'DXY & major pairs', count: 29, status: 'active' },
                { name: 'Sector Indicators', description: 'Industry-specific data', count: 36, status: 'active' }
            ]
        },
        {
            title: 'Real-Time Flows',
            icon: '⚡',
            status: 'processing',
            lastUpdate: '3 min ago (15:20:15)',
            totalItems: 2341,
            subCategories: [
                { name: 'Options Flow', description: 'Unusual activity', count: 567, status: 'active' },
                { name: 'Dark Pool Prints', description: 'Large block trades', count: 234, status: 'active' },
                { name: 'Short Interest', description: 'Borrowing costs', count: 123, status: 'active' },
                { name: 'Insider Clusters', description: 'Coordinated buying/selling', count: 45, status: 'active' },
                { name: 'News Aggregation', description: 'Real-time alerts', count: 1234, status: 'active' },
                { name: 'Trade Flows', description: 'Institutional flows', count: 138, status: 'active' }
            ]
        },
        {
            title: 'Sell-Side Research',
            icon: '🏦',
            status: 'active',
            lastUpdate: '1 hour ago (14:23:15)',
            totalItems: 3456,
            subCategories: [
                { name: 'Barclays', description: 'Equity research & ratings', count: 456, status: 'active' },
                { name: 'Goldman Sachs', description: 'Research notes & models', count: 523, status: 'active' },
                { name: 'Morgan Stanley', description: 'Sector analysis & calls', count: 478, status: 'active' },
                { name: 'Evercore ISI', description: 'Deep dive reports', count: 234, status: 'active' },
                { name: 'UBS', description: 'Global equity research', count: 345, status: 'active' },
                { name: 'Leerink Partners', description: 'Healthcare focus', count: 189, status: 'active' },
                { name: 'TD Cowen', description: 'TMT & growth coverage', count: 267, status: 'active' },
                { name: 'Jefferies', description: 'Trading desk color', count: 312, status: 'active' },
                { name: 'Baird', description: 'Mid-cap coverage', count: 198, status: 'active' },
                { name: 'Stifel', description: 'Regional insights', count: 156, status: 'active' },
                { name: 'Piper Sandler', description: 'Growth equity focus', count: 298, status: 'active' }
            ]
        },
        {
            title: 'Biotech & Pharma Intelligence',
            icon: '🧬',
            status: 'active',
            lastUpdate: '30 min ago (14:53:15)',
            totalItems: 1823,
            subCategories: [
                { name: 'FDA Submissions', description: 'NDA/BLA/ANDA filings', count: 234, status: 'active' },
                { name: 'Clinical Trial Readouts', description: 'Phase 1/2/3 results', count: 156, status: 'active' },
                { name: 'ClinicalTrials.gov', description: 'Trial updates & amendments', count: 423, status: 'active' },
                { name: 'Catalyst Calendar', description: 'PDUFA dates & milestones', count: 89, status: 'active' },
                { name: 'FDA Advisory Committees', description: 'AdCom schedules & briefings', count: 34, status: 'active' },
                { name: 'EMA Filings', description: 'European approvals', count: 123, status: 'active' },
                { name: 'Patent Expirations', description: 'Biosimilar opportunities', count: 78, status: 'active' },
                { name: 'Conference Abstracts', description: 'ASCO/ASH/ACC presentations', count: 267, status: 'active' },
                { name: 'Pharma Partnerships', description: 'Licensing & collaborations', count: 145, status: 'active' },
                { name: 'FDA Warning Letters', description: 'Compliance issues', count: 56, status: 'active' },
                { name: 'Breakthrough Designations', description: 'Fast track status', count: 98, status: 'active' },
                { name: 'Real World Evidence', description: 'Post-market studies', count: 120, status: 'active' }
            ]
        }
    ];
    
    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem;';
    
    monitoringCategories.forEach(category => {
        const card = document.createElement('div');
        card.style.cssText = `
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--border-light)';
            card.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--border-color)';
            card.style.transform = 'translateY(0)';
        });
        
        const statusClass = category.status === 'active' ? 'text-success' : 'text-warning';
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">${category.icon}</span>
                    <h4 style="font-size: 1rem; font-weight: 600;">${category.title}</h4>
                </div>
                <span class="${statusClass}" style="font-size: 0.75rem; font-weight: 500;">
                    ${category.status.toUpperCase()}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <div style="color: var(--text-tertiary); font-size: 0.75rem;">LAST UPDATE</div>
                    <div style="font-weight: 500;">${category.lastUpdate}</div>
                </div>
                <div>
                    <div style="color: var(--text-tertiary); font-size: 0.75rem;">TOTAL ITEMS</div>
                    <div style="font-weight: 500;">${category.totalItems.toLocaleString()}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <div style="color: var(--text-tertiary); font-size: 0.75rem; margin-bottom: 0.5rem;">DATA SOURCES</div>
                <div style="max-height: 150px; overflow-y: auto;">
                    ${category.subCategories.map(sub => `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding: 0.5rem; background-color: var(--bg-tertiary); border-radius: 0.375rem;">
                            <div>
                                <div style="font-size: 0.8125rem; font-weight: 500;">${sub.name}</div>
                                <div style="font-size: 0.75rem; color: var(--text-tertiary);">${sub.description}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.8125rem; font-weight: 500;">${sub.count.toLocaleString()}</div>
                                <div style="font-size: 0.75rem; color: var(--accent-success);">●</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="height: 4px; background-color: var(--bg-tertiary); border-radius: 2px; overflow: hidden;">
                <div style="height: 100%; width: ${category.status === 'active' ? '100%' : '60%'}; background-color: ${category.status === 'active' ? 'var(--accent-success)' : 'var(--accent-warning)'}; animation: ${category.status === 'processing' ? 'pulse 2s infinite' : 'none'};"></div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

function renderHeatmap() {
    const container = document.getElementById('heatmapContainer');
    container.innerHTML = '';
    
    positions.forEach(position => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        // Calculate color based on status and daily change
        let bgColor;
        if (position.status === 'critical') {
            bgColor = 'rgba(239, 68, 68, 0.8)';
        } else if (position.status === 'warning') {
            bgColor = 'rgba(245, 158, 11, 0.8)';
        } else {
            bgColor = position.dailyChange >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.4)';
        }
        
        cell.style.backgroundColor = bgColor;
        cell.onclick = () => showPositionDetails(position);
        
        const changePrefix = position.dailyChange >= 0 ? '+' : '';
        
        cell.innerHTML = `
            <div class="heatmap-ticker">${position.ticker}</div>
            <div class="heatmap-value">${changePrefix}${position.dailyChange.toFixed(1)}%</div>
        `;
        
        container.appendChild(cell);
    });
}

// Position Details Panel
function showPositionDetails(position) {
    selectedPosition = position;
    const panel = document.getElementById('sidePanel');
    const content = document.getElementById('panelContent');
    
    // Get position-specific news and actions
    const positionNews = getPositionNews(position);
    const positionActions = getPositionActions(position);
    
    content.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">${position.ticker}</h2>
            <div style="color: var(--text-secondary); cursor: pointer; margin-bottom: 1rem;" onclick="navigateToPosition('${position.ticker}')" onmouseover="this.style.color='var(--accent-primary)'" onmouseout="this.style.color='var(--text-secondary)'">${position.company}</div>
            <button onclick="navigateToPosition('${position.ticker}')" style="background-color: var(--accent-primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#2563eb'" onmouseout="this.style.backgroundColor='var(--accent-primary)'">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2L10 8L6 14" stroke="currentColor" stroke-width="2"/>
                </svg>
                View Company Page
            </button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
            <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem;">
                <div style="color: var(--text-tertiary); font-size: 0.75rem; margin-bottom: 0.25rem;">POSITION SIZE</div>
                <div style="font-size: 1.25rem; font-weight: 600;">$${position.positionSize.toFixed(1)}M</div>
            </div>
            <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem;">
                <div style="color: var(--text-tertiary); font-size: 0.75rem; margin-bottom: 0.25rem;">DAILY CHANGE</div>
                <div style="font-size: 1.25rem; font-weight: 600;" class="${position.dailyChange >= 0 ? 'text-success' : 'text-danger'}">
                    ${position.dailyChange >= 0 ? '+' : ''}${position.dailyChange.toFixed(2)}%
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Thesis Drivers</h3>
            ${position.drivers.map(driver => `
                <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="driver-indicator ${driver.status}"></span>
                            <span style="font-weight: 500;">${driver.text}</span>
                        </div>
                        <span class="text-${driver.status === 'healthy' ? 'success' : driver.status === 'warning' ? 'warning' : 'danger'}" style="font-size: 0.875rem;">
                            ${driver.health}%
                        </span>
                    </div>
                    <div style="height: 4px; background-color: var(--bg-primary); border-radius: 2px; overflow: hidden;">
                        <div style="height: 100%; width: ${driver.health}%; background-color: ${driver.status === 'healthy' ? 'var(--accent-success)' : driver.status === 'warning' ? 'var(--accent-warning)' : 'var(--accent-danger)'};"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Risk Triggers</h3>
            ${position.triggers.map(trigger => `
                <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem; ${trigger.triggered ? 'border: 1px solid var(--accent-danger);' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${trigger.text}</span>
                        <span class="${trigger.triggered ? 'text-danger' : 'text-muted'}" style="font-size: 0.875rem; font-weight: 500;">
                            ${trigger.triggered ? 'TRIGGERED' : 'MONITORING'}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Latest Intelligence</h3>
            <div style="background-color: var(--bg-tertiary); border-radius: 0.5rem; padding: 1rem;">
                ${positionNews.map(news => `
                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 0.875rem;">${news.icon}</span>
                                <span style="font-weight: 500; font-size: 0.875rem;">${news.source}</span>
                            </div>
                            <span style="color: var(--text-tertiary); font-size: 0.75rem;">${news.time}</span>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                            ${news.headline}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <span style="background-color: var(--bg-card); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: var(--text-tertiary);">
                                Impact: ${news.impact}
                            </span>
                            <span style="background-color: var(--bg-card); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: var(--text-tertiary);">
                                Conf: ${news.confidence}%
                            </span>
                            ${news.thesisImpact ? `
                                <span style="background-color: ${news.thesisImpact.effect === 'validates' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${news.thesisImpact.effect === 'validates' ? 'var(--accent-success)' : 'var(--accent-danger)'}; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;">
                                    ${news.thesisImpact.effect === 'validates' ? '✓' : '✗'} ${news.thesisImpact.driver}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Recommended Actions</h3>
            <div style="background-color: var(--bg-tertiary); border-radius: 0.5rem; padding: 1rem;">
                ${positionActions.map(action => `
                    <div style="margin-bottom: 1rem; padding: 1rem; background-color: var(--bg-card); border-radius: 0.5rem; ${action.urgency === 'high' ? 'border-left: 4px solid var(--accent-danger);' : action.urgency === 'medium' ? 'border-left: 4px solid var(--accent-warning);' : 'border-left: 4px solid var(--accent-success);'}">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1rem;">${action.icon}</span>
                                <span style="font-weight: 500; font-size: 0.875rem;">${action.title}</span>
                            </div>
                            <span style="color: var(--text-tertiary); font-size: 0.75rem; text-transform: uppercase;">${action.urgency}</span>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                            ${action.description}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button style="background-color: var(--accent-primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer;">
                                Execute
                            </button>
                            <button style="background-color: var(--bg-hover); color: var(--text-secondary); border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer;">
                                Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    panel.classList.add('active');
}

// Get position-specific news
function getPositionNews(position) {
    const newsTemplates = {
        'MSFT': [
            {
                source: 'Quarterly Report',
                headline: 'Azure growth decelerated to 28% from 31% last quarter. AWS gaining enterprise share.',
                time: '1 hour ago (14:23:15)',
                icon: '📊',
                impact: 'Medium',
                confidence: 85,
                thesisImpact: {
                    driver: 'Azure growth >25% YoY',
                    effect: 'detracts',
                    severity: 'medium'
                }
            },
            {
                source: 'Industry Report',
                headline: 'Gartner positions Microsoft as leader in AI workspace tools, ahead of Google.',
                time: '4 hours ago (11:23:15)',
                icon: '📈',
                impact: 'Low',
                confidence: 80,
                thesisImpact: {
                    driver: 'AI adoption in enterprise',
                    effect: 'validates',
                    severity: 'low'
                }
            }
        ],
        'NVDA': [
            {
                source: 'Product Launch',
                headline: 'H100 chips seeing 6-month waiting lists. Demand exceeding supply estimates.',
                time: '3 hours ago (12:23:15)',
                icon: '🔥',
                impact: 'High',
                confidence: 90,
                thesisImpact: {
                    driver: 'Data center growth >50%',
                    effect: 'validates',
                    severity: 'high'
                }
            },
            {
                source: 'Competitor News',
                headline: 'AMD announces MI300X competing with H100. Price point 20% below NVIDIA.',
                time: '1 day ago (15:23:15)',
                icon: '⚔️',
                impact: 'Medium',
                confidence: 85,
                thesisImpact: {
                    driver: 'AI chip market dominance',
                    effect: 'detracts',
                    severity: 'medium'
                }
            }
        ],
        'TSLA': [
            {
                source: 'Earnings Call',
                headline: 'FSD Beta showing 40% improvement in intervention rates. Robotaxi timeline moved to 2025.',
                time: '2 hours ago (13:23:15)',
                icon: '🚗',
                impact: 'High',
                confidence: 85,
                thesisImpact: {
                    driver: 'FSD adoption >30% take rate',
                    effect: 'validates',
                    severity: 'high'
                }
            },
            {
                source: 'Production Update',
                headline: 'Cybertruck production challenges continue. Q1 deliveries only 2,000 units.',
                time: '1 day ago (15:23:15)',
                icon: '🔧',
                impact: 'Medium',
                confidence: 92,
                thesisImpact: {
                    driver: 'Cybertruck production ramp',
                    effect: 'detracts',
                    severity: 'medium'
                }
            }
        ],
        'BABA': [
            {
                source: 'Regulatory News',
                headline: 'China announces easing of tech crackdown. Antitrust fines may be reduced.',
                time: '4 hours ago (11:23:15)',
                icon: '🇨🇳',
                impact: 'High',
                confidence: 80,
                thesisImpact: {
                    driver: 'Regulatory pressure easing',
                    effect: 'validates',
                    severity: 'high'
                }
            },
            {
                source: 'Earnings Preview',
                headline: 'Cloud division expected to report first quarterly profit in Q4.',
                time: '6 hours ago (09:23:15)',
                icon: '☁️',
                impact: 'Medium',
                confidence: 75,
                thesisImpact: {
                    driver: 'Cloud profitability achieved',
                    effect: 'validates',
                    severity: 'medium'
                }
            }
        ],
        'LLY': [
            {
                source: 'FDA Update',
                headline: 'Mounjaro supply constraints easing. Manufacturing capacity up 200% QoQ.',
                time: '1 hour ago (14:23:15)',
                icon: '💊',
                impact: 'High',
                confidence: 95,
                thesisImpact: {
                    driver: 'Manufacturing capacity 3x expansion',
                    effect: 'validates',
                    severity: 'high'
                }
            },
            {
                source: 'Clinical Trial',
                headline: 'Alzheimer\'s drug donanemab shows 35% slowing of cognitive decline.',
                time: '3 hours ago (12:23:15)',
                icon: '🧠',
                impact: 'High',
                confidence: 90,
                thesisImpact: {
                    driver: 'Alzheimer\'s drug uptake',
                    effect: 'validates',
                    severity: 'high'
                }
            }
        ],
        'META': [
            {
                source: 'Product Launch',
                headline: 'Reality Labs announces Quest 3S with 40% lower price point.',
                time: '2 hours ago (13:23:15)',
                icon: '🥽',
                impact: 'Medium',
                confidence: 82,
                thesisImpact: {
                    driver: 'Reality Labs losses narrowing',
                    effect: 'validates',
                    severity: 'medium'
                }
            },
            {
                source: 'Advertising Update',
                headline: 'Instagram Reels ad revenue run rate exceeds $15B annually.',
                time: '5 hours ago (10:23:15)',
                icon: '📱',
                impact: 'High',
                confidence: 88,
                thesisImpact: {
                    driver: 'Instagram Reels monetization >$10B run rate',
                    effect: 'validates',
                    severity: 'high'
                }
            }
        ],
        'PRME': [
            {
                source: 'Company Update',
                headline: 'No updates on clinical programs. Last readout was 14 months ago.',
                time: '1 day ago (15:23:15)',
                icon: '⏰',
                impact: 'Low',
                confidence: 95,
                thesisImpact: {
                    driver: 'Catalyst desert: No readouts >12 months',
                    effect: 'validates',
                    severity: 'high'
                }
            },
            {
                source: 'Financial Filing',
                headline: 'Cash runway estimated at 2.5 quarters based on current burn rate.',
                time: '3 days ago (09:15:30)',
                icon: '💰',
                impact: 'Medium',
                confidence: 90,
                thesisImpact: {
                    driver: 'Runway <3 quarters until dilution',
                    effect: 'validates',
                    severity: 'high'
                }
            },
            {
                source: 'Sector Analysis',
                headline: 'Trading at 15x premium to gene editing peers despite no near-term catalysts.',
                time: '1 week ago (16:45:22)',
                icon: '📊',
                impact: 'Medium',
                confidence: 85,
                thesisImpact: {
                    driver: 'Premium valuation vs gene editing peers',
                    effect: 'validates',
                    severity: 'medium'
                }
            }
        ]
    };
    
    return newsTemplates[position.ticker] || [
        {
            source: 'Market Update',
            headline: 'No significant news affecting thesis drivers at this time.',
            time: '1 hour ago (14:23:15)',
            icon: '📰',
            impact: 'Low',
            confidence: 50
        }
    ];
}

// Get position-specific actions
function getPositionActions(position) {
    const actionTemplates = {
        'MSFT': [
            {
                title: 'Trim 30% of Position',
                description: 'Reduce exposure by 30% due to Azure growth deceleration concerns.',
                urgency: 'medium',
                icon: '✂️'
            },
            {
                title: 'Set Stop Loss at $380',
                description: 'Implement stop loss at $380 to protect against further deterioration.',
                urgency: 'medium',
                icon: '🛑'
            }
        ],
        'NVDA': [
            {
                title: 'Add on Any Weakness',
                description: 'AI demand thesis intact. Supply constraints indicate pricing power.',
                urgency: 'low',
                icon: '📈'
            },
            {
                title: 'Sell AMD Against NVDA',
                description: 'Pair trade: Short AMD vs Long NVDA on competitive pressure.',
                urgency: 'medium',
                icon: '⚖️'
            }
        ],
        'TSLA': [
            {
                title: 'Trim 50% of Position',
                description: 'Multiple thesis drivers deteriorating. Auto margins under pressure.',
                urgency: 'medium',
                icon: '✂️'
            },
            {
                title: 'Buy Volatility Protection',
                description: 'Purchase straddles ahead of FSD/Robotaxi announcements.',
                urgency: 'high',
                icon: '🎯'
            }
        ],
        'BABA': [
            {
                title: 'Exit Position Completely',
                description: 'Regulatory overhang persists. Multiple thesis drivers broken.',
                urgency: 'high',
                icon: '🚪'
            },
            {
                title: 'Replace with GOOGL',
                description: 'Rotate into US tech with better regulatory clarity.',
                urgency: 'high',
                icon: '🔄'
            }
        ],
        'LLY': [
            {
                title: 'Add 25% to Position',
                description: 'GLP-1 demand exceeding supply. Manufacturing scaling well.',
                urgency: 'low',
                icon: '➕'
            },
            {
                title: 'Buy Call Spreads',
                description: 'Leverage donanemab approval upside with $600-650 call spreads.',
                urgency: 'low',
                icon: '📈'
            }
        ],
        'META': [
            {
                title: 'Trim 20% of Position',
                description: 'Reality Labs losses concern. Lock in gains from AI advertising.',
                urgency: 'medium',
                icon: '✂️'
            },
            {
                title: 'Hedge with QQQ Puts',
                description: 'Protect against big tech multiple compression.',
                urgency: 'medium',
                icon: '🛡️'
            }
        ],
        'PRME': [
            {
                title: 'Add 50% to Short',
                description: 'Catalyst desert continues. No clinical readouts for 14+ months.',
                urgency: 'low',
                icon: '📉'
            },
            {
                title: 'Buy Put Spreads',
                description: 'Leverage downside with $15-10 put spreads expiring Q2.',
                urgency: 'medium',
                icon: '💰'
            },
            {
                title: 'Set Cover Alert at $25',
                description: 'Cover short immediately if stock breaks above $25 on news.',
                urgency: 'high',
                icon: '⚠️'
            }
        ],
        'AMZN': [
            {
                title: 'Trim 25% of Position',
                description: 'AWS growth slowing. Retail margins under pressure.',
                urgency: 'medium',
                icon: '✂️'
            },
            {
                title: 'Hedge with Cloud ETF',
                description: 'Short SKYY ETF to hedge cloud exposure.',
                urgency: 'medium',
                icon: '🛡️'
            }
        ],
        'TSM': [
            {
                title: 'Add 30% to Position',
                description: 'AI chip demand accelerating. 3nm yields improving.',
                urgency: 'low',
                icon: '➕'
            },
            {
                title: 'Hedge Geopolitical Risk',
                description: 'Buy put protection against Taiwan invasion scenario.',
                urgency: 'medium',
                icon: '🛡️'
            }
        ],
        'COIN': [
            {
                title: 'Trim 40% of Position',
                description: 'Regulatory clarity improving but still uncertain.',
                urgency: 'medium',
                icon: '✂️'
            },
            {
                title: 'Hedge with Bitcoin Puts',
                description: 'Buy BTC puts to hedge crypto exposure.',
                urgency: 'high',
                icon: '🛡️'
            }
        ]
    };
    
    return actionTemplates[position.ticker] || [
        {
            title: 'Review Position Size',
            description: 'Evaluate current allocation vs conviction level.',
            urgency: 'low',
            icon: '📊'
        }
    ];
}

function closeSidePanel() {
    document.getElementById('sidePanel').classList.remove('active');
}

// Navigate to position from alert
function navigateToPosition(ticker) {
    // Find the position
    const position = positions.find(p => p.ticker === ticker);
    if (!position) return;
    
    // Show stock detail page
    showStockDetailPage(position);
}

// Real-time Simulation
function startRealTimeSimulation() {
    // Update prices and generate alerts periodically
    setInterval(() => {
        updatePositionPrices();
        if (Math.random() < 0.3) {
            generateNewAlert();
        }
    }, 5000);
    
    // Simulate thesis degradation
    setInterval(() => {
        if (Math.random() < 0.1) {
            degradeRandomThesis();
        }
    }, 15000);
}

function updatePositionPrices() {
    positions.forEach(position => {
        // Small price movements
        const change = (Math.random() - 0.5) * 2;
        position.dailyChange += change;
        position.currentPrice *= (1 + change / 100);
    });
    
    if (currentView === 'positions' || currentView === 'heatmap') {
        renderCurrentView();
    }
}

function generateNewAlert() {
    const position = positions[Math.floor(Math.random() * positions.length)];
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    const templates = {
        critical: [
            `Breaking: ${position.ticker} announces unexpected CEO departure. Stock down -5% in after-hours.`,
            `${position.ticker} misses Q4 revenue by 8%. Guidance withdrawn for FY2024.`,
            `Major competitor launches disruptive product targeting ${position.ticker}'s core market.`
        ],
        warning: [
            `${position.ticker} insider selling accelerates. CFO sells 50% of holdings.`,
            `Analyst downgrades ${position.ticker} from Buy to Hold citing valuation concerns.`,
            `${position.ticker} supplier reports component shortage may impact Q1 production.`
        ],
        info: [
            `${position.ticker} announces $2B share buyback program.`,
            `Positive mention of ${position.ticker} in Berkshire Hathaway letter.`,
            `${position.ticker} patent approved for next-gen technology.`
        ]
    };
    
    const message = templates[alertType][Math.floor(Math.random() * templates[alertType].length)];
    
    const newAlert = {
        id: Date.now(),
        ticker: position.ticker,
        type: alertType,
        message: message,
        drivers: [position.drivers[0].text],
        confidence: 70 + Math.random() * 30,
        source: ['Earnings Call', 'Breaking News', 'SEC Filing', 'Expert Network'][Math.floor(Math.random() * 4)],
        timestamp: new Date(),
        read: false
    };
    
    alerts.unshift(newAlert);
    
    // Update notification badge
    const badge = document.querySelector('.notification-badge');
    const unreadCount = alerts.filter(a => !a.read).length;
    badge.textContent = unreadCount;
    
    // Show toast notification
    showToast(`New alert: ${position.ticker} - ${alertType}`, alertType);
    
    if (currentView === 'alerts') {
        renderAlerts();
    }
}

function degradeRandomThesis() {
    const healthyPositions = positions.filter(p => p.status === 'healthy');
    if (healthyPositions.length === 0) return;
    
    const position = healthyPositions[Math.floor(Math.random() * healthyPositions.length)];
    const healthyDrivers = position.drivers.filter(d => d.status === 'healthy');
    
    if (healthyDrivers.length > 0) {
        const driver = healthyDrivers[Math.floor(Math.random() * healthyDrivers.length)];
        driver.health -= 20 + Math.random() * 30;
        
        if (driver.health < 30) {
            driver.status = 'critical';
        } else if (driver.health < 70) {
            driver.status = 'warning';
        }
        
        // Update position status
        const criticalCount = position.drivers.filter(d => d.status === 'critical').length;
        const warningCount = position.drivers.filter(d => d.status === 'warning').length;
        
        if (criticalCount >= 2) {
            position.status = 'critical';
        } else if (criticalCount >= 1 || warningCount >= 2) {
            position.status = 'warning';
        }
        
        generateNewAlert();
    }
}

// Utility Functions
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const timeString = date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    let relativeTime;
    if (seconds < 60) {
        relativeTime = `${seconds} seconds ago`;
    } else {
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            relativeTime = `${minutes} minutes ago`;
        } else {
            const hours = Math.floor(minutes / 60);
            if (hours < 24) {
                relativeTime = `${hours} hours ago`;
            } else {
                const days = Math.floor(hours / 24);
                relativeTime = `${days} days ago`;
            }
        }
    }
    
    return `${relativeTime} (${timeString})`;
}

function getAlertIcon(type) {
    const icons = {
        critical: '🚨',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || '📢';
}

function getActionIcon(type) {
    const icons = {
        exit: '🚪',
        trim: '✂️',
        hedge: '🛡️',
        add: '➕'
    };
    return icons[type] || '⚡';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${getAlertIcon(type)}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Filter handlers
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        const filterGroup = e.target.parentElement;
        filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        filterPositions(filter);
    }
});

function filterPositions(filter) {
    const cards = document.querySelectorAll('.position-card');
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const hasClass = card.classList.contains(filter) || 
                           (filter === 'at-risk' && card.classList.contains('critical')) ||
                           (filter === 'degrading' && card.classList.contains('warning'));
            card.style.display = hasClass ? 'block' : 'none';
        }
    });
}

// Stock Detail Page Functions
function initializeStockDetailPage() {
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        switchView('positions');
    });
}

function showStockDetailPage(position) {
    // Update header
    document.getElementById('stockTitle').textContent = position.ticker;
    document.getElementById('stockCompany').textContent = position.company;
    
    // Render stock detail content
    renderStockDetailContent(position);
    
    // Switch to stock detail view
    switchView('stock-detail');
}

function renderStockDetailContent(position) {
    const container = document.getElementById('stockDetailContent');
    const positionNews = getPositionNews(position);
    const positionActions = getPositionActions(position);
    
    const isShort = position.positionType === 'short';
    const changeClass = position.dailyChange >= 0 ? 'positive' : 'negative';
    const changePrefix = position.dailyChange >= 0 ? '+' : '';
    const shortChangeClass = isShort ? (position.dailyChange >= 0 ? 'negative' : 'positive') : changeClass;
    
    container.innerHTML = `
        <!-- Key Metrics -->
        <div class="stock-metrics">
            <div class="stock-metric">
                <div class="stock-metric-label">Position Size</div>
                <div class="stock-metric-value">${isShort ? '-' : ''}$${Math.abs(position.positionSize).toFixed(1)}M</div>
            </div>
            <div class="stock-metric">
                <div class="stock-metric-label">Daily Change</div>
                <div class="stock-metric-value ${shortChangeClass}">${changePrefix}${position.dailyChange.toFixed(2)}%</div>
            </div>
            <div class="stock-metric">
                <div class="stock-metric-label">Sector</div>
                <div class="stock-metric-value">${position.sector}</div>
            </div>
            <div class="stock-metric">
                <div class="stock-metric-label">Status</div>
                <div class="stock-metric-value ${position.status}">${position.status.toUpperCase()}</div>
            </div>
        </div>
        
        <!-- Thesis Drivers -->
        <div class="stock-section">
            <h3>${isShort ? 'Short Thesis Drivers' : 'Thesis Drivers'}</h3>
            ${position.drivers.map(driver => `
                <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="driver-indicator ${driver.status}"></span>
                            <span style="font-weight: 500;">${driver.text}</span>
                        </div>
                        <span class="text-${driver.status === 'healthy' ? 'success' : driver.status === 'warning' ? 'warning' : 'danger'}" style="font-size: 0.875rem;">
                            ${driver.health}%
                        </span>
                    </div>
                    <div style="height: 6px; background-color: var(--bg-primary); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${driver.health}%; background-color: ${driver.status === 'healthy' ? 'var(--accent-success)' : driver.status === 'warning' ? 'var(--accent-warning)' : 'var(--accent-danger)'};"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Risk Triggers -->
        <div class="stock-section">
            <h3>Risk Triggers</h3>
            ${position.triggers.map(trigger => `
                <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; ${trigger.triggered ? 'border: 1px solid var(--accent-danger);' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 500;">${trigger.text}</span>
                        <span class="${trigger.triggered ? 'text-danger' : 'text-muted'}" style="font-size: 0.875rem; font-weight: 500;">
                            ${trigger.triggered ? 'TRIGGERED' : 'MONITORING'}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Latest Intelligence -->
        <div class="stock-section stock-section-full">
            <h3>Latest Intelligence</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1rem;">
                ${positionNews.map(news => `
                    <div style="background-color: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1rem;">${news.icon}</span>
                                <span style="font-weight: 600; font-size: 0.875rem;">${news.source}</span>
                            </div>
                            <span style="color: var(--text-tertiary); font-size: 0.75rem;">${news.time}</span>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4;">
                            ${news.headline}
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <span style="background-color: var(--bg-card); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: var(--text-tertiary);">
                                Impact: ${news.impact}
                            </span>
                            <span style="background-color: var(--bg-card); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: var(--text-tertiary);">
                                Conf: ${news.confidence}%
                            </span>
                            ${news.thesisImpact ? `
                                <span style="background-color: ${news.thesisImpact.effect === 'validates' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${news.thesisImpact.effect === 'validates' ? 'var(--accent-success)' : 'var(--accent-danger)'}; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;">
                                    ${news.thesisImpact.effect === 'validates' ? '✓' : '✗'} ${news.thesisImpact.driver}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Recommended Actions -->
        <div class="stock-section stock-section-full">
            <h3>Recommended Actions</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1rem;">
                ${positionActions.map(action => `
                    <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: 0.5rem; ${action.urgency === 'high' ? 'border-left: 4px solid var(--accent-danger);' : action.urgency === 'medium' ? 'border-left: 4px solid var(--accent-warning);' : 'border-left: 4px solid var(--accent-success);'}">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.25rem;">${action.icon}</span>
                                <span style="font-weight: 600; font-size: 1rem;">${action.title}</span>
                            </div>
                            <span style="color: var(--text-tertiary); font-size: 0.75rem; text-transform: uppercase; font-weight: 500;">${action.urgency}</span>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4;">
                            ${action.description}
                        </div>
                        <div style="display: flex; gap: 0.75rem;">
                            <button style="background-color: var(--accent-primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                                Execute
                            </button>
                            <button style="background-color: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-color); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;">
                                Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Add CSS animation for pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);