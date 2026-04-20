/* ═══════════════════════════════
   PORTFOLIO – script.js
   Nicolò Troiano
═══════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. CANVAS PARTICLE NETWORK ─────────────── */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x    = Math.random() * W;
            this.y    = Math.random() * H;
            this.size = Math.random() * 1.5 + 0.3;
            this.vx   = (Math.random() - 0.5) * 0.25;
            this.vy   = (Math.random() - 0.5) * 0.25;
            this.life = Math.random();
            this.maxLife = Math.random() * 0.4 + 0.3;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life += 0.003;
            if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 192, ${alpha})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.floor((W * H) / 12000);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    initParticles();

    function drawConnections() {
        const MAX_DIST = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX_DIST) {
                    const alpha = (1 - d / MAX_DIST) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 192, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    /* ─── 2. NAV SCROLL EFFECT ────────────────────── */
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.style.borderBottomColor = window.scrollY > 80
            ? 'rgba(0, 229, 192, 0.2)'
            : 'rgba(0, 229, 192, 0.15)';
    });

    /* ─── 3. TYPEWRITER ───────────────────────────── */
    const phrases = [
        'Studente @ Politecnico di Milano',
        'Computer Engineering Student',
        'Security & Problem Solving',
        'Building things with code.'
    ];
    const el = document.getElementById('typewriter');
    let pi = 0, ci = 0, deleting = false;

    function typeLoop() {
        const phrase = phrases[pi % phrases.length];
        if (!deleting) {
            el.textContent = phrase.slice(0, ci++);
            if (ci > phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
        } else {
            el.textContent = phrase.slice(0, ci--);
            if (ci < 0) { deleting = false; pi++; setTimeout(typeLoop, 400); return; }
        }
        setTimeout(typeLoop, deleting ? 45 : 75);
    }
    typeLoop();

    /* ─── 4. INTERSECTION OBSERVER ───────────────── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-aos], .commit-item, .edu-card, .terminal-panel, .hex-skills, .lang-section, .soft-skills').forEach(el => observer.observe(el));

    /* ─── 5. TERMINAL ANIMATION ───────────────────── */
    const terminalBody = document.getElementById('terminal-body');
    const terminalPanel = document.querySelector('.terminal-panel');

    const terminalLines = [
        { type: 'prompt', text: '$ cat skills.json | grep -i programming' },
        { type: 'output', text: '' },
        { type: 'skill',  text: 'C           ', level: 7  },
        { type: 'skill',  text: 'Java        ', level: 7  },
        { type: 'skill',  text: 'Python      ', level: 6  },
        { type: 'skill',  text: 'JavaScript  ', level: 6  },
        { type: 'skill',  text: 'HTML/CSS    ', level: 7  },
        { type: 'output', text: '' },
        { type: 'prompt', text: '$ echo $STATUS' },
        { type: 'output', text: '✓ Pronto per nuove sfide' },
    ];

    let termStarted = false;

    function buildBar(level) {
        const MAX = 10;
        const fill  = '█'.repeat(level);
        const empty = '░'.repeat(MAX - level);
        return { fill, empty, pct: `${level * 10}%` };
    }

    async function runTerminal() {
        if (termStarted) return;
        termStarted = true;
        terminalBody.innerHTML = '';

        for (const line of terminalLines) {
            await sleep(250);
            const div = document.createElement('div');

            if (line.type === 'prompt') {
                await typeElement(div, line.text, 'prompt');
            } else if (line.type === 'skill') {
                const { fill, empty, pct } = buildBar(line.level);
                div.innerHTML =
                    `<span style="color:#a0b0c0">${line.text}</span>` +
                    `<span style="color:#00e5c0">${fill}</span>` +
                    `<span style="color:#1a2a3a">${empty}</span>` +
                    `<span style="color:#5a6a80;font-size:0.7rem"> ${pct}</span>`;
            } else {
                div.innerHTML = `<span style="color:#4ade80">${line.text}</span>`;
            }

            terminalBody.appendChild(div);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function typeElement(el, text, type) {
        const color = type === 'prompt' ? '#00e5c0' : '#a0b0c0';
        el.style.color = color;
        for (const char of text) {
            el.textContent += char;
            await sleep(28);
        }
    }

    /* Trigger terminal when visible */
    const termObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(runTerminal, 400);
                termObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    if (terminalPanel) termObs.observe(terminalPanel);

    /* ─── 6. SMOOTH ANCHOR SCROLL ─────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('%c[ NT ] Portfolio loaded.', 'color:#00e5c0;font-family:monospace;font-size:14px;');
});