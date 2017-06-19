
import path from "path";
import url from "url";
import { app, Menu, ipcMain } from "electron";

import settings from "electron-settings";

import { getDefs, exportMech, saveMech } from "./fileSystem.js";

import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { mainMenu } from "./menu/mainMenu.js";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "./env";

let win = null;
console.log("Main thread started");

const setApplicationMenu = () => {
  const menus = [mainMenu, editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on("ready", () => {
  setApplicationMenu();

  mainMenu.win = win = createWindow("main", {
    width: 1000,
    height: 600,
    useContentSize: true,
    minWidth: 1200,
  });

  if (settings.has("gameDirectory")) {
    // TODO: find a better fix for this race condition than delaying for a second
    setTimeout(() => {
      console.log("Game directory set");
      win.webContents.send("gameDirectorySet", {});
    }, 1000);
  }
  else {
    console.log("Game directory is not set.");
  }

  ipcMain.on("fsCommand", async (event, message) => {
    console.log(`fsCommand recieved: ${message.command}`);
    switch (message.command) {
      case "save": {
        saveMech(message.data);
      } break;
      case "export": {
        exportMech(message.data);
      } break;
      case "getDefs": {
        getDefs(message.type).then(defs => {
          console.log(`Sending defs to render process for ${message.type}`);
          win.webContents.send("def", {type: message.type, defs});
        }).catch(err => {
          console.log(`Error getting defs: ${message.type}; ${err}`);
        });
      } break;
    }
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
