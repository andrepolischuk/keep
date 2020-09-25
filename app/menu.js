'use strict'
const app = require('electron').app
const Menu = require('electron').Menu
const shell = require('electron').shell

module.exports = function createMainMenu () {
  const template = [
    {
      label: 'Keep',
      submenu: [
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Keep',
          accelerator: 'Cmd+H',
          role: 'hide',
          click: () => {
            app.emit('hide-all')
          }
        },
        {
          label: 'Hide Others',
          accelerator: 'Alt+Cmd+H',
          role: 'hideothers',
          click: (item, win) => {
            app.emit('hide-others', win)
          }
        },
        {
          label: 'Show All',
          role: 'unhide',
          click: () => {
            app.emit('show-all')
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
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (item, win) => {
            if (win) win.reload()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Cmd+F',
          click: (item, win) => {
            if (win) win.setFullScreen(!win.isFullScreen())
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Cmd+I',
          click: (item, win) => {
            if (win) win.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
        {
          type: 'separator'
        },
        {
          label: 'Notes',
          accelerator: 'CmdOrCtrl+1',
          click: (item, win) => {
            win.webContents.send('navigate', 'home')
          },
          type: 'radio',
          checked: true
        },
        {
          label: 'Reminders',
          accelerator: 'CmdOrCtrl+2',
          click: (item, win) => {
            win.webContents.send('navigate', 'reminders')
          },
          type: 'radio'
        },
        {
          label: 'Archive',
          accelerator: 'CmdOrCtrl+3',
          click: (item, win) => {
            win.webContents.send('navigate', 'archive')
          },
          type: 'radio'
        },
        {
          label: 'Trash',
          accelerator: 'CmdOrCtrl+4',
          click: (item, win) => {
            win.webContents.send('navigate', 'trash')
          },
          type: 'radio'
        }
      ]
    },
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
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
