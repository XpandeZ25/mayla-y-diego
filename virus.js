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
  try {
    const data = await api("/api/start", { roomCode, playerId });
    state = data.state;
    render();
  } catch (err) {
    toast(err.message);
  }
});

$("playCard").addEventListener("click", async () => {
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

if (roomCode && playerId) startPolling();
