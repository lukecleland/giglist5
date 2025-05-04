// lib/broadcast.ts
export const bc =
  typeof window !== "undefined"
    ? new BroadcastChannel("listings-channel")
    : null;
