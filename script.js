// State Variables
let currentSheet = 0;
const totalSheets = 4;
let enteredPin = "";
const correctPin = "7426";
let isUnlocked = false;

// DOM Elements
const book = document.getElementById('book');
const sheets = [
    document.getElementById('sheet-1'),
    document.getElementById('sheet-2'),
    document.getElementById('sheet-3'),
    document.getElementById('sheet-4')
];
const pinDots = document.querySelectorAll('.pin-dot');
const pinError = document.getElementById('pin-error');
const pageIndicator = document.getElementById('page-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Audio Player Controls
const audioPlayer = document.getElementById('audio-player');
const playIcon = document.getElementById('play-icon');
const vinyl = document.getElementById('vinyl');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');

// Pin Pad Functions
function pressPin(num) {
    if (enteredPin.length < 4) {
        enteredPin += num;
        updatePinDisplay();
    }
}

function clearPin() {
    enteredPin = "";
    updatePinDisplay();
    pinError.textContent = "";
}

function updatePinDisplay() {
    pinDots.forEach((dot, index) => {
        dot.value = enteredPin[index] ? "•" : "";
    });
}

function submitPin() {
    if (enteredPin === correctPin) {
        isUnlocked = true;
        pinError.textContent = "";
        nextPage();
    } else {
        pinError.textContent = "Incorrect date! Try again.";
        clearPin();
    }
}

// Navigation Functions
function updatePageIndicator() {
    if (currentSheet === 0) {
        pageIndicator.textContent = "Cover";
    } else if (currentSheet === totalSheets) {
        pageIndicator.textContent = "Back Cover";
    } else {
        pageIndicator.textContent = `Page ${currentSheet * 2 - 1} - ${currentSheet * 2}`;
    }

    prevBtn.disabled = currentSheet === 0;
    nextBtn.disabled = currentSheet === totalSheets;
}

function nextPage() {
    if (!isUnlocked && currentSheet === 0) {
        pinError.textContent = "Please enter the passcode first!";
        return;
    }
    if (currentSheet < totalSheets) {
        sheets[currentSheet].style.transform = "rotateY(-180deg)";
        currentSheet++;
        updateZIndex();
        updatePageIndicator();
    }
}

function prevPage() {
    if (currentSheet > 0) {
        currentSheet--;
        sheets[currentSheet].style.transform = "rotateY(0deg)";
        updateZIndex();
        updatePageIndicator();
    }
}

function updateZIndex() {
    sheets.forEach((sheet, index) => {
        if (index < currentSheet) {
            sheet.style.zIndex = index + 1;
        } else {
            sheet.style.zIndex = totalSheets - index;
        }
    });
}

// Audio Functions
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.className = "fas fa-pause";
        vinyl.classList.add('playing');
    } else {
        audioPlayer.pause();
        playIcon.className = "fas fa-play";
        vinyl.classList.remove('playing');
    }
}

audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = pct + "%";
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        totalDurationEl.textContent = formatTime(audioPlayer.duration);
    }
});

function seekTrack(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioPlayer.duration;
    if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Coupon Redeem Functionality
function redeemCoupon(id) {
    const card = document.getElementById(`coupon-${id}`);
    const btn = card.querySelector('.redeem-btn');
    card.classList.add('redeemed');
    btn.textContent = "Redeemed ❤️";
    btn.disabled = true;
    localStorage.setItem(`coupon-${id}`, 'true');
}

// Check saved coupons on load
window.addEventListener('DOMContentLoaded', () => {
    updatePageIndicator();
    [1, 2].forEach(id => {
        if (localStorage.getItem(`coupon-${id}`) === 'true') {
            const card = document.getElementById(`coupon-${id}`);
            if (card) {
                const btn = card.querySelector('.redeem-btn');
                card.classList.add('redeemed');
                btn.textContent = "Redeemed ❤️";
                btn.disabled = true;
            }
        }
    });
});
