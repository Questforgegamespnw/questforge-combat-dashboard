# ⚔️ Questforge Combat Dashboard

A lightweight, player-facing combat dashboard designed to speed up turn decisions without replacing the character sheet.

Built for fast-paced tabletop play, this tool gives players a clear, at-a-glance view of what they can do each round—so turns stay smooth, confident, and efficient.

---

<<<<<<< HEAD
=======
## 🚀 Quick Start

Launch the dashboard instantly:

👉 **https://questforgegamespnw.github.io/questforge-combat-dashboard/**

_No installation required — mobile friendly_

---

>>>>>>> dev
## 🎯 Purpose

Combat often slows down when players:

* forget abilities
* dig through sheets to find features
* hesitate while deciding what to do

The Questforge Combat Dashboard solves this by surfacing **relevant actions, stats, and resources in one place**, allowing players to plan and execute turns quickly.

---

## 🧠 Core Idea

This is not a character sheet.
<<<<<<< HEAD

This is a **decision accelerator**.

=======
This is a **decision-first interface**.
>>>>>>> dev
It helps players answer one question, fast:

> “What can I do right now?”

<<<<<<< HEAD
=======
The layout is designed around how players think during combat:

1. Defense & Reactions
2. Common Actions
3. Class Actions
4. Attack Options





>>>>>>> dev
---

## ⚙️ Feature Overview

### Player-Specific Dashboard

Each character has a focused combat view tailored to their:

* core stats
<<<<<<< HEAD
* primary attacks
=======
* Attack Options
>>>>>>> dev
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

<<<<<<< HEAD
---

### Primary Attacks Panel
=======
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
>>>>>>> dev

Quick access to:

* melee attacks
* ranged attacks
* core offensive options

---

<<<<<<< HEAD
### Defense Strip
=======
### Defense & Reactions
>>>>>>> dev

Highlights survivability tools such as:

* saving throw bonuses
* reactions
* defensive abilities

Keeps “don’t forget this” tools visible at all times.

---

### Active Abilities Panel

Surfaces class features and special actions so they are not buried or forgotten.

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
* Dice rolling
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
│   ├── characters.js
│   ├── dashboard-data.js
│   └── worldstate.js
│
├── js/
│   └── app.js
│
<<<<<<< HEAD
└── index.html
=======
├── changelog.md
├── READEME.md
├── LICENSE
└── index.html

>>>>>>> dev
```

---

## 🚀 Version

<<<<<<< HEAD
Current version: **v0.1.0**

This is an early functional release focused on establishing the core dashboard experience.
=======
Current version: **v1.0.0**

This is the now a complete, usable system with intentional UX after being initially developed and released at 0.1.0 
>>>>>>> dev

---

## 🧭 Roadmap

### Near-Term

* Expanded common action reminders
* Improved action type labeling (Action / Bonus / Reaction)
* Additional resource tracking support
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
