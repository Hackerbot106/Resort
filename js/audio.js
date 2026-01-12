/* =========================================================
   AUDIO SYSTEM — audio.js
   Handles all sound effects, ambient loops, muting, 
   night mode audio behavior, preloading, and triggers.
   ========================================================= */

/* --------------------------
   MASTER AUDIO CONTROLLER
   -------------------------- */

const AudioEngine = {
    muted: false,
    nightMode: false,

    sounds: {
        ambientWind: new Audio("assets/audio/ambient_wind.mp3"),
        dustMove: new Audio("assets/audio/dust_move.mp3"),
        footsteps: new Audio("assets/audio/footsteps.mp3"),
        pageFlip: new Audio("assets/audio/page_flip.mp3"),
        matchIgnite: new Audio("assets/audio/match_ignite.mp3"),
        fireCrackle: new Audio("assets/audio/fire_crackle.mp3"),
        woodCreak: new Audio("assets/audio/wood_creak.mp3"),
    },

    volumes: {
        ambientWind: 0.10,
        dustMove: 0.05,
        footsteps: 0.04,
        pageFlip: 0.06,
        matchIgnite: 0.08,
        fireCrackle: 0.06,
        woodCreak: 0.05,
    },

    /* Preload all audio buffers */
    preloadAll() {
        for (let key in this.sounds) {
            this.sounds[key].volume = this.volumes[key];
            this.sounds[key].load();
        }
        this.sounds.ambientWind.loop = true;
        this.sounds.fireCrackle.loop = true;
    },

    /* Play a sound if not muted */
    play(soundName) {
        if (!this.muted) {
            const sound = this.sounds[soundName];

            if (!sound) return;
            sound.currentTime = 0;
            sound.volume = this.volumes[soundName];
            sound.play().catch(err => {});
        }
    },

    /* Play a looped sound (ambient wind / fire crackle) */
    loop(soundName) {
        if (!this.muted) {
            const sound = this.sounds[soundName];
            if (!sound.loop) sound.loop = true;
            sound.volume = this.volumes[soundName];
            sound.play().catch(err => {});
        }
    },

    /* Fade out a sound smoothly */
    fadeOut(soundName, duration = 600) {
        let sound = this.sounds[soundName];
        let vol = sound.volume;
        let step = vol / (duration / 50);

        let fade = setInterval(() => {
            vol -= step;
            if (vol <= 0) {
                clearInterval(fade);
                sound.pause();
                sound.volume = this.volumes[soundName];
            } else {
                sound.volume = vol;
            }
        }, 50);
    },

    /* Global Mute Toggle */
    toggleMute() {
        this.muted = !this.muted;

        if (this.muted) {
            // Pause all sounds
            for (let key in this.sounds) {
                this.sounds[key].pause();
            }
        } else {
            // Resume ambient sounds
            this.loop("ambientWind");
            if (this.nightMode) this.loop("fireCrackle");
        }
    },

    /* Enable Night Mode Audio */
    enableNightAudio() {
        this.nightMode = true;
        this.fadeOut("ambientWind", 800);

        setTimeout(() => {
            this.loop("fireCrackle");
        }, 500);
    },

    /* Disable Night Mode Audio */
    disableNightAudio() {
        this.nightMode = false;
        this.fadeOut("fireCrackle", 700);

        setTimeout(() => {
            this.loop("ambientWind");
        }, 400);
    }
};


/* =========================================================
   EVENT-BASED TRIGGERS
   ========================================================= */

/* Play dust sound when cursor moves fast */
let lastMouseTime = Date.now();
document.addEventListener("mousemove", (e) => {
    let now = Date.now();
    let delta = now - lastMouseTime;
    lastMouseTime = now;

    if (delta < 25) {
        AudioEngine.play("dustMove");
    }
});

/* Cowboy footsteps during scroll-up hero animation */
function triggerCowboyFootsteps() {
    AudioEngine.play("footsteps");
}

/* Menu page flip sound */
function triggerPageFlipSound() {
    AudioEngine.play("pageFlip");
}

/* Wood creak for swinging sign */
function triggerWoodCreak() {
    AudioEngine.play("woodCreak");
}

/* Matchstick animation sound */
function triggerMatchIgnite() {
    AudioEngine.play("matchIgnite");
}

/* =========================================================
   STARTUP INITIALIZATION
   ========================================================= */

window.addEventListener("DOMContentLoaded", () => {
    AudioEngine.preloadAll();

    // Start ambient wind immediately
    AudioEngine.loop("ambientWind");
});


/* =========================================================
   PUBLIC EXPOSED GLOBALS (to be used in main.js)
   ========================================================= */

window.AudioEngine = AudioEngine;
window.triggerCowboyFootsteps = triggerCowboyFootsteps;
window.triggerPageFlipSound = triggerPageFlipSound;
window.triggerWoodCreak = triggerWoodCreak;
window.triggerMatchIgnite = triggerMatchIgnite;
