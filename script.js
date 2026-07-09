/* ============================================
   WALIMATUL KHITAN DIGITAL INVITATION
   Interactive JavaScript - Maroon + Flower Theme
   ============================================ */

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);
});

// ============================================
// INTERACTIVE FLOWER CANVAS
// ============================================
class FlowerCanvas {
    constructor() {
        this.canvas = document.getElementById('flower-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.flowers = [];
        this.mouseX = -999;
        this.mouseY = -999;
        this.scrollY = 0;
        this.resize();
        this.initFlowers();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initFlowers() {
        const count = Math.min(35, Math.floor(window.innerWidth / 30));
        for (let i = 0; i < count; i++) {
            this.flowers.push(this.createFlower());
        }
    }

    createFlower(x, y) {
        const types = ['🌸', '🌺', '🌷', '🌹', '🏵️', '💮', '✿', '❀', '🌻', '🍃'];
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            baseX: x || Math.random() * this.canvas.width,
            baseY: y || Math.random() * this.canvas.height,
            size: 12 + Math.random() * 18,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.01,
            type: types[Math.floor(Math.random() * types.length)],
            alpha: 0.15 + Math.random() * 0.25,
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: 0.005 + Math.random() * 0.01,
            floatRadius: 5 + Math.random() * 15,
            vx: 0,
            vy: 0,
            interactRadius: 80 + Math.random() * 40,
            isInteracting: false
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        // Mouse interaction
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.mouseX = -999;
            this.mouseY = -999;
        });

        // Touch interaction
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            this.mouseX = -999;
            this.mouseY = -999;
        });

        // Scroll interaction
        window.addEventListener('scroll', () => {
            const newScrollY = window.scrollY;
            const scrollDelta = newScrollY - this.scrollY;
            this.scrollY = newScrollY;
            
            // Push flowers based on scroll
            this.flowers.forEach(flower => {
                flower.vy += scrollDelta * 0.05;
                flower.vx += (Math.random() - 0.5) * scrollDelta * 0.03;
            });
        });

        // Click/tap to burst flowers
        window.addEventListener('click', (e) => {
            this.burstFlowers(e.clientX, e.clientY);
        });
    }

    burstFlowers(x, y) {
        this.flowers.forEach(flower => {
            const dx = flower.x - x;
            const dy = flower.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200) {
                const force = (200 - dist) / 200;
                const angle = Math.atan2(dy, dx);
                flower.vx += Math.cos(angle) * force * 8;
                flower.vy += Math.sin(angle) * force * 8;
                flower.rotSpeed = (Math.random() - 0.5) * 0.1;
            }
        });
    }

    update() {
        this.flowers.forEach(flower => {
            // Float animation
            flower.floatPhase += flower.floatSpeed;
            const floatX = Math.cos(flower.floatPhase) * flower.floatRadius;
            const floatY = Math.sin(flower.floatPhase * 0.7) * flower.floatRadius;

            // Mouse/touch interaction
            const dx = this.mouseX - flower.x;
            const dy = this.mouseY - flower.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < flower.interactRadius && dist > 0) {
                const force = (flower.interactRadius - dist) / flower.interactRadius;
                const angle = Math.atan2(dy, dx);
                flower.vx -= Math.cos(angle) * force * 2;
                flower.vy -= Math.sin(angle) * force * 2;
                flower.rotSpeed += (Math.random() - 0.5) * 0.02;
                flower.isInteracting = true;
            } else {
                flower.isInteracting = false;
            }

            // Apply velocity
            flower.x += flower.vx;
            flower.y += flower.vy;

            // Spring back to base position
            const returnForce = 0.01;
            const targetX = flower.baseX + floatX;
            const targetY = flower.baseY + floatY;
            flower.vx += (targetX - flower.x) * returnForce;
            flower.vy += (targetY - flower.y) * returnForce;

            // Damping
            flower.vx *= 0.95;
            flower.vy *= 0.95;

            // Rotation
            flower.rotation += flower.rotSpeed;
            flower.rotSpeed *= 0.99;

            // Wrap around screen
            if (flower.baseX < -50) flower.baseX = this.canvas.width + 50;
            if (flower.baseX > this.canvas.width + 50) flower.baseX = -50;
            if (flower.baseY < -50) flower.baseY = this.canvas.height + 50;
            if (flower.baseY > this.canvas.height + 50) flower.baseY = -50;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.flowers.forEach(flower => {
            this.ctx.save();
            this.ctx.translate(flower.x, flower.y);
            this.ctx.rotate(flower.rotation);
            this.ctx.globalAlpha = flower.isInteracting 
                ? Math.min(flower.alpha * 2, 0.7) 
                : flower.alpha;
            this.ctx.font = `${flower.size}px serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(flower.type, 0, 0);
            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize flower canvas
let flowerCanvas;
document.addEventListener('DOMContentLoaded', () => {
    flowerCanvas = new FlowerCanvas();
});

// ============================================
// OPEN INVITATION
// ============================================
function openInvitation() {
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    
    mainContent.classList.add('visible');
    musicBtn.classList.add('visible');
    
    // Auto-play music
    if (audio) {
        audio.volume = 0.5;
        audio.play().then(() => {
            isMusicPlaying = true;
            musicBtn.classList.add('playing');
            document.getElementById('music-icon-on').style.display = 'block';
            document.getElementById('music-icon-off').style.display = 'none';
        }).catch(() => {
            // Browser blocked autoplay
            isMusicPlaying = false;
        });
    }
    
    // Scroll to mukadimah
    setTimeout(() => {
        document.getElementById('mukadimah').scrollIntoView({ behavior: 'smooth' });
    }, 300);
    
    initScrollReveal();
    initFadeInScroll();
    initCountdown();
    initParticles();
    loadWishes();
}

// ============================================
// PHOTO CAROUSEL
// ============================================
let currentSlide = 0;
const totalSlides = 5;
let autoSlideInterval = null;

function updateSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function nextSlide() { currentSlide = (currentSlide + 1) % totalSlides; updateSlide(); resetAutoSlide(); }
function prevSlide() { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateSlide(); resetAutoSlide(); }
function goToSlide(i) { currentSlide = i; updateSlide(); resetAutoSlide(); }

function startAutoSlide() { autoSlideInterval = setInterval(() => { currentSlide = (currentSlide + 1) % totalSlides; updateSlide(); }, 4000); }
function resetAutoSlide() { if (autoSlideInterval) clearInterval(autoSlideInterval); startAutoSlide(); }

// Touch swipe
let touchStartX = 0;
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('photo-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
        }, { passive: true });
    }
    startAutoSlide();
});

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
    const eventDate = new Date('2026-08-01T11:00:00+07:00').getTime();
    
    function update() {
        const now = new Date().getTime();
        const dist = eventDate - now;
        
        if (dist < 0) {
            ['days','hours','minutes','seconds'].forEach(id => {
                document.getElementById(id).textContent = '00';
            });
            return;
        }
        
        const d = Math.floor(dist / 86400000);
        const h = Math.floor((dist % 86400000) / 3600000);
        const m = Math.floor((dist % 3600000) / 60000);
        const s = Math.floor((dist % 60000) / 1000);
        
        animateNum('days', d);
        animateNum('hours', h);
        animateNum('minutes', m);
        animateNum('seconds', s);
    }
    
    function animateNum(id, value) {
        const el = document.getElementById(id);
        const cur = parseInt(el.textContent);
        if (cur !== value) {
            el.style.transform = 'translateY(-10px)';
            el.style.opacity = '0';
            setTimeout(() => {
                el.textContent = value.toString().padStart(2, '0');
                el.style.transform = 'translateY(10px)';
                setTimeout(() => { el.style.transform = 'translateY(0)'; el.style.opacity = '1'; }, 50);
            }, 150);
        }
    }
    
    update();
    setInterval(update, 1000);
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// ============================================
// FADE IN SCROLL (for circular photos)
// ============================================
function initFadeInScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.2 });
    
    document.querySelectorAll('.fade-in-scroll').forEach(el => observer.observe(el));
}

// ============================================
// FLOATING PARTICLES
// ============================================
function initParticles() {
    const container = document.getElementById('particles-container');
    const emojis = ['🌸', '🌺', '✿', '🍃', '❀', '🌷', '✦', '🌹'];
    
    function create() {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = `${Math.random() * 100}%`;
        p.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
        p.style.animationDuration = `${12 + Math.random() * 15}s`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.remove(); }, 30000);
    }
    
    for (let i = 0; i < 8; i++) setTimeout(create, i * 800);
    setInterval(create, 3000);
}

// ============================================
// GUESTBOOK / UCAPAN & DOA
// ============================================
const WISHES_KEY = 'kenzo_khitan_wishes';

function getWishes() {
    try {
        return JSON.parse(localStorage.getItem(WISHES_KEY)) || [];
    } catch { return []; }
}

function saveWishes(wishes) {
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
}

function submitWish(e) {
    e.preventDefault();
    
    const name = document.getElementById('wish-name').value.trim();
    const message = document.getElementById('wish-message').value.trim();
    const attendance = document.getElementById('wish-attendance').value;
    
    if (!name || !message) return;
    
    const wish = {
        id: Date.now(),
        name,
        message,
        attendance,
        time: new Date().toISOString()
    };
    
    const wishes = getWishes();
    wishes.unshift(wish);
    saveWishes(wishes);
    
    // Reset form
    document.getElementById('wish-form').reset();
    
    // Re-render
    renderWishes();
    
    // Show success feedback
    const btn = document.querySelector('.btn-submit-wish');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span>✅ Terkirim!</span>';
    btn.style.background = 'linear-gradient(135deg, #2E7D32, #43A047)';
    setTimeout(() => {
        btn.innerHTML = origText;
        btn.style.background = '';
    }, 2000);
}

function renderWishes() {
    const wishes = getWishes();
    const container = document.getElementById('wishes-list');
    const countEl = document.getElementById('wishes-count-number');
    
    countEl.textContent = wishes.length;
    
    // Clear existing wish cards (keep count div)
    const existingCards = container.querySelectorAll('.wish-card');
    existingCards.forEach(card => card.remove());
    
    wishes.forEach((wish, index) => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const initial = wish.name.charAt(0).toUpperCase();
        const timeAgo = getTimeAgo(wish.time);
        
        const attendanceLabels = {
            hadir: 'Hadir',
            tidak: 'Tidak Hadir',
            ragu: 'Ragu-ragu'
        };
        
        card.innerHTML = `
            <div class="wish-card-header">
                <div class="wish-avatar">${initial}</div>
                <div class="wish-meta">
                    <span class="wish-name">${escapeHtml(wish.name)}</span>
                    <span class="wish-time">${timeAgo}</span>
                </div>
                <span class="wish-attendance-badge ${wish.attendance}">${attendanceLabels[wish.attendance] || ''}</span>
            </div>
            <p class="wish-message">${escapeHtml(wish.message)}</p>
        `;
        
        container.appendChild(card);
    });
}

function loadWishes() {
    renderWishes();
}

function getTimeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay < 7) return `${diffDay} hari yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// MUSIC TOGGLE
// ============================================
let isMusicPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    
    if (musicBtn && audio) {
        musicBtn.addEventListener('click', () => {
            isMusicPlaying = !isMusicPlaying;
            const iconOn = document.getElementById('music-icon-on');
            const iconOff = document.getElementById('music-icon-off');
            
            if (isMusicPlaying) {
                audio.play();
                iconOn.style.display = 'block';
                iconOff.style.display = 'none';
                musicBtn.classList.add('playing');
            } else {
                audio.pause();
                iconOn.style.display = 'none';
                iconOff.style.display = 'block';
                musicBtn.classList.remove('playing');
            }
        });
    }
});

// ============================================
// SCROLL TO TOP
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const btn = document.getElementById('scroll-top');
    btn.classList.toggle('visible', window.scrollY > 600);
});

// ============================================
// PARALLAX on COVER
// ============================================
document.addEventListener('mousemove', (e) => {
    const coverBg = document.querySelector('.cover-bg-overlay');
    if (coverBg) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        coverBg.style.background = `
            radial-gradient(ellipse at ${x}% ${y}%, rgba(212, 160, 23, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at ${100-x}% ${100-y}%, rgba(139, 34, 82, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(212, 160, 23, 0.08) 0%, transparent 50%)
        `;
    }
});

// ============================================
// KEYBOARD NAV
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
});

console.log('🌹 Undangan Digital Walimatul Khitan - Muhammad Kenzo Al Barra');
console.log('🕌 Sabtu, 1 Agustus 2026 | Hutan Kota Srengseng');
