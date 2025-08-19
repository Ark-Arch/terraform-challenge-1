// Game State
let gameState = {
    currentPage: 'start-screen',
    character: null,
    choices: [],
    unlockedEndings: [],
    audioEnabled: true,
    progress: 0
};

// Audio Context
let audioContext;
let isAudioInitialized = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    createParticles();
    setupKeyboardNavigation();
});

function initializeApp() {
    // Initialize audio context on first user interaction
    document.addEventListener('click', initializeAudio, { once: true });
    
    // Add magic sparkles to the start screen
    addMagicSparkles();
    
    // Start ambient animations
    animateBackground();
    
    console.log('🎮 Enchanted Realm Adventure Initialized!');
}

function initializeAudio() {
    if (!isAudioInitialized) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isAudioInitialized = true;
        
        // Play subtle ambient sound
        if (gameState.audioEnabled) {
            playAmbientSound();
        }
    }
}

function playAmbientSound() {
    const ambientAudio = document.getElementById('ambient-sound');
    if (ambientAudio && gameState.audioEnabled) {
        ambientAudio.volume = 0.3;
        ambientAudio.play().catch(e => console.log('Audio play prevented:', e));
    }
}

function toggleAudio() {
    gameState.audioEnabled = !gameState.audioEnabled;
    const audioIcon = document.getElementById('audio-icon');
    const ambientAudio = document.getElementById('ambient-sound');
    
    if (gameState.audioEnabled) {
        audioIcon.textContent = '🔊';
        playAmbientSound();
        playSound('toggle');
    } else {
        audioIcon.textContent = '🔇';
        if (ambientAudio) {
            ambientAudio.pause();
        }
    }
}

function playSound(type) {
    if (!gameState.audioEnabled || !audioContext) return;
    
    // Create simple sound effects using Web Audio API
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            break;
        case 'transition':
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            break;
        case 'success':
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            break;
        case 'toggle':
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function startAdventure() {
    playSound('click');
    updateProgress(20);
    goToPage('character-select');
}

function selectCharacter(character) {
    gameState.character = character;
    gameState.choices.push(`Selected ${character}`);
    playSound('success');
    updateProgress(40);
    
    // Add character-specific class to body for potential styling
    document.body.className = `character-${character}`;
    
    setTimeout(() => {
        goToPage('forest-entrance');
    }, 500);
}

function goToPage(pageId) {
    const currentPage = document.querySelector('.story-page.active');
    const nextPage = document.getElementById(pageId);
    
    if (!nextPage) {
        console.error(`Page ${pageId} not found!`);
        return;
    }
    
    playSound('transition');
    gameState.choices.push(`Went to ${pageId}`);
    
    // Add loading state
    currentPage.classList.add('loading');
    
    setTimeout(() => {
        // Hide current page
        currentPage.classList.remove('active', 'loading');
        
        // Show next page with animation
        nextPage.classList.add('active');
        
        // Add random transition animation
        const animations = ['slide-left', 'slide-right', 'zoom'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        nextPage.classList.add(randomAnimation);
        
        // Remove animation class after completion
        setTimeout(() => {
            nextPage.classList.remove('slide-left', 'slide-right', 'zoom');
        }, 800);
        
        // Update progress
        updateProgress(Math.min(100, gameState.progress + 15));
        
        // Update current page in state
        gameState.currentPage = pageId;
        
        // Check if this is an ending
        if (nextPage.classList.contains('ending')) {
            handleEnding(pageId);
        }
        
        // Add sparkles to new page
        addMagicSparkles();
        
    }, 300);
}

function handleEnding(endingId) {
    if (!gameState.unlockedEndings.includes(endingId)) {
        gameState.unlockedEndings.push(endingId);
        playSound('success');
        
        // Create celebration effect
        createCelebrationEffect();
        
        console.log(`🎉 New ending unlocked: ${endingId}`);
        console.log(`Total endings discovered: ${gameState.unlockedEndings.length}`);
    }
    
    updateProgress(100);
}

function restartStory() {
    playSound('click');
    
    // Reset game state but keep unlocked endings
    const unlockedEndings = [...gameState.unlockedEndings];
    gameState = {
        currentPage: 'start-screen',
        character: null,
        choices: [],
        unlockedEndings: unlockedEndings,
        audioEnabled: gameState.audioEnabled,
        progress: 0
    };
    
    // Reset body class
    document.body.className = '';
    
    // Hide all pages
    document.querySelectorAll('.story-page').forEach(page => {
        page.classList.remove('active', 'slide-left', 'slide-right', 'zoom');
    });
    
    // Show start screen
    document.getElementById('start-screen').classList.add('active');
    
    // Reset progress
    updateProgress(0);
    
    // Add sparkles
    addMagicSparkles();
}

function updateProgress(percentage) {
    gameState.progress = percentage;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        if (percentage === 0) {
            progressText.textContent = 'Beginning';
        } else if (percentage < 50) {
            progressText.textContent = 'Chapter 1';
        } else if (percentage < 100) {
            progressText.textContent = 'Chapter 2';
        } else {
            progressText.textContent = 'Complete';
        }
    }
}

function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-sparkle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particlesContainer.appendChild(particle);
    }
}

function addMagicSparkles() {
    const activeContent = document.querySelector('.story-page.active .story-content');
    if (!activeContent) return;
    
    // Remove existing sparkles
    activeContent.querySelectorAll('.magic-sparkle').forEach(sparkle => {
        sparkle.remove();
    });
    
    // Add new sparkles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'magic-sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 1 + 's';
            activeContent.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                sparkle.remove();
            }, 1500);
        }, i * 200);
    }
}

function createCelebrationEffect() {
    const container = document.querySelector('.story-content');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const celebration = document.createElement('div');
            celebration.textContent = ['✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 4)];
            celebration.style.position = 'absolute';
            celebration.style.left = Math.random() * 100 + '%';
            celebration.style.top = Math.random() * 100 + '%';
            celebration.style.fontSize = '1.5rem';
            celebration.style.animation = 'celebrationFloat 2s ease-out forwards';
            celebration.style.pointerEvents = 'none';
            celebration.style.zIndex = '1000';
            
            container.appendChild(celebration);
            
            setTimeout(() => {
                celebration.remove();
            }, 2000);
        }, i * 100);
    }
}

function animateBackground() {
    // Add subtle background animation
    const overlay = document.querySelector('.background-overlay');
    if (overlay) {
        setInterval(() => {
            overlay.style.filter = `hue-rotate(${Math.sin(Date.now() * 0.001) * 30}deg)`;
        }, 100);
    }
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const buttons = document.querySelectorAll('.story-page.active .choice-btn');
        
        if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            if (buttons[index]) {
                buttons[index].click();
            }
        }
        
        if (e.key === 'r' || e.key === 'R') {
            restartStory();
        }
        
        if (e.key === 'm' || e.key === 'M') {
            toggleAudio();
        }
    });
}

// Add some missing page functions for completeness
function goToPage(pageId) {
    // Check if page exists, if not create a placeholder ending
    const nextPage = document.getElementById(pageId);
    
    if (!nextPage) {
        // Create a generic ending for missing pages
        createPlaceholderEnding(pageId);
        return;
    }
    
    const currentPage = document.querySelector('.story-page.active');
    
    playSound('transition');
    gameState.choices.push(`Went to ${pageId}`);
    
    // Add loading state
    currentPage.classList.add('loading');
    
    setTimeout(() => {
        // Hide current page
        currentPage.classList.remove('active', 'loading');
        
        // Show next page with animation
        nextPage.classList.add('active');
        
        // Add random transition animation
        const animations = ['slide-left', 'slide-right', 'zoom'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        nextPage.classList.add(randomAnimation);
        
        // Remove animation class after completion
        setTimeout(() => {
            nextPage.classList.remove('slide-left', 'slide-right', 'zoom');
        }, 800);
        
        // Update progress
        updateProgress(Math.min(100, gameState.progress + 15));
        
        // Update current page in state
        gameState.currentPage = pageId;
        
        // Check if this is an ending
        if (nextPage.classList.contains('ending')) {
            handleEnding(pageId);
        }
        
        // Add sparkles to new page
        addMagicSparkles();
        
    }, 300);
}

function createPlaceholderEnding(pageId) {
    const currentPage = document.querySelector('.story-page.active');
    
    // Create temporary ending content
    const endingTexts = {
        'treasure-room': {
            title: 'The Treasure Hunter',
            text: 'You discover a room filled with ancient gold and magical artifacts. Your newfound wealth allows you to fund expeditions that help others in need.',
            badge: '💰 Treasure Ending Unlocked'
        },
        'magic-door': {
            title: 'The Portal Master',
            text: 'The magic door leads to a nexus of portals connecting all realms. You become the guardian of interdimensional travel.',
            badge: '🚪 Portal Ending Unlocked'
        },
        'follow-creature': {
            title: 'The Beast Whisperer',
            text: 'Following the creature leads you to a sanctuary of magical beasts. You become their protector and learn to speak with all creatures.',
            badge: '🦌 Beast Ending Unlocked'
        },
        'leave-grove': {
            title: 'The Wanderer',
            text: 'You choose to continue your journey, becoming a legendary wanderer whose tales inspire future adventurers across the realm.',
            badge: '🗺️ Wanderer Ending Unlocked'
        }
    };
    
    const ending = endingTexts[pageId] || {
        title: 'The Mysterious Path',
        text: 'Your unique choices have led you down an unexpected path, creating a story that has never been told before.',
        badge: '❓ Mystery Ending Unlocked'
    };
    
    // Update current page content
    currentPage.innerHTML = `
        <div class="story-content">
            <h2 class="page-title">${ending.title}</h2>
            <div class="story-text">
                <p>${ending.text}</p>
                <div class="ending-badge">${ending.badge}</div>
            </div>
            <div class="choices">
                <button class="choice-btn primary" onclick="restartStory()">
                    <span class="btn-text">Begin New Adventure</span>
                    <span class="btn-glow"></span>
                </button>
            </div>
        </div>
    `;
    
    currentPage.classList.add('ending');
    handleEnding(pageId);
}

// Add CSS animation for celebration effect
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    @keyframes celebrationFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
        }
    }
`;
document.head.appendChild(celebrationStyle);

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((key, index) => key === konamiSequence[index])) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    playSound('success');
    
    // Create special effect
    document.body.style.animation = 'rainbow 2s ease-in-out';
    
    setTimeout(() => {
        alert('🎉 Easter Egg Activated! 🎉\nYou\'ve discovered the secret Konami Code!\nAll story paths are now highlighted with golden sparkles!');
        document.body.style.animation = '';
        
        // Add permanent golden sparkles
        document.querySelectorAll('.story-content').forEach(content => {
            content.style.boxShadow += ', 0 0 20px rgba(255, 215, 0, 0.3)';
        });
    }, 2000);
}

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Auto-save progress to memory (not localStorage due to restrictions)
function saveProgress() {
    // In a real implementation, this would save to localStorage
    // For now, we'll just log the progress
    console.log('Progress saved:', {
        unlockedEndings: gameState.unlockedEndings,
        totalChoices: gameState.choices.length
    });
}

// Debug functions for development
function debugGameState() {
    console.log('Current Game State:', gameState);
}

function unlockAllEndings() {
    const allEndings = ['wisdom-reward', 'power-reward', 'friendship-reward', 'unite-realm', 'seek-artifact', 'become-guardian', 'crystal-chamber', 'examine-shrine'];
    gameState.unlockedEndings = [...allEndings];
    console.log('All endings unlocked for testing!');
}

// Add click sound to all interactive elements
document.addEventListener('click', function(e) {
    if (e.target.matches('.choice-btn, .character-card, .settings-btn')) {
        playSound('click');
    }
});

// Accessibility: Announce page changes for screen readers
function announcePageChange(pageTitle) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = `Now on page: ${pageTitle}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Performance optimization: Lazy load sound effects
function preloadSounds() {
    // In a real app, you might preload actual audio files here
    console.log('Sound system ready');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}