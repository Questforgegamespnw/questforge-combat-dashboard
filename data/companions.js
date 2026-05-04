export const companions = {
    sindriStoneBrawler: {
        ownerId: "Sindri",
        name: "Stone Brawler Golem",
        subtitle: "Stone Template • Brawler Form • Anima Prime Core",

        ac: 22,
        hp: 150,
        speed: "25 ft",

        stats: {
            str: { score: 19, mod: "+4" },
            dex: { score: 10, mod: "+0" },
            con: { score: 17, mod: "+3" },
            int: { score: 6, mod: "-2" },
            wis: { score: 10, mod: "+0" },
            cha: { score: 5, mod: "-3" }
        },

        defenses: {
            immunities: ["poison"],
            resistances: [],
            conditions: ["charmed", "exhaustion", "poisoned"]
        },

        senses: "Darkvision 60 ft, Passive Perception 10",
        languages: "Understands creator’s languages",

        attack: {
            name: "Slam",
            toHit: "+8",
            damage: "1d8 + 4 bludgeoning",
            rider: ""
        },

        altAttacks: [
            {
                name: "Driving Slam",
                description: "Special slam variant (player reference)"
            }
        ],

        traits: [
            "Stone Body: AC becomes 16 unless higher.",
            "Dense Frame: -5 ft speed (min 20 ft).",
            "Template + Form Bias: +5 STR, +3 CON (max 20).",
            "Anima Prime Core: +PB to AC & saves, +20 HP.",
            "Distributed Intelligence: spells can originate from golem."
        ],

        ultima: {
            name: "Ultima Mode (Tier 4, 1/Long Rest)",
            summary: "1 minute: resistance to all damage, +PB to attack rolls, +PB damage on attacks.",
            options: [
                "Overdrive Strike: next hit deals +3d8 force",
                "Phase Shift: teleport 30 ft before/after attack",
                "Adaptive Shell: gain temp HP = artificer level",
                "Hardness 4: ignore small nonmagical damage"
            ]
        },

        notes: [
            "Acts after Sindri.",
            "If not commanded, takes the Dodge action.",
            "Full build logic lives in Corewright Builder."
        ]
    }
};