
import path from "path";
import url from "url";
import { app, Menu, dialog, ipcMain } from "electron";

import settings from "electron-settings";
import fs from "fs";

import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "./env";

let win = null;
let lastFilePath = "";

const mainMenu = {
  label: "File",
  submenu: [{
    label: "Set Game Directory",
    click: () => {
      const filePath = dialog.showOpenDialog({properties: ["openDirectory"]});
      if (filePath) {
        settings.set("gameDirectory", filePath[0]);
      }
    },
  }, {
    label: "Open",
    accelerator: "CmdOrCtrl+O",
    click: () => {
      const filePath = dialog.showOpenDialog({defaultPath: settings.get("gameDirectory"), properties: ["openFile"]});
      if (filePath) {
        lastFilePath = filePath[0];
        fs.readFile(lastFilePath, "utf8", (err, data) => {
          if (err) {
            console.log(`File Write error: ${err}`);
            dialog.showErrorBox("Failed to write file to disk.", err);
          }
          else {
            win.webContents.send("menuCommand", {command: "load", data});
          }
        });
      }
    },
  }, {
    label: "Save",
    accelerator: "CmdOrCtrl+S",
    click: () => {
      win.webContents.send("menuCommand", {command: "save"});
    },
  }, {
    label: "Export",
    accelerator: "CmdOrCtrl+E",
    click: () => {
      win.webContents.send("menuCommand", {command: "export"});
    },
  }, {
    label: "Quit",
    accelerator: "Alt+f4",
    click: () => {
      app.quit();
    },
  }],
};

// Handle fs command from the renderer
ipcMain.on("fsCommand", (event, message) => {
  if (message.command === "save") {
//
  }
  else {
    const fileName = message.data.Description.Id;
    let file = null;
    const filePath = dialog.showSaveDialog({defaultPath: `${settings.get("gameDirectory")}\\${fileName}.json`});
    try {
      file = JSON.stringify(message.data);
      if (filePath) {
        fs.writeFile(filePath, file, err => {
          if (err) {
            throw err;
          }
        });
      }
    }
    catch (err) {
      console.log(`File Write error: ${err}`);
      dialog.showErrorBox("Failed to write file to disk.", err);
    }
  }
});

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
