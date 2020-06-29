importScripts('/assets/marked.min.js');
importScripts('/assets/highlight.js');

onmessage = (e) => {
  const markdownString = e.data;
  postMessage(marked(markdownString, {
    breaks: true,
    gfm: true,
    smartLists: true,
    xhtml: true,
    highlight: (code, language) => {
      const hljs = self.hljs;
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return hljs.highlight(validLanguage, code).value;
    },
  }));
};