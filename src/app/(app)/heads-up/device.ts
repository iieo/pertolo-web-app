import { useCallback, useEffect, useEffectEvent, useRef, useSyncExternalStore } from 'react';

type PermissionRequestable = {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
};

// iOS only grants motion access from a user gesture, so this must be called synchronously
// inside a click handler before anything else awaits.
export async function requestTiltPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return false;
  const request = (DeviceOrientationEvent as unknown as PermissionRequestable).requestPermission;
  if (typeof request !== 'function') return true;
  try {
    return (await request.call(DeviceOrientationEvent)) === 'granted';
  } catch {
    return false;
  }
}

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape') => Promise<void>;
  unlock?: () => void;
};

// Only works in fullscreen on Android. iOS rejects or lacks the API, which is fine.
export async function lockLandscape() {
  try {
    await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
  } catch {}
}

export function unlockOrientation() {
  try {
    (screen.orientation as LockableOrientation | undefined)?.unlock?.();
  } catch {}
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}

const LANDSCAPE_QUERY = '(orientation: landscape)';

function subscribeOrientation(onChange: () => void) {
  const media = window.matchMedia(LANDSCAPE_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export function useIsLandscape() {
  return useSyncExternalStore(
    subscribeOrientation,
    () => window.matchMedia(LANDSCAPE_QUERY).matches,
    () => false,
  );
}

export type TiltDirection = 'down' | 'up';

const TRIGGER_DEGREES = 45;
const REARM_DEGREES = 20;
const RAD = Math.PI / 180;

function screenAngle() {
  const angle =
    screen.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 0;
  return ((angle % 360) + 360) % 360;
}

// The world "up" vector in device coordinates, derived from the W3C Z-X'-Y'' Euler angles:
// up = (-sin(gamma) * cos(beta), sin(beta), cos(gamma) * cos(beta)).
// It depends only on the actual rotation, so the beta/gamma jump that happens near gamma = +-90
// (phone upright in landscape) cancels out. In landscape the nod axis is the device y axis,
// so only x (along the long edge) and z (out of the screen) change when tilting.
function upVector(beta: number, gamma: number) {
  const cosBeta = Math.cos(beta * RAD);
  return { x: -Math.sin(gamma * RAD) * cosBeta, z: Math.cos(gamma * RAD) * cosBeta };
}

function wrapDegrees(degrees: number) {
  return ((((degrees + 180) % 360) + 360) % 360) - 180;
}

type TiltState = {
  last: { x: number; z: number } | null;
  // +1 when the screen's top edge is the device's +x side, -1 when it is the -x side.
  side: 1 | -1;
  neutral: number | null;
  armed: boolean;
  pendingCalibration: boolean;
};

// Pitch is 0 with the phone upright, negative with the screen turned to the floor and positive
// with the screen turned to the ceiling.
function pitch(state: TiltState, up: { x: number; z: number }) {
  return Math.atan2(up.z, state.side * up.x) / RAD;
}

export function useTilt(enabled: boolean, onTilt: (direction: TiltDirection) => void) {
  const state = useRef<TiltState>({
    last: null,
    side: 1,
    neutral: null,
    armed: false,
    pendingCalibration: false,
  });
  const emit = useEffectEvent(onTilt);

  useEffect(() => {
    if (!enabled) return;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      const s = state.current;
      const up = upVector(event.beta, event.gamma);
      s.last = up;
      if (s.pendingCalibration) {
        setNeutral(s, up);
        return;
      }
      if (s.neutral === null) return;

      const delta = wrapDegrees(pitch(s, up) - s.neutral);
      if (!s.armed) {
        if (Math.abs(delta) < REARM_DEGREES) s.armed = true;
        return;
      }
      if (delta <= -TRIGGER_DEGREES) {
        s.armed = false;
        emit('down');
      } else if (delta >= TRIGGER_DEGREES) {
        s.armed = false;
        emit('up');
      }
    };
    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [enabled]);

  // Takes the current position as neutral. Without a reading yet, the next one becomes neutral.
  const calibrate = useCallback(() => {
    const s = state.current;
    if (s.last) setNeutral(s, s.last);
    else s.pendingCalibration = true;
  }, []);

  return calibrate;
}

function setNeutral(s: TiltState, up: { x: number; z: number }) {
  // Upright in landscape the up vector lies almost entirely on the x axis, so its sign tells
  // which long edge is on top. If the phone is held too flat to tell, use the screen angle.
  if (Math.abs(up.x) >= 0.3) s.side = up.x >= 0 ? 1 : -1;
  else s.side = screenAngle() === 270 ? -1 : 1;
  s.neutral = pitch(s, up);
  s.armed = true;
  s.pendingCalibration = false;
}
