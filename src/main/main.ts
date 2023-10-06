import {app, BrowserWindow, ipcMain, session, protocol, net} from 'electron';
import {join} from 'path';
import {readFileSync} from 'fs';
import url from 'url'
import { StorageFolder } from './backend/config'


import { setupBackend } from './backend/index'

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

setupBackend()

app.whenReady().then(() => {
  protocol.handle('aarakocra', (request) => {
    const { host, pathname } = new URL(request.url)
    const filePath = join(StorageFolder(), decodeURI(pathname))
    
    return net.fetch(url.pathToFileURL(filePath).toString())
  })
});