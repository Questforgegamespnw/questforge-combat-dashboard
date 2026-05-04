# ⚔️ Questforge Combat Dashboard

A lightweight, player-facing combat dashboard designed to speed up turn decisions without replacing the character sheet.

Built for fast-paced tabletop play, this tool gives players a clear, at-a-glance view of what they can do each round—so turns stay smooth, confident, and efficient.

---

## 🚀 Quick Start

Launch the dashboard instantly:

👉 **https://questforgegamespnw.github.io/questforge-combat-dashboard/**

_No installation required — mobile friendly_

---

## 🎯 Purpose

Combat often slows down when players:

* forget abilities
* dig through sheets to find features
* hesitate while deciding what to do

The Questforge Combat Dashboard solves this by surfacing **relevant actions, stats, and resources in one place**, allowing players to plan and execute turns quickly.

---

## 🧠 Core Idea

This is not a character sheet.
This is a **decision-first interface**.
It helps players answer one question, fast:

> “What can I do right now?”

The layout is designed around how players think during combat:

1. Defense & Reactions
2. Common Actions
3. Class Actions
4. Attack Options





---

## ⚙️ Feature Overview

### Campaign Selection

The dashboard can be scoped by campaign so each table only sees the relevant roster and optional systems.

Campaign settings can toggle:

* World State
* Yggdrasil Mead
* Custom resources
* Dice roller
* Grouped skill batches


### Player-Specific Dashboard

Each character has a focused combat view tailored to their:

* core stats
* Attack Options
* defensive tools
* active abilities

---

### Core Stats Panel

Always-visible combat essentials:

* Armor Class (AC)
* Initiative
* Speed
* Spell Attack Bonus
* Spell Save DC
* Passive Perception

---

### Fast HP Tracking

Quick, in-combat health management:

* Input a value
* Tap:

  * **Damage**
  * **Heal**
  * **Reset**

Designed for fast use on mobile without breaking flow.

---

### Resource Tracking

Track key class resources and limited-use abilities without digging through sheets.

Resources are visually grouped to improve readability:

- Yggdrasil Mead (top priority)
- Spell slots
- Class resources

Subtle spacing and separators help players quickly scan and manage resources without additional labels.

---

### 🍷 Yggdrasil Mead System

A campaign-specific consumable designed for fast recovery between encounters.

Each character has 4 uses per Valhalla cycle:

- **Half Heal** → restores half max HP (auto-calculated)
- **Pseudo Long Rest** → restores all resources except Mead

Built for:
- zero math
- one-click usage
- fast table recovery between fights

---


### ### Attack Options

Quick access to:

* melee attacks
* ranged attacks
* core offensive options

---

### Defense & Reactions

Highlights survivability tools such as:

* saving throw bonuses
* reactions
* defensive abilities

Keeps “don’t forget this” tools visible at all times.

---

### Active Abilities Panel

Surfaces class features and special actions so they are not buried or forgotten.

---

### Skills & Dice View

A secondary utility view provides fast access to commonly requested skill bonuses grouped by table-use category.

Includes a simple standalone dice roller with:

* d4, d6, d8, d10, d12, d20
* Normal / Advantage / Disadvantage modes
* Manual modifier input

The dice roller intentionally does not connect to character math or automate attack rolls.

---

---

### Companion / Pet Support

Characters can include a lightweight companion (pet, summon, or construct) directly within the dashboard.

Features include:

- Quick-reference stat block (AC, HP, Speed, attacks)
- Traits and notes for in-combat reminders
- Dedicated HP tracker with:
  - Damage / Heal / Reset controls
  - Persistent tracking between refreshes

Designed to eliminate the need to switch to external tools (builder pages, PDFs, or notes) during combat.

Supports multiple preset companion builds per character.

---


### General Actions Panel

Includes common combat actions such as:

* Dash
* Disengage
* Dodge
* Help
* Hide
* Investigate
* Ready
* Use an Object

Acts as a reminder layer for both new and experienced players.

---

### Turn Planning / Action Highlighting

Players can select and highlight intended actions to:

* plan their turn ahead of time
* visually confirm their choices
* reduce hesitation when their turn begins

---

## 🔁 Core Loop

**Review → Select → Confirm → Act**

1. Review available options
2. Select intended actions
3. Visually confirm plan
4. Execute quickly at the table

---

## 👥 Intended Use

Designed for:

* DMs running fast-paced combat
* Players who want quick decision support

Works best in:

* in-person sessions (mobile-friendly)
* hybrid play setups
* table-facing displays (future expansion)

---

## 🚫 Non-Goals

This tool intentionally does **not** include:

* Full character sheet replacement
* Combat automation
* Full inventory or currency tracking

The focus is **speed and clarity**, not system complexity.

---

## 🗂️ Project Structure

```
questforge-combat-dashboard/
│
├── css/
│   └── style.css
│
├── data/
│   ├── campaigns.js
│   ├── characters.js
│   ├── dashboard-data.js
│   └── worldstate.js
│
├── js/
│   └── app.js
│
├── changelog.md
├── READEME.md
├── LICENSE
└── index.html

```

---

## 🚀 Version

Current version: **v1.1.0**

This is the now a complete, usable system with intentional UX after being initially developed and released at 0.1.0 

---

## 🧭 Roadmap

### Near-Term

* Continued mobile layout refinement
* Improved action type labeling (Action / Bonus / Reaction)
* Optional campaign data cleanup and individual character files
* UI clarity improvements

### Future Considerations

* Lightweight inventory snapshot
* Quick-use item actions
* Currency tracking
* Player-facing shared display mode

### Out of Scope

* Full character sheet systems
* Dice rolling engines
* Full combat automation

---

## 🧾 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## 🛠️ Author

Questforge Games PNW
Custom tabletop experiences and tools focused on immersion, speed, and player agency.

---
