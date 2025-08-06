const form = document.getElementById("turno-form");
const container = document.getElementById("ultimo-turno");

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

function renderUltimoTurno() {
  if (turnos.length === 0) {
    container.innerHTML = "";
    return;
  }

  const turno = turnos[turnos.length - 1];
  container.innerHTML = `
    <div class="border rounded p-4 bg-gray-50 shadow">
      <h2 class="font-bold text-lg text-gray-800">Paciente: ${turno.nombre}</h2>
      <p>Especialidad: <strong>${turno.especialidad}</strong></p>
      <p>Fecha: ${turno.fecha}</p>
      <p>Hora: ${turno.hora}</p>
    </div>
  `;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !especialidad || !fecha || !hora) return;

  const nuevoTurno = { nombre, especialidad, fecha, hora };
  turnos.push(nuevoTurno);
  localStorage.setItem("turnos", JSON.stringify(turnos));

  renderUltimoTurno(); // <- 🔹 Asegurate de que esto se llama
  form.reset();
});

renderUltimoTurno(); // <- 🔹 Muestra el último turno al recargar
