console.log("Main JS loaded");

const app = {
    init: () => {
        // Module 12: Loading Animations
        app.handleLoading();

        // Module 16: Behavioral Logic
        const nightModeSaved = localStorage.getItem('nightMode');
        if (nightModeSaved === 'true') {
            document.body.classList.add('night-mode');
        }

        // Initialize sub-modules
        audioManager.init();
        visualsManager.init();

        // Event Listeners
        document.getElementById('night-mode-toggle').addEventListener('click', app.toggleNightMode);
        document.getElementById('floating-menu').addEventListener('click', app.toggleMenu);
        window.addEventListener('scroll', app.handleScroll);

        // Initial check
        app.handleScroll();
    },

    handleLoading: () => {
        const screen = document.getElementById('loading-screen');
        const content = document.getElementById('loader-content');

        // 12.1 Randomization Logic
        const loaders = [
            { text: "🔥 Warming up the campfire...", type: "campfire" },
            { text: "🐎 Saddling the horses...", type: "horse" },
            { text: "🪵 Hanging the sign...", type: "sign" },
            { text: "💨 Clearing the smoke...", type: "smoke" }
        ];

        const selected = loaders[Math.floor(Math.random() * loaders.length)];
        content.innerText = selected.text;
        screen.classList.add(selected.type);

        // Simulate load time (1.5s - 2.5s)
        setTimeout(() => {
            screen.style.opacity = 0;
            setTimeout(() => {
                screen.style.display = 'none';
                // Trigger entry animation
                app.playEntryAnimation();
            }, 500);
        }, 2000);
    },

    playEntryAnimation: () => {
        // Cowboy entry or initial camera pan could go here
    },

    toggleNightMode: () => {
        // Module 9: Animation Sequence
        const body = document.body;
        body.classList.toggle('night-mode');
        const isNight = body.classList.contains('night-mode');
        localStorage.setItem('nightMode', isNight);

        // Trigger SFX
        audioManager.play('match_ignite');

        // Module 3.3: Night Mode fire sounds
        if (isNight) {
            setTimeout(() => {
                audioManager.play('fire_crackle');
            }, 1000); // Delay for flame burst
        } else {
            audioManager.stop('fire_crackle');
        }
    },

    toggleMenu: () => {
        // Module 8: Floating Menu System
        const menu = document.getElementById('floating-menu');
        menu.classList.toggle('open');
        audioManager.play('page_flip');

        if (menu.classList.contains('open')) {
            console.log("Menu Opened");
        }
    },

    handleScroll: () => {
        // Module 7: Hero Scroll Story Mechanics
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollPct = Math.min(scrollY / windowHeight, 1.5);

        // 6.2 Parallax Movement Values
        const layers = {
            'layer-02-foreground': { y: -40, x: -20 },
            'layer-04-lodge': { y: -25 },
            'layer-06-mountains-2': { y: -15 },
            'layer-06-mountains-4': { y: -10 },
            'layer-07-sky': { y: -5 }
        };

        for (const [id, val] of Object.entries(layers)) {
            const el = document.getElementById(id);
            if (el) {
                const y = scrollY * (val.y / 100);
                const x = val.x ? scrollY * (val.x / 100) : 0;
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }
        }

        // Stage 2: 20-40% Scroll - Cowboy Silhouette
        const cowboy = document.getElementById('layer-03-cowboy');
        if (cowboy) {
            if (scrollPct > 0.2 && scrollPct < 0.6) {
                const progress = (scrollPct - 0.2) / 0.4;
                const translateX = -100 + (progress * 150);
                cowboy.style.transform = `translateX(${translateX}%)`;

                if (Math.floor(progress * 20) % 5 === 0 && Math.floor(progress * 20) !== app.lastStepFrame) {
                    audioManager.play('footsteps');
                    app.lastStepFrame = Math.floor(progress * 20);
                }
            } else if (scrollPct <= 0.2) {
                cowboy.style.transform = `translateX(-100%)`;
            }
        }

        // Stage 3: 40-60% Scroll - Lodge Sign Rope Swings
        const sign = document.querySelector('.sign-rope');
        if (scrollPct > 0.4 && sign) {
            const swing = Math.sin(scrollY * 0.01) * 5;
            sign.style.transform = `rotate(${swing}deg)`;
            if (Math.random() > 0.99) audioManager.play('wood_creak');
        }

        // Stage 4: 60-100% Scroll - Text Reveal
        const heroContent = document.getElementById('hero-content');
        if (heroContent) {
            if (scrollPct > 0.6) {
                heroContent.style.opacity = 1;
                heroContent.style.pointerEvents = 'auto';
                heroContent.style.transform = `translate(-50%, -50%) scale(1)`;
            } else {
                heroContent.style.opacity = 0;
                heroContent.style.pointerEvents = 'none';
                heroContent.style.transform = `translate(-50%, -40%) scale(0.95)`;
            }
        }
    },

    lastStepFrame: -1
};

window.addEventListener('DOMContentLoaded', app.init);
