/**
 * Module 4 & 5: Visuals System (Cursor & Dust)
 */
const visualsManager = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    particles: [],

    // Cursor State
    cursor: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        lastX: 0,
        lastY: 0,
        down: false
    },

    // Rope Simulation Props
    rope: {
        points: [],
        segments: 12,
        damp: 0.4,
        stiffness: 0.2
    },

    init: () => {
        console.log("Visuals System Initializing...");

        visualsManager.canvas = document.getElementById('dust-canvas');
        visualsManager.ctx = visualsManager.canvas.getContext('2d');
        visualsManager.cursorEl = document.getElementById('cursor-container');

        window.addEventListener('resize', visualsManager.resize);
        visualsManager.resize();

        // Input Listeners
        window.addEventListener('mousemove', visualsManager.handleMouseMove);
        window.addEventListener('mousedown', () => { visualsManager.cursor.down = true; visualsManager.spawnBurst(); });
        window.addEventListener('mouseup', () => { visualsManager.cursor.down = false; });

        // Init Rope Points
        for (let i = 0; i < visualsManager.rope.segments; i++) {
            visualsManager.rope.points.push({ x: 0, y: 0 });
        }

        // Start Loop
        requestAnimationFrame(visualsManager.loop);
    },

    resize: () => {
        visualsManager.width = window.innerWidth;
        visualsManager.height = window.innerHeight;
        visualsManager.canvas.width = visualsManager.width;
        visualsManager.canvas.height = visualsManager.height;
    },

    handleMouseMove: (e) => {
        visualsManager.cursor.x = e.clientX;
        visualsManager.cursor.y = e.clientY;

        // Calculate velocity for dust spawn
        visualsManager.cursor.vx = e.clientX - visualsManager.cursor.lastX;
        visualsManager.cursor.vy = e.clientY - visualsManager.cursor.lastY;

        visualsManager.cursor.lastX = e.clientX;
        visualsManager.cursor.lastY = e.clientY;

        // Module 5.2: Spawn when cursor moves fast
        const speed = Math.sqrt(visualsManager.cursor.vx ** 2 + visualsManager.cursor.vy ** 2);
        if (speed > 15) { // Threshold
            visualsManager.spawnDust(visualsManager.cursor.x, visualsManager.cursor.y, 1);
        }
    },

    spawnDust: (x, y, count = 1) => {
        const isNight = document.body.classList.contains('night-mode');
        // Colors: Day #C99A6A, Night #C49B66
        const color = isNight ? '255, 178, 94' : '201, 154, 106';

        for (let i = 0; i < count; i++) {
            if (visualsManager.particles.length >= 50) visualsManager.particles.shift(); // Max 50 limit

            visualsManager.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 2, // 2px-6px
                life: 1.0,
                decay: Math.random() * 0.01 + 0.015, // Lifespan 700-1300ms approx
                color: color
            });
        }
    },

    spawnBurst: () => {
        visualsManager.spawnDust(visualsManager.cursor.x, visualsManager.cursor.y, 8);
    },

    updateRope: () => {
        // Simple Inverse Kinematics / Follow logic
        let head = visualsManager.rope.points[0];
        head.x = visualsManager.cursor.x;
        head.y = visualsManager.cursor.y;

        for (let i = 1; i < visualsManager.rope.segments; i++) {
            let p = visualsManager.rope.points[i];
            let prev = visualsManager.rope.points[i - 1];

            // Spring/Follow logic
            let dx = prev.x - p.x;
            let dy = prev.y - p.y;

            p.x += dx * visualsManager.rope.damp;
            p.y += dy * visualsManager.rope.damp;

            // Add some "Lasso" oscillation if active
            if (visualsManager.cursor.down) {
                p.x += Math.sin(Date.now() * 0.01 + i) * 2;
            }
        }
    },

    drawRope: () => {
        const ctx = visualsManager.ctx;
        ctx.beginPath();
        // Rope Color: #C49B66
        ctx.strokeStyle = '#C49B66';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        if (visualsManager.rope.points.length > 0) {
            ctx.moveTo(visualsManager.rope.points[0].x, visualsManager.rope.points[0].y);
            for (let i = 1; i < visualsManager.rope.points.length; i++) {
                // Smooth curve
                const p = visualsManager.rope.points[i];
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();
    },

    loop: () => {
        const ctx = visualsManager.ctx;
        ctx.clearRect(0, 0, visualsManager.width, visualsManager.height);

        // Update Rope
        visualsManager.updateRope();
        visualsManager.drawRope();

        // Update Particles
        for (let i = visualsManager.particles.length - 1; i >= 0; i--) {
            let p = visualsManager.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                visualsManager.particles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            // Module 5.3: Glow for night mode
            const isNight = document.body.classList.contains('night-mode');

            if (isNight) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = `rgba(${p.color}, 0.4)`;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(visualsManager.loop);
    }
};
