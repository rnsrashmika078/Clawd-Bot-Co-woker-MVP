import { ipcMain, Notification } from "electron";

export function notificationHandler() {
  ipcMain.on("new-chat", (_, options: { title: string; body: string }) => {
    const notification = new Notification({
      title: options.title,
      body: options.body,
    });
    notification.show();
  });
}
