const { app, BrowserWindow, ipcMain } = require('electron')
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
    icon: path.join(__dirname, 'resources', 'icons', 'appIcon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  })

  remote.enable(mainWindow.webContents)

  mainWindow.loadFile(path.join(__dirname, 'resources/PomodoroTab/FocusPlus.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // win.webContents.openDevTools();

  if (process.platform === 'win32') {
    mainWindow.setBackgroundColor('#00000000')
    mainWindow.setHasShadow(true)
  }
}
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})