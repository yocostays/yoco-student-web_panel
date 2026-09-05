export const ANDROID_PACKAGE_NAME = "com.colladome.yoco";

export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;

export function isAndroidUserAgent(userAgent) {
  return /android/i.test(userAgent || "");
}

export function androidIntentUrl({ host, pathname, search }) {
  const fallback = encodeURIComponent(PLAY_STORE_URL);
  return `intent://${host}${pathname}${search}#Intent;scheme=https;package=${ANDROID_PACKAGE_NAME};S.browser_fallback_url=${fallback};end`;
}
