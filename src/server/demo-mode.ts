/** A deployment target is independent of Next.js's production build mode. */
export function demoDeploymentEnabled() {
  return process.env.TRUSTGO_DEMO_MODE === 'true';
}

/** Internal adapters require explicit opt-in in a production build. */
export function localAdaptersEnabled() {
  return process.env.NODE_ENV !== 'production' || demoDeploymentEnabled();
}

/** FE supplies its own expiry; the internal acceptance quote leaves time to fill the form. */
export function localQuoteLifetimeMs() {
  return (demoDeploymentEnabled() ? 30 : 3) * 60_000;
}
