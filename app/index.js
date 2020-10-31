'use strict'
const app = require('electron').app
const ipc = require('electron').ipcMain
const shell = require('electron').shell
const Tray = require('electron').Tray
const Menu = require('electron').Menu
const config = require('./config')
const createMainMenu = require('./menu')
const createMainWindow = require('./window')

require('electron-debug')()

let mainWindow

function handleResize () {
  if (!mainWindow.isFullScreen()) {
    config.set('lastWindowState', mainWindow.getBounds())
  }
}

function handleClosed () {
  mainWindow = null
}

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.hide()
  } else {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(handleResize, handleClosed)
  }
})

app.on('ready', () => {
  mainWindow = createMainWindow(handleResize, handleClosed)
  createMainMenu()

  var appIcon = new Tray('build/icon.png')

  var contextMenu = Menu.buildFromTemplate([
      {
          label: 'Show App', click: function () {
            mainWindow.show()
          }
      },
      {
          label: 'Quit', click: function () {
            mainWindow.destroy();
            app.quit();
          }
      }
  ])

  appIcon.setContextMenu(contextMenu)
})

ipc.on('clicklink', (event, url) => {
  event.preventDefault()
  shell.openExternal(url)
})


