// --- 1. COUNTDOWN TIMER LOGIC ---
function updateCountdown() {
    const now = new Date();
    let currentYear = now.getFullYear();
    let nextBirthday = new Date(currentYear, 10, 21); // November = Month index 10

    // If Nov 21 has already passed this year, set for next year
    if (now > nextBirthday) {
        nextBirthday = new Date(currentYear + 1, 10, 21);
    }

    const diff = nextBirthday - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// --- 2. PHOTO REPLACEMENT LOGIC ---
function triggerFileSelect(index) {
    document.getElementById(`input-${index}`).click();
}

function loadPhoto(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById(`img-${index}`);
            imgElement.src = e.target.result;
            imgElement.classList.remove('hidden');
            
            // Hide placeholder if replacing the 4th image slot
            const placeholder = document.getElementById(`placeholder-${index}`);
            if (placeholder) {
                placeholder.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
}

// --- 3. AUDIO PLAYER LOGIC ---
const audio = document.getElementById('bg-audio');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const seekBar = document.getElementById('seek-bar');
const currTime = document.getElementById('curr-time');
const totalTime = document.getElementById('total-time');
const audioStatus = document.getElementById('audio-status');
const musicDisc = document.getElementById('music-disc');

function togglePlay() {
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.className = "fa-solid fa-pause";
            musicDisc.classList.add('animate-spin');
            audioStatus.innerText = "Playing One Love ♪";
        }).catch(() => {
            audioStatus.innerText = "Click play or choose song file 🎵";
        });
    } else {
        audio.pause();
        playIcon.className = "fa-solid fa-play ml-0.5";
        musicDisc.classList.remove('animate-spin');
        audioStatus.innerText = "Paused 🎵";
    }
}

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

audio.addEventListener('loadedmetadata', () => {
    totalTime.innerText = formatTime(audio.duration);
    seekBar.max = Math.floor(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    seekBar.value = Math.floor(audio.currentTime);
    currTime.innerText = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
});

function adjustVolume(val) {
    audio.volume = val;
}

function loadAudio(event) {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audio.src = fileURL;
        audio.play();
        playIcon.className = "fa-solid fa-pause";
        musicDisc.classList.add('animate-spin');
        audioStatus.innerText = file.name;
    }
}

// --- 4. CONFETTI ANIMATION LOGIC ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = Math.random() * 8 + 4;
        this.color = ['#C9E5F6', '#FFF0B8', '#F8D9E5', '#FFFFFF'][Math.floor(Math.random() * 4)];
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.7) * 14;
        this.gravity = 0.25;
        this.alpha = 1;
        this.rotation = Math.random() * 360;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 0.012;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function triggerConfetti() {
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
    requestAnimationFrame(animateConfetti);
}
animateConfetti();

// --- 5. CUSTOM CURSOR TRAIL ---
const cursor = document.getElementById('custom-cursor');
window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX - 8}px`;
    cursor.style.top = `${e.clientY - 8}px`;
});