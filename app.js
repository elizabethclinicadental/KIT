const citas = JSON.parse(localStorage.getItem("citas") || "[]");

// GUARDAR
function guardar() {
const nombre = document.getElementById("nombre").value.trim();
const telefono = document.getElementById("telefono").value.trim();
const trat = document.getElementById("trat").value;
const fecha = document.getElementById("fecha").value;

if (!nombre || !telefono || !trat || !fecha) {
alert("Rellena todos los campos");
return;
}

const cita = {
id: Date.now(),
nombre,
tel: telefono,
trat,
fecha,
estado: "pendiente"
};

citas.push(cita);
localStorage.setItem("citas", JSON.stringify(citas));

alert("Cita guardada");
document.getElementById("citaForm").reset();
}

// PANEL
function mostrarPanel(){
document.getElementById("panel-acceso").style.display = "flex";
}

function cerrarPanel(){
document.getElementById("panel-acceso").style.display = "none";
}

// LOGIN
function doLogin(){
const u = document.getElementById('lu').value.trim();
const p = document.getElementById('lp').value.trim();

if(u === 'admin' && p === 'fuensanta2025'){
document.getElementById("login").style.display = "none";
document.getElementById("panel").style.display = "block";
render();
} else {
alert("Credenciales incorrectas");
}
}

// RENDER
function render() {
const cont = document.getElementById("citas");

if (citas.length === 0) {
cont.innerHTML = "<p>No hay citas</p>";
return;
}

const ordenadas = [...citas].sort((a,b)=>b.id-a.id);

cont.innerHTML = ordenadas.map(c => ` <div class="cita-card"> <strong>${c.nombre}</strong> <span class="cita-estado estado-${c.estado}">${c.estado}</span><br>

```
  📞 ${c.tel}<br>
  📋 ${c.trat}<br>
  📅 ${c.fecha}

  <div class="cita-actions">
    <button onclick="cambiarEstado(${c.id}, 'confirmada')">✔ Confirmar</button>
    <button onclick="cambiarEstado(${c.id}, 'cancelada')">✖ Cancelar</button>
  </div>
</div>
```

`).join("");
}

// CAMBIAR ESTADO
function cambiarEstado(id, estado){
const cita = citas.find(c => c.id === id);
if(!cita) return;

cita.estado = estado;
localStorage.setItem("citas", JSON.stringify(citas));
render();
}

// CERRAR AL HACER CLICK FUERA
window.onclick = function(e){
const panel = document.getElementById("panel-acceso");
if(e.target === panel){
panel.style.display = "none";
}
}
