/* =========================
   QUESTFORGE CHARACTER DATA
   =========================
   This file is the SOURCE OF TRUTH for all player data.

   Structure philosophy:
   - abilities = raw stats
   - combat = rolled numbers (final bonuses)
   - dashboard = what the player sees in combat
   ========================= */

export const characters = {

  /* ========================================
     ORI — PALADIN (STORM STANDARD BEARER)
     ======================================== */
  ori: {

    /* ---------- IDENTITY ---------- */
    identity: {
      id: "ori",
      name: "Ori",
      className: "Paladin",
      level: 10
    },

    /* ---------- ABILITY SCORES ---------- */
    abilities: {
      str: { score: 16, mod: 3 },
      dex: { score: 10, mod: 0 },
      con: { score: 16, mod: 3 },
      int: { score: 12, mod: 1 },
      wis: { score: 13, mod: 1 },
      cha: { score: 18, mod: 4 }
    },

    /* ---------- COMBAT STATS (FINAL NUMBERS) ---------- */
    combat: {
      proficiencyBonus: 4,
      hpMax: 94,
      ac: 20,
      initiative: 0,
      speed: "30 ft",

      passivePerception: 15,
      passiveInsight: 11,
      passiveInvestigation: 11,

      /* Sheet values */
      spellAttack: 8,
      spellSaveDC: 16,

      /* Saving throws (FINAL BONUSES)
         Note: Aura of Protection is already reflected in these sheet values. */
      saves: {
        str: { bonus: 7, proficient: false },
        dex: { bonus: 4, proficient: false },
        con: { bonus: 7, proficient: false },
        int: { bonus: 5, proficient: false },
        wis: { bonus: 9, proficient: true },
        cha: { bonus: 12, proficient: true }
      },

      /* Key trained skills from sheet */
      skills: {
        athletics: 7,
        intimidation: 8,
        medicine: 5,
        perception: 5
      },

      /* Defenses / senses from sheet */
      defenses: {
        resistances: ["Necrotic", "Radiant"],
        notes: ["Darkvision 60 ft.", "+4 bonus on saves from aura already baked into totals"]
      },

      /* Primary attacks (PRE-CALCULATED FOR DASHBOARD)
         Note: using current legendary weapon logic, not stale sheet weapon math.
         Ori uses two main modes:
         - melee2h = default close-range mode
         - thrown = ranged return mode
      */
      attacks: {
        melee2h: {
          name: "Storm Hammer (Melee 2H)",
          toHit: 7,
          damage: "1d10 + 3 + 1d8 lightning",
          rider: "Push 10 ft on hit (warhammer mastery) + legendary lightning riders"
        },

        thrown: {
          name: "Storm Hammer (Thrown)",
          toHit: 7,
          damage: "1d8 + 3 + 1d8 lightning",
          rider: "Thrown mode uses 1-handed warhammer die + legendary lightning riders"
        }
      },

      /* Resource pools */
      resources: {
        spellSlots: {
          1: { max: 4 },
          2: { max: 3 },
          3: { max: 2 }
        },

        custom: {
          yggdrasilMead: { label: "Yggdrasil Mead", max: 4 },
          stormHammerCharges: { label: "Storm Hammer Charges", max: 5 },
          channelDivinity: { label: "Channel Divinity", max: 2 },
          layOnHands: { label: "Lay on Hands Pool", max: 50, display: "number" },
          radiantSoul: { label: "Radiant Soul", max: 1 }
        }
      }
    },

    /* ---------- DASHBOARD (PLAYER VIEW) ---------- */
    dashboard: {

      /* Defensive reminders (TRIGGER-BASED)
         Important: Ori is NOT modeled as shield-using for dashboard flow. */
      defense: [
        "Aura of Protection: +4 to all saves while grouped.",
        "Stay in strong position rather than relying on AC spikes.",
        "Radiant Soul is your burst durability / mobility button.",
        "Thunder Recall and banner control help prevent pressure before it lands."
      ],

      actions: {
        action: ["Attack (Melee 2H)", "Attack (Thrown)", "Cast Spell", "Channel Divinity"],
        bonus: ["Plant Banner", "Move Banner", "Lay on Hands", "Radiant Soul"],
        reaction: ["Thunder Recall"],
        passive: ["Aura of Protection", "Aura of Conquest", "Aura of Courage"]
},

      /* Active combat abilities (ONLY CURRENTLY USABLE) */
      activeCards: [
        {
          type: "bonus",
          title: "Plant Banner",
          body: "Plant within 5 ft. Aura 20 ft. Spectral weapon attacks from banner."
        },
        {
          type: "reaction",
          title: "Thunder Recall",
          body: "When hammer returns: spend 1 charge → thunder burst + push."
        },
        {
          type: "action",
          title: "Lightning Cast",
          body: "Thrown attack: spend 1 charge for bonus lightning damage and arc effect."
        },
        {
          type: "bonus",
          title: "Lay on Hands",
          body: "Healing pool: 50 HP total per long rest."
        },
        {
          type: "action",
          title: "Radiant Soul",
          body: "1/LR. Gain flight for 1 minute and add 10 radiant damage once per turn."
        }
      ],

      /* Tier-based unlock progression */
      unlocks: {
        2: [
          "Banner: Aura radius increases to 30 ft",
          "Hammer: Lightning arcs hit +1 additional target"
        ],
        3: [
          "Banner: Move 20 ft instead of 10",
          "Hammer: Recall becomes 3d6 + stun on fail"
        ],
        4: [
          "Banner: Allies gain temp HP each turn",
          "Hammer: Chain lightning on crit"
        ]
      }
    }
  },

  /* ========================================
     ZOLTAS — ROGUE (VEIL DUELIST)
     ======================================== */
  zoltas: {

    /* ---------- IDENTITY ---------- */
    identity: {
      id: "zoltas",
      name: "Zoltas",
      className: "Rogue",
      level: 10
    },

    /* ---------- ABILITY SCORES ---------- */
    abilities: {
      str: { score: 10, mod: 0 },
      dex: { score: 18, mod: 4 },
      con: { score: 14, mod: 2 },
      int: { score: 15, mod: 2 },
      wis: { score: 12, mod: 1 },
      cha: { score: 17, mod: 3 }
    },

    /* ---------- COMBAT STATS (FINAL NUMBERS) ---------- */
    combat: {
      proficiencyBonus: 4,
      hpMax: 73,
      ac: 22,
      initiative: 11,
      speed: "30 ft",

      passivePerception: 24,
      passiveInsight: 15,
      passiveInvestigation: 17,

      /* Rogue has no spellcasting chassis on sheet */
      spellAttack: null,
      spellSaveDC: null,

      /* Saving throws (FINAL BONUSES) */
      saves: {
        str: { bonus: 0, proficient: false },
        dex: { bonus: 8, proficient: true },
        con: { bonus: 2, proficient: false },
        int: { bonus: 6, proficient: true },
        wis: { bonus: 1, proficient: false },
        cha: { bonus: 3, proficient: false }
      },

      /* Key trained / standout skills from sheet */
      skills: {
        acrobatics: 12,
        deception: 7,
        insight: 5,
        perception: 9,
        sleightOfHand: 8,
        stealth: 12,
        survival: 5
      },

      /* Defenses / senses from sheet */
      defenses: {
        notes: ["Unknown 5 ft.", "High passive Perception / Investigation via feat support"]
      },

      /* Primary attack (PRE-CALCULATED FOR DASHBOARD)
         Note: uses current legendary weapon package, not stale sheet attack math. */
      attacks: {
        primary: {
          name: "Veilpiercer (Legendary)",
          toHit: 10,
          damage: "1d8 + 6 + Sneak Attack (5d6)",
          rider: "Duelist rider package / charge-based blur-phase effects"
        }
      },

      /* Resource pools */
      resources: {
        custom: {
          yggdrasilMead: { label: "Yggdrasil Mead", max: 4 },
          rapierCharges: { label: "Rapier Charges", max: 10 }
        }
      }
    },

    /* ---------- DASHBOARD (PLAYER VIEW) ---------- */
    dashboard: {

      /* Defensive reminders (TRIGGER-BASED) */
      defense: [
        "Hit? Uncanny Dodge to halve damage.",
        "DEX save? Evasion = 0 on success, half on fail.",
        "Already AC 22 — force misses before burning panic tools.",
        "Phase / blur effects are escape and duel-control buttons."
      ],

      /* Action economy breakdown */
      actions: {
        action: ["Attack", "Dash", "Hide", "Panache"],
        bonus: ["Cunning Action", "Steady Aim", "Blur", "Phase Slip"],
        reaction: ["Uncanny Dodge"],
        passive: ["Sneak Attack", "Rakish Audacity", "Fancy Footwork", "Evasion"]
      },

      /* Active combat abilities (ONLY CURRENTLY USABLE) */
      activeCards: [
        {
          type: "bonus",
          title: "Steady Aim",
          body: "Gain advantage on your next attack this turn. Speed becomes 0."
        },
        {
          type: "reaction",
          title: "Uncanny Dodge",
          body: "When hit by an attacker you can see, halve the attack’s damage."
        },
        {
          type: "passive",
          title: "Sneak Attack",
          body: "5d6 once per turn when conditions are met."
        },
        {
          type: "bonus",
          title: "Blur",
          body: "Charge-based defensive mode from legendary rapier package."
        },
        {
          type: "bonus",
          title: "Phase Slip",
          body: "Charge-based escape / survival button from legendary rapier package."
        }
      ],

      /* Tier-based unlock progression */
      unlocks: {
        2: [
          "Blur grants partial concealment"
        ],
        3: [
          "Phase Slip becomes teleport"
        ],
        4: [
          "Veilstrike hits 2 targets"
        ]
      }
    }
  }
,

/* ========================================
   SINDRI COREWRIGHT ARTIFICER
   ======================================== */
Sindri: {

  /* ---------- IDENTITY ---------- */
  identity: {
    id: "Sindri",
    name: "Sindri",
    className: "Artificer (Corewright)",
    level: 10
  },

  /* ---------- ABILITY SCORES ---------- */
  abilities: {
    str: { score: 15, mod: 2 },
    dex: { score: 14, mod: 2 },
    con: { score: 13, mod: 1 },
    int: { score: 17, mod: 3 },
    wis: { score: 12, mod: 1 },
    cha: { score: 10, mod: 0 }
  },

  /* ---------- COMBAT STATS ---------- */
  combat: {
    proficiencyBonus: 4,
    hpMax: 73,

    /* ⚠️ OVERRIDDEN BY COREWRIGHT HARNESS */
    ac: 18, // 15 + INT (3)

    initiative: 2,
    speed: "30 ft",

    passivePerception: 11,
    passiveInsight: 15,
    passiveInvestigation: 17,

    spellAttack: 7,
    spellSaveDC: 15,

    /* Saving throws (FINAL BONUSES) */
    saves: {
      str: { bonus: 2 },
      dex: { bonus: 2 },
      con: { bonus: 5 },
      int: { bonus: 7 },
      wis: { bonus: 1 },
      cha: { bonus: 0 }
    },

    /* Key skill highlights (not exhaustive) */
    skills: {
      arcana: 7,
      investigation: 7,
      insight: 5,
      persuasion: 4
    },

    /* Passive defenses from gear */
    defenses: {
      resistances: ["Force", "Poison"],
      notes: [
        "Advantage vs Poisoned condition",
        "Darkvision 120 ft",
        "AC derived from Corewright Master Harness"
      ]
    },

    /* ---------- PRIMARY ATTACK ---------- */
    attacks: {
      primary: {
        name: "Hammer of the First Maker",
        toHit: 9, // +7 spell chassis +2 weapon
        damage: "1d8 + 2 + 1d8 force",
        rider: "Choose +2d6 fire, lightning, or force on hit"
      }
    },

    /* ---------- RESOURCES ---------- */
    resources: {
      spellSlots: {
        1: { max: 4 },
        2: { max: 3 },
        3: { max: 2 }
      },

      custom: {
        yggdrasilMead: { label: "Yggdrasil Mead", max: 4 },
        flashOfGenius: { label: "Flash of Genius", max: 3 },
        overrideDirective: { label: "Override Directive", max: 4 }, // PB
        commandProtocol: { label: "Command Protocol", max: null }, // free use
        emergencyReconfig: { label: "Emergency Reconfiguration", max: 4 }, // PB
        ultimaMode: { label: "Ultima Mode", max: 4 } // PB
      }
    }
  },

  /* ---------- DASHBOARD (PLAYER VIEW) ---------- */
  dashboard: {

    /* ---------- DEFENSE STRIP ---------- */
    defense: [
      "AC 18 + Force Resistance (Harness).",
      "Flash of Genius (+3) = emergency save fix.",
      "Emergency Reconfiguration = reduce damage + reposition.",
      "You are NOT a frontliner — use golem positioning."
    ],

    /* ---------- ACTION ECONOMY ---------- */
    actions: {
      action: [
        "Cast Spell",
        "Override Directive",
        "Attack"
      ],

      bonus: [
        "Command Golem",
        "Command Protocol",
        "Ultima Mode"
      ],

      reaction: [
        "Flash of Genius",
        "Emergency Reconfiguration"
      ],

      passive: [
        "Distributed Intelligence",
        "Infusions Active"
      ]
    },

    /* ---------- ACTIVE ABILITIES ---------- */
    activeCards: [
      {
        type: "reaction",
        title: "Flash of Genius",
        body: "+3 to a save/check (self or ally within 30 ft)."
      },
      {
        type: "reaction",
        title: "Emergency Reconfiguration",
        body: "Reduce damage by 2d10 + INT and shift 10 ft."
      },
      {
        type: "action",
        title: "Override Directive",
        body: "INT save → control construct until end of your next turn."
      },
      {
        type: "bonus",
        title: "Command Protocol",
        body: "Construct gains advantage + PB to damage."
      },
      {
        type: "bonus",
        title: "Ultima Mode",
        body: "Golem gains resistance, +PB attack/damage, and special modes."
      }
    ],

    /* ---------- GOLEM COMMAND LAYER ---------- */
    golemCommandMenu: {

      /* Default behavior from subclass rules */
      defaultBehavior: "If no command is issued, the golem takes the Dodge action.",

      /* THIS is the turn-speed menu */
      bonusActionOptions: [
        {
          title: "Attack",
          desc: "Golem makes its primary attack"
        },
        {
          title: "Reposition",
          desc: "Move, engage, disengage, or intercept"
        },
        {
          title: "Help",
          desc: "Grant advantage or support ally"
        },
        {
          title: "Engine Ability",
          desc: "Use current engine feature (storm/earth/etc)"
        },
        {
          title: "Defend",
          desc: "Hold position / body-block / protect"
        }
      ],

      notes: [
        "This is your MAIN decision each turn.",
        "If you don’t command → golem Dodges.",
        "Full golem stats + fusion live in builder."
      ]
    },

    /* ---------- PROGRESSION REMINDERS ---------- */
    unlocks: {
      2: [
        "Infusions expand tactical options"
      ],
      3: [
        "Templates define construct identity"
      ],
      4: [
        "Engine specialization unlocks advanced behavior"
         ]
      }
    }
  }
  ,

  /* ========================================
     CHIRP — BARD (ELOQUENCE / LOKI RELICS)
     ======================================== */
  chirp: {

    /* ---------- IDENTITY ---------- */
    identity: {
      id: "chirp",
      name: "Chirp Lyrestrum",
      className: "Bard (Eloquence)",
      level: 10
    },

    /* ---------- ABILITY SCORES ---------- */
    abilities: {
      str: { score: 10, mod: 0 },
      dex: { score: 16, mod: 3 },
      con: { score: 14, mod: 2 },
      int: { score: 14, mod: 2 },
      wis: { score: 13, mod: 1 },
      cha: { score: 20, mod: 5 }
    },

    /* ---------- COMBAT STATS ---------- */
    combat: {
      proficiencyBonus: 4,
      hpMax: 73,

      /* Sheet AC 13 + Cloak of the Shifting Tale */
      ac: 14,
      initiative: 3,
      speed: "30 ft",

      passivePerception: 15,
      passiveInsight: 13,
      passiveInvestigation: 14,

      /* Sheet baseline + Lyre of the Silver Tongue */
      spellAttack: 11,
      spellSaveDC: 19,

      saves: {
        str: { bonus: 0, proficient: false },
        dex: { bonus: 7, proficient: true },
        con: { bonus: 2, proficient: false },
        int: { bonus: 2, proficient: false },
        wis: { bonus: 1, proficient: false },
        cha: { bonus: 9, proficient: true }
      },

      skills: {
        acrobatics: 11,
        deception: 13,
        perception: 5,
        performance: 13,
        persuasion: 9,
        sleightOfHand: 7,
        stealth: 11
      },

      defenses: {
        notes: [
          "Advantage on saving throws against ranged attacks.",
          "High-value reactions: Shield, Counterspell, Cutting Words, Narrative Deflection, Mask of Many Selves.",
          "Control and reposition matter more than standing still and trading."
        ]
      },

      attacks: {
        primary: {
          name: "Vicious Mockery",
          toHit: null,
          damage: "Psychic cantrip pressure",
          rider: "WIS save DC 19; 1d4 psychic and disadvantage on next attack"
        },

          lyreNote: {
    name: "Magic Note",
    toHit: 11,
    damage: "1d8 + 5 psychic",
    rider: "Ranged spell attack from Lyre of the Silver Tongue"
  },
        melee: {
          name: "Dagger",
          toHit: 7,
          damage: "1d4 + 3 piercing",
          rider: "Fallback only"
        }

        
      },

      resources: {
        spellSlots: {
          1: { max: 4 },
          2: { max: 3 },
          3: { max: 3 },
          4: { max: 3 },
          5: { max: 2 }
        },

        custom: {
          yggdrasilMead: { label: "Yggdrasil Mead", max: 4 },
          bardicInspiration: { label: "Bardic Inspiration (1d10)", max: 5 },
          lucky: { label: "Lucky", max: 4 },
          kenkuRecall: { label: "Kenku Recall", max: 4 },
          universalSpeech: { label: "Universal Speech", max: 1 },
          maskOfManySelves: { label: "Mask of Many Selves", max: 4 },
          narrativeDeflection: { label: "Narrative Deflection", max: 4 },
          grandPerformance: { label: "Grand Performance", max: 1 }
        }
      }
    },

    /* ---------- DASHBOARD (PLAYER VIEW) ---------- */
    dashboard: {

      defense: [
        "Shield: reaction +5 AC until start of your next turn.",
        "Counterspell: stop enemy casting at the source.",
        "Cutting Words: reaction debuff tool; Cutting Reality adds 2d6 psychic + speed 0.",
        "Narrative Deflection: reduce damage, then redirect the attack on failed CHA save.",
        "Mask of Many Selves: reaction flicker imposes disadvantage when targeted by an attack."
      ],

      actions: {
        action: [
          "Vicious Mockery",
          "Dissonant Whispers",
          "Fireball",
          "Spirit Guardians",
          "Polymorph",
          "Steel Wind Strike",
          "Universal Speech",
          "Grand Performance"
        ],

        bonus: [
          "Bardic Inspiration",
          "Unsettling Words",
          "Twist the Scene",
          "Misty Step",
          "Mass Healing Word"
        ],

        reaction: [
          "Shield",
          "Feather Fall",
          "Counterspell",
          "Cutting Words",
          "Narrative Deflection",
          "Mask of Many Selves"
        ],

        passive: [
          "Silver Tongue",
          "Unfailing Inspiration",
          "Words Made Real",
          "Resonant Command",
          "Magical Secrets",
          "Master of Voices"
        ]
      },

      activeCards: [
        {
          type: "bonus",
          title: "Bardic Inspiration",
          body: "Bonus Action. 60 ft. A creature that can see or hear you gains a Bardic Inspiration die (1d10). 5 uses."
        },
        {
          type: "bonus",
          title: "Unsettling Words",
          body: "Bonus Action. Expend one use of Bardic Inspiration and choose one creature within 60 ft. Roll your Bardic Inspiration die. The creature subtracts the result from the next saving throw it makes before the start of your next turn. Unsettling Eloquence: the target must also succeed on a CHA save or have disadvantage on its next saving throw."
        },
        {
          type: "passive",
          title: "Silver Tongue",
          body: "When you make a Persuasion or Deception check, a d20 roll of 9 or lower counts as a 10."
        },
        {
          type: "passive",
          title: "Unfailing Inspiration",
          body: "When a creature uses one of your Bardic Inspiration dice on an ability check, attack roll, or saving throw and the roll still fails, the Bardic Inspiration die is not lost."
        },
        {
          type: "action",
          title: "Universal Speech",
          body: "Action. Choose up to 5 creatures within 60 ft. They can magically understand you for 1 hour. 1/LR, or expend a spell slot to use it again."
        },
        {
          type: "reaction",
          title: "Cutting Words",
          body: "Reaction. Expend a use of Bardic Inspiration to undercut a creature’s roll. Cutting Reality: when you use Cutting Words, the target also takes 2d6 psychic damage and its speed becomes 0 until the end of the turn."
        },
        {
          type: "reaction",
          title: "Narrative Deflection",
          body: "Reaction when hit by an attack. Reduce damage by 1d10 + CHA mod + PB, then force the attacker to make a CHA save. On a failure, they must choose a new target within range. 4 uses."
        },
        {
          type: "reaction",
          title: "Mask of Many Selves",
          body: "Disguise Self at will. Reaction when targeted by an attack: briefly flicker into another form to impose disadvantage. 4 uses."
        },
        {
          type: "bonus",
          title: "Twist the Scene",
          body: "Bonus Action. Choose one creature within 30 ft. Swap places with them; unwilling target gets a CHA save to negate."
        },
        {
          type: "passive",
          title: "Words Made Real",
          body: "When you cast an enchantment or illusion spell, choose one affected target. It takes psychic damage equal to your CHA modifier + PB."
        },
        {
          type: "passive",
          title: "Resonant Command",
          body: "When a creature fails a saving throw against one of your spells, you can force it to move up to its speed in a direction you choose or fall prone."
        },
        {
          type: "action",
          title: "Grand Performance",
          body: "1/LR, Action. For 1 minute, enemies of your choice within 30 ft. have disadvantage on all saves vs your spells, allies gain advantage on attack rolls and saving throws, and creatures that fail a save are also charmed until the end of their next turn."
        },
        {
          type: "passive",
          title: "Master of Voices",
          body: "Perfectly mimic any voice you’ve ever heard and any sound heard within the last 24 hours. Advantage on Deception and Performance checks."
        }
      ],

      unlocks: {
        2: [
          "Your bonus action economy is crowded: Bardic Inspiration, Unsettling Words, Twist the Scene, Misty Step, and Mass Healing Word all compete."
        ],
        3: [
          "Your reactions are premium: Shield, Counterspell, Cutting Words, Narrative Deflection, and Mask of Many Selves all demand timing discipline."
        ],
        4: [
          "Your strongest turns are control turns: failed saves, forced movement, prone, charm pressure, and battlefield disruption."
        ]
      }
    }
  }
};