
import { dialog, ipcMain } from "electron";

import fs from "fs";
import settings from "electron-settings";

// Handle fs command from the renderer
ipcMain.on("fsCommand", async (event, message) => {
  if (message.command === "save") {
//
  }
  else if (message.command === "export") {
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
  else if (message.command === "getDef") {
    //
  }
});
