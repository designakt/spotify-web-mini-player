// ==UserScript==
// @name         Spotify Mini Player
// @namespace    Spotify
// @version      0.24
// @description  An enhancement to the spotify web player to make it a usable player in small window sizes. Especially useful when installing the web player as a standalone web app.
// @author       designakt
// @match        *://open.spotify.com/*
// @icon         https://developer.spotify.com/assets/branding-guidelines/icon4@2x.png
// @run-at       document-start
// @grant        none
// @license      GNU GPLv3
// ==/UserScript==

(function() {
    'use strict';
    var customCSS = `
@media screen and (max-width: 799px),
       screen and (max-height: 564px)  {

  body {
    min-height: inherit;
    min-width: inherit;
  }
  .Root__top-container,
  div#main > div > div:nth-child(2){
    overflow: hidden;
    grid-template-columns: 0 auto;
    grid-template-rows: 0 0 auto;
    row-gap: 0;
    padding:0;
  }
  .Root__now-playing-bar,
  div:has(> footer){
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOU+A8AATUBGe90iuoAAAAASUVORK5CYII=);
    transition: background-image 6s ease-out;
  }
  .Root__now-playing-bar footer,
  footer{
    background-color:rgba(24,24,24,0.4);
    backdrop-filter: blur(50px);
  }

  .Root__now-playing-bar,
  .Root__now-playing-bar footer,
  .Root__now-playing-bar footer>div,
   div:has(> footer),
   footer,
   footer > div{
    width: 100vw;
    min-width: 100vw;
    height: 100vh;
    min-height: 100vh;
  }

  /* Now Playing Bar Layout to vertical */
  .Root__now-playing-bar footer>div,
  footer > div{
    flex-direction: column !important;
    justify-content: center !important;
    gap: 16px;
    padding: 0 !important;
  }
  /* Widen Now Playing Bar content areas */
  .Root__now-playing-bar footer>div>div,
  footer > div > div{
    width:70% !important;
  }
  /* Cover,Title,Artist block */
  .Root__now-playing-bar footer>div>div:first-child>div,
  footer > div > div:first-child > div{
    justify-content: space-between;
    gap: 8px;
    transform: none;
    transition: none;
  }
  /* Cover box */
  footer > div > div:first-child > div > div:first-child{
    transform: none;
  }
  /* Cover Expand Button */
  .Root__now-playing-bar footer>div>div:first-child>div>div:first-child>button,
  footer > div > div:first-child > div > div:first-child > button{
    display: none;
  }
  /* Cover Link */
  .Root__now-playing-bar footer>div>div:first-child>div>div:first-child img,
  footer > div > div:first-child > div > div:first-child > div > a {
      cursor: default;
  }
  /* Title, Artist box */
  .Root__now-playing-bar footer>div>div:first-child>div>div:nth-child(2),
  footer > div > div:first-child > div > div:nth-child(2){
    width: 100%;
  }
  /* Playback block */
  .playback-bar>div:first-child{
    min-width: 25px;
  }
  .playback-bar>div:last-child{
    min-width: 30px;
  }
  /* Volume block */
  .Root__now-playing-bar footer>div>div:last-child,
  footer > div > div:last-child{
    justify-content: center;
  }
  footer > div > div:last-child > div {
    flex-direction: row-reverse;
  }
  .Root__now-playing-bar footer>div>div:last-child>div .volume-bar,
  footer > div > div:last-child > div .volume-bar{
    width:100%;
    flex-basis: auto;
  }
  button[data-testid="control-button-npv"],
  button[data-testid="lyrics-button"],
  button[data-testid="control-button-queue"],
  div[data-testid="indicator"]{
    display: none;
  }
}
@media screen and (min-width: 800px),
       screen and (min-height: 565px) {
  div:has(> footer){
    background-image:none !important;
  }
}
`;
    // apply above css
    addGlobalStyle(customCSS);

    // wait for document to complete
    var interval = setInterval(function() {
        if(document.readyState === 'complete') {
            clearInterval(interval);
            init();
        }
    }, 100);

})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function init() {
    var item = null;
    var itemSRC = null;
    var bglayer = null;
    // regualarly check for cover art (if it exists and if it has changed)
    var interval = setInterval(function() {
        // see if there is a cover art
        item = document.querySelector('img[data-testid="cover-art-image"]');
        // check if there is a cover art
        if(item == null) {
            //console.log("searching for cover art");
        }
        // check if cover art has changed
        else if(item.src != itemSRC) {
            // store cover art url
            itemSRC = item.src;
            //console.log("found new cover art: " + item.src);
            // select background element to apply cover art to
            bglayer = document.querySelector('div:has(> footer)');
            // set cover art as background image
            bglayer.style.backgroundImage = "url(" + itemSRC + ")";
            console.log("applied new cover art to background");
        }
    }, 100);
}
