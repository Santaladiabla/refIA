// REFIA service worker — generado por refia-build.py 2026-09-09 02:57
const CACHE='refia-donrepuestos-202609090257';
const CORE=['refia-buscador.html','manifest.webmanifest','icons/refia-192.png','icons/refia-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('refia-donrepuestos-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  // El conocimiento y las placas van siempre a la red (nunca cache)
  if(/\/(k|placa)\//.test(u.pathname)||u.pathname.endsWith('/placa'))return;
  const sameOrigin=u.origin===location.origin;
  const isMedia=/\.(png|jpe?g|webp|gif|mp4|webm|svg)$/i.test(u.pathname);
  if(!sameOrigin&&!isMedia)return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const cached=await c.match(e.request);
    const net=fetch(e.request).then(r=>{if(r&&r.ok&&(sameOrigin||r.type==='cors'))c.put(e.request,r.clone());return r;}).catch(()=>null);
    if(cached){net.catch(()=>{});return cached;}
    const r=await net;
    return r||new Response('Sin conexión y sin copia guardada',{status:503,headers:{'content-type':'text/plain;charset=utf-8'}});
  }));
});
