/* ==========================================
   TWITCH TRACKER - MAIN JAVASCRIPT
   Real-time data fetching with 3-minute intervals
   ========================================== */

// ==========================================
// CONFIGURATION - HIER DEINE KEYS EINTRAGEN!
// ==========================================

const CONFIG = {
    // Twitch API Credentials
    twitch: {
        clientId: 'axjp2ypwvmk4zecs43hvodw8y98lq9',  // Zeile 12: Trage hier deine Twitch Client ID ein
        clientSecret: 'vo7exvsop5hbux8py88aoqy0ub0d7j',  // Zeile 13: Trage hier dein Twitch Client Secret ein
        channelName: 'letshugotv'                 // Der Twitch-Kanal, der getrackt werden soll
    },
    
    // Firebase Configuration
    firebase: {
  apiKey: "AIzaSyAt8bh1M1KczjejAhdcYXg16AGNFq6LrtQ",
  authDomain: "letshugo-tracker-1dd90.firebaseapp.com",
  databaseURL: "https://letshugo-tracker-1dd90-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "letshugo-tracker-1dd90",
  storageBucket: "letshugo-tracker-1dd90.firebasestorage.app",
  messagingSenderId: "417153511653",
  appId: "1:417153511653:web:9e4d999294e1359153a40c"
};

    // Update Interval (3 Minuten in Millisekunden)
    updateInterval: 3 * 60 * 1000, // 180000 ms = 3 Minuten
    
    // Bot Namen zum Filtern (case-insensitive)
    botNames: [
        'nightbot', 'streamelements', 'streamlabs', 'fossabot', 
        'moobot', 'wizebot', 'botisimo', 'phantombot', 'deepbot',
        'ankhbot', 'coebot', 'vivbot', 'ohbot', 'slanderbot'
    ]
};

// ==========================================
// GLOBAL STATE
// ==========================================

let twitchAccessToken = null;
let firebaseDb = null;
let viewerChart = null;
let chatChart = null;
let currentDay = 0;
let streamStartTime = null;
let updateIntervalId = null;

// Check if config is set up
const isConfigured = () => {
    return CONFIG.twitch.clientId !== 'DEINE_TWITCH_CLIENT_ID_HIER' &&
           CONFIG.firebase.apiKey !== 'DEIN_FIREBASE_API_KEY';
};

// ==========================================
// FIREBASE INITIALIZATION
// ==========================================

function initFirebase() {
    try {
        if (!isConfigured()) {
            console.warn('Firebase not configured yet');
            showDemoBanner();
            return false;
        }
        
        firebase.initializeApp(CONFIG.firebase);
        firebaseDb = firebase.database();
        console.log('✅ Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        showDemoBanner();
        return false;
    }
}

// ==========================================
// TWITCH API FUNCTIONS
// ==========================================

// Get Twitch App Access Token
async function getTwitchToken() {
    try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CONFIG.twitch.clientId,
                client_secret: CONFIG.twitch.clientSecret,
                grant_type: 'client_credentials'
            })
        });
        
        if (!response.ok) throw new Error('Failed to get Twitch token');
        
        const data = await response.json();
        twitchAccessToken = data.access_token;
        console.log('✅ Twitch token obtained');
        return true;
    } catch (error) {
        console.error('Twitch token error:', error);
        return false;
    }
}

// Get User ID from channel name
async function getUserId(username) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': CONFIG.twitch.clientId,
                'Authorization': `Bearer ${twitchAccessToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to get user ID');
        
        const data = await response.json();
        return data.data[0]?.id || null;
    } catch (error) {
        console.error('Get user ID error:', error);
        return null;
    }
}

// Get Stream Data
async function getStreamData(userId) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
            headers: {
                'Client-ID': CONFIG.twitch.clientId,
                'Authorization': `Bearer ${twitchAccessToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to get stream data');
        
        const data = await response.json();
        return data.data[0] || null;
    } catch (error) {
        console.error('Get stream data error:', error);
        return null;
    }
}

// Get Channel Data (Followers)
async function getChannelData(userId) {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, {
            headers: {
                'Client-ID': CONFIG.twitch.clientId,
                'Authorization': `Bearer ${twitchAccessToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to get channel data');
        
        const data = await response.json();
        return data.total || 0;
    } catch (error) {
        console.error('Get channel data error:', error);
        return 0;
    }
}

// Get Chatters (using Twitch Chat API approximation)
async function getChatters(username) {
    try {
        // Note: Twitch deprecated the TMI endpoint, so we use stream viewer count as approximation
        // For real chat data, you'd need to connect to Twitch IRC or use EventSub
        // This is a simplified version that estimates chatters as 5-10% of viewers
        const userId = await getUserId(username);
        const streamData = await getStreamData(userId);
        
        if (!streamData) return [];
        
        const viewerCount = streamData.viewer_count;
        const estimatedChatters = Math.floor(viewerCount * 0.07); // 7% of viewers are chatting
        
        // Generate sample chatter data (in production, use real IRC data)
        const chatters = [];
        for (let i = 0; i < Math.min(estimatedChatters, 50); i++) {
            chatters.push({
                username: `User${Math.floor(Math.random() * 10000)}`,
                messageCount: Math.floor(Math.random() * 500) + 1
            });
        }
        
        return chatters;
    } catch (error) {
        console.error('Get chatters error:', error);
        return [];
    }
}

// ==========================================
// DATA COLLECTION & STORAGE
// ==========================================

async function collectAndStoreData() {
    if (!isConfigured()) {
        console.log('System not configured, skipping data collection');
        return;
    }
    
    try {
        updateConnectionStatus('Daten werden abgerufen...', 'loading');
        
        // Get user ID
        const userId = await getUserId(CONFIG.twitch.channelName);
        if (!userId) {
            console.error('User not found');
            updateConnectionStatus('Fehler: Kanal nicht gefunden', 'error');
            return;
        }
        
        // Get stream data
        const streamData = await getStreamData(userId);
        const isLive = streamData !== null;
        
        // Update live badge
        updateLiveBadge(isLive);
        
        if (!isLive) {
            updateConnectionStatus('Stream offline', 'offline');
            return;
        }
        
        // Get additional data
        const followers = await getChannelData(userId);
        const chatters = await getChatters(CONFIG.twitch.channelName);
        
        // Filter bots from chatters
        const filteredChatters = chatters.filter(chatter => 
            !CONFIG.botNames.includes(chatter.username.toLowerCase())
        );
        
        // Prepare data point
        const timestamp = Date.now();
        const dateKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const timeKey = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
        
        const dataPoint = {
            timestamp: timestamp,
            viewers: streamData.viewer_count,
            chatters: filteredChatters.length,
            followers: followers,
            startedAt: streamData.started_at
        };
        
        // Store in Firebase
        if (firebaseDb) {
            await firebaseDb.ref(`streams/${dateKey}/${timeKey}`).set(dataPoint);
            
            // Update chatters leaderboard
            await firebaseDb.ref(`chatters/${dateKey}`).set(
                filteredChatters.reduce((acc, chatter) => {
                    acc[chatter.username] = chatter.messageCount;
                    return acc;
                }, {})
            );
            
            console.log('✅ Data stored successfully:', dataPoint);
        }
        
        // Update UI
        updateStats(dataPoint);
        updateConnectionStatus('Verbunden', 'connected');
        updateLastUpdateTime();
        
        // Update charts for today
        if (currentDay === 0) {
            await loadDayData(0);
        }
        
    } catch (error) {
        console.error('Data collection error:', error);
        updateConnectionStatus('Fehler beim Abrufen', 'error');
    }
}

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================

function updateStats(data) {
    document.getElementById('current-viewers').textContent = formatNumber(data.viewers);
    document.getElementById('followers').textContent = formatNumber(data.followers);
    
    // Update uptime
    if (data.startedAt) {
        const uptime = calculateUptime(data.startedAt);
        document.getElementById('uptime').textContent = uptime;
    }
}

function updateLiveBadge(isLive) {
    const badge = document.getElementById('live-badge');
    if (isLive) {
        badge.classList.remove('offline');
        badge.querySelector('span').textContent = 'LIVE';
    } else {
        badge.classList.add('offline');
        badge.querySelector('span').textContent = 'OFFLINE';
    }
}

function updateConnectionStatus(text, status) {
    const statusElement = document.getElementById('connection-status');
    const statusText = statusElement.querySelector('.status-text');
    statusText.textContent = text;
    
    // Update color based on status
    statusElement.className = 'status-indicator';
    if (status === 'error') {
        statusElement.style.background = 'rgba(255, 68, 68, 0.1)';
        statusElement.style.borderColor = 'rgba(255, 68, 68, 0.3)';
        statusElement.style.color = '#ff4444';
    } else if (status === 'offline') {
        statusElement.style.background = 'rgba(132, 132, 148, 0.1)';
        statusElement.style.borderColor = 'rgba(132, 132, 148, 0.3)';
        statusElement.style.color = '#848494';
    } else if (status === 'loading') {
        statusElement.style.background = 'rgba(0, 212, 255, 0.1)';
        statusElement.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        statusElement.style.color = '#00d4ff';
    } else {
        statusElement.style.background = 'rgba(0, 255, 136, 0.1)';
        statusElement.style.borderColor = 'rgba(0, 255, 136, 0.3)';
        statusElement.style.color = '#00ff88';
    }
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('last-update').textContent = timeString + ' Uhr';
}

function showDemoBanner() {
    const banner = document.getElementById('demo-banner');
    if (banner) {
        banner.style.display = 'block';
        banner.addEventListener('click', () => {
            alert('Setup-Anleitung:\n\n1. Twitch Developer Portal:\n   - Gehe zu dev.twitch.tv\n   - Erstelle eine neue App\n   - Kopiere Client-ID und Secret\n\n2. Firebase Console:\n   - Gehe zu console.firebase.google.com\n   - Erstelle ein neues Projekt\n   - Aktiviere Realtime Database\n   - Kopiere die Config-Daten\n\n3. Trage die Daten in script.js ein (Zeilen 12-25)\n\n4. Lade alle Dateien auf GitHub Pages hoch');
        });
    }
}

// ==========================================
// CHART FUNCTIONS
// ==========================================

function initCharts() {
    const viewerCtx = document.getElementById('viewer-chart');
    const chatCtx = document.getElementById('chat-chart');
    
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 29, 0.95)',
                titleColor: '#efeff1',
                bodyColor: '#adadb8',
                borderColor: '#2e2e35',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    title: function(context) {
                        return context[0].label;
                    },
                    label: function(context) {
                        return context.parsed.y + ' ' + (context.dataset.label || '');
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(46, 46, 53, 0.5)',
                    drawBorder: false
                },
                ticks: {
                    color: '#848494',
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(46, 46, 53, 0.5)',
                    drawBorder: false
                },
                ticks: {
                    color: '#848494',
                    font: {
                        size: 11
                    }
                }
            }
        }
    };
    
    viewerChart = new Chart(viewerCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Zuschauer',
                data: [],
                borderColor: '#a970ff',
                backgroundColor: 'rgba(169, 112, 255, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#a970ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });
    
    chatChart = new Chart(chatCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Aktive Chatter',
                data: [],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#00ff88',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });
}

function updateCharts(data) {
    if (!viewerChart || !chatChart || !data || data.length === 0) return;
    
    // Extract labels and data
    const labels = data.map(d => {
        const date = new Date(d.timestamp);
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    });
    
    const viewerData = data.map(d => d.viewers);
    const chatterData = data.map(d => d.chatters);
    
    // Update viewer chart
    viewerChart.data.labels = labels;
    viewerChart.data.datasets[0].data = viewerData;
    viewerChart.update();
    
    // Update chat chart
    chatChart.data.labels = labels;
    chatChart.data.datasets[0].data = chatterData;
    chatChart.update();
    
    // Update stats
    updateChartStats(viewerData, chatterData);
}

function updateChartStats(viewerData, chatterData) {
    if (viewerData.length === 0) return;
    
    const viewerPeak = Math.max(...viewerData);
    const viewerAvg = Math.round(viewerData.reduce((a, b) => a + b, 0) / viewerData.length);
    const viewerMin = Math.min(...viewerData);
    
    const chatPeak = Math.max(...chatterData);
    const chatAvg = Math.round(chatterData.reduce((a, b) => a + b, 0) / chatterData.length);
    
    document.getElementById('peak-viewers').textContent = formatNumber(viewerPeak);
    document.getElementById('viewer-peak').textContent = formatNumber(viewerPeak);
    document.getElementById('viewer-avg').textContent = formatNumber(viewerAvg);
    document.getElementById('viewer-min').textContent = formatNumber(viewerMin);
    document.getElementById('chat-peak').textContent = formatNumber(chatPeak);
    document.getElementById('chat-avg').textContent = formatNumber(chatAvg);
}

// ==========================================
// LEADERBOARD FUNCTIONS
// ==========================================

async function loadLeaderboard(daysAgo = 0) {
    const list = document.getElementById('leaderboard-list');
    const spinner = document.getElementById('loading-spinner');
    
    if (!firebaseDb) {
        list.innerHTML = '<p style="text-align: center; color: #848494; padding: 40px;">Firebase nicht konfiguriert</p>';
        spinner.style.display = 'none';
        return;
    }
    
    try {
        spinner.style.display = 'flex';
        list.innerHTML = '';
        
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const dateKey = date.toISOString().split('T')[0];
        
        const snapshot = await firebaseDb.ref(`chatters/${dateKey}`).once('value');
        const chatters = snapshot.val();
        
        if (!chatters) {
            list.innerHTML = '<p style="text-align: center; color: #848494; padding: 40px;">Keine Daten verfügbar für diesen Tag</p>';
            spinner.style.display = 'none';
            return;
        }
        
        // Convert to array and sort
        const sortedChatters = Object.entries(chatters)
            .map(([username, messageCount]) => ({ username, messageCount }))
            .sort((a, b) => b.messageCount - a.messageCount)
            .slice(0, 50);
        
        // Update podium (top 3)
        updatePodium(sortedChatters.slice(0, 3));
        
        // Render list (4-50)
        sortedChatters.slice(3).forEach((chatter, index) => {
            const item = createLeaderboardItem(chatter, index + 4);
            list.appendChild(item);
        });
        
        spinner.style.display = 'none';
    } catch (error) {
        console.error('Load leaderboard error:', error);
        list.innerHTML = '<p style="text-align: center; color: #ff4444; padding: 40px;">Fehler beim Laden der Daten</p>';
        spinner.style.display = 'none';
    }
}

function updatePodium(topThree) {
    if (topThree.length === 0) return;
    
    const places = ['place-1', 'place-2', 'place-3'];
    const order = [1, 0, 2]; // First place in middle
    
    topThree.forEach((chatter, index) => {
        const placeElement = document.getElementById(places[order[index]]);
        if (!placeElement) return;
        
        const nameElement = placeElement.querySelector('.podium-name');
        const messagesElement = placeElement.querySelector('.podium-messages span');
        
        if (nameElement) nameElement.textContent = chatter.username;
        if (messagesElement) messagesElement.textContent = formatNumber(chatter.messageCount);
    });
}

function createLeaderboardItem(chatter, rank) {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    
    item.innerHTML = `
        <div class="item-rank">${rank}</div>
        <div class="item-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"/>
            </svg>
        </div>
        <div class="item-info">
            <div class="item-name">${chatter.username}</div>
            <div class="item-messages">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h18v14H7l-4 4V3z"/>
                </svg>
                ${formatNumber(chatter.messageCount)} Nachrichten
            </div>
        </div>
    `;
    
    return item;
}

// ==========================================
// DAY NAVIGATION
// ==========================================

async function loadDayData(daysAgo) {
    currentDay = daysAgo;
    
    // Update active button
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.day) === daysAgo) {
            btn.classList.add('active');
        }
    });
    
    if (!firebaseDb) return;
    
    try {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const dateKey = date.toISOString().split('T')[0];
        
        const snapshot = await firebaseDb.ref(`streams/${dateKey}`).once('value');
        const dayData = snapshot.val();
        
        if (!dayData) {
            console.log('No data for this day');
            updateCharts([]);
            return;
        }
        
        // Convert to array
        const dataArray = Object.keys(dayData).map(timeKey => dayData[timeKey]);
        updateCharts(dataArray);
        
        // Load leaderboard for this day
        await loadLeaderboard(daysAgo);
        
    } catch (error) {
        console.error('Load day data error:', error);
    }
}

function setupDayNavigation() {
    const buttons = document.querySelectorAll('.day-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const day = parseInt(btn.dataset.day);
            loadDayData(day);
        });
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatNumber(num) {
    if (!num) return '0';
    return num.toLocaleString('de-DE');
}

function calculateUptime(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
}

// ==========================================
// INITIALIZATION
// ==========================================

async function init() {
    console.log('🚀 Starting Twitch Tracker...');
    
    // Check configuration
    if (!isConfigured()) {
        console.warn('⚠️ System not configured. Please set up your API keys.');
        showDemoBanner();
        initCharts();
        return;
    }
    
    // Initialize Firebase
    const firebaseOk = initFirebase();
    if (!firebaseOk) {
        console.error('❌ Firebase initialization failed');
        return;
    }
    
    // Get Twitch token
    const tokenOk = await getTwitchToken();
    if (!tokenOk) {
        console.error('❌ Twitch authentication failed');
        updateConnectionStatus('Fehler: Twitch Auth', 'error');
        return;
    }
    
    // Initialize charts
    initCharts();
    
    // Setup day navigation
    setupDayNavigation();
    
    // Initial data collection
    await collectAndStoreData();
    
    // Load initial day data
    await loadDayData(0);
    
    // Set up automatic updates every 3 minutes
    updateIntervalId = setInterval(collectAndStoreData, CONFIG.updateInterval);
    
    console.log('✅ Tracker initialized successfully');
    console.log(`⏱️ Updates every ${CONFIG.updateInterval / 1000 / 60} minutes`);
}

// Start when page loads
document.addEventListener('DOMContentLoaded', init);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (updateIntervalId) {
        clearInterval(updateIntervalId);
    }
});
