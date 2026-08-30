export function triggerChatNotification({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  window.notification.chat({
    title,
    body,
  });
}
