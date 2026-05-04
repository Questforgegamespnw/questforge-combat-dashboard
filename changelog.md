# Changelog
## [1.1.0] - 2026-05-03

### Added
- Campaign selector that replaces the first-run character prompt
- Campaign roster filtering for the character picker
- Campaign feature toggles for:
  - World State
  - Yggdrasil Mead
  - Custom resources
  - Dice roller
  - Skill groups
- Skills & Dice view with grouped skill batches organized by ability score
  - Displays both proficient and base ability values for all skills
- Simple standalone dice roller with:
  - d4, d6, d8, d10, d12, d20
  - Normal / Advantage / Disadvantage modes
  - Manual modifier input

### Companion System
- Support for character-linked companions (pets, summons, constructs)
- Companion data separated into dedicated `companions.js` file
- Multiple preset builds supported per character
- Companion stat card including:
  - AC, HP, Speed
  - Attack info
  - Traits and notes
- Dedicated companion HP tracker:
  - Damage / Heal / Reset controls
  - Persistent state (saved in localStorage)
  - Mirrors player HP workflow for fast use

### Changed
- First-run setup now asks which campaign the user is playing instead of which character they are
- Character selection is now scoped to campaign roster
- World State and campaign-specific systems can be hidden per campaign
- Combat layout updated to place companion cards directly under Attack Options for better flow

### Improved
- Skill lookup speed during play by removing need to reference character sheets
- Mobile usability and scan clarity for utility panels
- Reduced app-switching during play (dice + skills + companion info now in one place)

### Notes
- Dice rolling is intentionally not connected to character math, attack cards, saves, or resources
- Companion system is intentionally decoupled from external builders (Corewright) to maintain speed and reliability
- Dashboard remains decision-first and avoids becoming a full character sheet or automation engine

## [1.0.0] - 2026-04-12

### Added
- Yggdrasil Mead system (4-use consumable with Half Heal and Pseudo Long Rest)
- Dedicated resource action buttons for special consumables
- Resource grouping with visual separators for improved readability

### Changed
- Reordered UI layout to match player decision flow:
  - Defense & Reactions
  - Common Actions
  - Actions
  - Attack Options
- Renamed:
  - "Primary Attacks" → "Attack Options"
  - "Defense Strip" → "Defense & Reactions"

### Improved
- Resource panel readability for high-resource characters
- Overall mobile usability and scan speed
- Action decision clarity during combat

### Notes
- This version represents the first fully table-ready release of the dashboard
- Focus remains on speed, clarity, and decision support
## [0.1.0] - 2026-04-12
### Added
- Initial player-facing combat dashboard structure
- Character selector for swapping between player views
- Core stats panel for AC, initiative, speed, spell attack, spell save DC, and passive Perception
- HP tracker with quick damage, healing, and reset controls
- Primary attacks panel for fast access to key combat options
- Defense strip for saving throw bonuses, reactions, and survivability tools
- Active abilities panel for class feature usage and quick decision support
- General actions section for common turn options
- Action highlighting system for pre-selecting and previewing intended turn choices

### Notes
- This release is focused on speed, clarity, and decision support at the table
- The tool is not intended to replace a full character sheet or automate dice rolling