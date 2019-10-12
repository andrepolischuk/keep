'use strict'
const join = require('path').join
const BrowserWindow = require('electron').BrowserWindow
var { application } = require('electron');
const config = require('./config')

module.exports = function createMainWindow (handleResize, handleClosed) {
  const lastWindowState = config.get('lastWindowState')

  const window = new BrowserWindow({
    minWidth: 900,
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

  window.loadURL('https://keep.google.com')
  window.on('resize', handleResize)
  window.on('closed', handleClosed)

  window.on('close', function (event) {
        event.preventDefault();
        window.hide();

    return false;
  });

  return window
}
