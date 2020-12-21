If you are looking for.

## Purpose

The intent of this document is to help developers get started with a service worker that leverages the cache library of Workbox to provide. Below this guide is a quick tutorial on how to create a service worker and incorporate Workbox into your build step.

There are three major approaches to generating a service worker:

1. Have Workbox do the heavy lifting and plug into with `generateSW`.
2. Use your service worker as the start point and inject into it with the workbox system using `injectManifest`, if you do have a manifest and want to use workbox plugins this is a good way to extend your service worker, [demo and tutorial here](https://components.pwabuilder.com/demo/workbox_offline_with_sw).
3. Use the workbox libraries directly using `copyWorkboxLibraries`, this is not covered here, but this allows you to tailor the service worker behavior without boilerplate and allows you to plug into the workbox system and benefit from the plugins (theoretically).

## Use a workbox generated service worker

1. Get the dependencies

```bash
# If you are using pure-node
npm install --save workbox-build

# Rollup, maintained by modern-dev, wraps workbox-build
npm install --save rollup-plugin-workbox

# Webpack, maintained by Webpack team
npm install --save workbox-webpack-plugin
```

2. Add to your build step

```typescript
// Config remains largely the same between the different implementations.
const config = {
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

// Script
import { generateSW } from 'workbox-build';

generateSW(config).then(({count, size, filePaths, warnings}) => {
  console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
});

// Rollup plugin
import { generateSW } from 'rollup-plugin-workbox';

export default {
  //... rollup config
  plugins: [
    //... other plugins
    generateSW(config)
  ]
}

// Webpack
import { GenerateSW } from 'workbox-webpack-plugin';

export default {
  //... webpack config
  plugins: [
    new GenerateSW({
      ...config,
      // largely the same, but with a few nuances
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW#GenerateSW
    })
  ]
}

```

3. Profit.

## Advanced Topics

### Precaching Files

Candidates for precaching include: the start url html, the offline fallback html, javascript, images used on your start and . Essentially they are critical for 

## Offline Fallback

The fallback html

## Setup Walkthrough

### Setup Basic Service Worker

If you do not have a service worker the most basic example

### Configuring Workbox

If you do not have workbox configured this part of the guide will walk you through adding it to your build step for your service worker.

### Bundling Workbox into your service worker build
