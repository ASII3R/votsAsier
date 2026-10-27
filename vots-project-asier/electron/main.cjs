
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Votacions',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Mostrar errores de carga
  win.webContents.on('did-fail-load', (_event, code, description, url) => {
    console.error('ERROR DE CARGA:', code, description, url)
  })

  // Mostrar errores de JavaScript
  win.webContents.on('console-message', (_event, details) => {
    console.log('CONSOLA:', details.message)
  })

  // Abrir herramientas de desarrollo para diagnosticar la pantalla blanca
  win.webContents.openDevTools()

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    win.loadURL('http://localhost:5173')
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
