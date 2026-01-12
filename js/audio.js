/**
 * Module 3: Global Sound System
 */
const audioManager = {
    sounds: {},
    isMuted: true, // Default to muted for browser policy

    // 3.2 Sound Volumes config
    volumes: {
        'ambient_wind': 0.10,      // 7-10%
        'dust_fx': 0.05,           // 5%
        'footsteps': 0.04,         // 4%
        'page_flip': 0.06,         // 6%
        'match_ignite': 0.08,      // 8%
        'fire_crackle': 0.06,      // 6%
        'wood_creak': 0.05         // 5%
    },

    init: () => {
        console.log("Audio System Initializing...");

        // Setup toggle listener
        const toggleBtn = document.getElementById('audio-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', audioManager.toggleMute);
        }

        // Preload sounds (Mocking URLs for now)
        // In a real app, these would be actual file paths
        audioManager.loadSound('ambient_wind', 'assets/sounds/wind_loop.mp3', true);
        audioManager.loadSound('dust_fx', 'assets/sounds/dust.mp3');
        audioManager.loadSound('footsteps', 'assets/sounds/footsteps.mp3');
        audioManager.loadSound('page_flip', 'assets/sounds/paper_rustle.mp3');
        audioManager.loadSound('match_ignite', 'assets/sounds/match_strike.mp3');
        audioManager.loadSound('fire_crackle', 'assets/sounds/fire_loop.mp3', true);
        audioManager.loadSound('wood_creak', 'assets/sounds/wood_creak.mp3');

        audioManager.updateIcon();
    },

    loadSound: (name, path, loop = false) => {
        // Since we don't have actual files, we will simulate the Audio object
        // In a real implementation: const audio = new Audio(path);
        const audio = new Audio();
        // We won't set src to avoid 404 errors in console for this demo unless files exist
        // audio.src = path; 

        audio.loop = loop;
        audio.volume = audioManager.volumes[name] || 0.05;

        audioManager.sounds[name] = audio;
    },

    play: (name) => {
        if (audioManager.isMuted) return;

        const sound = audioManager.sounds[name];
        if (sound) {
            // Reset if not looping to allow re-trigger
            if (!sound.loop) {
                sound.currentTime = 0;
            }

            // Simulation log
            console.log(`🔊 [Audio] Playing: ${name} at vol ${sound.volume}`);

            // sound.play().catch(e => console.warn("Audio play blocked", e));
        } else {
            console.warn(`Sound not found: ${name}`);
        }
    },

    stop: (name) => {
        const sound = audioManager.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    },

    toggleMute: () => {
        audioManager.isMuted = !audioManager.isMuted;

        // 3.3 Sound Rules: Silence all if muted
        if (audioManager.isMuted) {
            Object.values(audioManager.sounds).forEach(s => s.pause());
        } else {
            // Resume ambient loops if unmuted
            audioManager.play('ambient_wind');
            if (document.body.classList.contains('night-mode')) {
                audioManager.play('fire_crackle');
            }
        }

        audioManager.updateIcon();
        console.log(`Audio Muted: ${audioManager.isMuted}`);
    },

    updateIcon: () => {
        const btn = document.getElementById('audio-toggle');
        if (btn) {
            btn.innerHTML = audioManager.isMuted ? '<div class="audio-icon">🔇</div>' : '<div class="audio-icon">🔊</div>';
        }
    },

    // 3.3 Fade logic
    fadeOut: (name, duration = 300) => {
        const sound = audioManager.sounds[name];
        if (sound && !sound.paused) {
            // logic to fade volume down to 0 then pause
        }
    }
};
