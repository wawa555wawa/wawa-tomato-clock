export async function requestNotifyPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const res = await Notification.requestPermission()
  return res === 'granted'
}

export function sendNotification(title: string, body: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, tag: 'wawa-tomato' })
  } catch {
    /* 某些浏览器仅在 Service Worker 内支持 */
  }
}
