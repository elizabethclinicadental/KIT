// ============================================
//  CLÍNICA DENTAL LA FUENSANTA — app.js
// ============================================

// --- ESTADO GLOBAL ---
const citas = JSON.parse(localStorage.getItem("citas") || "[]");

// --- NAV SCROLL ---
window.addEventListener("scroll", () => {
  const nav = document.getElementById("nav");
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
});

// --- UTILIDADES ---
function tel() {
  window.location = "tel:968837316";
}

function wa() {
  window.open("https://wa.me/34644210097?text=Hola%2C%20quiero%20pedir%20una%20cita");
}

function scrollToForm() {
  document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}

// --- FECHA MÍNIMA (hoy) ---
window.addEventListener("DOMContentLoaded", () => {
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    const today = new Date().toISOString().split("T")[0];
    fechaInput.min = today;
  }
});

// --- FORMULARIO / CRM ---
function guardar() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const trat = document.getElementById("trat").value;
  const fecha = document.getElementById("fecha").value;

  if (!nombre || !telefono || !trat || !fecha) {
    showToast("Por favor, rellena todos los campos.", "error");
    return;
  }

  const cita = {
    id: Date.now(),
    nombre,
    tel: telefono,
    trat,
    fecha,
    estado: "pendiente",
    creada: new Date().toLocaleString("es-ES")
  };

  citas.push(cita);
  localStorage.setItem("citas", JSON.stringify(citas));
  showToast("✓ Cita solicitada. Te confirmaremos en menos de 24 horas.", "success");
  document.getElementById("citaForm").reset();
}

// --- TOAST ---
function showToast(msg, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "90px",
    left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    background: type === "success" ? "#1a3a5c" : "#c0392b",
    color: "#fff",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: "9999",
    boxShadow: "0 8px 24px rgba(0,0,0,.2)",
    maxWidth: "90vw",
    textAlign: "center",
    transition: "all .3s ease",
    opacity: "0"
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- PANEL CRM ---
function render() {
  const citasDiv = document.getElementById("citas");
  if (!citasDiv) return;

  if (citas.length === 0) {
    citasDiv.innerHTML = "<p style='color:#6b6b7b'>No hay citas todavía.</p>";
    return;
  }

  const sorted = [...citas].sort((a, b) => b.id - a.id);

  citasDiv.innerHTML = sorted.map(c => `
    <div class="cita-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        <strong>${c.nombre}</strong>
        <span class="cita-estado estado-${c.estado}">${c.estado}</span>
      </div>
      <div style="font-size:14px;color:#6b6b7b;margin-bottom:4px">
        📋 ${c.trat} &nbsp;·&nbsp; 📅 ${c.fecha}
      </div>
      <div style="font-size:13px;color:#9b9bab;margin-bottom:12px">📞 ${c.tel} &nbsp;·&nbsp; Solicitud: ${c.creada || "—"}</div>
      <div class="cita-actions">
        <button class="btn btn-primary" style="padding:8px 14px;font-size:13px" onclick="cambiarEstado(${c.id},'confirmada')">✓ Confirmar</button>
        <button class="btn btn-ghost" style="padding:8px 14px;font-size:13px" onclick="cambiarEstado(${c.id},'cancelada')">✕ Cancelar</button>
        <button class="btn btn-wa" style="padding:8px 14px;font-size:13px" onclick="window.open('https://wa.me/34${c.tel.replace(/\D/g,'')}')">💬 WhatsApp</button>
      </div>
    </div>
  `).join("");
} 

function cambiarEstado(id, nuevoEstado) {
  const cita = citas.find(x => x.id === id);
  if (!cita) return;
  cita.estado = nuevoEstado;
  localStorage.setItem("citas", JSON.stringify(citas));
  render();
}

// --- LOGIN PANEL ---
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  const loginDiv = document.getElementById("login");
  const panel = document.getElementById("panel");

  if (user === "admin" && pass === "1234") {
    loginDiv.style.display = "none";
    panel.style.display = "block";
    render();
  } else {
    showToast("Usuario o contraseña incorrectos", "error");
  }
}

// --- PANEL POR HASH ---
window.addEventListener("load", () => {
  if (location.hash === "#panel-acceso") {
    const pa = document.getElementById("panel-acceso");
    if (pa) {
      pa.style.display = "block";
      document.getElementById("login").style.display = "flex";
      pa.scrollIntoView({ behavior: "smooth" });
    }
  }
});

// --- CHAT BOT ---
function toggleChat() {
  const chat = document.getElementById("chat");
  if (!chat) return;
  const isOpen = chat.style.display === "flex";
  chat.style.display = isOpen ? "none" : "flex";
}

function send() {
  const input = document.getElementById("msgInput");
  const msgs = document.getElementById("msgs");
  const text = input.value.trim();
  if (!text) return;

  // Mensaje usuario
  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.textContent = text;
  msgs.appendChild(userMsg);
  input.value = "";
  msgs.scrollTop = msgs.scrollHeight;

  // Respuesta del bot
  setTimeout(() => {
    const r = getResponse(text);
    const botMsg = document.createElement("div");
    botMsg.className = "msg bot";
    botMsg.textContent = r;
    msgs.appendChild(botMsg);
    msgs.scrollTop = msgs.scrollHeight;
  }, 500);
}

function getResponse(t) {
  const l = t.toLowerCase();

  if (l.includes("precio") || l.includes("cuánto") || l.includes("coste") || l.includes("presupuesto")) {
    return "El precio varía según el tratamiento y tu caso. Te hacemos presupuesto personalizado sin compromiso. ¿Te llamo para explicarte?";
  }
  if (l.includes("horario") || l.includes("hora") || l.includes("abierto") || l.includes("cuando")) {
    return "Estamos abiertos de lunes a viernes de 9:00 a 20:00. ¡Sin cita previa para urgencias!";
  }
  if (l.includes("dirección") || l.includes("dónde") || l.includes("donde") || l.includes("ubicación")) {
    return "Estamos en C/ Algezares 74, Beniaján (Murcia). ¡Muy fácil de encontrar y con aparcamiento!";
  }
  if (l.includes("cita") || l.includes("reservar") || l.includes("appointment")) {
    return "Puedes pedir cita usando el formulario de la página, llamándonos al 968 83 73 16 o por WhatsApp. ¿Qué prefieres?";
  }
  if (l.includes("implante")) {
    return "Nuestros implantes tienen garantía de por vida. Primera consulta gratis para valorar tu caso. ¿Te paso información?";
  }
  if (l.includes("ortodoncia") || l.includes("brackets") || l.includes("invisible")) {
    return "Trabajamos con ortodoncia invisible y brackets tradicionales. ¡Primeras consultas gratuitas! ¿Quieres más info?";
  }
  if (l.includes("blanqueamiento")) {
    return "Realizamos blanqueamiento profesional con resultados visibles desde la primera sesión. Precio muy competitivo. ¿Hablamos?";
  }
  if (l.includes("hola") || l.includes("buenas") || l.includes("hello")) {
    return "¡Hola! Bienvenido/a a La Fuensanta 😊 ¿En qué puedo ayudarte?";
  }
  if (l.includes("gracias")) {
    return "¡De nada! Estamos a tu disposición. ¿Puedo ayudarte con algo más?";
  }
  if (l.includes("urgencia") || l.includes("dolor") || l.includes("emergencia")) {
    return "Para urgencias llámanos al 968 83 73 16. Atendemos lo antes posible. ¡No sufras, te ayudamos!";
  }

  return "Puedo ayudarte con precios, horarios, ubicación o información sobre tratamientos. ¿Prefieres hablar directamente? Te llamo sin compromiso 😊";
}

// Enter en el chat
document.addEventListener("DOMContentLoaded", () => {
  const msgInput = document.getElementById("msgInput");
  if (msgInput) {
    msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });
  }
});
