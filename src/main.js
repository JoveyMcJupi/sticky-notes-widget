//console.log("main process working!");

const fs = require('fs');
const electron = require("electron");
const { systemPreferences } = require('electron')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
ipc = electron.ipcMain;
let styling = `
<head>
    <style type="text/css">
        * {
            color: white;
        }

        /* width */
        ::-webkit-scrollbar {
        width: 5px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
        background: transparent; 
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
        border-radius: 10px;

        }

        body:hover::-webkit-scrollbar-thumb {
            background-color: darkgrey;
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: darkgrey;
        }

        body::-webkit-scrollbar-thumb {
            background-color: transparent;
        }
        
    </style>
</head> `

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 300, height: 400, frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
    }));
    win.removeMenu()
    win.setResizable(false)

    const color = systemPreferences.getAccentColor()
    const red = parseInt(color.substr(0, 2), 16);
    const green = parseInt(color.substr(2, 2), 16);
    const blue = parseInt(color.substr(4, 2), 16);
    const alpha = parseInt(color.substr(6, 2), 16);
    const wholeColor = [red, green, blue, alpha];

    win.webContents.once('did-finish-load', () => {
        win.webContents.send('asynchronous-message', wholeColor);
    });
    
    //win.webContents.openDevTools()
    win.on("closed", () => {
        win = null;
    })
}

app.on("ready", createWindow);

const outputPath = path.join(__dirname, 'resources/app', 'noteContents.html');


ipc.on('text', (event, args) => {
    fs.writeFile(outputPath, styling + args.data, (err) => {
        if (err) throw err;
    })
   });