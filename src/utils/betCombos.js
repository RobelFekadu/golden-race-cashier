function cartesianProduct(positions) {
  return positions.reduce(
    (acc, choices) =>
      acc.flatMap((prefix) => choices.map((value) => [...prefix, value])),
    [[]],
  );
}

function difference(values, excluded) {
  return values.filter((value) => value !== excluded);
}

function uniqueCombos(combos) {
  const seen = new Set();
  const result = [];

  for (const combo of combos) {
    const key = combo.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      result.push(combo);
    }
  }

  return result;
}

/**
 * Mirror RaceSystemBetManager.createWildcards from the original terminal.
 *
 * Duplicated picks are replaced with wildcards (0) that are later exploded
 * against the rest of the field.
 */
function createWildcards(combo, positions, positionCount) {
  const required = positionCount - 1;
  const wildcards = [];

  combo.forEach((value, index) => {
    const current = combo.slice();
    let slot = index;

    const step = () => {
      let replaced = false;

      for (const candidate of positions[slot]) {
        if (!current.includes(candidate)) {
          current[slot] = candidate;
          wildcards.push(current);
          replaced = true;
        }
      }

      if (!replaced) {
        current[slot] = 0;
        if (difference(current, value).length === required) {
          wildcards.push(current);
        }
      }

      if (++slot === current.length) slot = 0;
    };

    while (difference(current, value).length < required && value !== 0) {
      step();
    }
  });

  return wildcards;
}

function substituteDuplicatedParticipants(positions, combos, positionCount) {
  const result = combos.slice();

  for (const combo of combos) {
    if (new Set(combo).size === combo.length || combo.length < 2) continue;
    result.push(...createWildcards(combo, positions, positionCount));
    result.splice(result.indexOf(combo), 1);
  }

  return uniqueCombos(result);
}

function replaceWildcard(combo, participantCount) {
  const result = [];

  for (let participant = 1; participant <= participantCount; participant++) {
    if (combo.includes(participant)) continue;

    const next = combo.slice();
    next[next.indexOf(0)] = participant;

    if (next.includes(0)) {
      result.push(...replaceWildcard(next, participantCount));
    } else {
      result.push(next);
    }
  }

  return result;
}

function explodeWildcards(combos, participantCount) {
  const result = [];

  for (const combo of combos) {
    if (combo.includes(0)) {
      result.push(...replaceWildcard(combo, participantCount));
    } else {
      result.push(combo);
    }
  }

  return result;
}

function generatePermutation(positions, participantCount) {
  const combos = substituteDuplicatedParticipants(
    positions,
    cartesianProduct(positions),
    positions.length,
  );
  return explodeWildcards(combos, participantCount);
}

function combinations(values, size) {
  if (size > values.length || size <= 0) return [];
  if (size === values.length) return [values.slice()];
  if (size === 1) return values.map((value) => [value]);

  const result = [];
  for (let index = 0; index < values.length - size + 1; index++) {
    const head = values.slice(index, index + 1);
    for (const tail of combinations(values.slice(index + 1), size - 1)) {
      result.push([...head, ...tail]);
    }
  }
  return result;
}

/**
 * Build win / exacta / trifecta combinations the way the original terminal does.
 *
 * rows[0] = win (1st) picks, rows[1] = exacta (2nd) picks, rows[2] = trifecta (3rd) picks.
 *
 * - 1st only filled  -> win:  win_{n}          (one per pick)
 * - 1st + 2nd filled -> exacta: exacta_{w}_{e} (ordered pairs)
 * - 1st + 2nd + 3rd  -> trifecta: trifecta_{w}_{e}_{t} (ordered triples)
 *
 * A participant picked in more than one row is replaced by a wildcard and
 * combined with every other runner in the field, exactly like the original.
 */
export function generateCombos(rows, participantCount = 0) {
  const win = rows[0] || [];
  const exacta = rows[1] || [];
  const trifecta = rows[2] || [];

  if (trifecta.length > 0) {
    return generatePermutation([win, exacta, trifecta], participantCount).map(
      (picks) => ({ betType: "TRIFECTA", picks }),
    );
  }

  if (exacta.length > 0) {
    return generatePermutation([win, exacta], participantCount).map(
      (picks) => ({ betType: "EXACTA", picks }),
    );
  }

  return win.map((w) => ({ betType: "WIN", picks: [w] }));
}

/**
 * Quinella: unordered pairs built from the quinella row only, matching the
 * original terminal. A single participant is expanded against the rest of the
 * field.
 */
export function generateQuinella(quinella, participantCount = 0) {
  const participants = Array.from(new Set(quinella));
  if (participants.length === 0) return [];
  if (participants.length === 1) participants.push(0);

  const combos = combinations(participants, 2);
  return explodeWildcards(combos, participantCount)
    .map((picks) => picks.sort((a, b) => a - b))
    .map((picks) => ({ betType: "QUINELLA", picks }));
}

export function marketLabel(betType) {
  if (betType === "TRIFECTA") return "Trifecta";
  if (betType === "EXACTA") return "Exacta";
  if (betType === "QUINELLA") return "Quinella";
  return "Win";
}
