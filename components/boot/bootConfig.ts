export const BOOT_LOG_LINES = [
  "Initializing secure console...",
  "Loading encrypted modules...",
  "Mounting classified volume...",
  "Verifying file system integrity...",
  "Establishing uplink...",
  "Syncing encryption keys...",
  "Registering agent session...",
  "Handshaking with command relay...",
  "Sealing audit trail...",
  "Calibrating sensors...",
  "Confirming signal quality...",
  "Diagnostics complete. System ready.",
] as const;

export const AUTH_STEPS = [
  "Verifying credentials",
  "Validating session token",
  "Checking clearance level",
  "Access granted",
] as const;

export const REDUCED_LOG_LINES = BOOT_LOG_LINES.slice(0, 3);

export const BOOT_LINE_INTERVAL = 200;
export const AUTH_STEP_INTERVAL = 700;
export const GRANTED_DELAY = 800;
export const REDUCED_FLOW_DELAY = 600;

