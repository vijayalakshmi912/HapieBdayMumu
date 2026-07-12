// ==========================
// Question Typewriter
// ==========================

const question = "Mukesh,Will you be my Valentine?";
let q = 0;

function typeQuestion() {
    if (q < question.length) {
        document.getElementById("question").innerHTML += question.charAt(q);
        q++;
        setTimeout(typeQuestion, 80);
    }
}

// ==========================
// EMOJI BURST ON BUTTON CLICK
// (reuses the existing .heart class + floatHeart
//  keyframe animation already defined in style.css,
//  so no extra CSS is needed)
// ==========================

function popEmoji(emoji, event, count = 10) {
    if (!event) return;
    const x = event.clientX;
    const y = event.clientY;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement("div");
            el.classList.add("heart"); // reuses existing floatHeart animation

            const spreadX   = (Math.random() - 0.5) * 140; // side spread
            const size      = 20 + Math.random() * 22;
            const duration  = 1.8 + Math.random() * 1.4;

            el.textContent = emoji;
            el.style.left  = (x + spreadX) + "px";
            el.style.top   = y + "px";
            el.style.fontSize = size + "px";
            el.style.animationDuration = duration + "s";

            document.body.appendChild(el);

            setTimeout(() => {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, (duration + 0.5) * 1000);
        }, i * 35);
    }
}

// ==========================
// PAPER FALLING EFFECT
// ==========================

const paperColors = [
    "#f9c6d4","#fde2b5","#c8e6f9","#d4f1c8",
    "#e8c8f9","#ffd6e0","#fff0a0","#ffc8e8",
    "#ffb3c1","#c8f9e8","#f9e8c8","#c8c8f9"
];

let paperInterval = null;

function createPaperPiece() {
    const container = document.getElementById("paper-container");
    if (!container) return;

    const el = document.createElement("div");
    el.classList.add("paper-piece");

    const isRect   = Math.random() > 0.4;
    const baseSize = 7 + Math.random() * 11;
    const width    = isRect ? baseSize : baseSize * 0.55;
    const height   = isRect ? baseSize : baseSize * 1.7;
    const duration = 2.8 + Math.random() * 3.5;
    const color    = paperColors[Math.floor(Math.random() * paperColors.length)];
    const startX   = Math.random() * 100;

    el.style.cssText = `
        left:${startX}%;
        width:${width}px;
        height:${height}px;
        background:${color};
        animation-duration:${duration}s;
        animation-delay:${Math.random() * 0.5}s;
    `;

    container.appendChild(el);

    // Remove after animation ends to keep DOM clean
    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, (duration + 0.8) * 1000);
}

function startPaperFall() {
    if (paperInterval) return;
    // Burst of initial pieces
    for (let i = 0; i < 25; i++) {
        setTimeout(createPaperPiece, i * 80);
    }
    // Continuous stream
    paperInterval = setInterval(createPaperPiece, 180);
}

function stopPaperFall() {
    if (paperInterval) {
        clearInterval(paperInterval);
        paperInterval = null;
    }
    // Fade out remaining pieces
    const container = document.getElementById("paper-container");
    if (container) container.innerHTML = "";
}

// ==========================
// Continuous Confetti
// ==========================

let confettiInterval;

function startConfetti() {
    confettiInterval = setInterval(() => {
        confetti({
            particleCount: 8,
            angle: 90,
            spread: 180,
            startVelocity: 25,
            origin: { x: Math.random(), y: 0 }
        });
    }, 200);
}

function stopConfetti() {
    clearInterval(confettiInterval);
}

// ==========================
// One Continuous Background Song
// (Page 1 → Page 5, non-stop. Only lowers/pauses briefly
//  while the Page 3 video plays so its own audio is heard.)
// ==========================

// Logs a clear, readable reason to the browser console (F12 → Console tab)
// whenever the song fails to load or play — instead of failing silently.
function attachSongDebugLogging() {
    const el = document.getElementById("bgMusic");
    if (!el) return;
    el.addEventListener("error", function() {
        console.error(
            "[bgMusic] could not load its audio file. " +
            "Check that Songs/BgSong.mp3 exists at that exact path " +
            "and that the filename/extension match exactly (case-sensitive)."
        );
    });
}

function startBgMusic() {
    const el = document.getElementById("bgMusic");
    if (!el) return;
    el.volume = 1;
    el.play().catch((err) => {
        console.warn("[bgMusic] autoplay blocked, will start on first click instead:", err);
    });
}

// Browsers block audio autoplay before any user interaction.
// This makes sure the song starts the moment the person taps
// ANYTHING on the page, even before they click YES.
function armBgMusicFallback() {
    function tryStartOnce() {
        const el = document.getElementById("bgMusic");
        if (el && el.paused) el.play().catch(() => {});
        document.removeEventListener("click", tryStartOnce);
        document.removeEventListener("touchstart", tryStartOnce);
    }
    document.addEventListener("click", tryStartOnce);
    document.addEventListener("touchstart", tryStartOnce);
}

// Used only around the Page 3 video so its own audio can be heard
function duckBgMusicForVideo() {
    const el = document.getElementById("bgMusic");
    if (!el) return;
    el.volume = 0.12; // lowered, not fully stopped — song keeps running underneath
}

function restoreBgMusicVolume() {
    const el = document.getElementById("bgMusic");
    if (!el) return;
    el.volume = 1;
}

// ==========================
// Show Next Page
// ==========================

function showPage(page) {
    document.querySelectorAll(".page").forEach(function(p) {
        p.classList.remove("active");
    });
    document.getElementById("page" + page).classList.add("active");

    // Page 1 → Paper falling
    if (page == 1) {
        startPaperFall();
        stopConfetti();
        stopFireworks();
        stopHeartFall();
        stopCouple();
        stopBalloons();
        stopPhotoFloat();
    }
    // Page 2 → Confetti + Balloons
    else if (page == 2) {
        stopPaperFall();
        startConfetti();
        stopFireworks();
        stopHeartFall();
        stopCouple();
        startBalloons();
        stopPhotoFloat();
    }
    // Page 3 → Bubbles only
    else if (page == 3) {
        stopConfetti();
        stopPaperFall();
        stopHeartFall();
        stopBalloons();
        stopFireworks();
        startCouple();
        stopPhotoFloat();
    }
    // Page 4 → Paper falling + Bubbles
    else if (page == 4) {
        stopConfetti();
        stopHeartFall();
        stopFireworks();
        stopBalloons();
        startPaperFall();
        startCouple();
        stopPhotoFloat();
    }
    // Page 5 → Hearts + confetti + Fireworks + tiny floating photos
    else if (page == 5) {
        stopPaperFall();
        stopCouple();
        stopBalloons();
        startConfetti();
        startHeartFall();
        startFireworks();
        startPhotoFloat();
    }
}

// ==========================
// FIREWORK SPARKS (Page 3)
// ==========================

let fireworkCanvas = null;
let fireworkCtx    = null;
let fireworkRAF    = null;
let fireworkTimer  = null;
let sparks         = [];

const sparkColors = [
    "#ff2d55","#ff9500","#ffcc00","#34c759",
    "#5ac8fa","#af52de","#ff375f","#fff"
];

function initFireworkCanvas() {
    if (document.getElementById("firework-canvas")) return;
    fireworkCanvas = document.createElement("canvas");
    fireworkCanvas.id = "firework-canvas";
    fireworkCanvas.style.cssText = `
        position:fixed;top:0;left:0;
        width:100%;height:100%;
        pointer-events:none;
        z-index:9998;
    `;
    document.body.appendChild(fireworkCanvas);
    resizeFireworkCanvas();
    window.addEventListener("resize", resizeFireworkCanvas);
}

function resizeFireworkCanvas() {
    if (!fireworkCanvas) return;
    fireworkCanvas.width  = window.innerWidth;
    fireworkCanvas.height = window.innerHeight;
}

function launchBurst() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.7;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    const count = 28 + Math.floor(Math.random() * 20);

    for (let i = 0; i < count; i++) {
        const angle    = (Math.PI * 2 / count) * i + Math.random() * 0.3;
        const speed    = 2.5 + Math.random() * 4.5;
        const life     = 55 + Math.floor(Math.random() * 40);
        const tailLen  = 4 + Math.random() * 6;
        sparks.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            alpha: 1,
            life,
            maxLife: life,
            tailLen,
            size: 1.5 + Math.random() * 1.5
        });
    }
}

function drawFireworks() {
    if (!fireworkCtx) return;
    fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);

    sparks = sparks.filter(s => s.life > 0);

    for (const s of sparks) {
        s.alpha = s.life / s.maxLife;
        s.vy   += 0.08;           // gravity
        s.vx   *= 0.97;           // drag
        s.vy   *= 0.97;

        const nx = s.x + s.vx;
        const ny = s.y + s.vy;

        fireworkCtx.save();
        fireworkCtx.globalAlpha = s.alpha;
        fireworkCtx.strokeStyle = s.color;
        fireworkCtx.lineWidth   = s.size;
        fireworkCtx.lineCap     = "round";
        fireworkCtx.shadowColor = s.color;
        fireworkCtx.shadowBlur  = 6;

        fireworkCtx.beginPath();
        fireworkCtx.moveTo(s.x, s.y);
        fireworkCtx.lineTo(nx, ny);
        fireworkCtx.stroke();
        fireworkCtx.restore();

        s.x = nx;
        s.y = ny;
        s.life--;
    }

    fireworkRAF = requestAnimationFrame(drawFireworks);
}

function startFireworks() {
    if (fireworkTimer) return;
    initFireworkCanvas();
    fireworkCtx = fireworkCanvas.getContext("2d");
    fireworkCanvas.style.display = "block";

    // Burst every 600ms — continuous cracker feel
    launchBurst();
    fireworkTimer = setInterval(launchBurst, 600);
    drawFireworks();
}

function stopFireworks() {
    if (fireworkTimer) {
        clearInterval(fireworkTimer);
        fireworkTimer = null;
    }
    if (fireworkRAF) {
        cancelAnimationFrame(fireworkRAF);
        fireworkRAF = null;
    }
    sparks = [];
    if (fireworkCanvas) {
        fireworkCanvas.style.display = "none";
        if (fireworkCtx) fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
    }
}

// ==========================
// HEART FALLING EFFECT (Page 5)
// ==========================

// FIX: removed the stray double comma that was here before
// ("💖",, "💓") — that created an empty/undefined slot in the
// array, which could randomly render the word "undefined"
// instead of a heart emoji.
const heartEmojis = ["❤️","💓","💞"];
let heartInterval = null;

function createFallingHeart() {
    const container = document.getElementById("paper-container");
    if (!container) return;

    const el = document.createElement("div");
    el.classList.add("paper-piece");

    const emoji    = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    const size     = 18 + Math.random() * 22;
    const duration = 3 + Math.random() * 4;
    const startX   = Math.random() * 100;
    const sway     = (Math.random() - 0.5) * 60;

    el.style.cssText = `
        left:${startX}%;
        font-size:${size}px;
        background:transparent;
        border-radius:0;
        animation-duration:${duration}s;
        animation-delay:${Math.random() * 0.5}s;
        animation-name:heartFall;
        --sway:${sway}px;
    `;
    el.textContent = emoji;

    container.appendChild(el);

    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, (duration + 1) * 1000);
}

function startHeartFall() {
    if (heartInterval) return;
    for (let i = 0; i < 20; i++) {
        setTimeout(createFallingHeart, i * 100);
    }
    heartInterval = setInterval(createFallingHeart, 200);
}

function stopHeartFall() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

// ==========================
// TINY FLOATING PHOTOS (Page 5)
// Reuses the same photos[] gallery from the slideshow,
// shown as tiny circular thumbnails floating up like the
// hearts, using the same heartFall keyframe/animation.
// ==========================

let photoFloatInterval = null;

function createFloatingPhoto() {
    const container = document.getElementById("paper-container");
    if (!container) return;

    const el = document.createElement("img");
    el.classList.add("floating-photo");
    el.src = photos[Math.floor(Math.random() * photos.length)];

    const size     = 34 + Math.random() * 26; // tiny thumbnail size
    const duration = 4 + Math.random() * 4;
    const startX   = Math.random() * 100;
    const sway     = (Math.random() - 0.5) * 70;

    el.style.cssText = `
        left:${startX}%;
        width:${size}px;
        height:${size}px;
        animation-duration:${duration}s;
        animation-delay:${Math.random() * 0.6}s;
        animation-name:heartFall;
        --sway:${sway}px;
    `;

    container.appendChild(el);

    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, (duration + 1) * 1000);
}

function startPhotoFloat() {
    if (photoFloatInterval) return;
    for (let i = 0; i < 10; i++) {
        setTimeout(createFloatingPhoto, i * 300);
    }
    photoFloatInterval = setInterval(createFloatingPhoto, 900);
}

function stopPhotoFloat() {
    if (photoFloatInterval) {
        clearInterval(photoFloatInterval);
        photoFloatInterval = null;
    }
}

// ==========================
// BALLOON FLOATING EFFECT (All Pages)
// ==========================

let balloonCanvas = null;
let balloonCtx    = null;
let balloonRAF    = null;
let balloonTimer  = null;
let balloons      = [];

const balloonColors = [
    "#ff2d55","#ff9500","#ffcc00","#34c759",
    "#5ac8fa","#af52de","#ff6eb4","#ff3b30",
    "#64d2ff","#ffd60a","#ff6961","#b19cd9"
];

function createBalloon() {
    const colors = balloonColors;
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const rx     = 18 + Math.random() * 18;
    const ry     = rx * 1.25;
    const x      = Math.random() * window.innerWidth;
    const speed  = 0.6 + Math.random() * 1.2;
    const sway   = (Math.random() - 0.5) * 1.2;
    const stringLen = 30 + Math.random() * 20;

    balloons.push({
        x,
        y: window.innerHeight + ry + stringLen + 10,
        rx, ry,
        color,
        speed,
        sway,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
        stringLen,
        alpha: 0.92
    });
}

function initBalloonCanvas() {
    if (document.getElementById("balloon-canvas")) return;
    balloonCanvas = document.createElement("canvas");
    balloonCanvas.id = "balloon-canvas";
    balloonCanvas.style.cssText = `
        position:fixed;top:0;left:0;
        width:100%;height:100%;
        pointer-events:none;
        z-index:9997;
    `;
    document.body.appendChild(balloonCanvas);
    resizeBalloonCanvas();
    window.addEventListener("resize", resizeBalloonCanvas);
}

function resizeBalloonCanvas() {
    if (!balloonCanvas) return;
    balloonCanvas.width  = window.innerWidth;
    balloonCanvas.height = window.innerHeight;
}

function drawSingleBalloon(ctx, b) {
    ctx.save();
    ctx.globalAlpha = b.alpha;

    // Balloon body
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();

    // Shine highlight
    ctx.beginPath();
    ctx.ellipse(b.x - b.rx * 0.28, b.y - b.ry * 0.3, b.rx * 0.22, b.ry * 0.18, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill();

    // Knot at bottom
    ctx.beginPath();
    ctx.arc(b.x, b.y + b.ry, 4, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();

    // String — wavy
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + b.ry + 4);
    const cp1x = b.x + 10 * Math.sin(b.swayAngle);
    const cp1y = b.y + b.ry + b.stringLen * 0.5;
    const endx = b.x - 6 * Math.sin(b.swayAngle);
    const endy = b.y + b.ry + b.stringLen;
    ctx.quadraticCurveTo(cp1x, cp1y, endx, endy);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
}

function animateBalloons() {
    if (!balloonCtx) return;
    balloonCtx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);

    balloons = balloons.filter(b => b.y + b.ry + b.stringLen > -20);

    for (const b of balloons) {
        b.swayAngle += b.swaySpeed;
        b.x += Math.sin(b.swayAngle) * b.sway;
        b.y -= b.speed;
        drawSingleBalloon(balloonCtx, b);
    }

    balloonRAF = requestAnimationFrame(animateBalloons);
}

function startBalloons() {
    if (balloonTimer) return;
    initBalloonCanvas();
    balloonCtx = balloonCanvas.getContext("2d");
    balloonCanvas.style.display = "block";

    // Initial burst
    for (let i = 0; i < 8; i++) {
        setTimeout(createBalloon, i * 180);
    }
    // Continuous — one new balloon every 1.2s
    balloonTimer = setInterval(createBalloon, 1200);
    animateBalloons();
}

function stopBalloons() {
    if (balloonTimer) {
        clearInterval(balloonTimer);
        balloonTimer = null;
    }
    if (balloonRAF) {
        cancelAnimationFrame(balloonRAF);
        balloonRAF = null;
    }
    balloons = [];
    if (balloonCanvas) {
        balloonCanvas.style.display = "none";
        if (balloonCtx) balloonCtx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);
    }
}

// ==========================
// BUBBLE FLOATING (Pages 3 & 4)
// ==========================

let bubbleCanvas  = null;
let bubbleCtx     = null;
let bubbleRAF     = null;
let bubbleTimer   = null;
let bubbles       = [];

function initBubbleCanvas() {
    if (document.getElementById("bubble-canvas")) return;
    bubbleCanvas = document.createElement("canvas");
    bubbleCanvas.id = "bubble-canvas";
    bubbleCanvas.style.cssText = `
        position:fixed;top:0;left:0;
        width:100%;height:100%;
        pointer-events:none;
        z-index:9996;
    `;
    document.body.appendChild(bubbleCanvas);
    resizeBubbleCanvas();
    window.addEventListener("resize", resizeBubbleCanvas);
}

function resizeBubbleCanvas() {
    if (!bubbleCanvas) return;
    bubbleCanvas.width  = window.innerWidth;
    bubbleCanvas.height = window.innerHeight;
}

function spawnBubble() {
    const r     = 18 + Math.random() * 30;
    const x     = r + Math.random() * (window.innerWidth - r * 2);
    const speed = 0.5 + Math.random() * 1.0;
    const sway  = (Math.random() - 0.5) * 1.2;
    const hue   = Math.random() * 360;
    bubbles.push({
        x, y: window.innerHeight + r + 10,
        r, speed, sway,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02,
        hue, alpha: 0
    });
}

function drawBubble(ctx, b) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.75, b.alpha);

    const grad = ctx.createRadialGradient(
        b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.05,
        b.x, b.y, b.r
    );
    grad.addColorStop(0,   `hsla(${b.hue},80%,95%,0.55)`);
    grad.addColorStop(0.6, `hsla(${b.hue},70%,80%,0.15)`);
    grad.addColorStop(1,   `hsla(${b.hue},60%,70%,0.45)`);

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = `hsla(${b.hue},60%,85%,0.6)`;
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Main shine
    ctx.beginPath();
    ctx.ellipse(b.x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.22, b.r * 0.14, -0.6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fill();

    // Small shine
    ctx.beginPath();
    ctx.ellipse(b.x + b.r * 0.28, b.y - b.r * 0.48, b.r * 0.08, b.r * 0.05, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fill();

    ctx.restore();
}

function animateBubbles() {
    if (!bubbleCtx) return;
    bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

    bubbles = bubbles.filter(b => b.y + b.r > -20);

    for (const b of bubbles) {
        b.wobble += b.wobbleSpeed;
        b.x      += Math.sin(b.wobble) * b.sway;
        b.y      -= b.speed;
        b.alpha   = Math.min(0.75, b.alpha + 0.025);
        drawBubble(bubbleCtx, b);
    }

    bubbleRAF = requestAnimationFrame(animateBubbles);
}

function startCouple() {
    if (bubbleTimer) return;
    initBubbleCanvas();
    bubbleCtx = bubbleCanvas.getContext("2d");
    bubbleCanvas.style.display = "block";

    for (let i = 0; i < 6; i++) setTimeout(spawnBubble, i * 250);
    bubbleTimer = setInterval(spawnBubble, 800);
    animateBubbles();
}

function stopCouple() {
    if (bubbleTimer) {
        clearInterval(bubbleTimer);
        bubbleTimer = null;
    }
    if (bubbleRAF) {
        cancelAnimationFrame(bubbleRAF);
        bubbleRAF = null;
    }
    bubbles = [];
    if (bubbleCanvas) {
        bubbleCanvas.style.display = "none";
        if (bubbleCtx) bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
    }
}


// ==========================
// Moving NO Button
// ==========================

const noBtn = document.getElementById("noBtn");

noBtn.addEventListener("mouseover", function() {
    let x = Math.random() * (window.innerWidth - 150);
    let y = Math.random() * (window.innerHeight - 100);
    noBtn.style.left = x + "px";
    noBtn.style.top  = y + "px";
});

// ==========================
// Photo Slideshow
// ==========================

const photos = [
    "Images/MuviPgimg3.jpeg",
    "Images/MuviPgimg4.jpeg",
    "Images/MuviPgimg5.jpeg",
    "Images/MuviPgimg6.jpeg",
    "Images/MuviPgimg7.jpeg",
    "Images/MuviPgimg8.jpeg",
    "Images/MuviPgimg9.jpeg",
    "Images/MuviPgimg10.jpeg",
    "Images/MuviPgimg11.jpeg",
    "Images/MuviPgimg12.jpeg",
    "Images/MuviPgimg13.jpeg",
    "Images/MuviPgimg14.jpeg",
    "Images/MuviPgimg15.jpeg",
    "Images/MuviPgimg16.jpeg"
];

const captions = [
    "Our first meet,First selfie🥰",
    "Our first outing #temple dating🧿",
    "His love bloomed in my hair🫣",
    "Our first together festival #Pongal🥰",
    "Every Moment With You Is Special 💕",
    "Holding you always like this😉",
    "Forever Together💖",
    "Little version of us👶👧",
    "With him more blessed💖",
    "Draped in black, wrapped in his love🖤✨",
    "No matter the angle, I'll always choose you🫶",
    "Excessive cuddles ahead! 🤭❤️",
    "In every blink is a art of saying without speaking👀💖",
    "Wandering the world with my Mumu🌍✨"
];

let index    = 0;
let interval;

function applyFadeEffect() {
    const img = document.getElementById("slideImage");
    img.classList.remove("fade");
    void img.offsetWidth;
    img.classList.add("fade");
}

function startSlideshow() {
    showPage(3);
    startFireworks();

    index = 0;
    document.getElementById("slideImage").src           = photos[index];
    document.getElementById("caption").innerHTML        = captions[index];
    document.getElementById("nextPage4").style.display  = "none";
    document.getElementById("hugHint").style.display    = "none";

    applyFadeEffect();

    interval = setInterval(function() {
        index++;

        if (index < photos.length) {
            document.getElementById("slideImage").src    = photos[index];
            document.getElementById("caption").innerHTML = captions[index];
            applyFadeEffect();
        } else {
            clearInterval(interval);

            // Video is about to play — lower (not stop) the bg song so
            // the video's own audio can be heard clearly
            //duckBgMusicForVideo();

            // Hide photo, show video
            document.getElementById("slideImage").style.display = "none";

            const video = document.getElementById("slideVideo");
            video.style.display = "block";
            video.play();

            document.getElementById("caption").innerHTML = "A Special Memory Just for You❤️";

            video.onended = function() {
                document.getElementById("nextPage4").style.display = "inline-flex";
                document.getElementById("hugHint").style.display   = "block";
                restoreBgMusicVolume();
            };
        }
    }, 3000);
}

// ==========================
// Submit Button
// ==========================

function submitAnswer() {
    showPage(5);
    startFinalCelebration();
    startTypewriter();
}

// Funny lines when the box is left empty
const emptyFieldLines = [
    "Blank-ah vittutu shortcut adikkadha babe, type pannunga!🙈"
];

// Funny lines when something is typed but it's not the right phrase
const wrongAnswerLines = [
    "😜Nope! Type it properly babe!",
];

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function submitAnswer1() {
    const answer = document.getElementById("answer").value.trim();
    const error  = document.getElementById("errorMsg");

    if (answer === "") {
        error.innerHTML = pickRandom(emptyFieldLines);
        return;
    }

    if (answer.toLowerCase() !== "i love you viji") {
        error.innerHTML = pickRandom(wrongAnswerLines);
        return;
    }

    error.innerHTML = "";

    showPage(5);
    startTypewriter();
}

// ==========================
// Typewriter Message
// (broken into styled segments so the
//  "To my future Director..." line can be
//  bold, left-aligned, and stand out like a
//  real handwritten letter)
// ==========================

const letterSegments = [
    {
        text: "The day you came into my life, everything became more colorful and meaningful. Thank you for filling my heart with love, happiness, and endless smiles. No matter what life brings us, I promise to stand by your side through every joy and every challenge. I want to create a lifetime of beautiful memories with you. You are my greatest blessing, and I love you more than words can express.",
        tag: "p",
        className: "letter-body"
    },
    {
        text: "❈ ❈ ❈",
        tag: "p",
        className: "letter-divider"
    },
    {
        text: "To my future Director... 🎬❤️",
        tag: "p",
        className: "letter-heading"
    },
    {
        text: `I'm already waiting for my first-day, first-show ticket to your debut movie. And don't forget to add a special "For My Viji ❤️" in the credits too😉. Don't make your heroine wait! I'll always be your biggest fan, your loudest cheerleader, and your forever supporter. I can't wait for the day I see "Directed by Mukesh Aathilakshmi" lighting up the big screen. I know that day isn't far away, and I'll be the proudest person in the theatre, cheering the loudest for you❤️.`,
        tag: "p",
        className: "letter-body"
    },
    {
        text: "Let's celebrate every birthday together from now on, and one day, we'll celebrate your blockbuster success too.",
        tag: "p",
        className: "letter-body"
    },
    {
        text: "Happy Birthday, my forever. I love you endlessly. ❤️🎂✨",
        tag: "p",
        className: "letter-closing"
    }
];

const TYPE_SPEED_MS = 100; // lower = faster typing

function startTypewriter() {
    const container = document.getElementById("typewriter");
    if (!container) return;
    container.innerHTML = "";
    typeSegment(0, 0);
}

// Types one character at a time into whichever segment element is active.
// Each segment gets its own element (created once, reused while typing) so
// per-line styling (bold heading, divider, closing line) stays clean and
// never risks broken/half-open HTML tags mid-animation.
function typeSegment(segIndex, charIndex) {
    if (segIndex >= letterSegments.length) return;

    const container = document.getElementById("typewriter");
    const seg = letterSegments[segIndex];
    const elId = "letterSeg" + segIndex;

    let el = document.getElementById(elId);
    if (!el) {
        el = document.createElement(seg.tag);
        el.id = elId;
        el.className = seg.className;
        container.appendChild(el);
    }

    if (charIndex < seg.text.length) {
        el.textContent += seg.text.charAt(charIndex);
        setTimeout(() => typeSegment(segIndex, charIndex + 1), TYPE_SPEED_MS);
    } else {
        // brief pause between segments feels more like a letter being written
        setTimeout(() => typeSegment(segIndex + 1, 0), 350);
    }
}

// ==========================
// Start on Load
// ==========================
window.onload = function() {
    typeQuestion();
    startPaperFall();
    attachSongDebugLogging();
    startBgMusic();        // try to start right away
    armBgMusicFallback();  // if the browser blocked it, start on first tap/click
};