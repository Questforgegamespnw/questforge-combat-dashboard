/* =========================
   QUESTFORGE WORLD STATE
   =========================
   This file stores the current campaign escalation tier labels.

   For v1:
   - tier is selected manually in the UI
   - app.js uses the selected tier to reveal unlocks
   - no meter automation yet
   ========================= */

export const worldState = {
  tiers: {
    1: {
      name: "Something is Wrong",
      label: "Tier 1 — Something is Wrong"
    },
    2: {
      name: "The World is Slipping",
      label: "Tier 2 — The World is Slipping"
    },
    3: {
      name: "Collapse is Imminent",
      label: "Tier 3 — Collapse is Imminent"
    },
    4: {
      name: "Ragnarok",
      label: "Tier 4 — Ragnarok"
    }
  },

  defaultTier: 1
};