## The Screen Capture API

```js
 try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */

  } catch(err) {
    /* handle the error */
    console.error("Error getting the stream", err);
  }
```

This API allows your app to prompt the user for access to either their entire screen contents or a single app. Once the user has chosen a screen you will then get a [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) which you can then save as a file, or record using the [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API).

* Note: The Screen Capture API is implemented in Safari, but the recording functionality in the demo will not work in Safari as Safari lacks support for the MediaStream Recording API.