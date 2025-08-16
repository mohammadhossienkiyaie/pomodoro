const { ipcRenderer, session } = require('electron');

document.getElementById('minimize').addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

document.getElementById('exit').addEventListener('click', () => {
    ipcRenderer.send('close-window');
});

const iconPath = {
    'noteIcon': {
        default: '../icons/noteIcon.svg',
        hover: '../icons/noteIcon-hover.svg'
    },
    'configIcon': {
        default: '../icons/configIcon.svg',
        hover: '../icons/configIcon-hover.svg'
    },
    'timerIcon': {
        default: '../icons/timerIcon.svg',
        hover: '../icons/timerIcon-hover.svg'
    },
    'startIcon': {
        clicked: '../icons/pause.svg',
        clickedHover: '../icons/pause-hover.svg'
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
    const defaultIconExit = '../icons/exit.svg';
    const hoverIconExit = '../icons/exit-hover.svg';
    const defaultIconmin = '../icons/minimize.svg';
    const hoverIconmin = '../icons/minimize-hover.svg';

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
const sessionText = document.getElementById('updateSession');
const displayText = document.getElementById('focusDivText');

function controllTimerIcon() {
    soundIcon.addEventListener('click', () => {
        soundIcon.classList.toggle('active');
    });
}
document.addEventListener('DOMContentLoaded', controllTimerIcon);

let starterTimer = {
    'focusTime': 25 * 60,
    'shortBreakTime': 5 * 60,
    'longBreakTime': 15 * 60,
};

let isWorkTime = true;
let totalDuration = starterTimer.focusTime;
let leftTime = starterTimer.focusTime;
let intervalId = null;
let completedFocusCount = 0;
const circumference = 2 * Math.PI * 45;

let isSoundOn = localStorage.getItem('isSoundOn');
isSoundOn = isSoundOn === null ? true : (isSoundOn === 'true');

soundIcon.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    localStorage.setItem('isSoundOn', isSoundOn);
    soundIcon.classList.toggle('active', isSoundOn);
});

function playSound() {
    if (!isSoundOn) return;
    const audio = new Audio('../sounds/focuse.mp3');
    audio.play().catch(e => console.log(e));
}

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

function setTimerColors(stroke, color) {
    progressCircle.style.stroke = stroke;
    timeDisplay.style.color = color;
    localStorage.setItem('shortBreakTimeCircle', stroke);
    localStorage.setItem('shortBreakTimeColor', color);
}

function startTimer() {
    if (intervalId !== null) return;

    startIcon.classList.add('is-running', 'active');

    if (leftTime <= 0) {
        if (isWorkTime) {
            completedFocusCount++;
            if (completedFocusCount % 4 === 0) {
                isWorkTime = false;
                leftTime = starterTimer.longBreakTime;
                sessionText.textContent = "long Break";
                displayText.textContent = "Long Break Time";
                setTimerColors("#EF8C27", "#EF8C27");
            } else {
                isWorkTime = false;
                leftTime = starterTimer.shortBreakTime;
                sessionText.textContent = "Short Break";
                displayText.textContent = "Short Break Time";
                setTimerColors("#EF8C27", "#EF8C27");
            }
        } else {
            isWorkTime = true;
            leftTime = starterTimer.focusTime;
            sessionText.textContent = "Focus";
            displayText.textContent = "Stay Focused";
            setTimerColors("#27B43E", "#27B43E");
        }
        totalDuration = leftTime;
        timeDisplay.textContent = formatTime(leftTime);
        progressCircle.style.strokeDashoffset = 0;
        localStorage.setItem('sessionTextContent', sessionText.textContent);
        localStorage.setItem('displayText', displayText.textContent);
    }

    const endTime = Date.now() + leftTime * 1000;
    localStorage.setItem('timerEndTime', endTime);
    localStorage.setItem('timerIsWorkTime', isWorkTime);
    localStorage.setItem('timerTotalDuration', totalDuration);
    localStorage.setItem('timerIsRunning', 'true');
    localStorage.setItem('completedFocusCount', completedFocusCount);
    localStorage.setItem('sessionTextContent', sessionText.textContent);
    localStorage.setItem('displayText', displayText.textContent);

    intervalId = setInterval(() => {
        leftTime--;
        timeDisplay.textContent = formatTime(leftTime);
        updateProgressCircle();

        if (leftTime <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            playSound();

            if (isWorkTime) {
                completedFocusCount++;
                if (completedFocusCount % 4 === 0) {
                    isWorkTime = false;
                    leftTime = starterTimer.longBreakTime;
                    sessionText.textContent = "long Break";
                    displayText.textContent = "Long Break Time";
                    setTimerColors("#EF8C27", "#EF8C27");
                } else {
                    isWorkTime = false;
                    leftTime = starterTimer.shortBreakTime;
                    sessionText.textContent = "Short Break";
                    displayText.textContent = "Short Break Time";
                    setTimerColors("#EF8C27", "#EF8C27");
                }
                totalDuration = leftTime;
                localStorage.setItem('sessionTextContent', sessionText.textContent);
                localStorage.setItem('displayText', displayText.textContent);
                startTimer();
            } else {
                isWorkTime = true;
                leftTime = starterTimer.focusTime;
                totalDuration = starterTimer.focusTime;
                timeDisplay.textContent = formatTime(leftTime);
                sessionText.textContent = "Focus";
                displayText.textContent = "Stay Focused";
                setTimerColors("#27B43E", "#27B43E");
                updateProgressCircle();
                startIcon.classList.remove('is-running', 'active');
                localStorage.setItem('timerIsRunning', 'false');
                localStorage.setItem('sessionTextContent', sessionText.textContent);
                localStorage.setItem('displayText', displayText.textContent);
            }
            localStorage.setItem('completedFocusCount', completedFocusCount);
        }
    }, 1000);
}

function forwardTimer() {
    clearInterval(intervalId);
    intervalId = null;
    startIcon.classList.remove('is-running', 'active');
    localStorage.setItem('timerIsRunning', 'false');

    if (isWorkTime) {
        completedFocusCount++;
        isWorkTime = false;
        if (completedFocusCount % 4 === 0) {
            leftTime = starterTimer.longBreakTime;
            sessionText.textContent = "long Break";
            displayText.textContent = "Long Break Time";
            setTimerColors("#EF8C27", "#EF8C27");
        } else {
            leftTime = starterTimer.shortBreakTime;
            sessionText.textContent = "Short Break";
            displayText.textContent = "Short Break Time";
            setTimerColors("#EF8C27", "#EF8C27");
        }
    } else {
        isWorkTime = true;
        leftTime = starterTimer.focusTime;
        sessionText.textContent = "Focus";
        displayText.textContent = "Stay Focused";
        setTimerColors("#27B43E", "#27B43E");
    }

    totalDuration = leftTime;
    timeDisplay.textContent = formatTime(leftTime);
    updateProgressCircle();

    localStorage.setItem('completedFocusCount', completedFocusCount);
    localStorage.setItem('timerIsWorkTime', isWorkTime);
    localStorage.setItem('timerTotalDuration', totalDuration);
    localStorage.setItem('timerIsRunning', 'false');
    localStorage.setItem('sessionTextContent', sessionText.textContent);
    localStorage.setItem('displayText', displayText.textContent);

    // حذف timerEndTime تا تایمر بعد از forward اجرا نشود
    localStorage.removeItem('timerEndTime');
}

function resetTimer() {
    clearInterval(intervalId);
    intervalId = null;
    isWorkTime = true;
    leftTime = starterTimer.focusTime;
    totalDuration = starterTimer.focusTime;
    completedFocusCount = 0;
    timeDisplay.textContent = formatTime(leftTime);
    progressCircle.style.strokeDashoffset = '0';
    startIcon.classList.remove('is-running', 'active');
    sessionText.textContent = "Focus";
    displayText.textContent = "Stay Focused";
    setTimerColors("#27B43E", "#27B43E");
    localStorage.setItem('sessionTextContent', "Focus");
    localStorage.setItem('displayText', "Stay Focused");

    localStorage.removeItem('timerEndTime');
    localStorage.removeItem('timerIsWorkTime');
    localStorage.removeItem('timerCycleCount');
    localStorage.removeItem('timerTotalDuration');
    localStorage.removeItem('timerIsRunning');
    localStorage.removeItem('completedFocusCount');
}

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
    const wasRunning = localStorage.getItem('timerIsRunning') === 'true';
    const savedIsWorkTime = localStorage.getItem('timerIsWorkTime') === 'true';

    if (savedEndTime) {
        const remainingSeconds = Math.round((savedEndTime - Date.now()) / 1000);

        if (remainingSeconds > 0) {
            leftTime = remainingSeconds;
            isWorkTime = savedIsWorkTime;
            totalDuration = parseInt(localStorage.getItem('timerTotalDuration')) ||
                (isWorkTime ? starterTimer.focusTime :
                    (completedFocusCount % 4 === 0 && completedFocusCount !== 0 ? starterTimer.longBreakTime : starterTimer.shortBreakTime));

            if (wasRunning) {
                startTimer();
            } else {
                startIcon.classList.remove('active', 'is-running');
            }

        } else {
            resetTimer();
        }
    } else {
        // مقداردهی درست بر اساس حالت فعلی تایمر
        isWorkTime = savedIsWorkTime;
        if (isWorkTime) {
            leftTime = starterTimer.focusTime;
            totalDuration = starterTimer.focusTime;
        } else {
            // تشخیص نوع استراحت
            if (completedFocusCount % 4 === 0 && completedFocusCount !== 0) {
                leftTime = starterTimer.longBreakTime;
                totalDuration = starterTimer.longBreakTime;
            } else {
                leftTime = starterTimer.shortBreakTime;
                totalDuration = starterTimer.shortBreakTime;
            }
        }
    }

    const savedFocusCount = localStorage.getItem('completedFocusCount');
    completedFocusCount = savedFocusCount ? parseInt(savedFocusCount) : 0;

    // بازیابی sessionText و displayText
    const savedSessionText = localStorage.getItem('sessionTextContent');
    sessionText.textContent = savedSessionText ? savedSessionText : "Focus";
    const savedDisplayText = localStorage.getItem('displayText');
    displayText.textContent = savedDisplayText ? savedDisplayText : "Stay Focused";

    // بازیابی رنگ‌ها
    const savedStroke = localStorage.getItem('shortBreakTimeCircle');
    const savedColor = localStorage.getItem('shortBreakTimeColor');
    if (savedStroke) progressCircle.style.stroke = savedStroke;
    if (savedColor) timeDisplay.style.color = savedColor;

    progressCircle.style.strokeDasharray = circumference;
    timeDisplay.textContent = formatTime(leftTime);
    updateProgressCircle();
    soundIcon.classList.toggle('active', isSoundOn);
});

startIcon.addEventListener('click', function () {
    if (intervalId === null) {
        startTimer();
    } else {
        clearInterval(intervalId);
        intervalId = null;
        startIcon.classList.remove('is-running', 'active');
        localStorage.setItem('timerIsRunning', 'false');
    }
});

resetIcon.addEventListener('click', function () {
    resetTimer();
});

forwardIcon.addEventListener('click', function () {
    forwardTimer();
});

function highlightActiveMenuIcon() {
    const page = window.location.pathname.toLowerCase();

    document.querySelectorAll('.menu-icon').forEach(icon => {
        icon.style.stroke = "#C3BBBB";
        icon.style.fill = "#C3BBBB";
    });

    if (page.includes('pomodorotab')) {
        const timerIcon = document.getElementById('timerIcon');
        const timerTextIcon = document.getElementById('timerTextIcon');
        if (timerIcon) {
            timerIcon.src = '../icons/timerIcon-hover.svg'
            timerTextIcon.style.color = "#27B43E";
        }
    } else if (page.includes('note')) {
        const noteIcon = document.getElementById('noteIcon');
        const noteText = document.getElementById('noteText');
        if (noteIcon) {
            noteIcon.src = '../icons/noteIcon-hover.svg'
            noteText.style.color = "#27B43E";
        }
    } else if (page.includes('config')) {
        const configIcon = document.getElementById('configIcon');
        const configText = document.getElementById('configText');
        if (configIcon) {
            configIcon.src = '../icons/configIcon-hover.svg';
            configText.style.color = "#27B43E";
        }
    }
}

document.addEventListener('DOMContentLoaded', highlightActiveMenuIcon);

