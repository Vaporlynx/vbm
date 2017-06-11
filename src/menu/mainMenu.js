import { app,  dialog } from "electron";

import settings from "electron-settings";
import fs from "fs";

let lastFilePath = "";

export const mainMenu = {
  win: null,
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
      const startPath = `${settings.get("gameDirectory")}\\BattleTech_Data\\StreamingAssets\\data\\mech`;
      const filePath = dialog.showOpenDialog({defaultPath: startPath, properties: ["openFile"]});
      if (filePath) {
        lastFilePath = filePath[0];
        fs.readFile(lastFilePath, "utf8", (err, data) => {
          if (err) {
            console.log(`File Write error: ${err}`);
            dialog.showErrorBox("Failed to write file to disk.", err);
          }
          else {
            mainMenu.win.webContents.send("menuCommand", {command: "load", data});
          }
        });
      }
    },
  }, {
    label: "Save",
    accelerator: "CmdOrCtrl+S",
    click: () => {
      mainMenu.win.webContents.send("menuCommand", {command: "save"});
    },
  }, {
    label: "Export",
    accelerator: "CmdOrCtrl+E",
    click: () => {
      mainMenu.win.webContents.send("menuCommand", {command: "export"});
    },
  }, {
    label: "Quit",
    accelerator: "Alt+f4",
    click: () => {
      app.quit();
    },
  }],
};
