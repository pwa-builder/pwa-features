If you are looking for.

## Purpose

The intent of this document is to help developers get started with a service worker that leverages the cache library of Workbox to provide. Below this guide is a quick tutorial on how to create a service worker and incorporate Workbox into your build step.

There are three major approaches to generating a service worker:

1. Have Workbox do the heavy lifting and plug into with `generateSW`, [demo and tutorial here](https://components.pwabuilder.com/demo/workbox_offline_generate_sw).
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

// Node
import replace from '@rollup/plugin-replace';
import { injectManifest } from 'workbox-build';

injectManifest(config).then(({count, size, filePaths, warnings}) => {
  console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
});

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

### Rollup Service Worker

The rollup service worker allows you to use the workbox libraries directly and interface with them.

#### Boilerplate

```typescript
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
```

#### An example tuned to a single api.

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
        // Used to generate the cache key and to replicate, the last in the plugins list dictates, default is the url
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

#### Example: Workbox

```typescript
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({cacheName: 'images'}),
);

```


#### Example: Cache API

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
  receive custom messages
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

// need to clean caches manually
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

#### Example: rel tags

```html
```

## Offline Fallback

The fallback html

## Setup Walkthrough

### Setup Basic Service Worker

If you do not have a service worker the most basic example

### Configuring Workbox

If you do not have workbox configured this part of the guide will walk you through adding it to your build step for your service worker.

### Bundling Workbox into your service worker build
