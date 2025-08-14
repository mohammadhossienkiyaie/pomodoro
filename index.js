const { app, BrowserWindow } = require('electron')
const path = require('path')
const remote = require('@electron/remote/main')

remote.initialize()

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 365,
    height: 510,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'resources/icons/appIcon.png')

  })


  remote.enable(mainWindow.webContents)

  mainWindow.loadFile(path.join(__dirname, 'resources/PomodoroTab/FocusPlus.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.platform === 'win32') {
    mainWindow.setBackgroundColor('#00000000')
    mainWindow.setHasShadow(true)
  }
}
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})