const tabX = 1.5;
const spacing = 3;
const ptabHeight = 60;
const ptabWidth = 60;
let lastY = 0;
let ptabExist = false;
let isApplying = false;

const observer = new MutationObserver((mutationsList) => {
    let shouldUpdate = false;
    
    for (const mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "attributes") {
            shouldUpdate = true;
            break;
        }
    }
    if (shouldUpdate && !isApplying) {
        setHeights();
    }
});

function enlargePinnedTabs() {
    "use strict";   
    let pinnedTabs = document.getElementsByClassName("tab-position is-pinned");
    let idx = 0;
    let tabY = 0; 
    Array.from(pinnedTabs).forEach(function (tab) {
        if (idx === 0) {lastY = 0;}
        tabY = lastY + spacing;
        tab.style['cssText'] = `--PositionX: ${tabX}px; --PositionY: ${tabY}px; --Height: ${ptabHeight}px; --Width: ${ptabWidth}px; --ZIndex: 2;`;
        idx++;
        lastY = tabY + ptabHeight + spacing;
    });
}

function setHeights() {
    if (isApplying) return;
    isApplying = true;
    
    observer.disconnect();
    let CONT = document.getElementById("tabs-container");
    if (CONT.className === 'overflow left') {
        let leftDotted = document.getElementsByClassName("left dotted");
        if (leftDotted.length > 0) {
            leftDotted[0].style['cssText'] = `width: 82px; height: 100%;`;
        }
    } else {
        let leftDotted = document.getElementsByClassName("left dotted");
        if (leftDotted.length > 0) {
            leftDotted[0].style['cssText'] = `width: 72px; height: 100%;`;
        }
    }
    
    enlargePinnedTabs();
    let tabBar = document.getElementsByClassName("tab-strip");
    if (tabBar.length === 0) {
        isApplying = false;
        return;
    }
    
    ptabExist = Array.from(tabBar[0].children).some(elem => {
        if (elem.firstChild?.className.includes('is-pinned')) { 
            return true;
        }
        return false;
    });
    if (!ptabExist) lastY = 0;
    
    Array.from(tabBar[0].children).forEach(function (elem) {
        let target = elem.firstChild;
        if (!target) return;  
        if (elem.className === "separator") { 
            elem.style['cssText'] = `--PositionX: 0px; --PositionY: ${lastY + spacing}px; --Height: 20px; --Width: 72px; --ZIndex: 0;`;
            lastY += spacing + 20;
        } else if (target.className === "tab-position") {
            target.style['cssText'] = `--PositionX: 0px; --PositionY: ${lastY + spacing}px; --Height: 30px; --Width: 72px; --ZIndex: 2;`;
            lastY += 34;
        } else if (target.className === "button-toolbar newtab") {
            if (ptabExist != true) { 
                target.style['cssText'] = `--PositionX: 21px; --PositionY: ${lastY + spacing + 20}px; --Height: 30px; --Width: 30px; --ZIndex: 0; left: 21px; top: ${lastY + spacing + 10}px;`;
            } else { 
                target.style['cssText'] = `--PositionX: 21px; --PositionY: ${lastY + ptabHeight + spacing + 10}px; --Height: 30px; --Width: 30px; --ZIndex: 0; left: 21px; top: ${lastY + spacing + 10}px;`;
            }
        }
    });
    ptabExist = false;
    observer.observe(tabBar[0], { attributes: true, childList: true, subtree: true, attributeFilter: ["style", "class"] });
    
    isApplying = false;
}

// Force reapply on visibility changes and fullscreen
function forceReapply() {
    setTimeout(() => {
        setHeights();
    }, 100);
    setTimeout(() => {
        setHeights();
    }, 300);
    setTimeout(() => {
        setHeights();
    }, 500);
}

// Listen for various events that might affect layout
function setupEventListeners() {
    // Fullscreen changes
    const fullscreenEvents = [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
    ];
    
    fullscreenEvents.forEach(eventName => {
        document.addEventListener(eventName, forceReapply);
    });
    
    // Window resize (catches fullscreen in some browsers)
    window.addEventListener('resize', forceReapply);
    
    // Visibility changes
    document.addEventListener('visibilitychange', forceReapply);
    
    // Focus events
    window.addEventListener('focus', forceReapply);
}

let intervalID = setInterval(function () {
    const browser = document.getElementById("browser");
    if (browser) {
        clearInterval(intervalID);
        document.getElementsByClassName("left dotted")[0].style['cssText'] = `width: 72px; height: 100%;`;
        setHeights();
        setupEventListeners();
        
        // Also set up a periodic check as a fallback
        setInterval(() => {
            const tabBar = document.getElementsByClassName("tab-strip");
            if (tabBar.length > 0 && !isApplying) {
                setHeights();
            }
        }, 2000);
    }
}, 300);
