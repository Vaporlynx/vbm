
import { dialog, ipcMain } from "electron";

import fs from "fs";
import settings from "electron-settings";

export const fileSystemHandler = (() => {
  // Handle fs command from the renderer
  ipcMain.on("fsCommand", async (event, message) => {
    switch (message.command) {
      case "save": {
        //
      } break;
      case "export": {
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
      } break;
      case "getDefs": {
        const subPath = () => {
          switch (message.type) {
            case "1": return "";
            default: return "";
          }
        };
        const path = `${settings.get("gameDirectory")}\\BattleTech_Data\\StreamingAssets\\data\\${subPath}`;
        fs.readFile(path, "utf8", (err, data) => {
          if (err) {
            console.log(`File Read error: ${err}`);
            dialog.showErrorBox("Failed to read files from disk.", err);
          }
          else {
            fileSystemHandler.webContents.send("def", {type: message.type, data});
          }
        });
      } break;
    }
  });
});
