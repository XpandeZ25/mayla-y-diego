const canvas = document.getElementById("universo");
const ctx = canvas.getContext("2d");
const poemaElemento = document.getElementById("poema");
const declaracionElemento = document.getElementById("declaracion");
const botonPoema = document.getElementById("botonPoema");
const tituloUniverso = document.getElementById("tituloUniverso");
const planetas = document.querySelectorAll(".planeta");
const ramoOverlay = document.getElementById("ramoOverlay");
const legoOverlay = document.getElementById("legoOverlay");
const venusOverlay = document.getElementById("venusOverlay");
const tierraOverlay = document.getElementById("tierraOverlay");
const saturnoOverlay = document.getElementById("saturnoOverlay");
const uranoOverlay = document.getElementById("uranoOverlay");
const neptunoOverlay = document.getElementById("neptunoOverlay");
const bigBangOverlay = document.getElementById("bigBangOverlay");
const retratosCosmicos = document.querySelectorAll(".retrato-cosmico");

const poemas = [
  "En la noche donde el silencio brilla,<br>tu risa despierta mi constelación;<br>cada estrella aprende tu orilla,<br>cada latido gira en tu dirección.",
  "Si la luna guardara secretos,<br>le pediría que esconda mi voz;<br>para decirte entre cielos completos<br>que mi destino empieza en los dos.",
  "Te vi y cambió la gravedad,<br>mi alma empezó a girar serena;<br>desde entonces toda la eternidad<br>lleva tu luz sobre la arena.",
  "No hay planeta tan lejano<br>que no alcance mi canción;<br>si me tomas de la mano,<br>se vuelve hogar la expansión.",
  "Eres aurora sobre mi invierno,<br>un sol pequeño en mi cristal;<br>contigo el tiempo parece eterno,<br>contigo el mundo aprende a amar.",
  "Entre meteoros y mares dorados,<br>te nombro bajito para no despertar;<br>los sueños que duermen enamorados<br>cuando tu mirada vuelve a brillar.",
  "Mi corazón, nave encendida,<br>cruza galaxias para encontrarte;<br>porque en el mapa de toda mi vida<br>siempre apareces como mi norte.",
  "Que el cielo firme esta promesa,<br>con polvo de astros sobre papel;<br>mi amor te busca, mi amor regresa,<br>mi amor se queda viviendo en tu piel.",
  "Si alguna estrella pierde su ruta,<br>yo le diré dónde está el fulgor;<br>en esa forma dulce y absoluta<br>con que tu nombre pronuncia amor.",
  "Bajo este universo de rosas y oro,<br>mi voz se vuelve constelación;<br>te amo en silencio, te amo en coro,<br>te amo en cada respiración."
];

const declaraciones = [
  "Si el cielo tuviera que elegir su luz favorita, estoy seguro de que pronunciaría tu nombre.",
  "Eres el lugar al que mi corazón quiere volver, incluso cuando todo el universo se mueve.",
  "No necesito pedir deseos a las estrellas: desde que llegaste, el deseo más bonito camina conmigo.",
  "Amarte es sentir que cada día tiene una órbita nueva, más cálida, más nuestra.",
  "Quiero ser la calma que te abrace y la chispa que te recuerde lo inmenso que eres para mí.",
  "Mi universo no empezó con una explosión, empezó con una mirada tuya.",
  "Si pudiera guardar una galaxia en mis manos, la llenaría con momentos contigo.",
  "Te elijo en esta vida, en este cielo y en cualquier constelación donde vuelva a encontrarte."
];

const paletaFlores = [
  ["#ff3f87", "#ffd4e2"],
  ["#df1f43", "#ff96aa"],
  ["#ffa51f", "#fff0a4"],
  ["#8d6bff", "#ddd4ff"],
  ["#ff6b2f", "#ffd0a1"],
  ["#d72a84", "#ffb3d8"],
  ["#b51648", "#ff8dae"]
];

const mensajesPlaneta = {
  SOL: "El SOL se queda al centro para alumbrar todo lo nuestro.",
  MERCURIO: "MERCURIO trae el primer brillo de este universo.",
  VENUS: "VENUS guarda la dulzura de todo lo que siento.",
  TIERRA: "Desde la TIERRA, todo florece cuando estás cerca.",
  MARTE: "MARTE te manda flores valientes, rojas y eternas.",
  JÚPITER: "JÚPITER guardó sus colores más grandes para ti.",
  SATURNO: "SATURNO rodea este amor con anillos de promesas.",
  URANO: "URANO enciende un azul tranquilo para cuidarte.",
  NEPTUNO: "NEPTUNO trae flores suaves como una promesa azul.",
  DIERIKA: "DIERIKA existe solo para guardar lo nuestro."
};

const frasesRamo = [
  "Para Mayla...",
  "Si pudiera arrancarle al cielo cada estrella fugaz,",
  "las pondría a tus pies una por una,",
  "para que nunca dudes que mi amor por ti no cabe en este universo."
];

let ancho = 0;
let alto = 0;
let estrellas = [];
let indicePoema = 0;
let indiceDeclaracion = 0;
let temporizadoresRamo = [];
let temporizadoresLego = [];
let temporizadoresVenus = [];
let temporizadoresTierra = [];
let temporizadoresSaturno = [];
let temporizadoresUrano = [];
let temporizadoresNeptuno = [];
let temporizadoresBigBang = [];

const cometa = {
  x: 0,
  y: 0,
  speed: 5.2,
  radio: 4,
  cola: []
};

function ajustarCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  ancho = window.innerWidth;
  alto = window.innerHeight;
  canvas.width = Math.floor(ancho * ratio);
  canvas.height = Math.floor(alto * ratio);
  canvas.style.width = `${ancho}px`;
  canvas.style.height = `${alto}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  crearEstrellas();
  reiniciarCometa();
}

function crearEstrellas() {
  estrellas = Array.from({ length: 280 }, () => ({
    x: Math.random() * ancho,
    y: Math.random() * alto,
    radio: Math.random() * 1.8 + 0.35,
    brillo: Math.random() * 0.8 + 0.2,
    pulso: Math.random() * Math.PI * 2,
    velocidad: Math.random() * 0.035 + 0.012,
    tono: Math.random() > 0.72 ? "255, 211, 106" : Math.random() > 0.45 ? "255, 126, 182" : "255, 248, 232"
  }));
}

function reiniciarCometa() {
  cometa.x = -80 - Math.random() * 180;
  cometa.y = Math.random() * alto * 0.45 + 20;
  cometa.speed = 4.6 + Math.random() * 2.4;
  cometa.cola = [];
}

function dibujarEstrellas() {
  for (const estrella of estrellas) {
    estrella.pulso += estrella.velocidad;
    const alpha = estrella.brillo * (0.45 + Math.sin(estrella.pulso) * 0.35 + 0.35);

    ctx.beginPath();
    ctx.fillStyle = `rgba(${estrella.tono}, ${Math.max(0.08, alpha)})`;
    ctx.shadowColor = `rgba(${estrella.tono}, ${alpha})`;
    ctx.shadowBlur = 10 + estrella.radio * 6;
    ctx.arc(estrella.x, estrella.y, estrella.radio, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function dibujarCometa() {
  cometa.x += cometa.speed;
  cometa.y += cometa.speed * 0.33;
  cometa.cola.unshift({ x: cometa.x, y: cometa.y });

  if (cometa.cola.length > 42) {
    cometa.cola.pop();
  }

  for (let i = cometa.cola.length - 1; i >= 0; i -= 1) {
    const punto = cometa.cola[i];
    const alpha = 1 - i / cometa.cola.length;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 174, 198, ${alpha * 0.46})`;
    ctx.shadowColor = `rgba(255, 211, 106, ${alpha * 0.72})`;
    ctx.shadowBlur = 18;
    ctx.arc(punto.x - i * 1.5, punto.y - i * 0.62, Math.max(0.6, cometa.radio * alpha), 0, Math.PI * 2);
    ctx.fill();
  }

  const gradiente = ctx.createRadialGradient(cometa.x, cometa.y, 0, cometa.x, cometa.y, 24);
  gradiente.addColorStop(0, "rgba(255, 255, 246, 1)");
  gradiente.addColorStop(0.38, "rgba(255, 211, 106, 0.9)");
  gradiente.addColorStop(1, "rgba(255, 126, 182, 0)");

  ctx.beginPath();
  ctx.fillStyle = gradiente;
  ctx.shadowColor = "rgba(255, 211, 106, 0.95)";
  ctx.shadowBlur = 26;
  ctx.arc(cometa.x, cometa.y, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  if (cometa.x > ancho + 120 || cometa.y > alto + 120) {
    reiniciarCometa();
  }
}

function animarUniverso() {
  ctx.clearRect(0, 0, ancho, alto);
  dibujarEstrellas();
  dibujarCometa();
  requestAnimationFrame(animarUniverso);
}

function cambiarContenido() {
  indicePoema = (indicePoema + 1) % poemas.length;
  indiceDeclaracion = (indiceDeclaracion + 1) % declaraciones.length;

  poemaElemento.classList.add("cambiando");
  declaracionElemento.classList.add("cambiando");

  window.setTimeout(() => {
    poemaElemento.innerHTML = poemas[indicePoema];
    declaracionElemento.textContent = declaraciones[indiceDeclaracion];
    poemaElemento.classList.remove("cambiando");
    declaracionElemento.classList.remove("cambiando");
  }, 230);
}

function limpiarRamo() {
  temporizadoresRamo.forEach((id) => window.clearTimeout(id));
  temporizadoresRamo = [];
  ramoOverlay.className = "ramo-overlay";
  ramoOverlay.innerHTML = "";
  ramoOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("ramo-activo");
}

function limpiarLego() {
  temporizadoresLego.forEach((id) => window.clearTimeout(id));
  temporizadoresLego = [];
  legoOverlay.className = "lego-overlay";
  legoOverlay.innerHTML = "";
  legoOverlay.setAttribute("aria-hidden", "true");
}

function limpiarVenus() {
  temporizadoresVenus.forEach((id) => window.clearTimeout(id));
  temporizadoresVenus = [];
  venusOverlay.className = "venus-overlay";
  venusOverlay.innerHTML = "";
  venusOverlay.setAttribute("aria-hidden", "true");
}

function limpiarTierra() {
  temporizadoresTierra.forEach((id) => window.clearTimeout(id));
  temporizadoresTierra = [];
  tierraOverlay.className = "tierra-overlay";
  tierraOverlay.innerHTML = "";
  tierraOverlay.setAttribute("aria-hidden", "true");
}

function limpiarSaturno() {
  temporizadoresSaturno.forEach((id) => window.clearTimeout(id));
  temporizadoresSaturno = [];
  saturnoOverlay.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  });
  saturnoOverlay.className = "saturno-overlay";
  saturnoOverlay.innerHTML = "";
  saturnoOverlay.setAttribute("aria-hidden", "true");
}

function limpiarUrano() {
  temporizadoresUrano.forEach((id) => window.clearTimeout(id));
  temporizadoresUrano = [];
  uranoOverlay.className = "urano-overlay";
  uranoOverlay.innerHTML = "";
  uranoOverlay.setAttribute("aria-hidden", "true");
}

function limpiarNeptuno() {
  temporizadoresNeptuno.forEach((id) => window.clearTimeout(id));
  temporizadoresNeptuno = [];
  neptunoOverlay.className = "neptuno-overlay";
  neptunoOverlay.innerHTML = "";
  neptunoOverlay.setAttribute("aria-hidden", "true");
}

function limpiarBigBang() {
  temporizadoresBigBang.forEach((id) => window.clearTimeout(id));
  temporizadoresBigBang = [];
  bigBangOverlay.className = "bigbang-overlay";
  bigBangOverlay.innerHTML = "";
  bigBangOverlay.setAttribute("aria-hidden", "true");
}

function cambiarTextoBigBang(elemento, texto, demora) {
  temporizadoresBigBang.push(window.setTimeout(() => {
    elemento.classList.add("cambiando-frase");
    temporizadoresBigBang.push(window.setTimeout(() => {
      elemento.innerHTML = texto;
      elemento.classList.remove("cambiando-frase");
      elemento.classList.add("visible");
    }, 360));
  }, demora));
}

function crearBigBangUniverso() {
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarSaturno();
  limpiarTierra();
  limpiarVenus();
  limpiarLego();
  limpiarRamo();
  bigBangOverlay.setAttribute("aria-hidden", "false");

  const escena = document.createElement("div");
  const cosmos = document.createElement("div");
  const retratos = document.createElement("div");
  const mayla = document.createElement("img");
  const diego = document.createElement("img");
  const universo = document.createElement("div");
  const frase = document.createElement("div");
  const final = document.createElement("div");

  escena.className = "bigbang-escena";
  cosmos.className = "bigbang-cosmos";
  retratos.className = "bigbang-retratos";
  mayla.className = "bigbang-foto mayla";
  diego.className = "bigbang-foto diego";
  universo.className = "bigbang-universo";
  frase.className = "bigbang-frase";
  final.className = "bigbang-final";
  mayla.src = "media/saturno/mayla.jpg";
  mayla.alt = "Mayla";
  diego.src = "media/saturno/diego.jpg";
  diego.alt = "Diego";
  frase.innerHTML = "Dos miradas viajando desde mundos distintos...";

  for (let i = 0; i < 96; i += 1) {
    const chispa = document.createElement("span");
    chispa.className = "bigbang-chispa";
    const angulo = (Math.PI * 2 * i) / 96;
    const distancia = 110 + Math.random() * 430;
    chispa.style.setProperty("--x", `${Math.cos(angulo) * distancia}px`);
    chispa.style.setProperty("--y", `${Math.sin(angulo) * distancia * 0.74}px`);
    chispa.style.setProperty("--delay", `${0.8 + Math.random() * 0.7}s`);
    universo.appendChild(chispa);
  }

  for (let i = 0; i < 9; i += 1) {
    const planeta = document.createElement("span");
    planeta.className = `bigbang-planeta p${i + 1}`;
    universo.appendChild(planeta);
  }

  final.innerHTML = `
    <div class="bigbang-final-fotos">
      <img src="media/saturno/mayla.jpg" alt="Mayla">
      <img src="media/saturno/diego.jpg" alt="Diego">
    </div>
    <strong>Este es nuestro universo</strong>
    <span>Mi teor&iacute;a del universo es ser parte de tu todo.</span>
  `;

  retratos.append(mayla, diego);
  escena.append(cosmos, universo, retratos, frase, final);
  bigBangOverlay.appendChild(escena);

  requestAnimationFrame(() => {
    bigBangOverlay.classList.add("visible");
    frase.classList.add("visible");
  });

  cambiarTextoBigBang(frase, "Y cuando chocaron, no hubo destrucci&oacute;n:<br>hubo luz, hubo destino, hubo nosotros.", 5200);
  cambiarTextoBigBang(frase, "Este es nuestro universo,<br>cada planeta conquistado hasta ahora y todo lo que nos falta.", 10800);
  cambiarTextoBigBang(frase, "Mi teor&iacute;a del universo es sencilla:<br>ser parte de tu todo, y que t&uacute; seas mi infinito.", 16800);
  cambiarTextoBigBang(frase, "Cada planeta que conquistamos guarda una versi&oacute;n de nosotros:<br>m&aacute;s fuertes, m&aacute;s juntos, m&aacute;s enamorados.", 22800);
  cambiarTextoBigBang(frase, "No quiero mirar galaxias sin tu mano;<br>quiero descubrirlas contigo, una promesa a la vez.", 28600);
  cambiarTextoBigBang(frase, "Y si faltan mundos por crear,<br>los haremos nacer con amor, paciencia y fe.", 34400);
  temporizadoresBigBang.push(window.setTimeout(() => {
    escena.classList.add("bigbang-final-activo");
  }, 40200));

  temporizadoresBigBang.push(window.setTimeout(() => {
    bigBangOverlay.classList.add("saliendo");
  }, 52500));
  temporizadoresBigBang.push(window.setTimeout(limpiarBigBang, 53700));
}

function cambiarTextoNeptuno(elemento, texto, demora) {
  temporizadoresNeptuno.push(window.setTimeout(() => {
    elemento.classList.add("cambiando-frase");
    temporizadoresNeptuno.push(window.setTimeout(() => {
      elemento.innerHTML = texto;
      elemento.classList.remove("cambiando-frase");
      elemento.classList.add("visible");
    }, 360));
  }, demora));
}

function crearPersonaNeptuno(clase) {
  const persona = document.createElement("span");
  persona.className = `neptuno-persona ${clase}`;
  persona.innerHTML = '<span class="neptuno-brazo"></span><span class="neptuno-pierna a"></span><span class="neptuno-pierna b"></span>';
  return persona;
}

function crearEscenaNeptuno() {
  limpiarNeptuno();
  limpiarBigBang();
  limpiarUrano();
  limpiarSaturno();
  limpiarTierra();
  limpiarVenus();
  limpiarLego();
  limpiarRamo();
  neptunoOverlay.setAttribute("aria-hidden", "false");

  const escena = document.createElement("div");
  const cielo = document.createElement("div");
  const frase = document.createElement("div");
  const camino = document.createElement("div");
  const pareja = document.createElement("div");
  const planetasSueno = document.createElement("div");
  const jardin = document.createElement("div");
  const final = document.createElement("div");

  escena.className = "neptuno-escena";
  cielo.className = "neptuno-cielo";
  frase.className = "neptuno-frase";
  camino.className = "neptuno-camino";
  pareja.className = "neptuno-pareja";
  planetasSueno.className = "neptuno-planetas";
  jardin.className = "neptuno-jardin";
  final.className = "neptuno-final";
  frase.innerHTML = "Tenemos m&aacute;s planetas para conquistar...";

  for (let i = 0; i < 46; i += 1) {
    const rosa = document.createElement("span");
    rosa.className = "neptuno-rosa";
    rosa.style.setProperty("--x", `${Math.random() * 100}%`);
    rosa.style.setProperty("--delay", `${Math.random() * 5.4}s`);
    rosa.style.setProperty("--duracion", `${7 + Math.random() * 5}s`);
    rosa.style.setProperty("--giro", `${120 + Math.random() * 420}deg`);
    cielo.appendChild(rosa);
  }

  for (let i = 0; i < 20; i += 1) {
    const flor = document.createElement("span");
    flor.className = "neptuno-flor";
    flor.style.setProperty("--x", `${5 + i * 4.8}%`);
    flor.style.setProperty("--delay", `${1.6 + i * 0.16}s`);
    jardin.appendChild(flor);
  }

  for (let i = 0; i < 5; i += 1) {
    const planeta = document.createElement("span");
    planeta.className = `neptuno-planeta p${i + 1}`;
    planetasSueno.appendChild(planeta);
  }

  pareja.append(crearPersonaNeptuno("uno"), crearPersonaNeptuno("dos"), document.createElement("span"));
  pareja.lastElementChild.className = "neptuno-corazon";
  final.innerHTML = "<strong>Diego & Mayla</strong><span>Con Dios, con fe y con amor, seguiremos conquistando nuestro universo.</span>";

  escena.append(cielo, camino, planetasSueno, jardin, pareja, frase, final);
  neptunoOverlay.appendChild(escena);

  requestAnimationFrame(() => {
    neptunoOverlay.classList.add("visible");
    frase.classList.add("visible");
  });

  cambiarTextoNeptuno(frase, "No es hora de caer, mi amor;<br>es hora de levantarnos con m&aacute;s fe.", 5200);
  cambiarTextoNeptuno(frase, "Todav&iacute;a tenemos planetas por conquistar,<br>sue&ntilde;os que sembrar y aventuras que escribir.", 10800);
  cambiarTextoNeptuno(frase, "Si un d&iacute;a pesa el camino,<br>yo tomar&eacute; tu mano y recordaremos que Dios camina con nosotros.", 17000);
  cambiarTextoNeptuno(frase, "Seguiremos am&aacute;ndonos juntos,<br>conquistando nuestro universo, flor por flor, estrella por estrella.", 23800);
  temporizadoresNeptuno.push(window.setTimeout(() => {
    escena.classList.add("neptuno-final-activo");
  }, 31800));

  temporizadoresNeptuno.push(window.setTimeout(() => {
    neptunoOverlay.classList.add("saliendo");
  }, 42000));
  temporizadoresNeptuno.push(window.setTimeout(limpiarNeptuno, 43200));
}

function cambiarTextoUrano(elemento, texto, demora) {
  temporizadoresUrano.push(window.setTimeout(() => {
    elemento.classList.add("cambiando-frase");
    temporizadoresUrano.push(window.setTimeout(() => {
      elemento.innerHTML = texto;
      elemento.classList.remove("cambiando-frase");
      elemento.classList.add("visible");
    }, 360));
  }, demora));
}

function activarSuenoUrano(escena, clase, demora) {
  temporizadoresUrano.push(window.setTimeout(() => {
    escena.className = `urano-escena ${clase}`;
  }, demora));
}

function crearEscenaUrano() {
  limpiarUrano();
  limpiarBigBang();
  limpiarNeptuno();
  limpiarSaturno();
  limpiarTierra();
  limpiarVenus();
  limpiarLego();
  limpiarRamo();
  uranoOverlay.setAttribute("aria-hidden", "false");

  const escena = document.createElement("div");
  const cielo = document.createElement("div");
  const frase = document.createElement("div");
  const casa = document.createElement("div");
  const tracto = document.createElement("div");
  const fabrica = document.createElement("div");
  const xpandez = document.createElement("div");
  const parejaCasa = document.createElement("div");
  const parejaTracto = document.createElement("div");
  const parejaTrabajo = document.createElement("div");
  const final = document.createElement("div");

  escena.className = "urano-escena casa-activa";
  cielo.className = "urano-cielo";
  frase.className = "urano-frase";
  casa.className = "urano-casa";
  tracto.className = "urano-tracto";
  fabrica.className = "urano-fabrica";
  xpandez.className = "urano-xpandez";
  parejaCasa.className = "urano-pareja casa";
  parejaTracto.className = "urano-pareja tracto";
  parejaTrabajo.className = "urano-pareja trabajo";
  final.className = "urano-final";
  frase.innerHTML = "En Urano guardamos los sue&ntilde;os que Dios est&aacute; preparando para nosotros.";

  for (let i = 0; i < 60; i += 1) {
    const estrella = document.createElement("span");
    estrella.className = "urano-estrella";
    estrella.style.setProperty("--x", `${Math.random() * 100}%`);
    estrella.style.setProperty("--y", `${Math.random() * 82}%`);
    estrella.style.setProperty("--delay", `${Math.random() * 3}s`);
    cielo.appendChild(estrella);
  }

  casa.innerHTML = `
    <span class="urano-sol"></span>
    <span class="urano-hogar-base"></span>
    <span class="urano-hogar-techo"></span>
    <span class="urano-hogar-puerta"></span>
    <span class="urano-hogar-ventana"></span>
    <span class="urano-jardin"></span>
  `;

  parejaCasa.innerHTML = `
    <span class="urano-persona uno besa"></span>
    <span class="urano-persona dos besa"></span>
    <span class="urano-corazon"></span>
  `;

  tracto.innerHTML = `
    <span class="tracto-cabeza"></span>
    <span class="tracto-ventana"></span>
    <span class="tracto-rueda a"></span>
    <span class="tracto-rueda b"></span>
    <span class="tracto-luz"></span>
  `;

  parejaTracto.innerHTML = `
    <span class="urano-persona uno saludo"></span>
    <span class="urano-persona dos saludo"></span>
  `;

  fabrica.innerHTML = `
    <span class="fabrica-edificio"></span>
    <span class="fabrica-chimenea una"></span>
    <span class="fabrica-chimenea dos"></span>
    <span class="fabrica-caja uno">Pañales</span>
    <span class="fabrica-caja dos">Higecos</span>
    <span class="fabrica-engranaje"></span>
  `;

  xpandez.innerHTML = `
    <span class="xpandez-pantalla">
      <strong>XpandeZ</strong>
      <i></i><i></i><i></i>
    </span>
    <span class="xpandez-laptop"></span>
    <span class="xpandez-brillo"></span>
  `;

  parejaTrabajo.innerHTML = `
    <span class="urano-persona uno"></span>
    <span class="urano-persona dos"></span>
  `;

  final.innerHTML = `
    <strong>Diego & Mayla</strong>
    <span>Tenemos m&aacute;s sue&ntilde;os que cumplir. Trazar el camino no ser&aacute; f&aacute;cil, pero con Dios, t&uacute; a mi lado y yo al tuyo, lo lograremos.</span>
  `;

  escena.append(cielo, casa, tracto, fabrica, xpandez, parejaCasa, parejaTracto, parejaTrabajo, frase, final);
  uranoOverlay.appendChild(escena);

  requestAnimationFrame(() => {
    uranoOverlay.classList.add("visible");
    frase.classList.add("visible");
  });

  cambiarTextoUrano(frase, "Primero sue&ntilde;o una casa hermosa,<br>con risas en la sala y nosotros abraz&aacute;ndonos como hogar.", 4200);
  activarSuenoUrano(escena, "tracto-activo", 9800);
  cambiarTextoUrano(frase, "Despu&eacute;s te imagino llegando feliz en la cabeza de un tracto,<br>saludando desde la ventana como si el mundo fuera nuestro camino.", 10400);
  activarSuenoUrano(escena, "fabrica-activa", 16600);
  cambiarTextoUrano(frase, "Luego nos veo construyendo una empresa juntos,<br>levantando pa&ntilde;ales Higecos con fe, trabajo y bendici&oacute;n.", 17200);
  activarSuenoUrano(escena, "xpandez-activo", 23800);
  cambiarTextoUrano(frase, "Y tambi&eacute;n veo nacer XpandeZ,<br>nuestra empresa de dise&ntilde;o web, hecha con ideas, amor y valent&iacute;a.", 24400);
  activarSuenoUrano(escena, "final-activo", 31200);
  cambiarTextoUrano(frase, "Con Dios, t&uacute; y yo vamos a cumplir nuestros sue&ntilde;os,<br>uno por uno, sin soltar la mano.", 31800);

  temporizadoresUrano.push(window.setTimeout(() => {
    uranoOverlay.classList.add("saliendo");
  }, 43000));
  temporizadoresUrano.push(window.setTimeout(limpiarUrano, 44200));
}

function cambiarTextoSaturno(elemento, texto, demora) {
  temporizadoresSaturno.push(window.setTimeout(() => {
    elemento.classList.add("cambiando-frase");
    temporizadoresSaturno.push(window.setTimeout(() => {
      elemento.innerHTML = texto;
      elemento.classList.remove("cambiando-frase");
      elemento.classList.add("visible");
    }, 340));
  }, demora));
}

function crearAstronautaSaturno(nombre, foto, clase) {
  const astronauta = document.createElement("div");
  astronauta.className = `saturno-astronauta ${clase}`;
  astronauta.innerHTML = `
    <span class="saturno-casco">
      <img src="${foto}" alt="Rostro de ${nombre}">
      <span class="saturno-reflejo"></span>
    </span>
    <span class="saturno-cuerpo"></span>
    <span class="saturno-brazo saludo"></span>
    <span class="saturno-brazo quieto"></span>
    <span class="saturno-pierna una"></span>
    <span class="saturno-pierna dos"></span>
    <strong>${nombre}</strong>
  `;
  return astronauta;
}

function crearEscenaSaturno() {
  limpiarSaturno();
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarTierra();
  limpiarVenus();
  limpiarLego();
  limpiarRamo();
  saturnoOverlay.setAttribute("aria-hidden", "false");

  const escena = document.createElement("div");
  const vortex = document.createElement("div");
  const anilloUno = document.createElement("span");
  const anilloDos = document.createElement("span");
  const anilloTres = document.createElement("span");
  const pareja = document.createElement("div");
  const frase = document.createElement("div");
  const videos = document.createElement("div");
  const videoPrincipal = document.createElement("video");
  const videoEco = document.createElement("video");

  escena.className = "saturno-escena";
  vortex.className = "saturno-vortex";
  anilloUno.className = "saturno-anillo uno";
  anilloDos.className = "saturno-anillo dos";
  anilloTres.className = "saturno-anillo tres";
  pareja.className = "saturno-pareja";
  frase.className = "saturno-frase";
  videos.className = "saturno-videos";
  frase.textContent = "Saturno nos mira girar entre promesas...";

  [videoPrincipal, videoEco].forEach((video, index) => {
    video.src = "media/saturno/saturno-recuerdo.mp4";
    video.autoplay = true;
    video.muted = index !== 0;
    video.volume = index === 0 ? 1 : 0;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.className = index === 0 ? "saturno-video principal" : "saturno-video eco";
  });

  for (let i = 0; i < 72; i += 1) {
    const estrella = document.createElement("span");
    estrella.className = "saturno-estrella";
    estrella.style.setProperty("--x", `${Math.random() * 100}%`);
    estrella.style.setProperty("--y", `${Math.random() * 100}%`);
    estrella.style.setProperty("--delay", `${Math.random() * 3.2}s`);
    escena.appendChild(estrella);
  }

  pareja.append(
    crearAstronautaSaturno("Mayla", "media/saturno/mayla.jpg", "mayla"),
    crearAstronautaSaturno("Diego", "media/saturno/diego.jpg", "diego")
  );
  vortex.append(anilloUno, anilloDos, anilloTres);
  videos.append(videoPrincipal, videoEco);
  escena.append(vortex, pareja, frase, videos);
  saturnoOverlay.appendChild(escena);

  requestAnimationFrame(() => {
    saturnoOverlay.classList.add("visible");
    frase.classList.add("visible");
  });

  videoPrincipal.play().catch(() => {});
  videoEco.play().catch(() => {});

  cambiarTextoSaturno(frase, "Dos astronautas perdidos frente al infinito,<br>pero encontrados cuando se miran.", 4600);
  cambiarTextoSaturno(frase, "Si el universo fuera un agujero negro,<br>yo igual elegir&iacute;a caer contigo.", 9400);
  cambiarTextoSaturno(frase, "Porque hasta donde la luz desaparece,<br>tu rostro sigue siendo mi forma favorita de volver.", 14600);
  cambiarTextoSaturno(frase, "Diego & Mayla: orbitando bonito,<br>saludando al destino desde el mismo amor.", 20200);

  temporizadoresSaturno.push(window.setTimeout(() => {
    saturnoOverlay.classList.add("saliendo");
  }, 32200));
  temporizadoresSaturno.push(window.setTimeout(limpiarSaturno, 33400));
}

function cambiarTextoTierra(elemento, texto, demora) {
  temporizadoresTierra.push(window.setTimeout(() => {
    elemento.classList.add("cambiando-frase");
    temporizadoresTierra.push(window.setTimeout(() => {
      elemento.textContent = texto;
      elemento.classList.remove("cambiando-frase");
      elemento.classList.add("visible");
    }, 320));
  }, demora));
}

function mostrarFinalTierra(escena) {
  const final = document.createElement("div");
  final.className = "tierra-final";
  final.innerHTML = "<strong>Diego & Mayla</strong>";
  escena.appendChild(final);
}

function crearEscenaTierra() {
  limpiarTierra();
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarSaturno();
  limpiarVenus();
  limpiarLego();
  limpiarRamo();
  tierraOverlay.setAttribute("aria-hidden", "false");

  const escena = document.createElement("div");
  const nubeUno = document.createElement("span");
  const nubeDos = document.createElement("span");
  const casa = document.createElement("div");
  const jardin = document.createElement("div");
  const pareja = document.createElement("div");
  const frase = document.createElement("div");
  const colores = ["#ff7eb6", "#ffd36a", "#8ed8ff", "#ff9b86", "#b99cff"];

  escena.className = "tierra-escena";
  nubeUno.className = "tierra-nube uno";
  nubeDos.className = "tierra-nube dos";
  casa.className = "tierra-casa";
  jardin.className = "tierra-jardin";
  pareja.className = "tierra-pareja";
  frase.className = "tierra-frase";
  frase.textContent = "Este es el planeta donde Diosito nos puso a sembrar un hogar...";

  casa.innerHTML = `
    <span class="casa-parte casa-base"></span>
    <span class="casa-parte casa-techo"></span>
    <span class="casa-parte casa-puerta"></span>
    <span class="casa-parte casa-ventana izq"></span>
    <span class="casa-parte casa-ventana der"></span>
  `;

  pareja.innerHTML = `
    <span class="trabajador uno"><span class="herramienta"></span></span>
    <span class="trabajador dos"><span class="herramienta"></span></span>
  `;

  for (let i = 0; i < 26; i += 1) {
    const flor = document.createElement("span");
    flor.className = "tierra-flor";
    flor.style.setProperty("--x", `${4 + i * 3.7}%`);
    flor.style.setProperty("--color", colores[i % colores.length]);
    flor.style.animationDelay = `${3200 + i * 130}ms`;
    jardin.appendChild(flor);
  }

  escena.append(nubeUno, nubeDos, casa, jardin, pareja, frase);
  tierraOverlay.appendChild(escena);

  requestAnimationFrame(() => {
    tierraOverlay.classList.add("visible");
    frase.classList.add("visible");
  });

  cambiarTextoTierra(frase, "Este es el planeta donde Diosito decidió que construyamos nuestro hogar.", 5200);
  cambiarTextoTierra(frase, "Un hogar con paciencia, con fe, con jardín, con familia y con amor del bueno.", 9800);
  cambiarTextoTierra(frase, "Y aunque vengan bajones, dudas o días pesados, no caminaremos separados.", 15000);
  cambiarTextoTierra(frase, "Porque si Diosito cruzó nuestros caminos, también nos bendecirá para levantarlo todo juntos.", 20800);
  temporizadoresTierra.push(window.setTimeout(() => mostrarFinalTierra(escena), 26800));

  temporizadoresTierra.push(window.setTimeout(() => {
    tierraOverlay.classList.add("saliendo");
  }, 35000));
  temporizadoresTierra.push(window.setTimeout(limpiarTierra, 36000));
}

function cambiarTextoVenus(elemento, texto, demora) {
  temporizadoresVenus.push(window.setTimeout(() => {
    elemento.classList.add("cambiando-frase");
    temporizadoresVenus.push(window.setTimeout(() => {
      elemento.textContent = texto;
      elemento.classList.remove("cambiando-frase");
      elemento.classList.add("visible");
    }, 320));
  }, demora));
}

function crearPersonaVenus(clase, conCabello = false) {
  const persona = document.createElement("div");
  persona.className = `venus-persona ${clase}`;
  persona.innerHTML = `${conCabello ? '<span class="venus-cabello"></span>' : ""}<span class="venus-brazo"></span><span class="venus-pierna a"></span><span class="venus-pierna b"></span>`;
  return persona;
}

function crearEscenaVenus() {
  limpiarVenus();
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarSaturno();
  limpiarRamo();
  limpiarLego();
  venusOverlay.setAttribute("aria-hidden", "false");

  const escena = document.createElement("div");
  const mar = document.createElement("div");
  const luz = document.createElement("div");
  const reloj = document.createElement("div");
  const pareja = document.createElement("div");
  const corazon = document.createElement("div");
  const frase = document.createElement("div");

  escena.className = "venus-escena";
  mar.className = "venus-mar";
  luz.className = "venus-luz-tiempo";
  reloj.className = "venus-reloj";
  pareja.className = "venus-pareja";
  corazon.className = "venus-corazon";
  frase.className = "venus-frase";
  frase.textContent = "Desde la primera vez que te vi...";

  pareja.append(crearPersonaVenus("venus-chico"), crearPersonaVenus("venus-chica", true), corazon);
  escena.append(mar, luz, reloj, pareja, frase);
  venusOverlay.appendChild(escena);
  requestAnimationFrame(() => {
    venusOverlay.classList.add("visible");
    frase.classList.add("visible");
  });

  cambiarTextoVenus(frase, "Desde la primera vez que te vi, mi tiempo se detuvo.", 5200);
  cambiarTextoVenus(frase, "No fue solo una mirada: nuestras almas se reconocieron.", 9800);
  cambiarTextoVenus(frase, "Y desde ese instante, algo en el universo entendió que debíamos encontrarnos.", 14500);
  cambiarTextoVenus(frase, "Porque hay amores que no empiezan en esta vida: solo regresan a casa.", 19800);

  temporizadoresVenus.push(window.setTimeout(() => {
    venusOverlay.classList.add("saliendo");
  }, 28500));
  temporizadoresVenus.push(window.setTimeout(limpiarVenus, 29500));
}

function crearBloqueLego(escena, x, y, w, h, color, demora) {
  const bloque = document.createElement("span");
  bloque.className = "lego-bloque";
  bloque.style.setProperty("--x", `${x}px`);
  bloque.style.setProperty("--y", `${y}px`);
  bloque.style.setProperty("--w", `${w}px`);
  bloque.style.setProperty("--h", `${h}px`);
  bloque.style.setProperty("--color", color);
  bloque.style.animationDelay = `${demora}ms`;
  escena.appendChild(bloque);
}

function crearSilueta(clase) {
  const silueta = document.createElement("span");
  silueta.className = `silueta ${clase}`;
  silueta.innerHTML = '<span class="brazo"></span><span class="pierna a"></span><span class="pierna b"></span>';
  return silueta;
}

function cambiarTextoLego(elemento, texto, demora) {
  temporizadoresLego.push(window.setTimeout(() => {
    elemento.classList.add("cambiando-frase");
    temporizadoresLego.push(window.setTimeout(() => {
      elemento.innerHTML = texto;
      elemento.classList.remove("cambiando-frase");
    }, 260));
  }, demora));
}

function mostrarFinalLego(escena) {
  const final = document.createElement("div");
  final.className = "lego-final";
  final.innerHTML = "<strong>Diego & Mayla</strong>";
  escena.appendChild(final);
}

function crearCastilloMercurio() {
  limpiarLego();
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarSaturno();
  limpiarRamo();
  legoOverlay.setAttribute("aria-hidden", "false");

  const cielo = document.createElement("div");
  const escena = document.createElement("div");
  const castillo = document.createElement("div");
  const suelo = document.createElement("div");
  const bandera = document.createElement("span");
  const pareja = document.createElement("div");
  const mensaje = document.createElement("div");
  const poema = document.createElement("div");
  const colores = ["#ff7eb6", "#ffd36a", "#8ed8ff", "#b99cff", "#ff9b86", "#fff1a6"];

  cielo.className = "lego-cielo";
  escena.className = "lego-escena";
  castillo.className = "lego-castillo";
  suelo.className = "lego-suelo";
  bandera.className = "lego-bandera";
  pareja.className = "lego-pareja";
  mensaje.className = "lego-mensaje";
  poema.className = "lego-poema";
  mensaje.textContent = "Nuestros caminos se cruzaron...";
  poema.innerHTML = "No fue casualidad encontrarte en medio del cielo,<br>fue el universo acercando mi alma a la tuya.";

  for (let i = 0; i < 34; i += 1) {
    const estrella = document.createElement("span");
    estrella.className = "lego-estrella";
    estrella.style.setProperty("--x", `${4 + Math.random() * 92}%`);
    estrella.style.setProperty("--y", `${5 + Math.random() * 70}%`);
    estrella.style.animationDelay = `${Math.random() * 1.8}s`;
    escena.appendChild(estrella);
  }

  legoOverlay.append(cielo, escena);
  escena.append(suelo, castillo, pareja, mensaje, poema);
  castillo.appendChild(bandera);
  pareja.append(crearSilueta("uno"), crearSilueta("dos"));

  const bloques = [
    [-180, 0, 72, 30], [-108, 0, 72, 30], [-36, 0, 72, 30], [36, 0, 72, 30], [108, 0, 72, 30], [180, 0, 72, 30],
    [-144, 30, 72, 30], [-72, 30, 72, 30], [0, 30, 72, 30], [72, 30, 72, 30], [144, 30, 72, 30],
    [-180, 60, 72, 30], [-108, 60, 72, 30], [-36, 60, 72, 30], [36, 60, 72, 30], [108, 60, 72, 30], [180, 60, 72, 30],
    [-190, 90, 58, 30], [-132, 90, 58, 30], [132, 90, 58, 30], [190, 90, 58, 30],
    [-190, 120, 58, 30], [-132, 120, 58, 30], [132, 120, 58, 30], [190, 120, 58, 30],
    [-190, 150, 58, 30], [-132, 150, 58, 30], [-29, 90, 58, 30], [29, 90, 58, 30], [132, 150, 58, 30], [190, 150, 58, 30],
    [-190, 180, 58, 30], [-132, 180, 58, 30], [-58, 120, 58, 30], [0, 120, 58, 30], [58, 120, 58, 30], [132, 180, 58, 30], [190, 180, 58, 30],
    [-218, 210, 54, 30], [-164, 210, 54, 30], [-27, 150, 54, 30], [27, 150, 54, 30], [164, 210, 54, 30], [218, 210, 54, 30],
    [-218, 240, 54, 30], [-164, 240, 54, 30], [0, 180, 72, 30], [164, 240, 54, 30], [218, 240, 54, 30],
    [-190, 270, 92, 30], [0, 210, 92, 30], [190, 270, 92, 30]
  ];

  bloques.forEach((bloque, indice) => {
    const [x, y, w, h] = bloque;
    crearBloqueLego(castillo, x, y, w, h, colores[indice % colores.length], indice * 72);
  });

  requestAnimationFrame(() => legoOverlay.classList.add("visible"));

  cambiarTextoLego(mensaje, "Nuestros caminos se cruzaron para estar juntos,", 7200);
  cambiarTextoLego(mensaje, "en esta constelación o en otras.", 11500);
  cambiarTextoLego(poema, "No fue casualidad encontrarte en medio del cielo,<br>fue el universo acercando mi alma a la tuya.", 15800);
  cambiarTextoLego(poema, "Y si la vida nos cambia de tiempo, de mundo o de estrella,<br>yo volvería a buscar tu mano en cualquier constelación.", 21000);
  temporizadoresLego.push(window.setTimeout(() => mostrarFinalLego(escena), 27200));

  temporizadoresLego.push(window.setTimeout(() => {
    legoOverlay.classList.add("saliendo");
  }, 33500));
  temporizadoresLego.push(window.setTimeout(limpiarLego, 34500));
}

function crearFlor(indice, total) {
  const flor = document.createElement("div");
  const [color, color2] = paletaFlores[Math.floor(Math.random() * paletaFlores.length)];
  const anillo = indice / total;
  const angulo = indice * 137.5 * (Math.PI / 180);
  const radio = 62 + anillo * 310;
  const x = Math.cos(angulo) * radio * (0.96 + Math.random() * 0.18);
  const y = Math.sin(angulo) * radio * 0.58 - 92 + Math.random() * 30;
  const startX = x + (Math.random() - 0.5) * 330;
  const escala = 0.9 + Math.random() * 0.82;

  flor.className = "flor-ramo";
  flor.style.setProperty("--x", `${x}px`);
  flor.style.setProperty("--y", `${y}px`);
  flor.style.setProperty("--inicio-x", `${startX}px`);
  flor.style.setProperty("--inicio-y", `${-420 - Math.random() * 260}px`);
  flor.style.setProperty("--rot", `${Math.random() * 360}deg`);
  flor.style.setProperty("--escala", escala.toFixed(2));
  flor.style.setProperty("--color", color);
  flor.style.setProperty("--color2", color2);

  for (let i = 0; i < 6; i += 1) {
    flor.appendChild(document.createElement("span")).className = "petalo";
  }

  flor.appendChild(document.createElement("span")).className = "centro-flor";
  return flor;
}

function crearPetaloSuelto(escena) {
  const petalo = document.createElement("span");
  const [color] = paletaFlores[Math.floor(Math.random() * paletaFlores.length)];
  const x = (Math.random() - 0.5) * 620;
  const y = (Math.random() - 0.5) * 290 - 30;

  petalo.className = "petalo-suelto";
  petalo.style.setProperty("--x", `${x}px`);
  petalo.style.setProperty("--y", `${y}px`);
  petalo.style.setProperty("--caida", `${130 + Math.random() * 230}px`);
  petalo.style.setProperty("--giro", `${120 + Math.random() * 500}deg`);
  petalo.style.setProperty("--color", color);
  escena.appendChild(petalo);

  temporizadoresRamo.push(window.setTimeout(() => petalo.remove(), 3000));
}

function crearExplosion(escena) {
  for (let i = 0; i < 72; i += 1) {
    const chispa = document.createElement("span");
    const [color] = paletaFlores[i % paletaFlores.length];
    const angulo = (Math.PI * 2 * i) / 72;
    const distancia = 120 + Math.random() * 340;

    chispa.className = "chispazo-flor";
    chispa.style.setProperty("--x", `${Math.cos(angulo) * distancia}px`);
    chispa.style.setProperty("--y", `${Math.sin(angulo) * distancia * 0.76}px`);
    chispa.style.setProperty("--color", color);
    escena.appendChild(chispa);

    temporizadoresRamo.push(window.setTimeout(() => chispa.remove(), 950));
  }
}

function crearEstrellasFugaces(cielo) {
  for (let i = 0; i < 11; i += 1) {
    const fugaz = document.createElement("span");
    fugaz.className = "ramo-fugaz";
    fugaz.style.setProperty("--top", `${8 + Math.random() * 58}%`);
    fugaz.style.setProperty("--left", `${34 + Math.random() * 66}%`);
    fugaz.style.setProperty("--duracion", `${1.35 + Math.random() * 1.1}s`);
    fugaz.style.setProperty("--demora", `${Math.random() * 2.6}s`);
    cielo.appendChild(fugaz);
  }
}

function mostrarFinalNombres(escena) {
  const final = document.createElement("div");
  final.className = "ramo-final";
  final.innerHTML = "<strong>Diego & Mayla</strong>";
  escena.appendChild(final);
}

function mostrarFrasesConCalma(mensaje, planetaNombre) {
  const frases = [mensajesPlaneta[planetaNombre] || "Un ramo entero para decirte cuánto te amo.", ...frasesRamo];

  frases.forEach((frase, indice) => {
    temporizadoresRamo.push(window.setTimeout(() => {
      mensaje.classList.add("cambiando-frase");
      temporizadoresRamo.push(window.setTimeout(() => {
        mensaje.textContent = frase;
        mensaje.classList.remove("cambiando-frase");
      }, 260));
    }, indice * 2400));
  });
}

function crearRamoFlores(planetaNombre) {
  limpiarRamo();
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarSaturno();
  document.body.classList.add("ramo-activo");
  ramoOverlay.setAttribute("aria-hidden", "false");

  const cielo = document.createElement("div");
  const escena = document.createElement("div");
  const luz = document.createElement("div");
  const lazo = document.createElement("div");
  const nudo = document.createElement("span");
  const mensaje = document.createElement("div");
  const iniciales = document.createElement("div");
  const totalFlores = 47;

  cielo.className = "ramo-cielo";
  escena.className = "ramo-escena";
  luz.className = "ramo-luz";
  lazo.className = "ramo-lazo";
  nudo.className = "ramo-nudo";
  mensaje.className = "ramo-mensaje";
  iniciales.className = "ramo-iniciales";
  mensaje.textContent = mensajesPlaneta[planetaNombre] || "Un ramo entero para decirte cuánto te amo.";
  iniciales.innerHTML = "<strong>Diego & Mayla</strong>";

  crearEstrellasFugaces(cielo);
  ramoOverlay.append(cielo, escena);
  escena.append(luz, iniciales);

  for (let i = 0; i < totalFlores; i += 1) {
    const tallo = document.createElement("span");
    const rotacion = -46 + (92 * i) / (totalFlores - 1);
    tallo.className = "ramo-tallo";
    tallo.style.setProperty("--rot", `${rotacion}deg`);
    tallo.style.setProperty("--largo", `${220 + Math.random() * 150}px`);
    tallo.style.animationDelay = `${Math.min(i * 0.026, 0.76)}s`;
    escena.appendChild(tallo);
  }

  lazo.appendChild(nudo);
  escena.append(lazo, mensaje);
  mostrarFrasesConCalma(mensaje, planetaNombre);
  requestAnimationFrame(() => ramoOverlay.classList.add("visible"));

  for (let i = 0; i < totalFlores; i += 1) {
    temporizadoresRamo.push(window.setTimeout(() => {
      const flor = crearFlor(i, totalFlores);
      escena.appendChild(flor);
      requestAnimationFrame(() => flor.classList.add("flor-visible"));

      if (i % 2 === 0) {
        crearPetaloSuelto(escena);
      }

      if (i === totalFlores - 1) {
        temporizadoresRamo.push(window.setTimeout(() => {
          escena.querySelectorAll(".flor-ramo").forEach((florRamo) => florRamo.classList.add("flor-brillo"));
          crearExplosion(escena);
          for (let p = 0; p < 38; p += 1) {
            temporizadoresRamo.push(window.setTimeout(() => crearPetaloSuelto(escena), p * 58));
          }
          temporizadoresRamo.push(window.setTimeout(() => mostrarFinalNombres(escena), 7600));
        }, 620));
      }
    }, i * 86));
  }

  temporizadoresRamo.push(window.setTimeout(() => {
    ramoOverlay.classList.add("saliendo");
  }, 14000));

  temporizadoresRamo.push(window.setTimeout(limpiarRamo, 15000));
}

botonPoema.addEventListener("click", cambiarContenido);
tituloUniverso.addEventListener("click", cambiarContenido);
declaracionElemento.addEventListener("click", cambiarContenido);

tituloUniverso.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    cambiarContenido();
  }
});

declaracionElemento.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    cambiarContenido();
  }
});

function animarPlaneta(planeta) {
  reiniciarCometa();
  planeta.animate(
    [
      { transform: "translate(var(--x), var(--y)) scale(1)" },
      { transform: "translate(var(--x), var(--y)) scale(1.22)" },
      { transform: "translate(var(--x), var(--y)) scale(1)" }
    ],
    { duration: 480, easing: "ease-out" }
  );
}

planetas.forEach((planeta) => {
  planeta.addEventListener("click", () => animarPlaneta(planeta));
});

retratosCosmicos.forEach((retrato) => {
  retrato.addEventListener("click", crearBigBangUniverso);
});

document.querySelector(".planeta-sol").addEventListener("click", () => {
  crearBigBangUniverso();
});

document.querySelector(".planeta-marte").addEventListener("click", () => {
  crearRamoFlores("MARTE");
});

document.querySelector(".planeta-mercurio").addEventListener("click", () => {
  crearCastilloMercurio();
});

document.querySelector(".planeta-venus").addEventListener("click", () => {
  crearEscenaVenus();
});

document.querySelector(".planeta-tierra").addEventListener("click", () => {
  crearEscenaTierra();
});

document.querySelector(".planeta-saturno").addEventListener("click", () => {
  crearEscenaSaturno();
});

document.querySelector(".planeta-urano").addEventListener("click", () => {
  crearEscenaUrano();
});

document.querySelector(".planeta-neptuno").addEventListener("click", () => {
  crearEscenaNeptuno();
});

document.querySelector(".planeta-jupiter").addEventListener("click", () => {
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarSaturno();
  window.location.href = "virus.html";
});

document.querySelector(".planeta-dierika").addEventListener("click", () => {
  limpiarBigBang();
  limpiarNeptuno();
  limpiarUrano();
  limpiarSaturno();
  window.location.href = "dierika.html";
});

window.addEventListener("resize", ajustarCanvas);

ajustarCanvas();
animarUniverso();
