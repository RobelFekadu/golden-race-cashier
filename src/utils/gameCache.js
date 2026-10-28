export const MIN_FUTURE_GAMES = 4;

export function countFutureGames(games, now = Date.now()) {
  if (!Array.isArray(games)) return 0;

  return games.filter((g) => g && new Date(g.endTime).getTime() > now).length;
}

export function needsMoreGames(
  games,
  minFuture = MIN_FUTURE_GAMES,
  now = Date.now(),
) {
  return countFutureGames(games, now) < minFuture;
}

export function findOpenGame(games, now = Date.now()) {
  if (!Array.isArray(games) || games.length === 0) return null;

  const open = games.find((g) => {
    const start = g.startTime ? new Date(g.startTime).getTime() : -Infinity;
    const end = new Date(g.endTime).getTime();
    return start <= now && now < end;
  });

  if (open) return open;

  return games.find((g) => new Date(g.endTime).getTime() > now) || null;
}

export function findNextGame(games, current) {
  if (!Array.isArray(games) || !current) return null;

  return (
    games
      .filter((g) => g.gameNumber > current.gameNumber)
      .sort((a, b) => a.gameNumber - b.gameNumber)[0] || null
  );
}
