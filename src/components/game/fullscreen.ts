import { useSyncExternalStore } from 'react';

type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type WebkitDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};

function getFullscreenElement() {
  const doc = document as WebkitDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

// Must run inside a user gesture. iOS Safari has no element fullscreen, so failures are ignored.
export async function enterFullscreen() {
  const el = document.documentElement as WebkitElement;
  try {
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
    else await el.webkitRequestFullscreen?.();
  } catch {
    return;
  }
}

export async function exitFullscreen() {
  if (!getFullscreenElement()) return;
  const doc = document as WebkitDocument;
  try {
    if (doc.exitFullscreen) await doc.exitFullscreen();
    else await doc.webkitExitFullscreen?.();
  } catch {
    return;
  }
}

function subscribeFullscreen(onChange: () => void) {
  document.addEventListener('fullscreenchange', onChange);
  document.addEventListener('webkitfullscreenchange', onChange);
  return () => {
    document.removeEventListener('fullscreenchange', onChange);
    document.removeEventListener('webkitfullscreenchange', onChange);
  };
}

const noopSubscribe = () => () => {};

export function useIsFullscreen() {
  return useSyncExternalStore(
    subscribeFullscreen,
    () => getFullscreenElement() !== null,
    () => false,
  );
}

// False on iPhone Safari, which only supports fullscreen for video elements.
export function useFullscreenSupported() {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const doc = document as WebkitDocument;
      return Boolean(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled);
    },
    () => false,
  );
}
