importScripts('/assets/marked.min.js');

onmessage = (e) => {
  const markdownString = e.data;
  postMessage(marked(markdownString));
};