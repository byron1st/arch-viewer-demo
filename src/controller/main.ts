import { app, BrowserWindow } from 'electron'
import * as url from 'url'
import * as path from 'path'
import * as util from './util'

let mainCanvasWindow: Electron.BrowserWindow

function createCanvasWindow () {
  mainCanvasWindow = new BrowserWindow({
    height: 600,
    width: 800,
  })

  mainCanvasWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../canvas/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  const reactDevToolPath = util.getReactDevToolPath()
  BrowserWindow.addDevToolsExtension(reactDevToolPath)
  mainCanvasWindow.webContents.openDevTools()

  mainCanvasWindow.on('closed', () => {
    mainCanvasWindow = null
  })
}

app.on('ready', createCanvasWindow)

app.on('window-all-closed', () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainCanvasWindow === null) {
    createCanvasWindow()
  }
})