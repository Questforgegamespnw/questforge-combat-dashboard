/* =========================
   QUESTFORGE DASHBOARD APP
   ========================= */

import { characters } from "../data/characters.js";
import { campaigns, defaultCampaignId } from "../data/campaigns.js";
import { worldState } from "../data/worldstate.js";
import { companions } from "../data/companions.js";

/* ---------- APP STATE ---------- */

const STORAGE_KEY = "qf-dashboard-state";

const state = {
  selectedCampaignId: defaultCampaignId,
  selectedCharacterId: null,
  selectedTier: worldState.defaultTier,
  activeView: "combat",
  currentHp: {},
  resources: {},
  selectedActions: {},
  companionHp: {},
  dice: {
    mode: "normal",
    modifier: 0,
    result: null
  }
};

/* ---------- HELPERS ---------- */

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getCampaignEntries() {
  return Object.entries(campaigns);
}

function getCurrentCampaign() {
  return campaigns[state.selectedCampaignId] || campaigns[defaultCampaignId];
}

function campaignHasFeature(featureKey) {
  return getCurrentCampaign()?.features?.[featureKey] !== false;
}

function getCampaignCharacterIds(campaign = getCurrentCampaign()) {
  const ids = campaign?.characterIds || [];
  return ids.filter((id) => characters[id]);
}

function getCharacterEntries() {
  const ids = getCampaignCharacterIds();

  if (!ids.length) {
    return Object.entries(characters);
  }

  return ids.map((id) => [id, characters[id]]);
}

function getFirstCharacterIdForCampaign(campaignId) {
  const campaign = campaigns[campaignId] || campaigns[defaultCampaignId];
  const ids = getCampaignCharacterIds(campaign);
  return ids[0] || Object.keys(characters)[0] || null;
}

function isCharacterInCampaign(characterId, campaignId = state.selectedCampaignId) {
  const campaign = campaigns[campaignId];
  if (!campaign) return false;

  const ids = getCampaignCharacterIds(campaign);
  return ids.length ? ids.includes(characterId) : Boolean(characters[characterId]);
}

function getCharacter(id) {
  return characters[id];
}

function formatMod(value) {
  if (value === null || value === undefined) return "—";
  return value >= 0 ? `+${value}` : `${value}`;
}

function safeResourceMax(resource) {
  if (!resource || resource.max === null || resource.max === undefined) return null;
  return Number(resource.max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toTitleCase(value) {
  return String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function getHalfHealAmount(characterId) {
  const hpMax = characters[characterId]?.combat?.hpMax || 0;
  return Math.floor(hpMax / 2);
}

function restoreSpellSlotsToMax(characterId) {
  const spellSlots = characters[characterId].combat.resources?.spellSlots || {};

  for (const [level, slotData] of Object.entries(spellSlots)) {
    state.resources[characterId].spellSlots[level] = slotData.max;
  }
}

function restoreCustomResourcesToMax(characterId, options = {}) {
  const { excludeKeys = [] } = options;
  const custom = characters[characterId].combat.resources?.custom || {};

  for (const [key, resource] of Object.entries(custom)) {
    if (excludeKeys.includes(key)) continue;
    state.resources[characterId].custom[key] = safeResourceMax(resource);
  }
}

function spendYggdrasilMead(characterId) {
  const current = state.resources[characterId]?.custom?.yggdrasilMead;

  if (current === null || current === undefined || current <= 0) {
    return false;
  }

  state.resources[characterId].custom.yggdrasilMead = current - 1;
  return true;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/* ---------- INITIALIZE STATE ---------- */

function buildInitialState() {
  const initialCampaignId = campaigns[defaultCampaignId] ? defaultCampaignId : Object.keys(campaigns)[0];

  const initial = {
    selectedCampaignId: initialCampaignId,
    selectedCharacterId: getFirstCharacterIdForCampaign(initialCampaignId),
    selectedTier: worldState.defaultTier,
    activeView: "combat",
    currentHp: {},
    resources: {},
    selectedActions: {},
    companionHp: {},
    dice: {
      mode: "normal",
      modifier: 0,
      result: null
    }
  };

  for (const [id, character] of Object.entries(characters)) {
    initial.currentHp[id] = character.combat.hpMax;
    initial.resources[id] = {
      spellSlots: {},
      custom: {}
    };
    initial.selectedActions[id] = {
      common: null,
      action: null,
      bonus: null,
      reaction: null,
      passive: null
    };

    const spellSlots = character.combat.resources?.spellSlots || {};
    const custom = character.combat.resources?.custom || {};

    for (const [level, slotData] of Object.entries(spellSlots)) {
      initial.resources[id].spellSlots[level] = slotData.max;
    }

    for (const [key, resource] of Object.entries(custom)) {
      initial.resources[id].custom[key] = safeResourceMax(resource);
    }
  }

  for (const [id, companion] of Object.entries(companions)) {
    initial.companionHp[id] = companion.hp;
  }

  return initial;
}

function loadState() {
  const initial = buildInitialState();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!saved) {
      Object.assign(state, initial);
      return;
    }

    state.selectedCampaignId =
      saved.selectedCampaignId && campaigns[saved.selectedCampaignId]
        ? saved.selectedCampaignId
        : initial.selectedCampaignId;

    state.selectedCharacterId =
      saved.selectedCharacterId &&
        characters[saved.selectedCharacterId] &&
        isCharacterInCampaign(saved.selectedCharacterId, state.selectedCampaignId)
        ? saved.selectedCharacterId
        : getFirstCharacterIdForCampaign(state.selectedCampaignId);

    state.selectedTier =
      saved.selectedTier && worldState.tiers[saved.selectedTier]
        ? Number(saved.selectedTier)
        : initial.selectedTier;

    state.activeView = ["combat", "skillsDice"].includes(saved.activeView)
      ? saved.activeView
      : initial.activeView;

    state.dice = {
      ...initial.dice,
      ...(saved.dice || {})
    };

    state.currentHp = { ...initial.currentHp, ...(saved.currentHp || {}) };
    state.companionHp = { ...initial.companionHp, ...(saved.companionHp || {}) };
    state.resources = deepClone(initial.resources);
    state.selectedActions = deepClone(initial.selectedActions);

    for (const [charId, charResources] of Object.entries(saved.resources || {})) {
      if (!state.resources[charId]) continue;

      if (charResources.spellSlots) {
        for (const [level, value] of Object.entries(charResources.spellSlots)) {
          if (state.resources[charId].spellSlots[level] !== undefined) {
            state.resources[charId].spellSlots[level] = value;
          }
        }
      }

      if (charResources.custom) {
        for (const [key, value] of Object.entries(charResources.custom)) {
          if (state.resources[charId].custom[key] !== undefined) {
            state.resources[charId].custom[key] = value;
          }
        }
      }
    }

    if (saved.selectedActions) {
      for (const [charId, selections] of Object.entries(saved.selectedActions)) {
        if (!state.selectedActions[charId]) continue;

        state.selectedActions[charId] = {
          ...state.selectedActions[charId],
          ...selections
        };
      }
    }
  } catch (error) {
    console.warn("Could not load saved dashboard state. Using defaults.", error);
    Object.assign(state, initial);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- DOM ---------- */

const app = document.getElementById("app");

/* ---------- RENDER ---------- */

function render() {
  if (!app) return;

  const campaign = getCurrentCampaign();
  const characterId = state.selectedCharacterId;
  const character = getCharacter(characterId);

  if (!character) {
    app.innerHTML = `<div class="panel">No character selected.</div>`;
    return;
  }

  app.innerHTML = `
    <div class="topbar">
      <div>
        <div class="title">QuestForge Combat Dashboard</div>
        <div class="subtitle">${escapeHtml(campaign.name)}. Fast decisions. Less table drag.</div>
      </div>

      <div class="picker-row">
        <div class="picker-wrap">
          <label for="campaign-picker" class="small">Campaign</label>
          <select id="campaign-picker" class="number-input">
            ${getCampaignEntries()
      .map(
        ([id, c]) => `
                  <option value="${escapeHtml(id)}" ${id === state.selectedCampaignId ? "selected" : ""}>
                    ${escapeHtml(c.name)}
                  </option>
                `
      )
      .join("")}
          </select>
        </div>

        <div class="picker-wrap">
          <label for="character-picker" class="small">Character</label>
          <select id="character-picker" class="number-input">
            ${getCharacterEntries()
      .map(
        ([id, c]) => `
                  <option value="${escapeHtml(id)}" ${id === characterId ? "selected" : ""}>
                    ${escapeHtml(c.identity.name)}
                  </option>
                `
      )
      .join("")}
          </select>
        </div>

        ${campaignHasFeature("worldState") ? renderTierPicker() : ""}
      </div>
    </div>

    <div class="view-tabs">
      <button class="view-tab ${state.activeView === "combat" ? "selected" : ""}" type="button" data-view="combat">
        Combat
      </button>
      <button class="view-tab ${state.activeView === "skillsDice" ? "selected" : ""}" type="button" data-view="skillsDice">
        Skills & Dice
      </button>
    </div>

    ${campaignHasFeature("worldState") && state.activeView === "combat" ? renderWorldStatePanel() : ""}
    ${state.activeView === "combat" ? renderCombatView(characterId, character) : renderSkillsDiceView(character)}
  `;

  bindEvents();
}

function renderTierPicker() {
  return `
    <div class="picker-wrap">
      <label for="tier-picker" class="small">World State</label>
      <select id="tier-picker" class="number-input">
        ${Object.entries(worldState.tiers)
      .map(
        ([tier, info]) => `
              <option value="${tier}" ${Number(tier) === state.selectedTier ? "selected" : ""}>
                ${escapeHtml(info.label)}
              </option>
            `
      )
      .join("")}
      </select>
    </div>
  `;
}

function renderWorldStatePanel() {
  const tierInfo = worldState.tiers[state.selectedTier];

  return `
    <div class="panel" style="margin-bottom: 14px;">
      <div class="section-title">Current World State</div>
      <div class="small"><strong>${escapeHtml(tierInfo.label)}</strong></div>
    </div>
  `;
}

function renderCombatView(characterId, character) {
  const currentHp = state.currentHp[characterId];
  const hpMax = character.combat.hpMax;

  return `
    <div class="grid">
      <div>
        <div class="panel">
          <div class="section-title">Core Stats</div>

          <div class="hp-box">
            <div class="hp-main">
              <div class="stat-label">Hit Points</div>
              <div class="hp-current">${currentHp} / ${hpMax}</div>
            </div>

            <div class="hp-controls">
              <input
                id="hp-adjust-input"
                class="number-input"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                placeholder="Amount"
              />
              <button id="hp-damage-btn" class="btn red" type="button">- Damage</button>
              <button id="hp-heal-btn" class="btn green" type="button">+ Heal</button>
              <button id="hp-reset-btn" class="btn blue" type="button">Reset HP</button>
            </div>
          </div>

          <div class="stats-grid">
            ${renderStat("AC", character.combat.ac)}
            ${renderStat("Initiative", formatMod(character.combat.initiative))}
            ${renderStat("Speed", character.combat.speed)}
            ${renderStat(
    "Spell Atk",
    character.combat.spellAttack !== null ? formatMod(character.combat.spellAttack) : "—"
  )}
            ${renderStat("Spell Save DC", character.combat.spellSaveDC ?? "—")}
            ${renderStat("Passive Perception", character.combat.passivePerception)}
          </div>
        </div>

        <div class="panel">
          <div class="section-title">Defense & Reactions</div>
          ${renderDefense(character)}
        </div>

        ${renderCommonActions(characterId)}

        <div class="panel">
          <div class="section-title">Actions</div>
          ${renderActions(characterId, character)}
        </div>

        <div class="panel">
  <div class="section-title">Attack Options</div>
  ${renderAttack(character)}
</div>

${renderCompanionCard(character)}
      </div>

      <div>
        ${renderResourcePanel(characterId, character)}

        <div class="panel">
          <div class="section-title">Active Abilities</div>
          ${renderCards(character.dashboard.activeCards)}
          
        </div>

        ${campaignHasFeature("worldState") ? `
          <div class="panel">
            <div class="section-title">Unlocked by World State</div>
            ${renderUnlocks(character)}
          </div>
        ` : ""}

        ${character.dashboard.golemCommandMenu
      ? `
            <div class="panel">
              <div class="section-title">Golem Commands</div>
              ${renderGolemCommands(character)}
            </div>
          `
      : ""
    }
      </div>
    </div>
  `;
}

function renderResourcePanel(characterId, character) {
  const resourceHtml = renderResources(characterId, character);

  if (!resourceHtml.trim()) {
    return "";
  }

  return `
    <div class="panel">
      <div class="section-title">Resources</div>
      ${resourceHtml}
    </div>
  `;
}

function renderStat(label, value) {
  return `
    <div class="stat">
      <div class="stat-label">${escapeHtml(label)}</div>
      <div class="stat-value">${escapeHtml(value)}</div>
    </div>
  `;
}

function renderAttack(character) {
  const attacks = character.combat.attacks || {};
  const entries = Object.entries(attacks);

  if (!entries.length) {
    return `<div class="small">No attack data available.</div>`;
  }

  return entries
    .map(
      ([key, attack]) => `
        <div class="attack-box" data-attack-key="${escapeHtml(key)}" style="margin-bottom: 10px;">
          <div class="stat-label">${escapeHtml(attack.name)}</div>
          ${attack.toHit !== null && attack.toHit !== undefined
          ? `<div class="attack-line">To Hit: ${escapeHtml(formatMod(attack.toHit))}</div>`
          : `<div class="attack-line">Save: ${escapeHtml(attack.rider.includes("DC") ? attack.rider.split(";")[0] : "See rider")}</div>`
        }
          <div class="small"><strong>Damage:</strong> ${escapeHtml(attack.damage)}</div>
          <div class="small"><strong>Rider:</strong> ${escapeHtml(attack.rider)}</div>
        </div>
      `
    )
    .join("");
}

function renderDefense(character) {
  return `
    <div class="defense-strip">
      ${character.dashboard.defense
      .map((item) => `<div class="defense-item">${escapeHtml(item)}</div>`)
      .join("")}
    </div>
  `;
}

function renderActions(characterId, character) {
  const { action = [], bonus = [], reaction = [], passive = [] } = character.dashboard.actions;

  return `
    <div class="actions-grid">
      ${renderActionBlock("Action", "action", action, characterId)}
      ${renderActionBlock("Bonus Action", "bonus", bonus, characterId)}
      ${renderActionBlock("Reaction", "reaction", reaction, characterId)}
      ${renderActionBlock("Passive", "passive", passive, characterId)}
    </div>
  `;
}

function renderCommonActions(characterId) {
  const items = [
    "Attack",
    "Grapple",
    "Dash",
    "Disengage",
    "Dodge",
    "Help",
    "Hide",
    "Ready",
    "Search",
    "Use an Object"
  ];

  const selected = state.selectedActions[characterId]?.common;

  return `
    <div class="panel common-actions-panel">
      <div class="section-title">Common Combat Actions</div>

      <div class="common-actions-grid">
        ${items
      .map((action, index) => {
        const key = `common-${index}`;
        const isSelected = selected === key ? "selected" : "";

        return `
              <button
                class="action-btn common-action-btn ${isSelected}"
                type="button"
                data-character="${escapeHtml(characterId)}"
                data-type="common"
                data-key="${escapeHtml(key)}"
              >
                ${escapeHtml(action)}
              </button>
            `;
      })
      .join("")}
      </div>

      <div class="reaction-strip">
        ⚡ Reaction Reminder: Opportunity Attack
      </div>
    </div>
  `;
}

function renderActionBlock(label, type, items, characterId) {
  const selected = state.selectedActions[characterId]?.[type];

  return `
    <div class="action-block">
      <div class="tag ${escapeHtml(type)}">${escapeHtml(label)}</div>
      <div class="action-buttons">
        ${items
      .map((item, index) => {
        const key = `${type}-${index}`;
        const isSelected = selected === key ? "selected" : "";

        return `
              <button
                class="action-btn ${isSelected}"
                type="button"
                data-character="${escapeHtml(characterId)}"
                data-type="${escapeHtml(type)}"
                data-key="${escapeHtml(key)}"
              >
                ${escapeHtml(item)}
              </button>
            `;
      })
      .join("")}
      </div>
    </div>
  `;
}

function renderCards(cards = []) {
  if (!cards.length) {
    return `<div class="small">No active abilities listed.</div>`;
  }

  return cards
    .map(
      (card) => `
        <div class="card" style="margin-bottom: 10px;">
          <div class="tag ${escapeHtml(card.type)}">${escapeHtml(card.type)}</div>
          <div class="stat-value">${escapeHtml(card.title)}</div>
          <div class="small">${escapeHtml(card.body)}</div>
        </div>
      `
    )
    .join("");
}

function renderResources(characterId, character) {
  const spellSlots = character.combat.resources?.spellSlots || {};
  const custom = character.combat.resources?.custom || {};
  const showMead = campaignHasFeature("yggdrasilMead");
  const showCustomResources = campaignHasFeature("customResources");

  const spellSlotHtml = Object.entries(spellSlots)
    .map(([level, slotData]) => {
      const remaining = state.resources[characterId].spellSlots[level];
      return `
        <div class="card" style="margin-bottom: 10px;">
          <div class="stat-label">Level ${escapeHtml(level)} Slots</div>
          ${renderPips(characterId, "spellSlots", level, slotData.max, remaining)}
        </div>
      `;
    })
    .join("");

  const meadResource = custom.yggdrasilMead;
  const meadHtml = showMead && meadResource
    ? `
      <div class="card" style="margin-bottom: 10px;">
        <div class="stat-label">${escapeHtml(meadResource.label)}</div>
        <div class="small" style="margin-bottom: 8px;">
          Valhalla refresh item. Choose one effect per use.
        </div>
        ${renderPips(
      characterId,
      "custom",
      "yggdrasilMead",
      safeResourceMax(meadResource),
      state.resources[characterId].custom.yggdrasilMead
    )}
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
          <button
            class="btn green yggdrasil-half-heal-btn"
            type="button"
            data-character="${escapeHtml(characterId)}"
          >
            Half Heal (${getHalfHealAmount(characterId)} HP)
          </button>
          <button
            class="btn blue yggdrasil-rest-btn"
            type="button"
            data-character="${escapeHtml(characterId)}"
          >
            Pseudo Long Rest
          </button>
        </div>
      </div>
    `
    : "";

  const customHtml = showCustomResources
    ? Object.entries(custom)
      .filter(([key]) => key !== "yggdrasilMead")
      .map(([key, resource]) => {
        const max = safeResourceMax(resource);
        const remaining = state.resources[characterId].custom[key];
        const displayType = resource.display || "pips";

        if (max === null) {
          return `
            <div class="card" style="margin-bottom: 10px;">
              <div class="stat-label">${escapeHtml(resource.label)}</div>
              <div class="small">Always available / no tracker</div>
            </div>
          `;
        }

        if (displayType === "number") {
          return `
            <div class="card" style="margin-bottom: 10px;">
              <div class="stat-label">${escapeHtml(resource.label)}</div>
              <div class="small" style="margin-bottom: 8px;">
                ${remaining} / ${max}
              </div>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <input
                  class="number-input resource-adjust-input"
                  type="number"
                  min="1"
                  step="1"
                  inputmode="numeric"
                  placeholder="Amount"
                  data-character="${escapeHtml(characterId)}"
                  data-key="${escapeHtml(key)}"
                />
                <button
                  class="btn red resource-spend-btn"
                  type="button"
                  data-character="${escapeHtml(characterId)}"
                  data-key="${escapeHtml(key)}"
                >
                  - Spend
                </button>
                <button
                  class="btn green resource-restore-btn"
                  type="button"
                  data-character="${escapeHtml(characterId)}"
                  data-key="${escapeHtml(key)}"
                  data-max="${max}"
                >
                  + Restore
                </button>
              </div>
            </div>
          `;
        }

        return `
          <div class="card" style="margin-bottom: 10px;">
            <div class="stat-label">${escapeHtml(resource.label)}</div>
            ${renderPips(characterId, "custom", key, max, remaining)}
          </div>
        `;
      })
      .join("")
    : "";

  return `
    ${meadHtml}
    ${spellSlotHtml ? `<div class="resource-divider"></div>${spellSlotHtml}` : ""}
    ${customHtml ? `<div class="resource-divider"></div>${customHtml}` : ""}
  `;
}

function renderPips(characterId, bucket, key, max, remaining) {
  let html = `<div class="pips">`;

  for (let i = 0; i < max; i++) {
    const filled = i < remaining ? "filled" : "";
    html += `
      <button
        class="pip ${filled}"
        type="button"
        data-character="${escapeHtml(characterId)}"
        data-bucket="${escapeHtml(bucket)}"
        data-key="${escapeHtml(key)}"
        data-index="${i}"
        title="${remaining}/${max}"
      ></button>
    `;
  }

  html += `</div>`;
  return html;
}

function renderUnlocks(character) {
  const currentTier = state.selectedTier;
  const unlocks = character.dashboard.unlocks || {};

  const activeUnlocks = Object.entries(unlocks)
    .filter(([tier]) => Number(tier) <= currentTier)
    .flatMap(([tier, items]) =>
      items.map((item) => ({
        tier: Number(tier),
        text: item
      }))
    );

  if (!activeUnlocks.length) {
    return `<div class="small">No tier unlocks active yet.</div>`;
  }

  return activeUnlocks
    .map(
      (entry) => `
        <div class="card" style="margin-bottom: 10px;">
          <div class="tag passive">Tier ${entry.tier}</div>
          <div class="small">${escapeHtml(entry.text)}</div>
        </div>
      `
    )
    .join("");
}

function renderGolemCommands(character) {
  const menu = character.dashboard.golemCommandMenu;
  if (!menu) return "";

  return `
    <div class="card" style="margin-bottom: 10px;">
      <div class="stat-label">Default</div>
      <div class="small">${escapeHtml(menu.defaultBehavior)}</div>
    </div>

    <div class="actions-grid">
      ${menu.bonusActionOptions
      .map((option) => {
        const title = typeof option === "string" ? option : option.title;
        const desc = typeof option === "string" ? "" : option.desc;

        return `
            <div class="action-block">
              <div class="tag bonus">Command</div>
              <div class="stat-value">${escapeHtml(title)}</div>
              <div class="small">${escapeHtml(desc)}</div>
            </div>
          `;
      })
      .join("")}
    </div>

    <div class="card" style="margin-top: 10px;">
      <div class="stat-label">Notes</div>
      <ul class="small">
        ${menu.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
      </ul>
    </div>
  `;
}

/* ---------- SKILLS + DICE ---------- */

function renderSkillsDiceView(character) {
  return `
    <div class="grid utility-grid">
      ${campaignHasFeature("skillGroups") ? `
        <div class="panel">
          <div class="section-title">Grouped Skill Batches</div>
          ${renderSkillGroups(character)}
        </div>
      ` : ""}

      ${campaignHasFeature("diceRoller") ? `
        <div class="panel">
          <div class="section-title">Dice Roller</div>
          ${renderDiceRoller()}
        </div>
      ` : ""}
    </div>
  `;
}

function renderSkillGroups(character) {
  const skillGroups = {
    Strength: ["athletics"],
    Dexterity: ["acrobatics", "sleightOfHand", "stealth"],
    Intelligence: ["arcana", "history", "investigation", "nature", "religion"],
    Wisdom: ["animalHandling", "insight", "medicine", "perception", "survival"],
    Charisma: ["deception", "intimidation", "performance", "persuasion"]
  };

  const skillAbilityMap = {
    athletics: "str",
    acrobatics: "dex",
    sleightOfHand: "dex",
    stealth: "dex",
    arcana: "int",
    history: "int",
    investigation: "int",
    nature: "int",
    religion: "int",
    animalHandling: "wis",
    insight: "wis",
    medicine: "wis",
    perception: "wis",
    survival: "wis",
    deception: "cha",
    intimidation: "cha",
    performance: "cha",
    persuasion: "cha"
  };

  const skills = character.combat.skills || {};
  const abilities = character.abilities || {};

  function getSkillValue(skillKey) {
    if (skills[skillKey] !== undefined) return skills[skillKey];

    const abilityKey = skillAbilityMap[skillKey];
    return abilities[abilityKey]?.mod ?? 0;
  }

  function isListedSkill(skillKey) {
    return skills[skillKey] !== undefined;
  }

  return `
    <div class="skill-groups">
      ${Object.entries(skillGroups)
      .map(([groupName, keys]) => {
        const trained = keys.filter((key) => isListedSkill(key));
        const untrained = keys.filter((key) => !isListedSkill(key));

        return `
            <div class="skill-group-card">
              <div class="stat-label">${escapeHtml(groupName)}</div>

              ${trained.length
            ? `
                    <div class="skill-subhead">Listed / Proficient</div>
                    <div class="skill-list">
                      ${trained
              .map(
                (key) => `
                            <div class="skill-row trained">
                              <span>${escapeHtml(toTitleCase(key))}</span>
                              <strong>${escapeHtml(formatMod(getSkillValue(key)))}</strong>
                            </div>
                          `
              )
              .join("")}
                    </div>
                  `
            : ""
          }

              ${untrained.length
            ? `
                    <div class="skill-subhead">Base Ability</div>
                    <div class="skill-list">
                      ${untrained
              .map(
                (key) => `
                            <div class="skill-row">
                              <span>${escapeHtml(toTitleCase(key))}</span>
                              <strong>${escapeHtml(formatMod(getSkillValue(key)))}</strong>
                            </div>
                          `
              )
              .join("")}
                    </div>
                  `
            : ""
          }
            </div>
          `;
      })
      .join("")}
    </div>
  `;
}

function renderDiceRoller() {
  const dice = [4, 6, 8, 10, 12, 20];
  const result = state.dice.result;

  return `
    <div class="dice-box">
      <div class="dice-mode-row">
        ${["normal", "adv", "disadv"]
      .map(
        (mode) => `
              <button
                class="dice-mode-btn ${state.dice.mode === mode ? "selected" : ""}"
                type="button"
                data-mode="${mode}"
              >
                ${mode === "normal" ? "Normal" : mode === "adv" ? "Adv" : "Disadv"}
              </button>
            `
      )
      .join("")}
      </div>

      <div class="dice-controls-row">
        <label class="small" for="dice-modifier-input">Modifier</label>
        <input
          id="dice-modifier-input"
          class="number-input dice-modifier-input"
          type="number"
          step="1"
          inputmode="numeric"
          value="${escapeHtml(state.dice.modifier || 0)}"
        />
      </div>

      <div class="dice-button-grid">
        ${dice
      .map(
        (sides) => `
              <button class="dice-btn" type="button" data-sides="${sides}">
                d${sides}
              </button>
            `
      )
      .join("")}
      </div>

      <div class="dice-result-card">
        ${result ? renderDiceResult(result) : `<div class="small">Pick a mode, add an optional modifier, then roll.</div>`}
      </div>
    </div>
  `;
}

function renderDiceResult(result) {
  const modifierText = result.modifier === 0 ? "" : ` ${result.modifier > 0 ? "+" : "-"} ${Math.abs(result.modifier)}`;
  const modeText = result.mode === "normal" ? "" : ` ${result.mode.toUpperCase()}`;
  const rollText = result.rolls.length > 1
    ? `${result.rolls.join(" / ")} kept ${result.kept}`
    : `${result.kept}`;

  return `
    <div class="dice-result-main">d${result.sides}${modeText}${modifierText} → ${result.total}</div>
    <div class="small">Roll: ${escapeHtml(rollText)}</div>
  `;
}

function renderCompanionCard(character) {
  if (!character.companionIds?.length) return "";

  return character.companionIds
    .map((id) => {
      const c = companions[id];
      if (!c) return "";

      const currentHp = state.companionHp[id] ?? c.hp;

      return `
        <div class="panel">
          <div class="section-title">Companion</div>

          <div class="card">
            <div class="stat-value">${escapeHtml(c.name)}</div>
            <div class="small">${escapeHtml(c.subtitle || "")}</div>

            <div class="hp-box" style="margin-top: 10px;">
              <div class="hp-main">
                <div class="stat-label">Golem HP</div>
                <div class="hp-current">${currentHp} / ${c.hp}</div>
              </div>

              <div class="hp-controls">
                <input
                  class="number-input companion-hp-input"
                  type="number"
                  min="1"
                  step="1"
                  inputmode="numeric"
                  placeholder="Amount"
                  data-companion="${escapeHtml(id)}"
                />
                <button class="btn red companion-damage-btn" type="button" data-companion="${escapeHtml(id)}">
                  - Damage
                </button>
                <button class="btn green companion-heal-btn" type="button" data-companion="${escapeHtml(id)}">
                  + Heal
                </button>
                <button class="btn blue companion-reset-btn" type="button" data-companion="${escapeHtml(id)}">
                  Reset HP
                </button>
              </div>
            </div>

            <div class="stats-grid" style="margin-top: 10px;">
              ${renderStat("AC", c.ac)}
              ${renderStat("Speed", c.speed)}
              ${renderStat("Type", c.type || "Construct")}
            </div>

            <div class="attack-box" style="margin-top: 10px;">
              <div class="stat-label">${escapeHtml(c.attack.name)}</div>
              <div class="attack-line">To Hit: ${escapeHtml(c.attack.toHit)}</div>
              <div class="small"><strong>Damage:</strong> ${escapeHtml(c.attack.damage)}</div>
            </div>

            ${c.traits?.length
          ? `
                <div class="small" style="margin-top: 8px;">
                  ${c.traits.map((t) => `• ${escapeHtml(t)}`).join("<br>")}
                </div>
              `
          : ""
        }
          </div>
        </div>
      `;
    })
    .join("");
}

/* ---------- EVENTS ---------- */

function bindEvents() {
  const campaignPicker = document.getElementById("campaign-picker");
  const picker = document.getElementById("character-picker");
  const tierPicker = document.getElementById("tier-picker");
  const hpInput = document.getElementById("hp-adjust-input");
  const damageBtn = document.getElementById("hp-damage-btn");
  const healBtn = document.getElementById("hp-heal-btn");
  const resetBtn = document.getElementById("hp-reset-btn");
  const diceModifierInput = document.getElementById("dice-modifier-input");

  if (campaignPicker) {
    campaignPicker.addEventListener("change", (e) => {
      state.selectedCampaignId = e.target.value;
      state.selectedCharacterId = getFirstCharacterIdForCampaign(state.selectedCampaignId);
      state.selectedTier = worldState.defaultTier;
      saveState();
      render();
    });
  }

  if (picker) {
    picker.addEventListener("change", (e) => {
      state.selectedCharacterId = e.target.value;
      saveState();
      render();
    });
  }

  if (tierPicker) {
    tierPicker.addEventListener("change", (e) => {
      state.selectedTier = Number(e.target.value);
      saveState();
      render();
    });
  }

  document.querySelectorAll(".view-tab").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      state.activeView = e.currentTarget.dataset.view;
      saveState();
      render();
    });
  });

  if (damageBtn) {
    damageBtn.addEventListener("click", () => {
      const amount = Number(hpInput?.value || 0);
      if (!amount) return;

      const id = state.selectedCharacterId;
      state.currentHp[id] = Math.max(0, state.currentHp[id] - amount);
      saveState();
      render();
    });
  }

  if (healBtn) {
    healBtn.addEventListener("click", () => {
      const amount = Number(hpInput?.value || 0);
      if (!amount) return;

      const id = state.selectedCharacterId;
      const max = characters[id].combat.hpMax;
      state.currentHp[id] = Math.min(max, state.currentHp[id] + amount);
      saveState();
      render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const id = state.selectedCharacterId;
      state.currentHp[id] = characters[id].combat.hpMax;

      restoreSpellSlotsToMax(id);
      restoreCustomResourcesToMax(id);

      saveState();
      render();
    });
  }

  document.querySelectorAll(".yggdrasil-half-heal-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const characterId = e.currentTarget.dataset.character;
      if (!spendYggdrasilMead(characterId)) return;

      const healAmount = getHalfHealAmount(characterId);
      const maxHp = characters[characterId].combat.hpMax;

      state.currentHp[characterId] = Math.min(
        maxHp,
        state.currentHp[characterId] + healAmount
      );

      saveState();
      render();
    });
  });

  document.querySelectorAll(".yggdrasil-rest-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const characterId = e.currentTarget.dataset.character;
      if (!spendYggdrasilMead(characterId)) return;

      restoreSpellSlotsToMax(characterId);
      restoreCustomResourcesToMax(characterId, {
        excludeKeys: ["yggdrasilMead"]
      });

      saveState();
      render();
    });
  });

  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const characterId = target.dataset.character;
      const type = target.dataset.type;
      const key = target.dataset.key;
      const current = state.selectedActions[characterId][type];

      state.selectedActions[characterId][type] =
        current === key ? null : key;

      saveState();
      render();
    });
  });

  document.querySelectorAll(".resource-spend-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const characterId = target.dataset.character;
      const key = target.dataset.key;

      const input = document.querySelector(
        `.resource-adjust-input[data-character="${characterId}"][data-key="${key}"]`
      );

      const amount = Number(input?.value || 0);
      if (!amount) return;

      state.resources[characterId].custom[key] = Math.max(
        0,
        state.resources[characterId].custom[key] - amount
      );

      saveState();
      render();
    });
  });

  document.querySelectorAll(".resource-restore-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const characterId = target.dataset.character;
      const key = target.dataset.key;
      const max = Number(target.dataset.max);

      const input = document.querySelector(
        `.resource-adjust-input[data-character="${characterId}"][data-key="${key}"]`
      );

      const amount = Number(input?.value || 0);
      if (!amount) return;

      state.resources[characterId].custom[key] = Math.min(
        max,
        state.resources[characterId].custom[key] + amount
      );

      saveState();
      render();
    });
  });

  document.querySelectorAll(".pip").forEach((pip) => {
    pip.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const characterId = target.dataset.character;
      const bucket = target.dataset.bucket;
      const key = target.dataset.key;
      const index = Number(target.dataset.index);

      let max = null;

      if (bucket === "spellSlots") {
        max = characters[characterId].combat.resources.spellSlots[key].max;
      } else {
        max = safeResourceMax(characters[characterId].combat.resources.custom[key]);
      }

      if (max === null) return;

      const currentValue = state.resources[characterId][bucket][key];
      const clickedValue = index + 1;

      state.resources[characterId][bucket][key] =
        currentValue === clickedValue ? clickedValue - 1 : clickedValue;

      if (state.resources[characterId][bucket][key] < 0) {
        state.resources[characterId][bucket][key] = 0;
      }

      if (state.resources[characterId][bucket][key] > max) {
        state.resources[characterId][bucket][key] = max;
      }

      saveState();
      render();
    });
  });

  document.querySelectorAll(".dice-mode-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      state.dice.mode = e.currentTarget.dataset.mode;
      saveState();
      render();
    });
  });

  if (diceModifierInput) {
    diceModifierInput.addEventListener("change", (e) => {
      state.dice.modifier = Number(e.target.value || 0);
      saveState();
    });
  }

  document.querySelectorAll(".dice-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const sides = Number(e.currentTarget.dataset.sides);
      const modifier = Number(document.getElementById("dice-modifier-input")?.value || 0);
      const mode = state.dice.mode;
      const rolls = mode === "normal" ? [rollDie(sides)] : [rollDie(sides), rollDie(sides)];
      const kept = mode === "disadv" ? Math.min(...rolls) : Math.max(...rolls);

      state.dice.modifier = modifier;
      state.dice.result = {
        sides,
        mode,
        modifier,
        rolls,
        kept,
        total: kept + modifier
      };

      saveState();
      render();
    });
  });

  document.querySelectorAll(".companion-damage-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const companionId = e.currentTarget.dataset.companion;
      const input = document.querySelector(`.companion-hp-input[data-companion="${companionId}"]`);
      const amount = Number(input?.value || 0);
      if (!amount) return;

      state.companionHp[companionId] = Math.max(
        0,
        (state.companionHp[companionId] ?? companions[companionId].hp) - amount
      );

      saveState();
      render();
    });
  });

  document.querySelectorAll(".companion-heal-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const companionId = e.currentTarget.dataset.companion;
      const input = document.querySelector(`.companion-hp-input[data-companion="${companionId}"]`);
      const amount = Number(input?.value || 0);
      if (!amount) return;

      state.companionHp[companionId] = Math.min(
        companions[companionId].hp,
        (state.companionHp[companionId] ?? companions[companionId].hp) + amount
      );

      saveState();
      render();
    });
  });

  document.querySelectorAll(".companion-reset-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const companionId = e.currentTarget.dataset.companion;
      state.companionHp[companionId] = companions[companionId].hp;

      saveState();
      render();
    });
  });
}



/* ---------- FIRST-RUN PICKER ---------- */

function maybePromptForCampaign() {
  if (localStorage.getItem(STORAGE_KEY)) return;

  const campaignNames = getCampaignEntries()
    .map(([id, campaign]) => `${id}: ${campaign.name}`)
    .join("\n");

  const answer = window.prompt(
    `Which campaign are you playing?\n\n${campaignNames}\n\nType the campaign id exactly:`
  );

  if (answer && campaigns[answer]) {
    state.selectedCampaignId = answer;
    state.selectedCharacterId = getFirstCharacterIdForCampaign(answer);
    saveState();
  }
}

/* ---------- BOOT ---------- */

loadState();
maybePromptForCampaign();
render();
