const ADSENSE_CLIENT = 'ca-pub-8740205731170348';

const AD_SLOTS = {
  'hero-rectangle': '',
  'image-compressor-inline': '',
  'pdf-to-text-inline': '',
  'word-counter-inline': ''
};

function hasRealAdsenseConfig() {
  return /^ca-pub-\d+$/.test(ADSENSE_CLIENT)
    && Object.values(AD_SLOTS).some((slot) => /^\d+$/.test(slot));
}

function loadAdsenseScript() {
  if (document.querySelector('script[data-dmt-adsense]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.dataset.dmtAdsense = 'true';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.append(script);
}

function mountAdUnit(container) {
  const adName = container.dataset.adName;
  const slot = AD_SLOTS[adName];
  if (!/^\d+$/.test(slot)) {
    container.dataset.adMode = 'placeholder';
    return;
  }

  container.replaceChildren();
  const ad = document.createElement('ins');
  ad.className = 'adsbygoogle';
  ad.style.display = 'block';
  ad.dataset.adClient = ADSENSE_CLIENT;
  ad.dataset.adSlot = slot;
  ad.dataset.adFormat = 'auto';
  ad.dataset.fullWidthResponsive = 'true';
  container.append(ad);

  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.push({});
}

function initAds() {
  const containers = document.querySelectorAll('.ad-unit');
  if (!hasRealAdsenseConfig()) {
    containers.forEach((container) => {
      container.dataset.adMode = 'placeholder';
    });
    return;
  }

  loadAdsenseScript();
  containers.forEach(mountAdUnit);
}

initAds();
