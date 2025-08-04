const iconPath = {
    'noteIcon': {
        default: '/img/icons/noteIcon.svg',
        hover: '/img/icons/noteIcon-hover.svg'
    },
    'configIcon': {
        default: '/img/icons/configIcon.svg',
        hover: '/img/icons/configIcon-hover.svg'
    },
    'timerIcon': {
        default: '/img/icons/timerIcon.svg',
        hover: '/img/icons/timerIcon-hover.svg'
    },
    'settingIcon': {
        default: '/img/icons/settingIcon.svg',
        hover: '/img/icons/settingIcon-hover.svg'
    },
    'startIcon': {
        clicked: '/img/icons/pause.svg',
        clickedHover: '/img/icons/pause-hover.svg'
    }
};

document.addEventListener('DOMContentLoaded', function () {
    fetch('navbar.html').then(Response => {
        if (!Response.ok) {
            throw new Error('the navigation file not found !' + Response.statusText);
        }
        return Response.text();
    }).then(html => {
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            navbarPlaceholder.innerHTML = html;
            initializeMenuHoverEffects();
            initializetTopbarHoverEffects();
        } else {
            console.error(' the element with navbar-placeholder not found!');
        }
    }).catch(error => console.error('faild to load nav', error));
});

// function for apply style 
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
    const defaultIconExit = '/img/icons/exit.svg';
    const hoverIconExit = '/img/icons/exit-hover.svg';
    const defaultIconmin = '/img/icons/minimize.svg';
    const hoverIconmin = '/img/icons/minimize-hover.svg';

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

// hover controll buttons 
const resetIcon = document.getElementById('restIcon');
const startIcon = document.getElementById('startIcon');
const forwardIcon = document.getElementById('forwardIcon');
const soundIcon = document.getElementById('soundIcon');

function controllTimerIcon() {
    startIcon.addEventListener('click', () => {
        startIcon.classList.toggle('active');
    })
    soundIcon.addEventListener('click', () => {
        soundIcon.classList.toggle('active');
    })
}
document.addEventListener('DOMContentLoaded', controllTimerIcon);

// timer 
const progressCircle = document.getElementById('progressCircle');
const timeDisplay = document.getElementById('timeDisplay');
const foucesPic = document.getElementById('foucesPic');

const starterTimer = {
    'focusTime' : 25 * 60 , 
    'shortBreakTime' : 5 * 60 ,
    'longBreakTime' : 15 * 60 ,
}
let isWorkTime = true ; 
let cycleCount = 0 ; 
const duration = 1500;
let leftTime = 0;
let intervalId = null;

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formatMinutes = String(minutes).padStart(2, '0');
    const formatSeconds = String(seconds).padStart(2, '0');
    // return the result 
    return `${formatMinutes}:${formatSeconds}`;
}
function startTimer() {
    const circumference = 2 * Math.PI * 45;
    progressCircle.style.strokeDasharray = circumference;
    leftTime = duration;
    if(isWorkTime){
        timer = starterTimer['focusTime'];
    }else{
        if(cycleCount === 4){
            timer = starterTimer['longBreakTime'];
        }else{
            timer = starterTimer['shortBreakTime']
        }
    }
    intervalId = setInterval(() => {
        leftTime--;
        const formattedTime = formatTime(leftTime);
        timeDisplay.textContent = formattedTime;

        const offest = circumference * (leftTime / duration);
        progressCircle.style.strokeDashoffset = offest;


        if (leftTime <= 0) {
            if(isWorkTime){
                cycleCount++; 
                isWorkTime = false ; 
            }else{
                isWorkTime = true;
            }
            clearInterval(intervalId);
            intervalId = null ;
            startTimer();
        }
    }, 1000);
};
function restTimer() {
    clearInterval(intervalId);
    intervalId = null ; 
}
startIcon.addEventListener('click', function () {
    if (intervalId === null) {
        startTimer();
        foucesPic.style.backgroundImage = "url('/img/icons/focusTime-active.svg')";
    } else {
        stopTimer();
        foucesPic.style.backgroundImage = "url('/img/icons/focusTime.svg')";
    }
});
function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
}
resetIcon.addEventListener('click', function () {
    restTimer();
    timeDisplay.textContent = '25:00';
    progressCircle.style.strokeDashoffset = '0';
    startIcon.style.backgroundImage = "url('/img/icons/start.svg')";
})
