
import path from "path";
import url from "url";
import { app, Menu } from "electron";

import { fileSystemHandler } from "./fileSystem.js";

import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { mainMenu } from "./menu/mainMenu.js";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "./env";

let win = null;

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

  fileSystemHandler.win = mainMenu.win = win = createWindow("main", {
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
