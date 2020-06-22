export function initAnalytics() {
  const config = {
    autoCapture: {
      lineage: true
    },
    coreData: {
      appId: "PWABuilder",
      market: "en-us"
    }
  };
  (window as any).awa.init(config);
}

export function doCapture(config: any) {
  if ((window as any).awa) {
    (window as any).awa.ct.capturePageView(config);
  }
}