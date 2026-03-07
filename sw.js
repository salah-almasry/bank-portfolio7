// ===== Service Worker — Web Push Handler =====
// ضع الملف ده في نفس مجلد index.html على GitHub Pages

self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'إشعار جديد', body: event.data.text() }; }

  const title   = data.title || 'حالا بنبان';
  const options = {
    body:    data.body || '',
    icon:    data.icon || '/icons/icon-192.png',
    badge:   '/icons/icon-192.png',
    dir:     'rtl',
    lang:    'ar',
    tag:     data.tag || 'default',
    data:    { url: data.url || '/' },
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url === url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
