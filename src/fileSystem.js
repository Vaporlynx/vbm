
import { dialog} from "electron";

import fs from "fs";
import settings from "electron-settings";

export const saveMech = data => {
  const fileName = data.Description.Id;
  let file = null;
  if (settings.has("gameDirectory")) {
    const filePath = `${settings.get("gameDirectory")}\\BattleTech_Data\\StreamingAssets\\data\\mech\\${fileName}.json`;
    try {
      file = JSON.stringify(data);
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
};

export const exportMech = data => {
  if (settings.has("gameDirectory")) {
    const fileName = data.Description.Id;
    let file = null;
    let filePath = dialog.showSaveDialog({defaultPath: `${settings.get("gameDirectory")}\\${fileName}.json`});
    filePath = filePath.slice(0, filePath.lastIndexOf("\\"));
    try {
      file = JSON.stringify(data);
      if (filePath) {
        fs.writeFile(`${filePath}\\${fileName}.json`, file, err => {
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
};

export const getDefs = (defName, win) => {
  return new Promise(async (resolve, reject) => {
    if (settings.has("gameDirectory")) {
      const subPath = (() => {
        switch (defName) {
          case "chassis": return "chassis";
          case "ammunitionbox": return "ammunitionBox";
          case "heatsink": return "heatsinks";
          case "jumpjet": return "jumpjets";
          case "movement": return "movement";
          case "weapon": return "weapon";
          case "mech": return "mech";
          default: return "";
        }
      })();
      const path = `${settings.get("gameDirectory")}\\BattleTech_Data\\StreamingAssets\\data\\${subPath}`;
      try {
        const directoryData = await new Promise((resolve, reject) => {
          fs.readdir(path, "utf8", (err, data) => {
            if (err) {
              reject(err);
            }
            else {
              // console.log(`Loading defs: ${data}`);
              resolve(data);
            }
          });
        });
        const files = [];
        for (const filePath of directoryData.filter(i => i.includes(".json"))) {
          files.push(await new Promise((resolve, reject) => {
            fs.readFile(`${path}\\${filePath}`, "utf8", (err, data) => {
              if (err) {
                reject(err);
              }
              else {
                resolve(data);
              }
            });
          }));
        }
        resolve(files);
      }
      catch (err) {
        reject(err);
      }
    }
    else {
      reject("Game director not set!");
    }
  });
};
