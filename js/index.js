// Referencias
const form = document.getElementById("turno-form");
const container = document.getElementById("ultimo-turno");
const especialidadesContainer = document.getElementById("especialidades");
const hiddenEspecialidad = document.getElementById("especialidad");
const fechaHoraInput = document.getElementById("fechaHora");

// Recuperar turnos guardados
let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

// Inicializar Flatpickr
flatpickr(fechaHoraInput, {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  defaultDate: new Date(),
  minDate: "today",
  time_24hr: true,
  wrap: false, // No necesita wrapper
  locale: {
    weekdays: {
      shorthand: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
      longhand: ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
    },
    months: {
      shorthand: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
      longhand: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
    }
  },
  onReady: function(selectedDates, dateStr, instance) {
    // Agregar clases Tailwind al calendario
    instance.calendarContainer.classList.add("bg-white","shadow-xl","rounded-2xl","p-4","border","border-blue-200");
  },
  onMonthChange: function(selectedDates, dateStr, instance) {
    // Refrescar diseño al cambiar mes
    instance.calendarContainer.classList.add("bg-white","shadow-xl","rounded-2xl","p-4","border","border-blue-200");
  }
});


function renderTurnos() {
  if (turnos.length === 0) {
    container.innerHTML = "";
    return;
  }

  // Limpiar container
  container.innerHTML = "";

  // Recorrer todos los turnos
  turnos.forEach(turno => {
    const turnoCard = document.createElement("div");
    turnoCard.className = "border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-md p-5 mb-4 animate-[fadeIn_0.5s_ease-in-out]";
    turnoCard.innerHTML = `
      <h2 class="font-bold text-xl text-blue-700 mb-2">✅ Turno confirmado</h2>
      <p><span class="font-semibold">Paciente:</span> ${turno.nombre}</p>
      <p><span class="font-semibold">Especialidad:</span> ${turno.especialidad}</p>
      <p><span class="font-semibold">Fecha:</span> ${turno.fecha}</p>
      <p><span class="font-semibold">Hora:</span> ${turno.hora}</p>
    `;
    container.appendChild(turnoCard);
  });
}


// Renderizar especialidades desde JSON
function cargarEspecialidades(data) {
  especialidadesContainer.innerHTML = "";
  data.forEach(esp => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "border rounded-xl p-4 flex flex-col items-center justify-center shadow-sm bg-white hover:bg-blue-50 hover:scale-105 transition cursor-pointer";
    btn.innerHTML = `
      <i data-lucide="${esp.icon}" class="w-8 h-8 text-blue-600"></i>
      <span class="mt-2 font-semibold text-gray-700">${esp.nombre}</span>
    `;
    btn.addEventListener("click", () => {
      hiddenEspecialidad.value = esp.nombre;
      document.querySelectorAll("#especialidades button").forEach(b => b.classList.remove("ring-2","ring-blue-500"));
      btn.classList.add("ring-2","ring-blue-500");
    });
    especialidadesContainer.appendChild(btn);
  });

  // Inicializar íconos de Lucide
  lucide.createIcons();
}

// Manejar submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const especialidad = hiddenEspecialidad.value;
  const fechaHora = fechaHoraInput.value;

  if (!nombre || !especialidad || !fechaHora) {
    Swal.fire({
      title: "Error",
      text: "Todos los campos son obligatorios",
      icon: "error",
      confirmButtonText: "OK"
    });
    return;
  }

  const [fecha, hora] = fechaHora.split(" ");

  // Validar duplicado
  const existe = turnos.some(t => t.especialidad === especialidad && t.fecha === fecha && t.hora === hora);
  if (existe) {
    Swal.fire({
      title: "Turno no disponible",
      text: "Ya existe un turno en esa especialidad, fecha y hora.",
      icon: "warning",
      confirmButtonText: "Entendido"
    });
    return;
  }

  const nuevoTurno = { nombre, especialidad, fecha, hora };
  turnos.push(nuevoTurno);
  localStorage.setItem("turnos", JSON.stringify(turnos));

  renderTurnos();

  Swal.fire({
    title: "Turno reservado",
    html: `<b>${nombre}</b> - ${especialidad}<br>${fecha} ${hora}`,
    icon: "success",
    confirmButtonText: "Perfecto"
  });

  form.reset();
  hiddenEspecialidad.value = "";
});

// Cargar datos del JSON externo
fetch("/js/data/data.json")
  .then(res => res.json())
  .then(data => cargarEspecialidades(data))
  .catch(() => {
    especialidadesContainer.innerHTML = "<p class='text-red-500'>Error al cargar especialidades.</p>";
  });

// Renderizar al cargar la página
renderTurnos();
