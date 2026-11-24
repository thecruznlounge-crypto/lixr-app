const C='lixr-v3', A=['./','index.html','lixr-ai.js','manifest.json','hero.jpg','blue.jpg','berry.jpg','choc.jpg','icon-192.png','icon-512.png'];
// Install the new version right away instead of waiting for every tab to close.
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;
  // Page and code: network first so updates show, saved copy when offline. Images: saved copy first.
  if(e.request.mode==='navigate'||/\.(html|js|json)$/.test(u.pathname)||u.pathname==='/'){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  } else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
