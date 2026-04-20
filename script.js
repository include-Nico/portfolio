/* ═══════════════════════════════════════════════
   PORTFOLIO — script.js  |  Nicolò Troiano
═══════════════════════════════════════════════ */

/* ╔══════════════════════════════════════╗
   ║  CONFIG — change your GitHub handle  ║
   ╚══════════════════════════════════════╝ */
const GITHUB_USERNAME = 'include-Nico'; // ← Username aggiornato!

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────
       1. CANVAS PARTICLE NETWORK
    ──────────────────────────────────────── */
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, particles = [];

    function resizeCanvas() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    class Particle {
        constructor() { this.reset(true); }
        reset(rand = false) {
            this.x    = rand ? Math.random() * W : (Math.random() < .5 ? -2 : W + 2);
            this.y    = Math.random() * H;
            this.size = Math.random() * 1.4 + 0.3;
            this.vx   = (Math.random() - 0.5) * 0.22;
            this.vy   = (Math.random() - 0.5) * 0.22;
            this.life = Math.random();
            this.max  = Math.random() * 0.4 + 0.3;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.life += 0.0025;
            if (this.life > this.max || this.x < -5 || this.x > W+5 || this.y < -5 || this.y > H+5)
                this.reset();
        }
        draw() {
            const a = Math.sin((this.life / this.max) * Math.PI) * 0.55;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,229,192,${a})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const n = Math.floor((W * H) / 11000);
        for (let i = 0; i < n; i++) particles.push(new Particle());
    }
    initParticles();

    function drawNet() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.hypot(dx, dy);
                if (d < 115) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,229,192,${(1 - d/115) * 0.1})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    (function frame() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawNet();
        requestAnimationFrame(frame);
    })();

    /* ────────────────────────────────────────
       2. NAV SCROLL SHADOW
    ──────────────────────────────────────── */
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.scrollY > 60
            ? '0 2px 30px rgba(0,0,0,0.6)' : 'none';
    });

    /* ────────────────────────────────────────
       3. TYPEWRITER
    ──────────────────────────────────────── */
    const phrases  = [
        'Studente @ Politecnico di Milano',
        'Computer Engineering Student',
        'Security & Problem Solving',
        'Building things with code.',
    ];
    const twEl = document.getElementById('typewriter');
    let pi = 0, ci = 0, deleting = false;

    function typeLoop() {
        const p = phrases[pi % phrases.length];
        twEl.textContent = p.slice(0, ci);
        if (!deleting) {
            ci++;
            if (ci > p.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
        } else {
            ci--;
            if (ci < 0) { deleting = false; pi++; setTimeout(typeLoop, 400); return; }
        }
        setTimeout(typeLoop, deleting ? 42 : 72);
    }
    typeLoop();

    /* ────────────────────────────────────────
       4. INTERSECTION OBSERVER (fade-in)
    ──────────────────────────────────────── */
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        '.acc-item, .edu-card, .terminal-panel, .hex-skills, ' +
        '.lang-section, .soft-section, .gh-banner, .proj-card'
    ).forEach(el => io.observe(el));

    /* ────────────────────────────────────────
       5. ACCORDION — EXPERIENCE (Hover & Click)
    ──────────────────────────────────────── */
    document.querySelectorAll('.acc-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.acc-item');
            const isOpen = item.classList.contains('open');

            // close all
            document.querySelectorAll('.acc-item.open').forEach(i => i.classList.remove('open'));

            // open clicked if it was closed
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ────────────────────────────────────────
       6. EDUCATION — EXPANDABLE CARDS (Hover & Click)
    ──────────────────────────────────────── */
    document.querySelectorAll('.edu-card-main').forEach(mainCard => {
        mainCard.addEventListener('click', () => {
            const card = mainCard.closest('.edu-card');
            card.classList.toggle('expanded');
        });
    });

    /* ────────────────────────────────────────
       7. TERMINAL ANIMATION
    ──────────────────────────────────────── */
    const termBody  = document.getElementById('terminal-body');
    const termPanel = document.querySelector('.terminal-panel');
    let termDone    = false;

    const SKILLS = [
        { name: 'C           ', v: 7 },
        { name: 'Java        ', v: 7 },
        { name: 'Python      ', v: 6 },
        { name: 'JavaScript  ', v: 6 },
        { name: 'HTML / CSS  ', v: 7 },
        { name: 'Excel       ', v: 8 },
    ];

    function bar(v) {
        const MAX = 10;
        return { fill: '█'.repeat(v), empty: '░'.repeat(MAX - v), pct: `${v * 10}%` };
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function typeInto(el, text, color = '#00e5c0') {
        el.style.color = color;
        for (const ch of text) { el.textContent += ch; await sleep(24); }
    }

    async function runTerminal() {
        if (termDone) return;
        termDone = true;
        termBody.innerHTML = '';

        const lines = [
            { type: 'prompt', text: '$ cat skills.json' },
            { type: 'gap' },
            ...SKILLS.map(s => ({ type: 'skill', ...s })),
            { type: 'gap' },
            { type: 'prompt', text: '$ echo $READY' },
            { type: 'out',    text: '✓  Open to opportunities' },
        ];

        for (const line of lines) {
            await sleep(200);
            const div = document.createElement('div');

            if (line.type === 'prompt') {
                await typeInto(div, line.text, '#00e5c0');
            } else if (line.type === 'skill') {
                const { fill, empty, pct } = bar(line.v);
                div.innerHTML =
                    `<span style="color:#8899aa">${line.name}</span>` +
                    `<span style="color:#00e5c0">${fill}</span>` +
                    `<span style="color:#1a2e40">${empty}</span>` +
                    `<span style="color:#4a6070;font-size:.68rem"> ${pct}</span>`;
            } else if (line.type === 'out') {
                div.innerHTML = `<span style="color:#4ade80">${line.text}</span>`;
            } else {
                div.innerHTML = '&nbsp;';
            }

            termBody.appendChild(div);
            termBody.scrollTop = termBody.scrollHeight;
        }
    }

    const termObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { setTimeout(runTerminal, 350); termObs.disconnect(); }
    }, { threshold: 0.3 });
    if (termPanel) termObs.observe(termPanel);

    /* ────────────────────────────────────────
       8. GITHUB API - FETCH REPOSITORIES
    ──────────────────────────────────────── */
    const LANG_COLORS = {
        JavaScript: '#f1e05a', Python: '#3572A5', C: '#555555',
        Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c',
        'C++': '#f34b7d', TypeScript: '#2b7489', Shell: '#89e051',
        Jupyter: '#DA5B0B', default: '#8888aa'
    };

    async function loadGitHub() {
        const ghUsername  = document.getElementById('gh-username');
        const ghRepos     = document.getElementById('gh-repos');
        const ghFollowers = document.getElementById('gh-followers');
        const ghFollowing = document.getElementById('gh-following');
        const ghLink      = document.getElementById('gh-profile-link');
        const reposGrid   = document.getElementById('repos-grid');

        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
                fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
            ]);

            if (!userRes.ok) throw new Error('User not found');

            const user  = await userRes.json();
            const repos = await reposRes.json();

            // Aggiorna Informazioni Utente
            ghUsername.textContent  = user.login;
            ghRepos.textContent     = user.public_repos;
            ghFollowers.textContent = user.followers;
            ghFollowing.textContent = user.following;
            ghLink.href             = user.html_url;

            // Costruisci la griglia delle Repositories
            reposGrid.innerHTML = '';
            repos.slice(0, 6).forEach((repo, i) => {
                const color   = LANG_COLORS[repo.language] || LANG_COLORS.default;
                const updated = new Date(repo.updated_at).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
                const card    = document.createElement('a');
                card.className       = 'repo-card';
                card.href            = repo.html_url;
                card.target          = '_blank';
                card.rel             = 'noopener';
                card.style.animationDelay = `${i * 80}ms`;
                
                // Pulisce la descrizione per evitare "null"
                const desc = repo.description || 'Nessuna descrizione disponibile per questa repository.';

                card.innerHTML = `
                    <div class="repo-card-top">
                        <i class="fas fa-book-open"></i>
                        <span class="repo-name">${repo.name}</span>
                    </div>
                    <p class="repo-desc">${desc}</p>
                    <div class="repo-meta">
                        ${repo.language ? `
                        <span class="repo-lang">
                            <span class="lang-dot" style="background:${color}"></span>
                            ${repo.language}
                        </span>` : ''}
                        <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span class="repo-updated">${updated}</span>
                    </div>`;
                reposGrid.appendChild(card);
            });

        } catch (err) {
            console.error("Errore nel caricamento dei dati GitHub:", err);
            reposGrid.innerHTML = `
                <div style="grid-column:1/-1;font-size:.78rem;color:var(--text-dim);padding:1.5rem;
                    border:1px dashed var(--border);border-radius:4px;text-align:center;">
                    <i class="fab fa-github" style="font-size:1.5rem;margin-bottom:.5rem;display:block;color:var(--text-dim)"></i>
                    Si è verificato un errore nel caricamento delle repositories di <code style="color:var(--cyan)">${GITHUB_USERNAME}</code>.
                </div>`;
            ghUsername.textContent  = `@${GITHUB_USERNAME}`;
            document.getElementById('gh-profile-link').href = `https://github.com/${GITHUB_USERNAME}`;
        }
    }

    // Lazy-load GitHub quando la sezione entra nella visuale
    const ghObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { loadGitHub(); ghObs.disconnect(); }
    }, { threshold: 0.05 });
    const projectsSection = document.getElementById('projects');
    if (projectsSection) ghObs.observe(projectsSection);

    /* ────────────────────────────────────────
       9. RADAR CHART — SOFT SKILLS
    ──────────────────────────────────────── */
    const radarCanvas  = document.getElementById('radar-canvas');
    const radarTooltip = document.getElementById('radar-tooltip');
    const legendEl     = document.getElementById('radar-legend');

    const RADAR_SKILLS = [
        { label: 'Problem Solving', value: 88, color: '#00e5c0' },
        { label: 'Resilienza',      value: 93, color: '#ff3e7f' },
        { label: 'Team Work',       value: 80, color: '#7c3aed' },
        { label: 'Customer Care',   value: 85, color: '#f59e0b' },
        { label: 'Osservazione',    value: 82, color: '#3b82f6' },
        { label: 'Comunicazione',   value: 76, color: '#10b981' },
    ];

    if (radarCanvas) {
        const rc   = radarCanvas.getContext('2d');
        const SIZE = radarCanvas.width;
        const CX   = SIZE / 2;
        const CY   = SIZE / 2;
        const R    = SIZE * 0.36;
        const N    = RADAR_SKILLS.length;
        let   anim = 0; // 0→1 for intro animation
        let   hoveredIdx = -1;

        function angle(i) { return (Math.PI * 2 * i / N) - Math.PI / 2; }

        function point(i, ratio) {
            const a = angle(i);
            const v = RADAR_SKILLS[i].value / 100 * R * ratio;
            return { x: CX + Math.cos(a) * v, y: CY + Math.sin(a) * v };
        }

        function drawRadar(progress) {
            rc.clearRect(0, 0, SIZE, SIZE);

            // Grid rings
            [0.25, 0.5, 0.75, 1].forEach(frac => {
                rc.beginPath();
                for (let i = 0; i < N; i++) {
                    const a = angle(i);
                    const x = CX + Math.cos(a) * R * frac;
                    const y = CY + Math.sin(a) * R * frac;
                    i === 0 ? rc.moveTo(x, y) : rc.lineTo(x, y);
                }
                rc.closePath();
                rc.strokeStyle = 'rgba(0,229,192,0.1)';
                rc.lineWidth = 1;
                rc.stroke();
                if (frac < 1) {
                    rc.fillStyle = 'rgba(0,229,192,0.02)';
                    rc.fill();
                }
            });

            // Axes
            RADAR_SKILLS.forEach((_, i) => {
                const a = angle(i);
                rc.beginPath();
                rc.moveTo(CX, CY);
                rc.lineTo(CX + Math.cos(a) * R, CY + Math.sin(a) * R);
                rc.strokeStyle = 'rgba(0,229,192,0.12)';
                rc.lineWidth = 1;
                rc.stroke();
            });

            // Axis labels
            RADAR_SKILLS.forEach((s, i) => {
                const a   = angle(i);
                const lx  = CX + Math.cos(a) * (R + 26);
                const ly  = CY + Math.sin(a) * (R + 26);
                const hot = i === hoveredIdx;
                rc.font     = `${hot ? '600 ' : ''}${hot ? '11px' : '10px'} 'JetBrains Mono', monospace`;
                rc.fillStyle = hot ? s.color : 'rgba(160,180,200,0.7)';
                rc.textAlign = 'center';
                rc.textBaseline = 'middle';
                rc.fillText(s.label, lx, ly);
            });

            // Filled polygon
            rc.beginPath();
            for (let i = 0; i < N; i++) {
                const p = point(i, progress);
                i === 0 ? rc.moveTo(p.x, p.y) : rc.lineTo(p.x, p.y);
            }
            rc.closePath();
            const grad = rc.createRadialGradient(CX, CY, 0, CX, CY, R);
            grad.addColorStop(0, 'rgba(0,229,192,0.35)');
            grad.addColorStop(1, 'rgba(255,62,127,0.15)');
            rc.fillStyle = grad;
            rc.fill();
            rc.strokeStyle = 'rgba(0,229,192,0.7)';
            rc.lineWidth = 1.5;
            rc.stroke();

            // Dots on each vertex
            RADAR_SKILLS.forEach((s, i) => {
                const p   = point(i, progress);
                const hot = i === hoveredIdx;
                rc.beginPath();
                rc.arc(p.x, p.y, hot ? 6 : 4, 0, Math.PI * 2);
                rc.fillStyle   = hot ? s.color : 'rgba(0,229,192,0.9)';
                rc.fill();
                if (hot) {
                    rc.strokeStyle = 'rgba(0,0,0,0.6)';
                    rc.lineWidth   = 1.5;
                    rc.stroke();
                }
            });
        }

        // Intro animation
        let radarStarted = false;
        function animateRadar() {
            if (anim >= 1) { drawRadar(1); return; }
            anim = Math.min(anim + 0.025, 1);
            drawRadar(anim);
            requestAnimationFrame(animateRadar);
        }

        const radarObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !radarStarted) {
                radarStarted = true;
                animateRadar();
                radarObs.disconnect();
            }
        }, { threshold: 0.3 });
        radarObs.observe(radarCanvas);

        // Hover interaction
        radarCanvas.addEventListener('mousemove', e => {
            const rect  = radarCanvas.getBoundingClientRect();
            const mx    = (e.clientX - rect.left) * (SIZE / rect.width);
            const my    = (e.clientY - rect.top)  * (SIZE / rect.height);
            let nearest = -1, minD = 30;

            RADAR_SKILLS.forEach((_, i) => {
                const p = point(i, 1);
                const d = Math.hypot(mx - p.x, my - p.y);
                if (d < minD) { minD = d; nearest = i; }
            });

            hoveredIdx = nearest;
            drawRadar(1);

            if (nearest >= 0) {
                const s = RADAR_SKILLS[nearest];
                radarTooltip.textContent = `${s.label}: ${s.value}%`;
                radarTooltip.style.left  = `${e.clientX - rect.left + 12}px`;
                radarTooltip.style.top   = `${e.clientY - rect.top  - 28}px`;
                radarTooltip.classList.add('show');
            } else {
                radarTooltip.classList.remove('show');
            }
        });
        radarCanvas.addEventListener('mouseleave', () => {
            hoveredIdx = -1;
            drawRadar(1);
            radarTooltip.classList.remove('show');
        });

        // Build legend
        if (legendEl) {
            RADAR_SKILLS.forEach((s, i) => {
                const row = document.createElement('div');
                row.className = 'rl-item';
                row.innerHTML = `
                    <span class="rl-dot" style="background:${s.color}"></span>
                    <span>${s.label}</span>
                    <span class="rl-val">${s.value}%</span>`;
                row.addEventListener('mouseenter', () => { hoveredIdx = i; drawRadar(1); });
                row.addEventListener('mouseleave', () => { hoveredIdx = -1; drawRadar(1); });
                legendEl.appendChild(row);
            });
        }
    }

    /* ────────────────────────────────────────
       10. SMOOTH ANCHOR SCROLL
    ──────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    console.log('%c[ NT ] Portfolio v2 loaded.', 'color:#00e5c0;font-family:monospace;font-size:13px;background:#060a10;padding:4px 8px');
});