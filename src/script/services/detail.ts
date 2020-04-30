export async function handleMarkdown(markdownURL: string): Promise<string | void> {
  return new Promise(async (resolve, reject) => {
    try {
      const markdownReq = await fetch(markdownURL);
      const markdown = await markdownReq.text();

      const markedWorker = new Worker('/assets/markWorker.js');
      console.log(markedWorker);

      markedWorker.postMessage(markdown);

      markedWorker.onmessage = (e) => {
        const html = e.data;
        console.log('html', html);

        resolve(html);
      };
    }
    catch (err) {
      reject(err);
    }
  })
}