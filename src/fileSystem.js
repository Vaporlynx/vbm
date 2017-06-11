
import { dialog} from "electron";

import fs from "fs";
import settings from "electron-settings";

export const saveMech = data => {
  console.log("Save mech called");
};

export const exportMech = data => {
  const fileName = data.Description.Id;
  let file = null;
  const filePath = dialog.showSaveDialog({defaultPath: `${settings.get("gameDirectory")}\\${fileName}.json`});
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
};

export const getDefs = (defName, win) => {
  return new Promise(async (resolve, reject) => {

    const subPath = (() => {
      switch (defName) {
        case "chassis": return "chassis";
        case "amunition": return "ammunitionBox";
        case "heatsinks": return "heatsinks";
        case "jumpjets": return "jumpjets";
        case "movement": return "movement";
        case "weapon": return "weapon";
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
  });
};
