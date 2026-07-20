const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const rooms = new Map();

const colors = {
  red: { label: "Corazon", icon: "♥", css: "red" },
  yellow: { label: "Cerebro", icon: "🧠", css: "yellow" },
  white: { label: "Hueso", icon: "🦴", css: "white" },
  green: { label: "Estomago", icon: "☘", css: "green" },
  wild: { label: "Comodin", icon: "✦", css: "wild" }
};

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function id(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function roomCode() {
  let code = "";
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (rooms.has(code));
  return code;
}

function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function card(kind, color, name, icon, effect = "") {
  return { id: id("card"), kind, color, name, icon, effect };
}

function buildDeck(expansions = {}) {
  const deck = [];
  ["red", "yellow", "white", "green"].forEach((color) => {
    for (let i = 0; i < 5; i += 1) deck.push(card("organ", color, colors[color].label, colors[color].icon, "Coloca este organo en tu cuerpo."));
    for (let i = 0; i < 4; i += 1) deck.push(card("virus", color, `Virus ${colors[color].label}`, "🦠", "Infecta un organo rival del mismo color."));
    for (let i = 0; i < 4; i += 1) deck.push(card("medicine", color, `Medicina ${colors[color].label}`, "💊", "Cura un virus o vacuna un organo sano."));
  });
  deck.push(card("organ", "wild", "Organo Comodin", "🌈", "Cuenta como cualquier color libre."));
  deck.push(card("virus", "wild", "Virus Comodin", "🧫", "Infecta cualquier organo rival."));
  for (let i = 0; i < 4; i += 1) deck.push(card("medicine", "wild", "Medicina Comodin", "✨", "Cura o vacuna cualquier organo."));
  [
    ["steal", "Ladron de organos", "🧤", "Roba un organo sano del rival."],
    ["steal", "Ladron de organos", "🧤", "Roba un organo sano del rival."],
    ["swap", "Transplante", "🔁", "Intercambia un organo con el rival."],
    ["hands", "Intercambio de manos", "🤝", "Intercambia las manos."],
    ["clean", "Desinfeccion", "🧼", "Elimina todos los virus."],
    ["super", "Supermedicina", "💉", "Cura cualquier virus propio."],
    ["super", "Supermedicina", "💉", "Cura cualquier virus propio."],
    ["shield", "Guante de latex", "🛡", "Vacuna un organo sano propio."],
    ["shield", "Guante de latex", "🛡", "Vacuna un organo sano propio."],
    ["extra", "Horas extra", "⏱", "Roba dos cartas."]
  ].forEach(([type, name, icon, effect]) => deck.push(card("treatment", type, name, icon, effect)));

  if (expansions.virus2) {
    deck.push(card("organ", "bionic", "Organo Bionico", "🤖", "Organo especial protegido."));
    ["red", "yellow", "white", "green"].forEach((color) => {
      for (let i = 0; i < 2; i += 1) deck.push(card("virus", color, `Virus evolucionado ${colors[color].label}`, "☣", "Infecta con fuerza evolucionada."));
      for (let i = 0; i < 2; i += 1) deck.push(card("medicine", color, `Medicina experimental ${colors[color].label}`, "🧪", "Cura virus evolucionados."));
    });
  }
  if (expansions.halloween) {
    deck.push(card("organ", "orange", "Organo mutante", "🎃", "Organo naranja especial."));
    for (let i = 0; i < 3; i += 1) deck.push(card("treatment", "scare", "Susto mortal", "👻", "El rival pierde un organo sano."));
    for (let i = 0; i < 3; i += 1) deck.push(card("treatment", "trick", "Truco o trato", "🍬", "El rival descarta una carta."));
  }
  return shuffle(deck);
}

function makePlayer(name, slot) {
  return { id: id("player"), name: name || `Jugador ${slot}`, slot, hand: [], organs: {}, connected: true };
}

function draw(room, player, amount = 1) {
  for (let i = 0; i < amount; i += 1) {
    if (!room.deck.length && room.discard.length) room.deck = shuffle(room.discard.splice(0));
    if (room.deck.length) player.hand.push(room.deck.pop());
  }
  while (player.hand.length > 7) room.discard.push(player.hand.pop());
}

function publicOrgan(organ) {
  return organ ? { ...organ } : null;
}

function view(room, playerId) {
  const you = room.players.find((p) => p.id === playerId);
  return {
    roomCode: room.code,
    phase: room.phase,
    currentTurn: room.currentTurn,
    winner: room.winner,
    deckCount: room.deck.length,
    discardCount: room.discard.length,
    log: room.log.slice(-20),
    youSlot: you?.slot,
    players: room.players.map((p) => ({
      id: p.id,
      slot: p.slot,
      name: p.name,
      handCount: p.hand.length,
      hand: p.id === playerId ? p.hand : [],
      playableIds: p.id === playerId && room.phase === "playing" && p.slot === room.currentTurn ? playableIds(room, p) : [],
      organs: Object.fromEntries(Object.entries(p.organs).map(([key, organ]) => [key, publicOrgan(organ)]))
    }))
  };
}

function healthyColors(player) {
  return Object.values(player.organs)
    .filter((organ) => organ && organ.status !== "infected")
    .map((organ) => organ.color === "wild" ? organ.asColor : organ.color);
}

function checkWinner(room, player) {
  const unique = new Set(healthyColors(player).filter(Boolean));
  if (unique.size >= 4) {
    room.phase = "finished";
    room.winner = player.slot;
    room.log.push(`${player.name} gano con 4 organos sanos.`);
  }
}

function nextTurn(room) {
  room.currentTurn = room.currentTurn === 1 ? 2 : 1;
}

function colorFree(player, color) {
  const target = color === "wild" ? ["red", "yellow", "white", "green"].find((c) => !player.organs[c]) : color;
  return target || null;
}

function canApplyTreatment(room, player, rival, cardPlayed) {
  if (cardPlayed.color === "steal") {
    return Object.entries(rival.organs).some(([key, organ]) => organ.status === "healthy" && !player.organs[key]);
  }
  if (cardPlayed.color === "clean") {
    return room.players.some((p) => Object.values(p.organs).some((organ) => organ.status === "infected"));
  }
  if (cardPlayed.color === "hands") return rival.hand.length > 0 || player.hand.length > 1;
  if (cardPlayed.color === "super") return Object.values(player.organs).some((organ) => organ.status === "infected");
  if (cardPlayed.color === "shield") return Object.values(player.organs).some((organ) => organ.status === "healthy");
  if (cardPlayed.color === "swap") return Object.keys(player.organs).length > 0 && Object.keys(rival.organs).length > 0;
  if (cardPlayed.color === "scare") return Object.values(rival.organs).some((organ) => organ.status === "healthy");
  if (cardPlayed.color === "trick") return rival.hand.length > 0;
  if (cardPlayed.color === "extra") return true;
  return true;
}

function isPlayable(room, player, rival, selected) {
  if (selected.kind === "organ") return !!colorFree(player, selected.color);
  if (selected.kind === "virus") {
    return Object.values(rival.organs).some((organ) =>
      organ.status === "healthy" && (selected.color === "wild" || organ.asColor === selected.color || organ.color === selected.color)
    );
  }
  if (selected.kind === "medicine") {
    return Object.values(player.organs).some((organ) =>
      (organ.status === "infected" || organ.status === "healthy") &&
      (selected.color === "wild" || organ.asColor === selected.color || organ.color === selected.color)
    );
  }
  return canApplyTreatment(room, player, rival, selected);
}

function playableIds(room, player) {
  const rival = room.players.find((p) => p.id !== player.id);
  if (!rival) return [];
  return player.hand.filter((cardInHand) => isPlayable(room, player, rival, cardInHand)).map((cardInHand) => cardInHand.id);
}

function playCard(room, playerId, cardId) {
  if (room.phase !== "playing") return "La partida no esta activa.";
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.slot !== room.currentTurn) return "No es tu turno.";
  const rival = room.players.find((p) => p.id !== playerId);
  const index = player.hand.findIndex((c) => c.id === cardId);
  if (index < 0) return "Esa carta no esta en tu mano.";
  const selected = player.hand[index];
  if (!isPlayable(room, player, rival, selected)) return "Esa carta no tiene efecto valido. Elige otra carta.";
  let log = "";

  if (selected.kind === "organ") {
    const targetColor = colorFree(player, selected.color);
    if (!targetColor) return "No puedes repetir ese organo.";
    player.organs[targetColor] = { color: selected.color, asColor: targetColor, icon: selected.icon, name: selected.name, status: "healthy" };
    log = `${player.name} coloco ${selected.name}.`;
  } else if (selected.kind === "virus") {
    const target = Object.entries(rival.organs).find(([, organ]) =>
      organ.status === "healthy" && (selected.color === "wild" || organ.asColor === selected.color || organ.color === selected.color)
    );
    if (!target) return "No hay organo rival valido para infectar.";
    target[1].status = "infected";
    log = `${player.name} infecto ${target[1].name} de ${rival.name}.`;
  } else if (selected.kind === "medicine") {
    const infected = Object.entries(player.organs).find(([, organ]) =>
      organ.status === "infected" && (selected.color === "wild" || organ.asColor === selected.color || organ.color === selected.color)
    );
    const healthy = Object.entries(player.organs).find(([, organ]) =>
      organ.status === "healthy" && (selected.color === "wild" || organ.asColor === selected.color || organ.color === selected.color)
    );
    if (infected) {
      infected[1].status = "healthy";
      log = `${player.name} curo ${infected[1].name}.`;
    } else if (healthy) {
      healthy[1].status = "vaccinated";
      log = `${player.name} vacuno ${healthy[1].name}.`;
    } else {
      return "No tienes objetivo valido para esa medicina.";
    }
  } else {
    log = applyTreatment(room, player, rival, selected);
    if (!log) return "No se pudo usar ese tratamiento.";
  }

  player.hand.splice(index, 1);
  room.discard.push(selected);
  draw(room, player, selected.kind === "treatment" && selected.color === "extra" ? 2 : 1);
  room.log.push(log);
  checkWinner(room, player);
  if (room.phase !== "finished") nextTurn(room);
  return null;
}

function discardCard(room, playerId, cardId) {
  if (room.phase !== "playing") return "La partida no esta activa.";
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.slot !== room.currentTurn) return "No es tu turno.";
  if (playableIds(room, player).length > 0) return "Tienes cartas jugables, debes jugar una.";
  const index = player.hand.findIndex((c) => c.id === cardId);
  if (index < 0) return "Esa carta no esta en tu mano.";

  const selected = player.hand.splice(index, 1)[0];
  room.discard.push(selected);
  draw(room, player, 1);
  room.log.push(`${player.name} descarto ${selected.name} y robo una carta nueva.`);
  nextTurn(room);
  return null;
}

function applyTreatment(room, player, rival, cardPlayed) {
  if (cardPlayed.color === "steal") {
    const target = Object.entries(rival.organs).find(([, organ]) => organ.status === "healthy");
    if (!target || player.organs[target[0]]) return "";
    player.organs[target[0]] = target[1];
    delete rival.organs[target[0]];
    return `${player.name} robo un organo de ${rival.name}.`;
  }
  if (cardPlayed.color === "clean") {
    room.players.forEach((p) => Object.values(p.organs).forEach((organ) => {
      if (organ.status === "infected") organ.status = "healthy";
    }));
    return `${player.name} desinfecto la mesa.`;
  }
  if (cardPlayed.color === "hands") {
    [player.hand, rival.hand] = [rival.hand, player.hand];
    return `${player.name} intercambio las manos.`;
  }
  if (cardPlayed.color === "super") {
    const infected = Object.values(player.organs).find((organ) => organ.status === "infected");
    if (!infected) return "";
    infected.status = "healthy";
    return `${player.name} uso supermedicina.`;
  }
  if (cardPlayed.color === "shield") {
    const healthy = Object.values(player.organs).find((organ) => organ.status === "healthy");
    if (!healthy) return "";
    healthy.status = "vaccinated";
    return `${player.name} protegió un organo.`;
  }
  if (cardPlayed.color === "swap") {
    const own = Object.keys(player.organs)[0];
    const other = Object.keys(rival.organs)[0];
    if (!own || !other) return "";
    [player.organs[own], rival.organs[other]] = [rival.organs[other], player.organs[own]];
    return `${player.name} hizo un transplante.`;
  }
  if (cardPlayed.color === "scare") {
    const target = Object.keys(rival.organs).find((key) => rival.organs[key].status === "healthy");
    if (!target) return "";
    delete rival.organs[target];
    return `${player.name} dio un susto mortal.`;
  }
  if (cardPlayed.color === "trick") {
    if (rival.hand.length) room.discard.push(rival.hand.pop());
    return `${player.name} hizo truco o trato.`;
  }
  if (cardPlayed.color === "extra") return `${player.name} hizo horas extra.`;
  return `${player.name} uso ${cardPlayed.name}.`;
}

function createRoom(body) {
  const code = roomCode();
  const player = makePlayer(body.name, 1);
  const room = {
    code,
    phase: "waiting",
    players: [player],
    deck: buildDeck({ virus2: !!body.virus2, halloween: !!body.halloween }),
    discard: [],
    currentTurn: 1,
    winner: null,
    log: [`Sala ${code} creada.`]
  };
  rooms.set(code, room);
  return { room, player };
}

function start(room) {
  room.phase = "playing";
  room.players.forEach((p) => {
    p.hand = [];
    p.organs = {};
    draw(room, p, 3);
  });
  room.log.push("La partida empezo. Cada jugador recibio 3 cartas.");
}

async function api(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "POST" && url.pathname === "/api/create") {
    const { room, player } = createRoom(await readBody(req));
    return json(res, 200, { roomCode: room.code, playerId: player.id, state: view(room, player.id) });
  }
  if (req.method === "POST" && url.pathname === "/api/join") {
    const body = await readBody(req);
    const room = rooms.get(String(body.roomCode || ""));
    if (!room) return json(res, 404, { error: "Sala no encontrada." });
    if (room.players.length >= 2) return json(res, 400, { error: "La sala ya tiene 2 jugadores." });
    const player = makePlayer(body.name, 2);
    room.players.push(player);
    room.log.push(`${player.name} se unio a la sala.`);
    return json(res, 200, { roomCode: room.code, playerId: player.id, state: view(room, player.id) });
  }
  if (req.method === "POST" && url.pathname === "/api/start") {
    const body = await readBody(req);
    const room = rooms.get(String(body.roomCode || ""));
    if (!room || room.players.length < 2) return json(res, 400, { error: "Faltan jugadores." });
    if (room.phase === "waiting") start(room);
    return json(res, 200, { state: view(room, body.playerId) });
  }
  if (req.method === "POST" && url.pathname === "/api/play") {
    const body = await readBody(req);
    const room = rooms.get(String(body.roomCode || ""));
    if (!room) return json(res, 404, { error: "Sala no encontrada." });
    const error = playCard(room, body.playerId, body.cardId);
    return json(res, error ? 400 : 200, error ? { error } : { state: view(room, body.playerId) });
  }
  if (req.method === "POST" && url.pathname === "/api/discard") {
    const body = await readBody(req);
    const room = rooms.get(String(body.roomCode || ""));
    if (!room) return json(res, 404, { error: "Sala no encontrada." });
    const error = discardCard(room, body.playerId, body.cardId);
    return json(res, error ? 400 : 200, error ? { error } : { state: view(room, body.playerId) });
  }
  if (req.method === "POST" && url.pathname === "/api/restart") {
    const body = await readBody(req);
    const room = rooms.get(String(body.roomCode || ""));
    if (!room) return json(res, 404, { error: "Sala no encontrada." });
    room.deck = buildDeck({});
    room.discard = [];
    room.phase = "waiting";
    room.winner = null;
    room.currentTurn = 1;
    room.players.forEach((p) => { p.hand = []; p.organs = {}; });
    room.log = ["Revancha preparada."];
    return json(res, 200, { state: view(room, body.playerId) });
  }
  if (req.method === "GET" && url.pathname === "/api/state") {
    const room = rooms.get(String(url.searchParams.get("roomCode") || ""));
    if (!room) return json(res, 404, { error: "Sala no encontrada." });
    return json(res, 200, { state: view(room, url.searchParams.get("playerId")) });
  }
  return false;
}

function staticFile(req, res) {
  const rawPath = decodeURIComponent(req.url.split("?")[0]);
  const fileName = rawPath === "/" ? "index.html" : rawPath.slice(1);
  const filePath = path.normalize(path.join(ROOT, fileName));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const handled = await api(req, res);
    if (handled !== false) return;
  }
  staticFile(req, res);
}).listen(PORT, () => {
  console.log(`Juego listo en http://localhost:${PORT}`);
});
