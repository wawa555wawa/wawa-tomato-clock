export async function requestNotifyPermission(): Promise<boolean> {
  // 尝试 Capacitor 本地通知
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    const result = await LocalNotifications.requestPermissions()
    if (result.display === 'granted') return true
  } catch { /* 不在 Capacitor 环境中 */ }
  
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const res = await Notification.requestPermission()
  return res === 'granted'
}

export function sendNotification(title: string, body: string) {
  // 尝试 Capacitor 本地通知 (Android 锁屏可见)
  try {
    import('@capacitor/local-notifications').then(({ LocalNotifications }) => {
      LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title,
          body,
          smallIcon: 'ic_launcher',
          largeIcon: 'ic_launcher',
          channelId: 'tomato_timer_channel',
          ongoing: false,
          autoCancel: true,
          schedule: { at: new Date() }
        }]
      })
    }).catch(() => {})
  } catch { /* 不在 Capacitor 环境中 */ }
  
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, tag: 'wawa-tomato' })
  } catch {
    /* 某些浏览器仅在 Service Worker 内支持 */
  }
}
