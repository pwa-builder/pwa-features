## The low-latency canvas API

This API enables fast, low latency rendering to an HTML canvas element by allowing your drawing calls to skip most of the rendering pipeline in the browser so that pixels get painted faster. It works for both 3d and 2d scenarios and is used in the [PWABuilder Inking component](https://pwafeatures.z22.web.core.windows.net/component/inking).