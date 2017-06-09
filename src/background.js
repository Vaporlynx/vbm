// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu, dialog } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";

const fs = require("fs");
const settings = require("electron-settings");

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "./env";

let win = null;

const mainMenu = {
  label: "File",
  submenu: [{
    label: "Set Game Directory",
    click: () => {
      const filePath = dialog.showOpenDialog({properties: ["openDirectory"]});
      if (filePath) {
        settings.set("gameDirectory", filePath[0]);
        // const file = JSON.stringify(Object.assign({}, config, {gameDirectory: filePath[0]}));
        // fs.writeFile("config.json", file, err => {
        //   if (err) {
        //     console.log(`File Write error: ${err}`);
        //     dialog.showErrorBox("Failed to write file to disk.", err);
        //   }
        // });
      }
    },
  }, {
    label: "Open",
    accelerator: "CmdOrCtrl+O",
    click: () => {
      const filePath = dialog.showOpenDialog({defaultPath: settings.get("gameDirectory"), properties: ["openFile"]});
      if (filePath) {
        win.webContents.send("menuCommand", {command: "load", path: filePath[0]});
      }
    },
  }, {
    label: "Save",
    accelerator: "CmdOrCtrl+S",
    click: () => {
      win.webContents.send("menuCommand", "save");
    },
  }, {
    label: "Export",
    accelerator: "CmdOrCtrl+E",
    click: () => {
      const filePath = dialog.showOpenDialog({defaultPath: settings.get("gameDirectory"), properties: ["openFile"]});
      if (filePath) {
        win.webContents.send("menuCommand", {command: "save", path: filePath[0]});
      }
    },
  }, {
    label: "Quit",
    accelerator: "Alt+f4",
    click: () => {
      app.quit();
    },
  }],
};

const setApplicationMenu = () => {
  const menus = [mainMenu, editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  setApplicationMenu();

  win = createWindow("main", {
    width: 1000,
    height: 600,
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, "app.html"),
    protocol: "file:",
    slashes: true,
  }));

  if (env.name === "development") {
    win.openDevTools();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
