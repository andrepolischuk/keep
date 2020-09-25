'use strict'
const app = require('electron').app
const ipc = require('electron').ipcMain
const BrowserWindow = require('electron').BrowserWindow
const shell = require('electron').shell
const config = require('./config')
const createMainMenu = require('./menu')
const createTrayMenu = require('./tray')
const createMainWindow = require('./window').createMainWindow
const createMainWindowWithUrl = require('./window').createMainWindowWithUrl

require('electron-debug')()

let windows = []

function handleResize (args) {
  if (!args.sender.isFullScreen()) {
    config.set('lastWindowState', args.sender.getBounds())
  }
}

function handleClosed (args) {
  windows = windows.filter(function (value, index, array) {
    try {
      let test = value.id
    }
    catch(err) {
      return false
    }
    return true
  })
}

function hideAllWindows () {
  windows.forEach((window) => {
    window.hide()
  })
}

function hideAllWindowsExcept (except) {
  windows.forEach((window) => {
    if (window.id !== except.id) {
      window.hide()
    }
  })
}

function showAllWindows () {
  windows.forEach((window) => {
    window.show()
  })
}

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.hide()
  } else {
    app.quit()
  }
})

app.on('activate', () => {
  if (!windows.length < 1) {
    windows.push(createMainWindow(handleResize, handleClosed))
  }
})

ipc.on('clicklink', (event, url) => {
  event.preventDefault()
  shell.openExternal(url)
})

app.on('ready', () => {
  windows.push(createMainWindow(handleResize, handleClosed))
  createMainMenu()
  createTrayMenu(hideAllWindows, showAllWindows)
})

app.on('hide-all', hideAllWindows)

app.on('show-all', showAllWindows)

app.on('hide-others', hideAllWindowsExcept)

ipc.on('newaccountwindow', (event, url) => {
  event.preventDefault()
  // Checks if the window for the account is already open, and if so, shows it, and brings it into focus.
  if (windows.filter(function (window) {
    let testUrl = 'https://keep.google.com/u/' + (url.split('?authuser=')[1]) + '/'
    if (window.webContents.getURL() == testUrl) {
      window.show()
      window.focus()
      return true;
    }
  }).length < 1) {
    windows.push(createMainWindowWithUrl(handleResize, handleClosed, url))
  }
})
