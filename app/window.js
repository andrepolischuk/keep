'use strict'
const join = require('path').join
const BrowserWindow = require('electron').BrowserWindow
const config = require('./config')

module.exports = {
  createMainWindow: function (handleResize, handleClose, handleClosed) {
    return module.exports.createMainWindowWithUrl(handleResize, handleClose, handleClosed, 'https://keep.google.com')
  },
  createMainWindowWithUrl: function (handleResize, handleClose, handleClosed, url) {
    const lastWindowState = config.get('lastWindowState')

    const window = new BrowserWindow({
      minWidth: 615,
      x: lastWindowState.x,
      y: lastWindowState.y,
      width: lastWindowState.width,
      height: lastWindowState.height,
      icon: join(__dirname, '../build/icon.png'),
      title: 'Keep',
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        preload: `${__dirname}/browser.js`
      }
    })

    window.loadURL(url, {userAgent: 'Chrome'})
    window.on('resize', handleResize)
    window.on('closed', handleClosed)
    window.on('close', handleClose)

    return window
  }
}
