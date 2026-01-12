/* =========================================================
   MAIN ENGINE — main.js
   Ties together: parallax, hero animations, night mode,
   floating menu, matchstick ignition, scroll triggers,
   audio events, and responsive behaviors.
   ========================================================= */


/* ---------------------------------------------------------
   ELEMENT REFERENCES
   --------------------------------------------------------- */

const body = document.body;
const hero = document.getElementById("hero");
const heroText = document.getElementById("heroTextContainer");
const cowboy = document.getElementById("cowboySilhouette");

const nightToggle = document.getElementById("nightToggle");
const matchstickAnim = document.getElementById("matchstickAnimation");

const floatingMenu = document.getElementById("floatingMenu");
const menuDimLayer = document.getElementById("menuDimLayer");

const scrollIndicator = document.getElementById("scrollIndicator");

const mountLayers = [
    document.getElementById("mount1"),
    document.getElementById("mount2"),
    document.getElementById("mount3"),
    document.getElementById("mount4")
];

const heroLayers = [
    document.getElementById("heroSky"),
    ...mountLayers,
    document.getElementById("heroTrees"),
    document.getElementById("heroLodge"),
    document.getElementById("heroRocks"),
    document.getElementById("heroFence"),
    document.getElementById("heroWagon")
];


/* ---------------------------------------------------------
   SCROLL STATE TRACKING
   --------------------------------------------------------- */

let lastScrollY = 0;
let silhouetteActive = false;
let hasTextRevealed = false;


/* =========================================================
   PARALLAX ENGINE
   ========================================================= */

function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    const progress = Math.min(scrollY / heroHeight, 1);

    heroLayers.forEach((layer, index) => {
        const depth = (index + 1) * 10; 
        const translateY = -(scrollY / depth);
        layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
}

window.addEventListener("scroll", updateParallax);


/* =========================================================
   HERO SCROLL TRIGGER — COWBOY SILHOUETTE
   ========================================================= */

function triggerCowboy() {
    const scrollY = window.scrollY;

    if (scrollY < lastScrollY && scrollY < hero.offsetHeight * 0.5) {
        if (!silhouetteActive) {
            silhouetteActive = true;
            cowboy.classList.add("active");
            triggerCowboyFootsteps();

            setTimeout(() => {
                cowboy.classList.remove("active");
                silhouetteActive = false;
            }, 1500);
        }
    }

    lastScrollY = scrollY;
}

window.addEventListener("scroll", triggerCowboy);


/* =========================================================
   HERO TEXT FADE-IN
   ========================================================= */

function revealHeroText() {
    const scrollY = window.scrollY;

    if (!hasTextRevealed && scrollY > hero.offsetHeight * 0.25) {
        heroText.classList.add("visible");
        hasTextRevealed = true;
    }
}

window.addEventListener("scroll", revealHeroText);


/* =========================================================
   FLOATING MENU OPEN / CLOSE
   ========================================================= */

floatingMenu.addEventListener("click", () => {
    if (floatingMenu.classList.contains("menu-open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

function openMenu() {
    floatingMenu.classList.add("menu-open");
    menuDimLayer.style.display = "block";

    menuDimLayer.onclick = closeMenu;

    // Hide night mode toggle
    nightToggle.style.display = "none";

    // Sound effect
    triggerPageFlipSound();
}

function closeMenu() {
    floatingMenu.classList.remove("menu-open");
    menuDimLayer.style.display = "none";

    // Show night mode toggle
    nightToggle.style.display = "block";
}


/* =========================================================
   NIGHT MODE SYSTEM
   ========================================================= */

function enableNightMode() {
    body.classList.add("night-mode");

    // Audio transition
    AudioEngine.enableNightAudio();

    // Save state
    localStorage.setItem("nightMode", "true");
}

function disableNightMode() {
    body.classList.remove("night-mode");

    // Audio transition
    AudioEngine.disableNightAudio();

    // Save state
    localStorage.setItem("nightMode", "false");
}


/* =========================================================
   MATCHSTICK IGNITION ANIMATION
   ========================================================= */

function playNightModeAnimation(callback) {
    matchstickAnim.innerHTML = `
        <div class="matchstick-effect"></div>
    `;

    triggerMatchIgnite();

    matchstickAnim.classList.add("active");

    setTimeout(() => {
        matchstickAnim.classList.remove("active");
        matchstickAnim.innerHTML = "";
        callback();
    }, 2300);
}


/* =========================================================
   NIGHT MODE TOGGLE CLICK EVENT
   ========================================================= */

nightToggle.addEventListener("click", () => {
    if (!body.classList.contains("night-mode")) {
        playNightModeAnimation(enableNightMode);
    } else {
        disableNightMode();
    }
});


/* =========================================================
   PERSIST NIGHT MODE ACROSS PAGES / RELOADS
   ========================================================= */

window.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("nightMode");

    if (savedMode === "true") {
        body.classList.add("night-mode");
        AudioEngine.enableNightAudio();
    } else {
        body.classList.remove("night-mode");
    }
});


/* =========================================================
   SCROLL INDICATOR HIDE ON SCROLL
   ========================================================= */

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        scrollIndicator.style.opacity = "0";
    } else {
        scrollIndicator.style.opacity = "1";
    }
});


/* =========================================================
   CTA BUTTON LOGIC
   ========================================================= */

document.getElementById("ctaBook").addEventListener("click", () => {
    window.location.href = "#cabinsSection";
});

document.getElementById("ctaMenu").addEventListener("click", () => {
    openMenu();
});


/* =========================================================
   REDUCED MOTION SUPPORT (ACCESSIBILITY)
   ========================================================= */

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroLayers.forEach(layer => {
        layer.style.transform = "none";
    });

    window.removeEventListener("scroll", updateParallax);
    window.removeEventListener("scroll", triggerCowboy);
}


/* =========================================================
   MOBILE OPTIMIZATION HOOKS
   ========================================================= */

if (/Mobi|Android/i.test(navigator.userAgent)) {
    heroLayers.forEach(layer => {
        layer.style.transform = "none";
    });
}

