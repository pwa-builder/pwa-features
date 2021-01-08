## Purpose

The intent of this document is to help developers get started with a service worker that leverages the cache library of Workbox to provide. Below this guide is a quick tutorial on how to create a service worker and incorporate Workbox into your build step.

There are three major approaches to generating a service worker:

1. Have Workbox do the heavy lifting and plug into with `generateSW`, [demo and tutorial here](/demo/workbox-offline-generate).
2. Use your service worker as the start point and inject into it with the workbox system using `injectManifest`, if you do have a manifest and want to use workbox plugins this is a good way to extend your service worker.
3. Use the workbox libraries directly using `copyWorkboxLibraries`, this is not covered here, but this allows you to tailor the service worker behavior without boilerplate and allows you to plug into the workbox system and benefit from the plugins (theoretically).


## Extending your service worker with workbox

1. Get the dependencies

```bash
# If you are using pure-node
npm install --save workbox-build

# Rollup, maintained by modern-dev, wraps workbox-build
npm install --save workbox-build rollup-plugin-workbox-inject @rollup/plugin-replace

# Webpack, maintained by Webpack team
npm install --save workbox-webpack-plugin
```

2. Add to your build step, note there's specify: `swSrc` which is the service worker source file, opionally thee `injectionPoint` which defaults to `injectionPoint`

### Universal Configuration

```typescript
// Inject Manifest config
const config = {
  swSrc: 'sw.js',
  injectionPoint: 'INJECTION_POINT', // default behavior is append, so if you want this to be at the top of the file use a string here to control that.
  swDest: 'build/sw.js',
  globDirectory: "build/",
  globPatterns: [
    'styles/*.css',
    '**/*/*.svg',
    '*.js',
    '*.html',
    'assets/**',
    '*.json'
  ],
  importScripts: ['other-sw.js'], // add to the generated service worker, like middle ware.
  templatedURLs: ['your.site.com/server-renderer'] // place all server rendered urls to precache here.
}
```

### Node build script

```typescript
// Node
import replace from '@rollup/plugin-replace';
import { injectManifest } from 'workbox-build';

injectManifest(config).then(({count, size, filePaths, warnings}) => {
  console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
});

```

### Rollup plugin

```typescript
// Rollup config, an example rollup bundled service worker below
import workbox from 'rollup-plugin-workbox-inject'

export default {
  //... rollup config
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    workbox({
      ...config
    })
  ]
}
```

### Webpack plugin

```typescript
// Webpack
import { InjectManifest } from 'workbox-webpack-plugin';

export default {
  //... webpack config
  plugins: [
    new InjectManifest({
      ...config,
      // largely the same, but with a few nuances
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest#InjectManifest
    })
  ]
}
```

## Advanced Topics

These examples are not meant to be exhaustive, the alternatives shown are to highlight the advantages of workbox.

### Rollup Service Worker

The rollup service worker allows you to use the workbox libraries directly and interface with them.

#### Boilerplate

```typescript
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
```

#### Example: Extending the cache to a single api

```typescript
declare const self: ServiceWorkerGlobalScope;
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst
} from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

class ApiStrategy extends CacheFirst {}

registerRoute(({url}) => url.hostname === "the-one-api.dev",
  new ApiStrategy({
    cacheName: 'onering',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      }),
      {
        // Used to generate the cache key and to replicate, the last in the plugins list dictates, default is the url, the edit here is just to use the pathname and search.
        cacheKeyWillBeUsed: async ({request}) => {
          const parsedUrl = new URL(request.url);
          return parsedUrl.pathname + parsedUrl.search;
        },
      }
    ]
  }),
  "GET" // optional param.
);
```

### Precaching Files

Candidates for precaching are the typical static assets of your website:

- html
- javascript
- css
- fonts
- images

Caching can be done manually with the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache), Workbox which interfaces with the Cache API and simplifies it considerably, and the html `rel` tag although [not all browsers support the tag equally](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). Our recommendation is to use Workbox, as it provides simple work flows that will address most tasks, and keeps the development digestible.

#### Example: Precache with Workbox

```typescript
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

// can do custom tasks here
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({cacheName: 'images'}),
);
```


#### Example: Precache with Cache API

```javascript
// setup caches with the install event listener
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('cachename').then(cache => {
      return cache.addAll([
        'index.html', '/css/main.css', '/js/main.js', '/assets/logo.png' //... you get the idea
      ])
    })
  )
})

// handle fetch events
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // found in cache
        return response;
      }

      return fetch(event.request).then(response => {
        event.waitUntil(
          caches.open('cachename').then(cache => {
            return cache.put(event.request, response)
          })
        )

        return response
      }).catch(error => {
        throw error;
      })
    })
  )
})

/*
  receive custom messages, e.i. manually trigger things to cache
*/
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'KEY") {
    // example, you'll need to implement logic here
    event.waitUntil(
      caches.open(event.data.type).then(cache => {
        // cache.add is designed for request objects, use cache.put for more custom behavior.
        return cache.add(event.data.request)
      })
    )
  }
})

// need to clean caches manually.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (someDeleteCondition(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    })
  )
})
```

With a manual cache setup you will need to send messages to the service worker, or set it up to intercept your network calls.

```javascript
navigate.serviceWorker.postMessage(
  type: "KEY",
  request: {} // request object in this case.
)
```

#### Example: Precache with rel tags

The main issue with the rel tags is that browser support isn't universal, and the behavior is different based on implementation. Not to mention cache rules need to be sent with the response header, meaning your caching behavior is relies on four different sources, two of them being logic in your control: the browser's settings, the users custom settings and browser plugins, the response header rules for caching, and the html.

```html
<html>
  <head>
    <!-- ... -->
    <!-- gives the browser a small head start in dns lookup for resources like images and audio -->
    <link rel="dns-prefetch" href="www.example.com">

    <!-- sets up sockets before use -->
    <link rel="preconnect" href="www.example.com">

    <!-- asks the browser to do the above, but also actually fetch the resource -->
    <link rel="prefetch" href="www.example.com/api/user">

    <!-- higher priority than prefetch -->
    <link rel="subresource" href="www.example.com/assets/main.css">

    <!-- works like a buffer swap, renders the page in the background and swaps it out, expensive, and the nullified by Page Visibility API settings: https://www.w3.org/TR/page-visibility/ -->
    <link rel="prerender" href="www.example.com">

    <!-- asks the browser to pre-emptively cache the resource -->
    <link rel="preload" href="www.example.com/assets/main.css">

  </head>
  <body>
    <!-- ... -->
  </body>
</html>

```

## Offline Fallback

Offline fallbacks primarily rely on the precache boilerplate above, but the service worker intercepts the preload request and loads from the cache rather than make a network request.

### Example: Offline Fallback with Workbox

```typescript
  import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
  import { setCatchHandler } from 'workbox-routing';
  import {* as navigationPreload} from 'workbox-navigation-preload';

  // placeholder, better to map directly to json that is used to generate the prefetch manifest
  const FALLBACK_HTML = "www.example.com/fallback"

  precacheAndRoute(self.__WB_MANIFEST);

  // new logic starts here
  navigationPreload.enable();

  setCatchHandler(async ({event}) => {
    if (event.request.destination === "document") {
      return matchPrecache(FALLBACK_HTML)
    }

    return Response.error();
  })
```

### Example: Offline Fallback with Cache API

```javascript
  const cacheName = "offline"
  const offlineUrl = "offline.html"

  self.addEventListener("install", event => {
    // including "install" cache logic above
    event.waitUntil(
      (async () => {
        const cache = await caches.open(cacheName)
        // skips the http cache
        await cache.add(new Request(offlineUrl, { cache: "reload" }))
      })()
    )

    self.skipWaiting()
  })

  self.addEventListener("activate", event => {
    // including the "activate" logic above
    event.waitUntil(
      (async () => {
        // browser supports navigation preload.
        if ("navigationPreload" in self.registration) {
          await self.registration.navigationPreload.enable()
        }
      })()
    )

    self.clients.claim()
  })

  self.addEventListener("fetch", event => {
    // to only interfect navigate requests.
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
            const preloadResponse = await event.preloadResponse
            if (preloadResponse) {
              return preloadResponse
            }

            const networkResponse = await fetch(event.request)
            return networkResponse
          } catch (error) {
            const cache = await caches.open(cacheName)
            const cachedResponse = await cache.match(offlineUrl)

            return cachedResponse
          }
        })()
      )
    }

    // include the fetch logic above
  })

  // Remember this code will require manual cache cleaning and the management of the other resources as well, for sake of DRYness I'm not repeating the logic above.
```
