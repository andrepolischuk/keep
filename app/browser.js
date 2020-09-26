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

  updateTitle()
  document.querySelectorAll('.PvRhvb-LgbsSe-haAclf > div').forEach((node) => {node.addEventListener('click', updateTitle)})

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

  if (node.closest('a').href.indexOf('?authuser=') > -1) {
    // Link is to other account window.
    event.preventDefault()
    ipc.send('newaccountwindow', node.closest('a').href)
  }

  if (node.nodeName === 'A' && node.target === '_blank') {
    event.preventDefault()
    ipc.send('clicklink', node.href)
  }
}

function handleNavigate (event, hash) {
  window.location.hash = hash
  updateTitle()
}

function updateTitle() {
  document.title = "Google Keep - "
  + document.querySelector('div.gb_sb').textContent
  + " - "
  + document.querySelector(
    '.gk6SMd > span'
    ).textContent.trim()
}

window.addEventListener('DOMContentLoaded', handleDOMLoaded, false)
window.addEventListener('click', handleClick, false)
ipc.on('navigate', handleNavigate)
