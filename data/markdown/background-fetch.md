### Background Fetch

Background fetch enables web apps to download or upload large files, such as videos or podcasts or game levels. The fetch operation is resilient: it can be paused and resumed, and it remains active even if the browser is closed.

Your web app can detect ongoing background fetch operations, query them for progress, and store them in a service worker cache for offline use. Moreover, a single background fetch operation can contain multiple downloads. For example, a podcast app might download Season 2 -- a single background fetch operation that contains multiple audio file downloads. You web app can name the fetch operation and supply an image to display.

![Image of Background Fetch executing on Android](/assets/background-fetch-android.png)
*<small>A background fetch operation running on Android, even when the browser is closed.</small>*

![Image of Background Fetch executing on Android](/assets/background-fetch-edge.png)
*<small>A background fetch operation running in Edge, appearing similar to a file download.</small>*

Background fetches are user-friendly: showing download progress to users, enabling users to pause/resume/abort, and can group related items (e.g. all episodes of a podcast season) as a single fetch operation. Users can close your web app, and even their browser, and the background fetch will continue running. Users will enjoy a faster, more responsive experience: rather than buffering large media files during times of slow connection (e.g. travelling on a bus), they'll be able to instantly play media that was cached while on a fast connection.

### Detecting Support
You can feature-detect support for Background Fetch:

```js
if ('BackgroundFetchManager' in self) {
  // This browser supports Background Fetch.
}
```

### Starting a Background Fetch
Background fetch requires a service worker to be registered first. Once registered, you can start a Background Fetch operation:

```js
// Wait for the SW to be ready.
const sw = await navigator.serviceWorker.ready;

// Start a Background Fetch to download Season 2 of the podcast.
const fetchId = "my-podcast-season-2";
const season2Files = [
    "/episode-1.mp3",
    "/episode-1-art.jpg",
    "/episode-2.mp3",
    "/episode-2-art.jpg"
]
const bgFetch = await sw.backgroundFetch.fetch(fetchId, season2Files, {
    title: "My Podcast - Season 2",
    icons: [
        {
            sizes: "300x300",
            src: "/ep-1-icon.jpg",
            type: "image/png"
        }
    ],
    downloadTotal: 120 * 1024 * 1024
}
```

Note that you can request resources from other domains as well, but they must support CORS.

The `downloadTotal` argument specifies the total size of the download. This is needed to get a proper progress event.

### Resuming an existing Background Fetch
Background Fetches are resilient: Imagine a user clicks "Download Season 2" in your PWA, and your PWA initiates a Background Fetch. But seconds later, the user closes your PWA. The background fetch will still be running.

Because of this, your PWA may want to check for existing background fetch operations:

```js
// Grab the service worker.
const sw = await navigator.serviceWorker.ready;

// See if we're already fetching Season 2.
const season2Id = "my-podcast-season-2";
const existingFetch = await sw.backgroundFetch.get(season2Id);
if (existingFetch) {
    console.log("Season 2 download already in progress.");
}
```

### Listening for progress
Once you've kicked off a Background Fetch, you can listen for download progress using the `progress` event:

```js
bgFetch.addEventListener("progress", () => {
    if (bgFetch.downloadTotal > 0) {
        const percentComplete = Math.round(bgFetch.downloaded / bgFetch.downloadTotal * 100);
        console.log(`Download progress: ${percentComplete}%`);
    }
})
```

### Handling success and failure
The status of a Background Fetch is stored in its `result` property:

```js
if (bgFetch.result === "success") {
   console.log("success!"); 
} else if (bgFetch.result === "failure") {
    console.error("Background fetch failed:", bgFetch.failureReason);
} else {
    console.log("Background fetch still running...");
}
```

Additionally, your service worker will fire different events for your Background Fetch operation:

```js
// Inside service worker

self.addEventListener("backgroundfetchsuccess", e => {
    const bgFetch = e.registration;
    console.log("background fetch succeeded", bgFetch);
});

self.addEventListener("backgroundfetchfailure", e => {
    const bgFetch = e.registration;
    console.error("background fetch failed", bgFetch);
});

self.addEventListener("backgroundfetchabort", e => {
    const bgFetch = e.registration;
    console.warn("background fetch aborted", bgFetch);
});

```

### Responding to user interaction 
Background Fetch operations can be managed (paused, resumed, aborted) by users. Aborting a Background Fetch will fire the `backgroundfetchabort` event as described above.

Additionally, users can click or tap on a Background Fetch operation to activate it. You can listen for this event also in your service worker:

```js
self.addEventListener("backgroundfetchclick", e => {
    console.log("user clicked on the background fetch operation", e.registration);
});
```

Your PWA could, for example, respond to the user clicking on the background fetch by scrolling the media player into view and start playing the media.

Additionally, you can change the appearance of the Background Fetch operation when it completes:

```js
// In service worker

self.addEventListener("backgroundfetchsuccess", e => {
    e.updateUI({ title: "Season 2 is ready!" });
});

self.addEventListener("backgroundfetchfailure", e => {
    e.updateUI({ title: "Error downloading Seasons 2" });
});
```

### Caching Background Fetch results
Once a Background Fetch completes, you will likely wish to cache it for offline playback. To do this, listen for `backgroundfetchsuccess` and add it to a service worker cache:

```js
// Inside service worker

self.addEventListener('backgroundfetchsuccess', (e) => {
    const bgFetch = e.registration;
    e.waitUntil(async () => await putSeasonInCache(bgFetch));
});

async function putSeasonInCache(bgFetch) {
    // Create/open a cache.
    const cache = await caches.open("podcast-cache");

    // Get all the Background Fetch results.
    const records = await bgFetch.matchAll();

    // Copy each request/response into the cache.
    const putInCacheTasks = records.map(async (record) => {
        const response = await record.responseReady;
        await cache.put(record.request, response);
    });

    await Promise.all(putInCacheTasks);
}
```

### Detecting if media is already cached

You may wish to display UI when a Background Fetch has successfully cached media. For example, you may wish to show "Season 2 available offline." 

In our podcast example, we can simply check the cache for media:

```js
async function isSeason2Cached() {
    // Open our podcast cache.
    const cache = await caches.open("podcast-cache");
    const everythingInCache = await cache.matchAll();

    // We should have 4 episodes in season 2
    const expectedTotalEpisodes = 3;
    return everythingInCache.filter(r => r.url.includes(".mp3")).length === expectedTotalEpisodes;
}
```

Opening a cache can be done either in your app code or in your service worker, making it easy to check for cache status. Once detected, your app can display appropriate UI to show offline status.