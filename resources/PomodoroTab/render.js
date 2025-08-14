const iconPath = {
    'noteIcon': {
        default: '../../resources/icons/noteIcon.svg',
        hover: '../../resources/icons/noteIcon-hover.svg'
    },
    'configIcon': {
        default: '../../resources/icons/configIcon.svg',
        hover: '../../resources/icons/configIcon-hover.svg'
    },
    'timerIcon': {
        default: '../../resources/icons/timerIcon.svg',
        hover: '../../resources/icons/timerIcon-hover.svg'
    },
    'settingIcon': {
        default: '../../resources/icons/settingIcon.svg',
        hover: '../../resources/icons/settingIcon-hover.svg'
    },
    'startIcon': {
        clicked: '../../resources/icons/pause.svg',
        clickedHover: '../../resources/icons/pause-hover.svg'
    }
};

function initializeMenuHoverEffects() {
    const allMenuItem = document.querySelectorAll('.menu-item-link');
    const hoverColor = '#27B43E';
    const defaultIconFill = '#C3BBBB';
    const defaultTextColor = '#C3BBBB';


    allMenuItem.forEach(menuItemLink => {
        const menuIcon = menuItemLink.querySelector('.menu-icon');
        const menuText = menuItemLink.querySelector('.menu-text');
        const menuUnderline = menuItemLink.querySelector('.menu-underline');
        if (menuIcon && menuText && menuUnderline) {
            const iconId = menuIcon.id;
            menuItemLink.addEventListener('mouseenter', function () {
                menuIcon.style.stroke = "#27B43E";
                menuIcon.style.fill = "#27B43E";
                menuText.style.color = hoverColor;
                if (iconPath[iconId] && iconPath[iconId].hover) {
                    menuIcon.src = iconPath[iconId].hover;
                }
            });
            menuItemLink.addEventListener('mouseleave', function () {
                menuIcon.style.stroke = "#C3BBBB";
                menuIcon.style.fill = "#C3BBBB";
                menuText.style.color = defaultTextColor;
                if (iconPath[iconId] && iconPath[iconId].default) {
                    menuIcon.src = iconPath[iconId].default;
                }
            });
        } else {
            console.log('element not found!');
        }
    });
}

function initializetTopbarHoverEffects() {
    const exitIcon = document.getElementById('exit');
    const minIcon = document.getElementById('minimize');
    const defaultIconExit = '../../resources/icons/exit.svg';
    const hoverIconExit = '../../resources/icons/exit-hover.svg';
    const defaultIconmin = '../../resources/icons/minimize.svg';
    const hoverIconmin = '../../resources/icons/minimize-hover.svg';

    exitIcon.style.cursor = 'pointer';
    minIcon.style.cursor = 'pointer';
    if (minIcon && exitIcon) {
        exitIcon.addEventListener('mouseenter', function () {
            exitIcon.src = hoverIconExit;
            exitIcon.style.background = 'rgba(5, 1, 39, 1)';
        })
        exitIcon.addEventListener('mouseleave', function () {
            exitIcon.src = defaultIconExit;
            exitIcon.style.background = 'rgb(3, 1, 26)';
        })
        minIcon.addEventListener('mouseenter', function () {
            minIcon.src = hoverIconmin;
            minIcon.style.background = 'rgba(5, 1, 39, 1)';
        })
        minIcon.addEventListener('mouseleave', function () {
            minIcon.src = defaultIconmin;
            minIcon.style.background = 'rgb(3, 1, 26)';
        })
    }
}
initializeMenuHoverEffects();
initializetTopbarHoverEffects();


const resetIcon = document.getElementById('restIcon');
const startIcon = document.getElementById('startIcon');
const forwardIcon = document.getElementById('forwardIcon');
const soundIcon = document.getElementById('soundIcon');
const progressCircle = document.getElementById('progressCircle');
const timeDisplay = document.getElementById('timeDisplay');
const foucesPic = document.getElementById('foucesPic');

function controllTimerIcon() {
    soundIcon.addEventListener('click', () => {
        soundIcon.classList.toggle('active');
    });
}
document.addEventListener('DOMContentLoaded', controllTimerIcon);

const starterTimer = {
    'focusTime': 25 * 60,
    'shortBreakTime': 5 * 60, 
    'longBreakTime': 15 * 60,  
};

// --- متغیرهای وضعیت تایمر ---
let isWorkTime = true;
let cycleCount = 0;
let totalDuration = starterTimer.focusTime;
let leftTime = 0;
let intervalId = null;
const circumference = 2 * Math.PI * 45;

// --- توابع کمکی ---
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formatMinutes = String(minutes).padStart(2, '0');
    const formatSeconds = String(seconds).padStart(2, '0');
    return `${formatMinutes}:${formatSeconds}`;
}

function updateProgressCircle() {
    if (totalDuration === 0) return;
    const offset = circumference - (circumference * (leftTime / totalDuration));
    progressCircle.style.strokeDashoffset = offset;
}

// --- توابع اصلی تایمر ---
function startTimer() {
    if (intervalId !== null) return;

    startIcon.classList.add('is-running', 'active');

    if (leftTime <= 0) {
        if (isWorkTime) {
            cycleCount++;
            isWorkTime = false;
            leftTime = (cycleCount % 4 === 0) ? starterTimer.longBreakTime : starterTimer.shortBreakTime;
        } else {
            isWorkTime = true;
            leftTime = starterTimer.focusTime;
        }
        totalDuration = leftTime;
        timeDisplay.textContent = formatTime(leftTime);
        progressCircle.style.strokeDashoffset = 0;
    }
    
    const endTime = Date.now() + leftTime * 1000;
    localStorage.setItem('timerEndTime', endTime);
    localStorage.setItem('timerIsWorkTime', isWorkTime);
    localStorage.setItem('timerCycleCount', cycleCount);
    localStorage.setItem('timerTotalDuration', totalDuration);
    localStorage.setItem('timerIsRunning', 'true');

    intervalId = setInterval(() => {
        leftTime--;
        timeDisplay.textContent = formatTime(leftTime);
        updateProgressCircle();

        if (leftTime <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            leftTime = 0;
            startIcon.classList.remove('is-running', 'active');
            
            if (isWorkTime) {
                const nextBreakTime = ((cycleCount + 1) % 4 === 0) ? starterTimer.longBreakTime : starterTimer.shortBreakTime;
                timeDisplay.textContent = formatTime(nextBreakTime);
            } else {
                timeDisplay.textContent = formatTime(starterTimer.focusTime);
            }
            progressCircle.style.strokeDashoffset = 0;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    startIcon.classList.remove('is-running', 'active');
    localStorage.setItem('timerIsRunning', 'false');
}

function resetTimer() {
    clearInterval(intervalId);
    intervalId = null;
    isWorkTime = true;
    cycleCount = 0;
    leftTime = starterTimer.focusTime;
    totalDuration = starterTimer.focusTime;
    timeDisplay.textContent = formatTime(leftTime);
    progressCircle.style.strokeDashoffset = '0';
    startIcon.classList.remove('is-running', 'active');
    localStorage.removeItem('timerEndTime');
    localStorage.removeItem('timerIsWorkTime');
    localStorage.removeItem('timerCycleCount');
    localStorage.removeItem('timerTotalDuration');
    localStorage.removeItem('timerIsRunning');
}

// --- رویدادهای کلیک ---
startIcon.addEventListener('click', function () {
    if (intervalId === null) {
        startTimer();
    } else {
        stopTimer();
    }
});

resetIcon.addEventListener('click', function () {
    resetTimer();
});

// --- رویداد اصلی بارگذاری صفحه ---
document.addEventListener('DOMContentLoaded', function () {
    const savedFocusTime = localStorage.getItem('focusTime');
    if (savedFocusTime) {
        starterTimer.focusTime = parseFloat(savedFocusTime) * 60;
    }
    
    const savedShortBreakTime = localStorage.getItem('shortBreakTime');
    if (savedShortBreakTime) {
        starterTimer.shortBreakTime = parseFloat(savedShortBreakTime) * 60;
    }
    
    const savedLongBreakTime = localStorage.getItem('longBreakTime');
    if (savedLongBreakTime) {
        starterTimer.longBreakTime = parseFloat(savedLongBreakTime) * 60;
    }

    const savedEndTime = localStorage.getItem('timerEndTime');
    if (savedEndTime) {
        const remainingSeconds = Math.round((savedEndTime - Date.now()) / 1000);
        
        if (remainingSeconds > 0) {
            leftTime = remainingSeconds;
            isWorkTime = localStorage.getItem('timerIsWorkTime') === 'true';
            cycleCount = parseInt(localStorage.getItem('timerCycleCount')) || 0;
            totalDuration = parseInt(localStorage.getItem('timerTotalDuration')) || starterTimer.focusTime;
            
            const wasRunning = localStorage.getItem('timerIsRunning') === 'true';
            if (wasRunning) {
                startTimer();
            } else {
                startIcon.classList.remove('active', 'is-running');
            }

        } else {
            resetTimer();
        }
    } else {
        leftTime = starterTimer.focusTime;
        totalDuration = starterTimer.focusTime;
    }

    progressCircle.style.strokeDasharray = circumference;
    timeDisplay.textContent = formatTime(leftTime);
    updateProgressCircle();
});