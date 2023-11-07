const tabX = 0;
const spacing = 3;
const ptabHeight = 60;
const ptabWidth = 60;
let lastY = 0;
let normExist = false;
const observer = new MutationObserver(setHeights);

/*
 TODO:
        Adjust pinnedTab image.
            - give <img> the class="imgCenter" OR just give it inline Style
            - copy <img> to <div> with class="tab pinned force-hover button-off"
            - delete div with class="tab-header" and all it's children

*/

function enlargePinnedTabs() {
    "use strict";   
    let pinnedTabs = document.getElementsByClassName("tab-position is-pinned");

    let idx = 0;
    Array.from(pinnedTabs).forEach(function (tab) {
        //Default cssText str: "--PositionX: 0px; --PositionY: 0px; --Height: 30px; --Width: 72px; --ZIndex: 2;"     
        let tabY = (idx * 60) + spacing;
        tab.style['cssText'] = `--PositionX: ${tabX}px; --PositionY: ${tabY+spacing}px; --Height: ${ptabHeight}px; --Width: ${ptabWidth}px; --ZIndex: 2;`;
        idx ++;
        lastY = tabY;
    });
};

function setHeights(){
    //<div id="tabs-tabbar-container" class="left dotted" style="width: 72px; height: 100%;">
    observer.disconnect()
    let CONT = document.getElementById("tabs-container");
    if (CONT.className == 'overflow left'){
        let CONT = document.getElementsByClassName("left dotted");
        CONT[0].style['cssText'] = `width: 82px; height: 100%;`
    }
    else{
        let CONT = document.getElementsByClassName("left dotted");
        CONT[0].style['cssText'] = `width: 72px; height: 100%;`
    }
    
    enlargePinnedTabs();
    let tabBar = document.getElementsByClassName("tab-strip");

    Array.from(tabBar[0].children).forEach(function (elem) {
        target = elem.firstChild; // Get the inside in a separate var
        if ((target.className).includes('is-pinned')){ // PINNED TABS HERE
            ; //skip
        } else if (elem.className == "separator"){ // SEPARATOR HERE
            elem.style['cssText'] = `--PositionX: 0px; --PositionY: ${lastY+ptabHeight+spacing}px; --Height: 20px; --Width: 72px; --ZIndex: 0;`
            lastY += spacing + 56; // 20 + 30 + 2x spacing
        } else if (target.className == "tab-position"){ // NORMAL TABS HERE
            target.style['cssText'] = `--PositionX: 0px; --PositionY: ${lastY+spacing+20}px; --Height: 30px; --Width: 72px; --ZIndex: 2;`
            lastY += 33;
        } else if (target.className == "button-toolbar newtab"){ // NEW TAB BUTTON HERE
            sepExist = document.getElementsByTagName("hr");
            if (sepExist.length == 1){ // SEPARATOR
                target.style['cssText'] = `--PositionX: 21px; --PositionY: ${lastY+spacing+20}px; --Height: 30px; --Width: 30px; --ZIndex: 0; left: 21px; top: ${lastY+spacing+20}px;`
            }
            else{ // NO SEPARATOR
                target.style['cssText'] = `--PositionX: 21px; --PositionY: ${lastY+ptabHeight+spacing+10}px; --Height: 30px; --Width: 30px; --ZIndex: 0; left: 21px; top: ${lastY+ptabHeight+spacing+10}px;`
            }

        } else { // everything else here (nothing as of yet)
            //console.log('Found ELSE: ' +  target.className);
        }
    });
    observer.observe(tabBar[0], {attributes: true, childlist: true, subtree: true});
}


// Loop waiting for the browser to load the UI
let intervalID = setInterval(function () {
    const browser = document.getElementById("browser");
    if (browser) {
      clearInterval(intervalID);
      // set init size
      document.getElementsByClassName("left dotted")[0].style['cssText'] = `width: 72px; height: 100%;`;
      // call function once
      setHeights();
    }
  }, 300);   // Don't forget to thank @luetage for the standard 300 ms
  