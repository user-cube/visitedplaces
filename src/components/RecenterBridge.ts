export type RecenterFn = () => void;

let globalRecenterFunction: RecenterFn | null = null;

export function setGlobalRecenter(fn: RecenterFn | null) {
  globalRecenterFunction = fn;
}

export function triggerRecenter() {
  globalRecenterFunction?.();
}
