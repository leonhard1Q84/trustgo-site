/** Focus and visibility often fire together. No timer: refresh only after a long absence. */
export function createVisibleRefresh(refresh: () => void, staleMs = 5 * 60_000) {
  let checkedAt = Date.now();
  return () => {
    if (document.visibilityState !== 'visible' || Date.now() - checkedAt < staleMs) return;
    checkedAt = Date.now();
    refresh();
  };
}
