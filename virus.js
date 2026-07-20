const api = async (path, body) => {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error");
  return data;
};

let roomCode = localStorage.getItem("virusRoom") || "";
let playerId = localStorage.getItem("virusPlayer") || "";
let state = null;
let selectedCard = null;
let poller = null;
let localMode = false;
let localDeck = [];
let localDiscard = [];
let localNextId = 1;

const $ = (id) => document.getElementById(id);

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function cardClass(card) {
  return `card ${card.kind} ${card.color}`;
}

function renderCard(card) {
  const div = document.createElement("button");
  const you = state?.players.find((p) => p.slot === state.youSlot);
  const playableIds = you?.playableIds || [];
  const isYourTurn = state?.phase === "playing" && state.currentTurn === state.youSlot;
  const canPlayThis = !isYourTurn || playableIds.includes(card.id) || playableIds.length === 0;
  div.className = cardClass(card);
  div.innerHTML = `<span>${card.kind.toUpperCase()}</span><span class="icon">${card.icon}</span><strong>${card.name}</strong><small>${card.effect}</small>`;
  div.title = card.effect;
  if (isYourTurn && playableIds.length > 0 && !playableIds.includes(card.id)) div.classList.add("not-playable");
  div.addEventListener("click", () => {
    if (!canPlayThis) {
      toast("Esa carta no tiene efecto valido ahora.");
      return;
    }
    selectedCard = card.id;
    render();
  });
  if (selectedCard === card.id) div.classList.add("selected");
  return div;
}

function renderOrgan(organ, key) {
  const slot = document.createElement("div");
  slot.className = "organ-slot";
  if (!organ) {
    slot.textContent = key.toUpperCase();
    return slot;
  }
  slot.innerHTML = `
    <div class="organ-card ${organ.asColor || organ.color}">
      <span class="icon">${organ.icon}</span>
      <strong>${organ.name}</strong>
      <span class="status">${organ.status === "infected" ? "Infectado" : organ.status === "vaccinated" ? "Vacunado" : "Sano"}</span>
    </div>`;
  return slot;
}

function renderBoard(player) {
  const article = document.createElement("article");
  article.innerHTML = `<h3>${player.name} ${player.slot === state.currentTurn ? "• turno" : ""}</h3>`;
  const organs = document.createElement("div");
  organs.className = "organs";
  ["red", "yellow", "white", "green", "orange", "bionic"].forEach((key) => organs.appendChild(renderOrgan(player.organs[key], key)));
  article.appendChild(organs);
  return article;
}

function render() {
  if (!state) return;
  $("lobby").classList.add("hidden");
  $("game").classList.remove("hidden");
  $("roomCode").textContent = state.roomCode;
  $("turnInfo").textContent = state.phase === "finished"
    ? `Ganó Jugador ${state.winner}`
    : state.phase === "waiting"
      ? "Esperando jugadores"
      : state.currentTurn === state.youSlot ? "Tu turno" : "Turno rival";
  $("deckCount").textContent = state.deckCount;
  $("discardCount").textContent = state.discardCount;
  $("turnCore").textContent = state.phase === "playing" ? (state.currentTurn === state.youSlot ? "TU TURNO" : "RIVAL") : "VS";
  $("startGame").disabled = state.phase !== "waiting" || state.players.length < 2;
  const you = state.players.find((p) => p.slot === state.youSlot);
  const noPlayable = state.phase === "playing" && state.currentTurn === state.youSlot && (you?.playableIds || []).length === 0;
  $("playCard").disabled = !selectedCard || noPlayable || state.phase !== "playing" || state.currentTurn !== state.youSlot;
  $("discardCard").disabled = !selectedCard || !noPlayable;
  $("discardCard").classList.toggle("available", noPlayable);

  const rival = state.players.find((p) => p.slot !== state.youSlot);
  $("opponentBoard").innerHTML = "";
  $("yourBoard").innerHTML = "";
  if (rival) $("opponentBoard").appendChild(renderBoard(rival));
  if (you) $("yourBoard").appendChild(renderBoard(you));

  const hand = $("hand");
  hand.innerHTML = "";
  (you?.hand || []).forEach((card) => hand.appendChild(renderCard(card)));

  $("log").innerHTML = state.log.slice().reverse().map((line) => `<div>${line}</div>`).join("");
}

function makeLocalCard(kind, color, name, icon, effect) {
  return { id: `local-${localNextId++}`, kind, color, name, icon, effect };
}

function buildLocalDeck() {
  const colors = [
    ["red", "Corazon", "♥"],
    ["yellow", "Hueso", "🦴"],
    ["green", "Estomago", "♡"],
    ["blue", "Medicina", "💊"]
  ];
  const deck = [];
  for (let i = 0; i < 6; i += 1) {
    colors.forEach(([color, name, icon]) => {
      deck.push(makeLocalCard("organ", color, name, icon, "Construye tu cuerpo."));
      deck.push(makeLocalCard("medicine", color, `Antidoto ${name}`, "💉", "Cura o protege."));
      deck.push(makeLocalCard("virus", color, `Virus ${name}`, "☣", "Ataca al rival."));
    });
  }
  return deck.sort(() => Math.random() - 0.5);
}

function drawLocalCards(player, count) {
  for (let i = 0; i < count; i += 1) {
    if (!localDeck.length) localDeck = localDiscard.splice(0).sort(() => Math.random() - 0.5);
    const card = localDeck.pop();
    if (card) player.hand.push(card);
  }
}

function createLocalPlayer(slot, name) {
  return {
    slot,
    name,
    hand: [],
    organs: { red: null, yellow: null, white: null, green: null, orange: null, bionic: null },
    playableIds: []
  };
}

function updateLocalPlayable() {
  state.players.forEach((player) => {
    player.playableIds = player.slot === state.currentTurn ? player.hand.map((card) => card.id) : [];
  });
}

function startLocalGame() {
  localMode = true;
  clearInterval(poller);
  localNextId = 1;
  localDiscard = [];
  localDeck = buildLocalDeck();
  const p1 = createLocalPlayer(1, $("playerName").value.trim() || "Diego");
  const p2 = createLocalPlayer(2, "Mayla");
  drawLocalCards(p1, 3);
  drawLocalCards(p2, 3);
  state = {
    roomCode: "AMOR",
    phase: "playing",
    currentTurn: 1,
    youSlot: 1,
    deckCount: localDeck.length,
    discardCount: 0,
    players: [p1, p2],
    log: ["Modo celular activado: jueguen pasando el dispositivo con amor."]
  };
  updateLocalPlayable();
  render();
}

function localPlaySelected(discardOnly = false) {
  if (!state || !selectedCard) return;
  const player = state.players.find((item) => item.slot === state.currentTurn);
  const cardIndex = player.hand.findIndex((card) => card.id === selectedCard);
  if (cardIndex < 0) return;
  const [card] = player.hand.splice(cardIndex, 1);
  localDiscard.push(card);
  drawLocalCards(player, 1);
  state.log.push(discardOnly ? `${player.name} descarto una carta.` : `${player.name} jugo ${card.name}.`);
  state.currentTurn = state.currentTurn === 1 ? 2 : 1;
  state.youSlot = state.currentTurn;
  state.deckCount = localDeck.length;
  state.discardCount = localDiscard.length;
  selectedCard = null;
  updateLocalPlayable();
  render();
}

async function refresh() {
  if (!roomCode || !playerId) return;
  try {
    const res = await fetch(`/api/state?roomCode=${roomCode}&playerId=${playerId}`);
    const data = await res.json();
    if (res.ok) {
      state = data.state;
      render();
    }
  } catch {}
}

function startPolling() {
  clearInterval(poller);
  poller = setInterval(refresh, 900);
  refresh();
}

$("createRoom").addEventListener("click", async () => {
  if (location.protocol === "file:" || !["localhost", "127.0.0.1"].includes(location.hostname)) {
    startLocalGame();
    return;
  }
  try {
    const data = await api("/api/create", {
      name: $("playerName").value,
      virus2: $("virus2").checked,
      halloween: $("halloween").checked
    });
    roomCode = data.roomCode;
    playerId = data.playerId;
    localStorage.setItem("virusRoom", roomCode);
    localStorage.setItem("virusPlayer", playerId);
    $("lobbyMsg").textContent = `Sala creada: ${roomCode}. Comparte este codigo.`;
    state = data.state;
    startPolling();
  } catch (err) {
    toast(err.message);
  }
});

$("joinRoom").addEventListener("click", async () => {
  if (location.protocol === "file:" || !["localhost", "127.0.0.1"].includes(location.hostname)) {
    toast("En la version web publica usa Crear sala para modo celular.");
    return;
  }
  try {
    const data = await api("/api/join", { roomCode: $("roomInput").value.trim(), name: $("playerName").value });
    roomCode = data.roomCode;
    playerId = data.playerId;
    localStorage.setItem("virusRoom", roomCode);
    localStorage.setItem("virusPlayer", playerId);
    state = data.state;
    startPolling();
  } catch (err) {
    toast(err.message);
  }
});

$("startGame").addEventListener("click", async () => {
  if (localMode) {
    state.phase = "playing";
    render();
    return;
  }
  try {
    const data = await api("/api/start", { roomCode, playerId });
    state = data.state;
    render();
  } catch (err) {
    toast(err.message);
  }
});

$("playCard").addEventListener("click", async () => {
  if (localMode) {
    localPlaySelected(false);
    return;
  }
  try {
    const data = await api("/api/play", { roomCode, playerId, cardId: selectedCard });
    selectedCard = null;
    state = data.state;
    render();
  } catch (err) {
    toast(err.message);
  }
});

$("discardCard").addEventListener("click", async () => {
  if (localMode) {
    localPlaySelected(true);
    return;
  }
  try {
    const selectedEl = document.querySelector(".card.selected");
    if (selectedEl) selectedEl.classList.add("discarding");
    await new Promise((resolve) => setTimeout(resolve, selectedEl ? 260 : 0));
    const data = await api("/api/discard", { roomCode, playerId, cardId: selectedCard });
    selectedCard = null;
    state = data.state;
    render();
  } catch (err) {
    toast(err.message);
  }
});

if (location.protocol !== "file:" && ["localhost", "127.0.0.1"].includes(location.hostname) && roomCode && playerId) startPolling();
