const especialidades = ["Clínica Médica", "Pediatría", "Cardiología", "Dermatología"];
const turnos = [];

function pedirDatos() {
  let nombre = prompt("¿Cómo te llamás?");
  if (nombre === "" || nombre === null) return;

  let opciones = "";
  for (let i = 0; i < especialidades.length; i++) {
    opciones += (i + 1) + ". " + especialidades[i] + "\n";
  }

  let seleccion = prompt("Hola " + nombre + "! ¿Para qué especialidad querés turno?\n" + opciones);
  let indice = seleccion - 1;

  if (indice < 0 || indice > 3) {
    alert("Opción inválida.");
    return;
  }

  let dia = prompt("¿Qué día querés venir? (DD/MM/AAAA)");
  if (!dia) return;

  let hora = prompt("¿A qué hora? (HH:MM)");
  if (!hora) return;

  let turno = [nombre, especialidades[indice], dia, hora];
  turnos.push(turno);
  alert("¡Listo! Reservaste para " + especialidades[indice] + " el " + dia + " a las " + hora + ".");
  console.log("Turno reservado:", turno);
}

function verTurnos() {
    if (turnos.length === 0) {
        alert("Todavía no hay turnos registrados.");
        return;
    }

    let resumen = "Estos son los turnos registrados:\n";

    for (let i = 0; i < turnos.length; i++) {
        const t = turnos[i];
        const detalle = 
            (i + 1) + ") Nombre: " + t[0] +
            " - Especialidad: " + t[1] +
            " - Fecha: " + t[2] +
            " - Hora: " + t[3];

        resumen += "\n" + detalle;
        console.log(detalle); // Mostrar también en la consola
    }

    alert(resumen);
}

function inicio() {
  alert("Bienvenido al simulador de turnos.");
  pedirDatos();
  verTurnos();
}

inicio();
