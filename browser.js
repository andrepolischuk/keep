'use strict'
const ipc = require('electron').ipcRenderer

function isKeep () {
  return window.location.hostname === 'keep.google.com'
}

function injectCss (rule) {
  document.styleSheets[0].insertRule(rule, 0)
}

function handleDOMLoaded () {
  if (!isKeep()) return

  if (process.platform === 'darwin') {
    injectCss(`
      #ognwrapper {
        -webkit-app-region: drag;
      }
    `)

    injectCss(`
      #ognwrapper form,
      #ognwrapper [role="menu"],
      #ognwrapper [role="button"] {
        -webkit-app-region: no-drag;
      }
    `)

    injectCss(`
      #ognwrapper > :first-child > :nth-child(2) {
        padding-left: 75px;
      }
    `)
  }

  injectCss(`
    ::-webkit-scrollbar {
      display: none !important;
    }
  `)
}

function handleClick (event) {
  const node = event.target

  if (node.nodeName === 'A' && node.target === '_blank') {
    event.preventDefault()
    ipc.send('clicklink', node.href)
  }
}

function handleNavigate (event, hash) {
  window.location.hash = hash
}

const electronSpellchecker = window.require('electron-spellchecker');

function loadSpellChecker() {
       if (window.require) {
         const SpellCheckHandler = electronSpellchecker.SpellCheckHandler;
         const ContextMenuListener = electronSpellchecker.ContextMenuListener;
         const ContextMenuBuilder = electronSpellchecker.ContextMenuBuilder;

         window.spellCheckHandler = new SpellCheckHandler();
         window.spellCheckHandler.attachToInput();
         window.spellCheckHandler.switchLanguage('en-US');

         let contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);

         let contextMenuListener = new ContextMenuListener((info) => {
             contextMenuBuilder.showPopupMenu(info);
         });
       }
}

window.addEventListener('DOMContentLoaded', handleDOMLoaded, false)
window.addEventListener('click', handleClick, false)
window.addEventListener('load', function () { loadSpellChecker() } );
ipc.on('navigate', handleNavigate)
