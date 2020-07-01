### Picture-in-Picture

Picture-in-Picture (PiP) can display a HTML video element as a floating window you can place whereever your want. It will remain on top of other windows. 

Check support for your targeted browsers: https://caniuse.com/#feat=picture-in-picture 

In this demo, you'll see 4 ways of using the PiP element: 

- for a regular mp4 video 
- to display the webcam feed using ```getUserMedia()```
- to share one of your screen, app or tab using ```getDisplayMedia()```
- at last with a streamed WebGL canvas using ```canvas.captureStream()```

This obviously enables great scenarios for productivity and multitask. You can keep an eye to a video you are watching while reading your emails, check you webcam video output during a conf-call, etc.

The WebGL demo is hacking a bit the feature as it uses the navigation button to control the Babylon.js rotating camera. 
