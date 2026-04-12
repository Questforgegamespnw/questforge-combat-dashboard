/* =========================
   QUESTFORGE DASHBOARD APP
   ========================= */

import { characters } from "../data/characters.js";
import { worldState } from "../data/worldstate.js";

/* ---------- APP STATE ---------- */

const STORAGE_KEY = "qf-dashboard-state";

const state = {
  selectedCharacterId: null,
  selectedTier: worldState.defaultTier,
  currentHp: {},
  resources: {},
  selectedActions: {}
};

/* ---------- HELPERS ---------- */

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getCharacterEntries() {
  return Object.entries(characters);
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

/* ---------- INITIALIZE STATE ---------- */

function buildInitialState() {
  const initial = {
  selectedCharacterId: Object.keys(characters)[0] || null,
  selectedTier: worldState.defaultTier,
  currentHp: {},
  resources: {},
  selectedActions: {}
};

  for (const [id, character] of getCharacterEntries()) {
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

  return initial;
}

function loadState() {
  const initial = buildInitialState();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // No saved data → use defaults
    if (!saved) {
      Object.assign(state, initial);
      return;
    }

    /* ---------- BASIC STATE ---------- */

    state.selectedCharacterId =
      saved.selectedCharacterId && characters[saved.selectedCharacterId]
        ? saved.selectedCharacterId
        : initial.selectedCharacterId;

    state.selectedTier =
      saved.selectedTier && worldState.tiers[saved.selectedTier]
        ? Number(saved.selectedTier)
        : initial.selectedTier;

    /* ---------- CORE TRACKED VALUES ---------- */

    // HP is simple merge
    state.currentHp = { ...initial.currentHp, ...(saved.currentHp || {}) };

    // Resources + actions start clean, then get patched
    state.resources = deepClone(initial.resources);
    state.selectedActions = deepClone(initial.selectedActions);

    /* ---------- LOAD RESOURCE VALUES ---------- */
    // This ONLY handles spell slots + custom resources
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

    /* ---------- LOAD SELECTED ACTIONS ---------- */
    // Completely separate from resources
    // This restores which buttons were "selected" (pre-planned actions)
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

  const characterId = state.selectedCharacterId;
  const character = getCharacter(characterId);

  if (!character) {
    app.innerHTML = `<div class="panel">No character selected.</div>`;
    return;
  }

  const currentHp = state.currentHp[characterId];
  const hpMax = character.combat.hpMax;
  const tierInfo = worldState.tiers[state.selectedTier];

  app.innerHTML = `
    <div class="topbar">
      <div>
        <div class="title">QuestForge Combat Dashboard</div>
        <div class="subtitle">One character at a time. Fast decisions. Less table drag.</div>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
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
      </div>
    </div>

    <div class="panel" style="margin-bottom: 14px;">
      <div class="section-title">Current World State</div>
      <div class="small"><strong>${escapeHtml(tierInfo.label)}</strong></div>
    </div>

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
      </div>

      <div>
        <div class="panel">
          <div class="section-title">Resources</div>
          ${renderResources(characterId, character)}
        </div>

        <div class="panel">
          <div class="section-title">Active Abilities</div>
          ${renderCards(character.dashboard.activeCards)}
        </div>

        <div class="panel">
          <div class="section-title">Unlocked by World State</div>
          ${renderUnlocks(character)}
        </div>

        ${
          character.dashboard.golemCommandMenu
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

  bindEvents();
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
  const meadHtml = meadResource
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

  const customHtml = Object.entries(custom)
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
    .join("");

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

/* ---------- EVENTS ---------- */

function bindEvents() {
  const picker = document.getElementById("character-picker");
  const tierPicker = document.getElementById("tier-picker");
  const hpInput = document.getElementById("hp-adjust-input");
  const damageBtn = document.getElementById("hp-damage-btn");
  const healBtn = document.getElementById("hp-heal-btn");
  const resetBtn = document.getElementById("hp-reset-btn");

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
}

/* ---------- FIRST-RUN PICKER ---------- */

function maybePromptForCharacter() {
  if (localStorage.getItem(STORAGE_KEY)) return;

  const names = getCharacterEntries()
    .map(([id, character]) => `${id}: ${character.identity.name}`)
    .join("\n");

  const answer = window.prompt(
    `Which character are you?\n\n${names}\n\nType the character id exactly:`
  );

  if (answer && characters[answer]) {
    state.selectedCharacterId = answer;
    saveState();
  }
}

/* ---------- BOOT ---------- */

loadState();
maybePromptForCharacter();
render();

