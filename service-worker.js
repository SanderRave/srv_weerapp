if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const o=e=>i(e,t),a={module:{uri:t},exports:c,require:o};s[t]=Promise.all(n.map((e=>a[e]||o(e)))).then((e=>(r(...e),c)))}}define(["./workbox-7e1bcf14"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/srv_weerapp/index.html",revision:"72983f4cf4c22f09ff65b1cffe7c5d31"},{url:"/srv_weerapp/static/css/main.a362f743.css",revision:null},{url:"/srv_weerapp/static/js/453.c693e64f.chunk.js",revision:null},{url:"/srv_weerapp/static/js/main.5f08a326.js",revision:null},{url:"/srv_weerapp/static/js/main.5f08a326.js.LICENSE.txt",revision:"b114cc85da504a772f040e3f40f8e46a"}],{}),e.registerRoute(/\.(?:png|jpg|jpeg|svg|gif)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/https:\/\/api.yourservice.com\//,new e.NetworkFirst({cacheName:"api-cache",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:300})]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
