// ============================================
// KONFIGURATION - HIER DEINE KEYS EINTRAGEN!
// ============================================

const CONFIG = {
    // Twitch API Konfiguration
    twitch: {
        clientId: 'axjp2ypwvmk4zecs43hvodw8y98lq9',      // Ersetze mit deiner Twitch Client ID
        clientSecret: 'foiivfx53oijq0ieusqh6a4sci8jnh',       // Ersetze mit deinem Twitch Client Secret
        channelName: 'letshugotv'               // Dein Twitch Kanal Name
    },
    
    // Firebase Konfiguration
    firebase: {
  apiKey: "AIzaSyAt8bh1M1KczjejAhdcYXg16AGNFq6LrtQ",
  authDomain: "letshugo-tracker-1dd90.firebaseapp.com",
  databaseURL: "https://letshugo-tracker-1dd90-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "letshugo-tracker-1dd90",
  storageBucket: "letshugo-tracker-1dd90.firebasestorage.app",
  messagingSenderId: "417153511653",
  appId: "1:417153511653:web:9e4d999294e1359153a40c"
};
    
    // Tracking Intervall (10 Minuten in Millisekunden)
    updateInterval: 10 * 60 * 1000  // 10 Minuten
};

// Bot-Liste (werden im Chat ignoriert)
const BOTS = [
    'fossabot', 'nightbot', 'streamelements', 'moobot', 
    'streamlabs', 'wizebot', 'ankhbot', 'botisimo',
    'phantombot', 'cloudbot', 'coebot', 'deepbot'
];

// ============================================
// FIREBASE INITIALISIERUNG
// ============================================

let db = null;
let twitchAccessToken = null;

function initFirebase() {
    try {
        firebase.initializeApp(CONFIG.firebase);
        db = firebase.database();
        console.log('✅ Firebase initialisiert');
        return true;
    } catch (error) {
        console.error('❌ Firebase Fehler:', error);
        showError('Firebase konnte nicht initialisiert werden. Prüfe deine Konfiguration!');
        return false;
    }
}

// ============================================
// TWITCH API
// ============================================

async function getTwitchAccessToken() {
    try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: CONFIG.twitch.clientId,
                client_secret: CONFIG.twitch.clientSecret,
                grant_type: 'client_credentials'
            })
        });
        
        const data = await response.json();
        if (data.access_token) {
            twitchAccessToken = data.access_token;
            console.log('✅ Twitch Token erhalten');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Twitch Token Fehler:', error);
        return false;
    }
}

async function getTwitchData() {
    if (!twitchAccessToken) {
        await getTwitchAccessToken();
    }
    
    try {
        // Channel Info
        const userResponse = await fetch(
            `https://api.twitch.tv/helix/users?login=${CONFIG.twitch.channelName}`,
            {
                headers: {
                    'Client-ID': CONFIG.twitch.clientId,
                    'Authorization': `Bearer ${twitchAccessToken}`
                }
            }
        );
        
        const userData = await userResponse.json();
        if (!userData.data || userData.data.length === 0) {
            throw new Error('Channel nicht gefunden');
        }
        
        const user = userData.data[0];
        const userId = user.id;
        
        // Stream Info
        const streamResponse = await fetch(
            `https://api.twitch.tv/helix/streams?user_id=${userId}`,
            {
                headers: {
                    'Client-ID': CONFIG.twitch.clientId,
                    'Authorization': `Bearer ${twitchAccessToken}`
                }
            }
        );
        
        const streamData = await streamResponse.json();
        const isLive = streamData.data && streamData.data.length > 0;
        
        // Followers
        const followersResponse = await fetch(
            `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`,
            {
                headers: {
                    'Client-ID': CONFIG.twitch.clientId,
                    'Authorization': `Bearer ${twitchAccessToken}`
                }
            }
        );
        
        const followersData = await followersResponse.json();
        
        return {
            isLive: isLive,
            viewerCount: isLive ? streamData.data[0].viewer_count : 0,
            title: isLive ? streamData.data[0].title : '',
            gameName: isLive ? streamData.data[0].game_name : '',
            startedAt: isLive ? streamData.data[0].started_at : null,
            profileImageUrl: user.profile_image_url,
            followers: followersData.total || 0,
            userId: userId
        };
    } catch (error) {
        console.error('❌ Twitch API Fehler:', error);
        return null;
    }
}

// ============================================
// CHAT ANALYSE (TMI.js wird nicht verwendet - Vereinfachte Version)
// ============================================

async function getChatData() {
    // Simulierte Chat-Daten für Demo
    // In der echten Version würde hier TMI.js oder eine andere Chat-Library verwendet
    const activeChatter = Math.floor(Math.random() * 50) + 30;
    
    return {
        activeChatter: activeChatter,
        messages: generateDemoChatterData()
    };
}

function generateDemoChatterData() {
    const names = [
        'CoolGamer2024', 'StreamFan99', 'xXDragonSlayerXx', 'NightOwl_DE',
        'LuckyCharm42', 'ShadowHunter', 'PixelWarrior', 'GameMaster5000',
        'ChillVibes123', 'StarGazer_', 'ThunderBolt88', 'SunRise2024',
        'MoonWalker_', 'FireStorm777', 'DarkKnight_DE', 'IceQueen_GG',
        'LightBringer', 'TigerClaw', 'EagleEye99', 'LionHeart_',
        'PhoenixRise', 'GriffinWing', 'FoxTrot_GG', 'WolfPack_',
        'BearHug123', 'SnakeEyes_', 'UnicornMagic', 'DragonFire',
        'MedusaGaze', 'HydraHead', 'CobraStrike', 'FalconFlyer',
        'RavenWing', 'OwlWatcher', 'HawkEye777', 'SparrowSong',
        'DoveOfPeace', 'CrowQuest', 'PeacockFan', 'SwanGrace',
        'FlamingoVibes', 'PenguinWalk', 'OstrichRun', 'ParrotTalk',
        'ToucanSam99', 'HummingBee', 'CanaryYellow', 'JayBird123',
        'CardinalRed', 'BlueJay99', 'RobinHood88'
    ];
    
    const chatterData = {};
    names.forEach((name, index) => {
        chatterData[name] = Math.floor(Math.random() * 300) + 200 - index * 2;
    });
    
    return chatterData;
}

// ============================================
// DATENBANK FUNKTIONEN
// ============================================

async function saveToDatabase(data) {
    if (!db) return;
    
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    
    try {
        // Zuschauerdaten speichern
        await db.ref(`viewerData/${today}/${timestamp}`).set({
            viewers: data.viewerCount,
            timestamp: timestamp
        });
        
        // Chat-Daten speichern
        await db.ref(`chatData/${today}/${timestamp}`).set({
            activeChatter: data.chatData.activeChatter,
            timestamp: timestamp
        });
        
        // Chatter Leaderboard aktualisieren
        const currentLeaderboard = (await db.ref(`leaderboard/${today}`).once('value')).val() || {};
        
        Object.keys(data.chatData.messages).forEach(username => {
            const count = data.chatData.messages[username];
            currentLeaderboard[username] = (currentLeaderboard[username] || 0) + count;
        });
        
        await db.ref(`leaderboard/${today}`).set(currentLeaderboard);
        
        // Stream Info aktualisieren
        await db.ref('streamInfo').set({
            isLive: data.isLive,
            title: data.title,
            game: data.gameName,
            startedAt: data.startedAt,
            profileImage: data.profileImageUrl,
            followers: data.followers,
            lastUpdate: timestamp
        });
        
        console.log('✅ Daten gespeichert');
    } catch (error) {
        console.error('❌ Datenbank Fehler:', error);
    }
}

async function loadFromDatabase(daysAgo = 0) {
    if (!db) return null;
    
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
        const viewerSnapshot = await db.ref(`viewerData/${dateStr}`).once('value');
        const chatSnapshot = await db.ref(`chatData/${dateStr}`).once('value');
        const leaderboardSnapshot = await db.ref(`leaderboard/${dateStr}`).once('value');
        const streamInfoSnapshot = await db.ref('streamInfo').once('value');
        
        return {
            viewerData: viewerSnapshot.val() || {},
            chatData: chatSnapshot.val() || {},
            leaderboard: leaderboardSnapshot.val() || {},
            streamInfo: streamInfoSnapshot.val() || {}
        };
    } catch (error) {
        console.error('❌ Datenbank Ladefehler:', error);
        return null;
    }
}

// ============================================
// UI UPDATE FUNKTIONEN
// ============================================

function updateUI(data) {
    if (!data) return;
    
    const { viewerData, chatData, leaderboard, streamInfo } = data;
    
    // Stream Status
    if (streamInfo.profileImage) {
        document.getElementById('profileImage').src = streamInfo.profileImage;
    }
    
    if (streamInfo.isLive) {
        document.getElementById('liveBadge').style.display = 'block';
        document.getElementById('gameTitle').textContent = streamInfo.game || 'League of Legends';
        document.getElementById('streamTitle').textContent = streamInfo.title || '';
    } else {
        document.getElementById('liveBadge').style.display = 'none';
    }
    
    // Follower
    document.getElementById('followers').textContent = formatNumber(streamInfo.followers);
    
    // Viewer Statistiken berechnen
    const viewerValues = Object.values(viewerData).map(d => d.viewers);
    if (viewerValues.length > 0) {
        const currentViewers = viewerValues[viewerValues.length - 1];
        const peakViewers = Math.max(...viewerValues);
        const minViewers = Math.min(...viewerValues);
        const avgViewers = Math.floor(viewerValues.reduce((a, b) => a + b, 0) / viewerValues.length);
        
        document.getElementById('currentViewers').textContent = formatNumber(currentViewers);
        document.getElementById('peakViewers').textContent = formatNumber(peakViewers);
        document.getElementById('chartPeak').textContent = formatNumber(peakViewers);
        document.getElementById('chartAvg').textContent = formatNumber(avgViewers);
        document.getElementById('chartMin').textContent = formatNumber(minViewers);
    }
    
    // Uptime berechnen
    if (streamInfo.startedAt) {
        const uptime = calculateUptime(streamInfo.startedAt);
        document.getElementById('uptime').textContent = uptime;
    }
    
    // Chat Statistiken
    const chatValues = Object.values(chatData).map(d => d.activeChatter);
    if (chatValues.length > 0) {
        const peakChat = Math.max(...chatValues);
        const avgChat = Math.floor(chatValues.reduce((a, b) => a + b, 0) / chatValues.length);
        
        document.getElementById('chatPeak').textContent = peakChat;
        document.getElementById('chatAvg').textContent = avgChat;
    }
    
    // Charts aktualisieren
    updateViewerChart(viewerData);
    updateChatChart(chatData);
    
    // Leaderboard aktualisieren
    updateLeaderboard(leaderboard);
    
    // Last Update
    document.getElementById('lastUpdate').textContent = 'Gerade eben';
}

function updateViewerChart(viewerData) {
    const ctx = document.getElementById('viewerChart');
    if (!ctx) return;
    
    const timestamps = Object.keys(viewerData).sort();
    const values = timestamps.map(t => viewerData[t].viewers);
    const labels = timestamps.map(t => {
        const date = new Date(parseInt(t));
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    });
    
    // Chart zerstören falls vorhanden
    if (window.viewerChartInstance) {
        window.viewerChartInstance.destroy();
    }
    
    window.viewerChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Zuschauer',
                data: values,
                borderColor: '#a78bfa',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#a78bfa',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 27, 58, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0a0b8',
                    borderColor: 'rgba(167, 139, 250, 0.2)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return formatNumber(context.parsed.y) + ' Zuschauer';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(167, 139, 250, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b6b8a',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b6b8a',
                        font: {
                            size: 11
                        },
                        maxRotation: 0
                    }
                }
            }
        }
    });
}

function updateChatChart(chatData) {
    const ctx = document.getElementById('chatChart');
    if (!ctx) return;
    
    const timestamps = Object.keys(chatData).sort();
    const values = timestamps.map(t => chatData[t].activeChatter);
    const labels = timestamps.map(t => {
        const date = new Date(parseInt(t));
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    });
    
    // Chart zerstören falls vorhanden
    if (window.chatChartInstance) {
        window.chatChartInstance.destroy();
    }
    
    window.chatChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Aktive Chatter',
                data: values,
                borderColor: '#a78bfa',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#a78bfa',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 27, 58, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#a0a0b8',
                    borderColor: 'rgba(167, 139, 250, 0.2)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' aktive Chatter';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(167, 139, 250, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b6b8a',
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b6b8a',
                        font: {
                            size: 11
                        },
                        maxRotation: 0
                    }
                }
            }
        }
    });
}

function updateLeaderboard(leaderboard) {
    // Sortieren nach Nachrichtenanzahl
    const sorted = Object.entries(leaderboard)
        .filter(([name]) => !BOTS.includes(name.toLowerCase()))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50);
    
    if (sorted.length === 0) return;
    
    // Top 3 aktualisieren
    if (sorted[0]) {
        document.getElementById('chatter1').textContent = sorted[0][0];
        document.getElementById('count1').textContent = sorted[0][1];
    }
    if (sorted[1]) {
        document.getElementById('chatter2').textContent = sorted[1][0];
        document.getElementById('count2').textContent = sorted[1][1];
    }
    if (sorted[2]) {
        document.getElementById('chatter3').textContent = sorted[2][0];
        document.getElementById('count3').textContent = sorted[2][1];
    }
    
    // Restliche Liste (4-50)
    const listHtml = sorted.slice(3).map(([name, count], index) => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">${index + 4}</div>
            <div class="leaderboard-name">${name}</div>
            <div class="leaderboard-count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
                </svg>
                ${count}
            </div>
        </div>
    `).join('');
    
    document.getElementById('leaderboardList').innerHTML = listHtml;
}

// ============================================
// HILFSFUNKTIONEN
// ============================================

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calculateUptime(startedAt) {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = now - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showError(message) {
    console.error(message);
    alert(message);
}

// ============================================
// HAUPTFUNKTION
// ============================================

async function trackStream() {
    console.log('🔄 Tracking gestartet...');
    
    const twitchData = await getTwitchData();
    if (!twitchData) {
        console.error('Keine Twitch Daten erhalten');
        return;
    }
    
    const chatData = await getChatData();
    
    const data = {
        ...twitchData,
        chatData: chatData
    };
    
    await saveToDatabase(data);
    
    // UI aktualisieren
    const loadedData = await loadFromDatabase(0);
    updateUI(loadedData);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 App wird gestartet...');
    
    // Firebase initialisieren
    if (!initFirebase()) {
        return;
    }
    
    // Initiales Laden
    const data = await loadFromDatabase(0);
    if (data) {
        updateUI(data);
    }
    
    // Day Buttons
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const daysAgo = parseInt(e.target.dataset.day);
            const data = await loadFromDatabase(daysAgo);
            if (data) {
                updateUI(data);
            }
        });
    });
    
    // Tracking starten (nur wenn konfiguriert)
    if (CONFIG.twitch.clientId !== 'DEINE_CLIENT_ID_HIER') {
        await trackStream();
        
        // Automatisches Update alle 10 Minuten
        setInterval(trackStream, CONFIG.updateInterval);
    } else {
        console.warn('⚠️ Keine Twitch Konfiguration gefunden. Bitte CONFIG anpassen!');
    }
});
