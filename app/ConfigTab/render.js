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
initializeMenuHoverEffects();
initializetTopbarHoverEffects();

// for show change a minute in range for focus time 

// for focus range 
const starterTimer = {
    'focusTime': 25 * 60,
    'shortBreaktime': 5 * 60,
    'longBreaktime': 15 * 60,
};

document.addEventListener('DOMContentLoaded', function () {
    const focusRange = document.getElementById('Focusrange');
    const shortBreakRange = document.getElementById('breakRange');
    const longBreakRange = document.getElementById('longBreakRange');

    const focusText = document.getElementById('focusselectedTime');
    const shortText = document.getElementById('shortSelectedTime');
    const longText = document.getElementById('longSelectedTime');

    function updateAndSaveValue() {
        if (focusRange) {
            const focusMinute = parseFloat(focusRange.value);
            starterTimer.focusTime = parseFloat(focusRange.value) * 60;
            localStorage.setItem('focusTime', focusMinute);
            if (focusText) focusText.textContent = `${focusMinute} Mins`;
        }
        if (shortBreakRange) {
            const shortBreakMinute = parseFloat(shortBreakRange.value);
            starterTimer.shortBreaktime = parseFloat(shortBreakRange.value) * 60;
            localStorage.setItem('shortBreakRange', shortBreakMinute);
            if (shortText) shortText.textContent = `${shortBreakMinute} Mins`;
        }
        if (longBreakRange) {
            const longBreakMinute = parseFloat(longBreakRange.value);
            starterTimer.longBreaktime = parseFloat(longBreakRange.value) * 60;
            localStorage.setItem('longBreakRange', longBreakMinute);
            if (longText) longText.textContent = `${longBreakMinute} Mins`;
        }
    }
    function loadValue() {
        const savedFocus = localStorage.getItem('focusTime');
        const shortBreak = localStorage.getItem('shortBreakRange');
        const longBreak = localStorage.getItem('longBreakRange');

        if (focusRange && savedFocus !== null) {
            focusRange.value = savedFocus;
        }
        if (shortBreakRange && shortBreak !== null) {
            shortBreakRange.value = shortBreak;
        }
        if (longBreakRange && longBreak !== null) {
            longBreakRange.value = longBreak;
        }
        updateAndSaveValue();
    }
    if (focusRange) {
        focusRange.addEventListener('input', updateAndSaveValue);
    }
    if (shortBreakRange) {
        shortBreakRange.addEventListener('input', updateAndSaveValue);
    }
    if (longBreakRange) {
        longBreakRange.addEventListener('input', updateAndSaveValue);
    }
    loadValue();
})


const focusRange = document.getElementById('Focusrange');
const output = document.getElementById('focusselectedTime');

// default value for 3 ranges in config tab 
output.innerHTML = `${focusRange.value} Mins`;
updateGradient(focusRange.value);
focusRange.oninput = function () {
    output.innerHTML = `${this.value} Mins`;
    updateGradient(this.value);
};
function updateGradient(value) {
    const timerNum = focusRange.value;
    starterTimer.focusTime = parseFloat(timerNum) * 60;
    let percentage = (value / 120) * 100;
    let color = `linear-gradient(90deg, #27B43E ${percentage}%, #C3BBBB ${percentage}%)`;
    focusRange.style.background = color;
}

// for long and short break time 
document.addEventListener('DOMContentLoaded', function () {
    const breakRanges = document.querySelectorAll('.rangeInput');
    const breakTimetext = document.querySelectorAll('.selectedTime');
    if (breakRanges.length > 0 && breakTimetext.length === breakRanges.length) {
        breakRanges.forEach((range, index) => {
            const text = breakTimetext[index];
            function updateBreakRange() {
                const value = range.value;
                text.textContent = `${value} Mins`;
                const percentage = ((value - range.min) / (range.max - range.min)) * 100;
                range.style.background = `linear-gradient(to right, #27B43E 0%, #27B43E ${percentage}%, #C3BBBB ${percentage}%, #C3BBBB 100%)`;
            }
            updateBreakRange();
            range.addEventListener('input', updateBreakRange);
        })
    } else {
        console.error('error');
    }
});
// function for reset a range value 
document.addEventListener('DOMContentLoaded', function () {
    const inputRange = document.querySelectorAll('.restRange');
    const textRange = document.querySelectorAll('.restText');
    const restBtn = document.getElementById('restBtn');

    const defaultValue = {
        focus: 25,
        shortbreak: 5,
        longbreak: 15,
    };

    function restall() {
        inputRange[0].value = defaultValue.focus;
        inputRange[1].value = defaultValue.shortbreak;
        inputRange[2].value = defaultValue.longbreak;

        textRange[0].textContent = `${defaultValue.focus} Mins`;
        textRange[1].textContent = `${defaultValue.shortbreak} Mins`;
        textRange[2].textContent = `${defaultValue.longbreak} Mins`;

        inputRange.forEach(input => {
            updateRangeBackground(input);
        });
    }
    function result(changeValue) {
        const defaultvalue = restBtn.textContent;
        restBtn.textContent = changeValue;
        setTimeout(() => {
            restBtn.textContent = defaultvalue;
        }, 1000);
    }
    function updateRangeBackground(inputRange) {
        const value = inputRange.value;
        const min = parseFloat(inputRange.min);
        const max = parseFloat(inputRange.max);
        const percentage = ((value - min) / (max - min)) * 100;
        inputRange.style.background = `linear-gradient(to right, #27B43E 0%, #27B43E ${percentage}%, #C3BBBB ${percentage}%, #C3BBBB 100%)`;
    }
    function restButton() {
        restall();
    }
    if (restBtn) {
        restBtn.addEventListener('click', restButton);
        restBtn.addEventListener('click', () => {
            result('Restored Successfully');
        });
        inputRange.forEach(input => updateRangeBackground(input));
    }
})

