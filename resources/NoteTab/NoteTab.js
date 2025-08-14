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

// for add task list 
const inputBtn = document.getElementById('addNoteButton');
const buttonDiv = document.getElementById('buttonDiv');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const noteDiv = document.getElementById('noteDiv');
const taskListDiv = document.getElementById('taskListDiv');
let savedTask = null;

function resetUI() {
    inputBtn.type = 'button';
    inputBtn.value = '+ Add Task';
    inputBtn.classList.add('addNoteButton');
    inputBtn.classList.remove('addNoteButton-clicked');
    buttonDiv.style.display = 'none';
}

function addBtnAction() {
    savedTask = inputBtn.value;
    if (savedTask && savedTask.trim() !== "") {
        const savedTaskDiv = document.createElement('div');
        savedTaskDiv.classList.add('taskBox');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('taskContent');
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.classList.add('TaskcheckBox');
        const taskText = document.createElement('span');
        taskText.classList.add('taskText');
        const removeIconDiv = document.createElement('div');
        removeIconDiv.classList.add('removeIcon');
        taskText.textContent = savedTask;
        contentDiv.appendChild(checkBox);
        contentDiv.appendChild(taskText);
        savedTaskDiv.appendChild(contentDiv);
        savedTaskDiv.appendChild(removeIconDiv);
        noteDiv.insertBefore(savedTaskDiv, noteDiv.firstChild);
        if(checkBox && savedTaskDiv && removeIconDiv){
            checkBox.addEventListener('click' , function(){
                taskText.classList.toggle('linethroughstyle');
            })
            removeIconDiv.addEventListener('click', function(){
                savedTaskDiv.remove();
            })
        }
        resetUI();
    } else {
        resetUI();
    }
}

if (inputBtn && buttonDiv && cancelBtn && addBtn) {
    inputBtn.addEventListener('click', function () {
        if (inputBtn.value === "+ Add Task") {
            inputBtn.value = "";
        }
        inputBtn.type = 'text';
        inputBtn.classList.add('addNoteButton-clicked');
        inputBtn.classList.remove('addNoteButton');
        buttonDiv.style.display = "flex";
    });

    cancelBtn.addEventListener('click', resetUI);

    addBtn.addEventListener('click', addBtnAction);

    inputBtn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addBtnAction();
            event.preventDefault();
        }
    });
}
