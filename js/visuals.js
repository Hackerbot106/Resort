/* =========================================================
   VISUAL ENGINE — visual.js
   Handles all non-logical visual/graphical effects:
   - Cursor lasso trail
   - Dust particles
   - Fire glow flicker
   - Subtle parallax smoothing
   - Rim lights, depth shadows
   - Hover depth effects
   - Map animation
   - 3D cabin rotation
   - Activity carousel inertia
   ========================================================= */


/* ---------------------------------------------------------
   CURSOR LASSO TRAIL EFFECT
   --------------------------------------------------------- */

const cursor = { x: 0, y: 0 };
const ropeSegments = [];
const maxSegments = 12;

document.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;

    ropeSegments.unshift({ x: cursor.x, y: cursor.y });
    if (ropeSegments.length > maxSegments) ropeSegments.pop();
});

function drawLassoTrail() {
    const canvas = document.getElementById("lassoCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(148, 106, 62, 0.8)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.beginPath();
    ropeSegments.forEach((seg, i) => {
        if (i === 0) ctx.moveTo(seg.x, seg.y);
        else ctx.lineTo(seg.x, seg.y);
    });

    ctx.stroke();

    requestAnimationFrame(drawLassoTrail);
}

requestAnimationFrame(drawLassoTrail);


/* ---------------------------------------------------------
   DUST PARTICLE SYSTEM (VISUAL ONLY)
   --------------------------------------------------------- */

const dustCanvas = document.getElementById("dustCanvas");
const dustCtx = dustCanvas ? dustCanvas.getContext("2d") : null;

let dustParticles = [];

function spawnDust(x, y, glow = false) {
    for (let i = 0; i < 5; i++) {
        dustParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2,
            size: Math.random() * 4 + 2,
            opacity: 1,
            glow: glow
        });
    }
}

document.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.7) {
        const glow = document.body.classList.contains("night-mode");
        spawnDust(e.clientX, e.clientY, glow);
    }
});

function updateDust() {
    if (!dustCanvas) return;

    dustCanvas.width = window.innerWidth;
    dustCanvas.height = window.innerHeight;

    dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);

    dustParticles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.02;

        if (p.opacity <= 0) {
            dustParticles.splice(index, 1);
        }

        dustCtx.globalAlpha = p.opacity;

        if (p.glow) {
            dustCtx.fillStyle = "rgba(255, 200, 120, 0.9)";
            dustCtx.shadowBlur = 12;
            dustCtx.shadowColor = "rgba(255, 180, 90, 0.9)";
        } else {
            dustCtx.fillStyle = "rgba(200, 160, 120, 0.8)";
            dustCtx.shadowBlur = 0;
        }

        dustCtx.beginPath();
        dustCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        dustCtx.fill();
    });

    requestAnimationFrame(updateDust);
}

requestAnimationFrame(updateDust);


/* ---------------------------------------------------------
   FIRE GLOW FLICKER — NIGHT MODE ONLY
   --------------------------------------------------------- */

let glowIntensity = 0;

function updateFireGlow() {
    if (!document.body.classList.contains("night-mode")) {
        requestAnimationFrame(updateFireGlow);
        return;
    }

    glowIntensity = 0.2 + Math.random() * 0.3;

    document.documentElement.style.setProperty(
        "--fire-glow",
        `rgba(255, 180, 90, ${glowIntensity})`
    );

    requestAnimationFrame(updateFireGlow);
}

requestAnimationFrame(updateFireGlow);


/* ---------------------------------------------------------
   HERO PARALLAX SMOOTHING (reduces jitter)
   --------------------------------------------------------- */

let parallaxX = 0;
let parallaxY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener("mousemove", (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    targetX = (e.clientX - centerX) * -0.01;
    targetY = (e.clientY - centerY) * -0.015;
});

function smoothParallax() {
    parallaxX += (targetX - parallaxX) * 0.1;
    parallaxY += (targetY - parallaxY) * 0.1;

    document.getElementById("heroLodge").style.transform =
        `translate(${parallaxX}px, ${parallaxY}px)`;

    requestAnimationFrame(smoothParallax);
}

requestAnimationFrame(smoothParallax);


/* ---------------------------------------------------------
   RIM LIGHT ON COWBOY (night mode enhancement)
   --------------------------------------------------------- */

function updateCowboyRim() {
    if (!document.body.classList.contains("night-mode")) return;

    cowboy.style.filter =
        "drop-shadow(0 0 14px rgba(255, 200, 120, 0.4))";
}

setInterval(updateCowboyRim, 300);


/* ---------------------------------------------------------
   MAP LINE DRAWING EFFECT
   --------------------------------------------------------- */

function animateMapLine() {
    const map = document.getElementById("animatedMap");
    if (!map) return;

    const line = document.createElement("div");
    line.classList.add("map-line");
    map.appendChild(line);

    setTimeout(() => {
        line.style.width = "100%";
    }, 100);
}

window.addEventListener("DOMContentLoaded", animateMapLine);


/* ---------------------------------------------------------
   3D CABIN ROTATION PLACEHOLDER
   --------------------------------------------------------- */

const cabin = document.getElementById("cabin3DContainer");

if (cabin) {
    cabin.addEventListener("mousemove", (e) => {
        const rect = cabin.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotY = (x / rect.width - 0.5) * 40;
        const rotX = (y / rect.height - 0.5) * -40;

        cabin.style.transform = `
            rotateX(${rotX}deg)
            rotateY(${rotY}deg)
        `;
    });

    cabin.addEventListener("mouseleave", () => {
        cabin.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}


/* ---------------------------------------------------------
   ACTIVITY CAROUSEL INERTIAL DRAG
   --------------------------------------------------------- */

const carousel = document.querySelector(".activity-carousel");
if (carousel) {
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mouseleave", () => {
        isDown = false;
    });

    carousel.addEventListener("mouseup", () => {
        isDown = false;
    });

    carousel.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 3;
        carousel.scrollLeft = scrollLeft - walk;
    });
}


/* ---------------------------------------------------------
   EXPORTS
   --------------------------------------------------------- */

window.spawnDust = spawnDust;

