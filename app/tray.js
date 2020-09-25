'use strict'
const { app, Menu, Tray } = require('electron')
const path = require('path')

module.exports = function createTrayMenu (hideAllWindowsCallback, showAllWindowsCallback) {
  let tray = null
  app.whenReady().then(() => {
    console.log("Creating tray icon.")
    tray = new Tray(path.join(__dirname, '..', 'build','icon.png'))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'View on GitHub',
            click: () => {
              shell.openExternal('http://github.com/andrepolischuk/keep')
            }
          }
        ]
      },
      {
        label: 'Hide Keep',
        accelerator: 'Cmd+H',
        role: 'hide',
        click: () => {
          hideAllWindowsCallback()
        }
      },
      {
        label: 'Show All',
        role: 'unhide',
        click: () => {
          showAllWindowsCallback()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Cmd+Q',
        click: () => {
          app.quit()
        }
      }
    ])
    tray.setToolTip('Google Keep')
    tray.setContextMenu(contextMenu)
  })
}
