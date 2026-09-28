// Disposición de las piezas iniciales
const piezasIniciales = [
  '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
  '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
  '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
];

const piezasBlancas = ['♙', '♖', '♘', '♗', '♕', '♔'];
const piezasNegras  = ['♟', '♜', '♞', '♝', '♛', '♚'];

let turnoActual = 'blancas';
let casillaSeleccionada = null;
let indiceSeleccionado = null;

// Inicialización del botón
document.getElementById('btnComenzar').addEventListener('click', function() {
  const casillas = document.querySelectorAll('.casilla');
  
  casillas.forEach((casilla, index) => {
    casilla.textContent = piezasIniciales[index];
    casilla.addEventListener('click', () => manejarClicCasilla(casilla, index));
  });

  this.style.display = 'none';
});

function manejarClicCasilla(casilla, index) {
  const textoPieza = casilla.textContent.trim();

  // SI YA HAY UNA CASILLA SELECCIONADA: Intentar mover
  if (casillaSeleccionada) {
    if (casillaSeleccionada === casilla) {
      deseleccionar();
      return;
    }

    const piezaOrigen = casillaSeleccionada.textContent.trim();
    const esDestinoMismoColor = 
      (turnoActual === 'blancas' && piezasBlancas.includes(textoPieza)) ||
      (turnoActual === 'negras' && piezasNegras.includes(textoPieza));

    if (esDestinoMismoColor) {
      deseleccionar();
      seleccionar(casilla, index);
      return;
    }

    // Validar si el movimiento es legal para esa pieza
    if (esMovimientoValido(piezaOrigen, indiceSeleccionado, index, textoPieza)) {
      casilla.textContent = piezaOrigen;
      casillaSeleccionada.textContent = '';
      deseleccionar();
      turnoActual = (turnoActual === 'blancas') ? 'negras' : 'blancas';
    }

  // SI NO HAY NINGUNA CASILLA SELECCIONADA: Intentar seleccionar
  } else {
    if (textoPieza !== '') {
      const esBlanca = piezasBlancas.includes(textoPieza);
      const esNegra = piezasNegras.includes(textoPieza);

      if ((turnoActual === 'blancas' && esBlanca) || (turnoActual === 'negras' && esNegra)) {
        seleccionar(casilla, index);
      }
    }
  }
}

function seleccionar(casilla, index) {
  casillaSeleccionada = casilla;
  indiceSeleccionado = index;
  casilla.classList.add('seleccionada');
  mostrarOpcionesMovimiento(casilla.textContent.trim(), index);
}

function deseleccionar() {
  if (casillaSeleccionada) {
    casillaSeleccionada.classList.remove('seleccionada');
    casillaSeleccionada = null;
    indiceSeleccionado = null;
    limpiarMarcas();
  }
}

// Muestra los puntos o bordes en las casillas permitidas
function mostrarOpcionesMovimiento(pieza, origenIdx) {
  const casillas = document.querySelectorAll('.casilla');
  
  casillas.forEach((casillaDestino, destinoIdx) => {
    if (origenIdx === destinoIdx) return;

    const piezaDestino = casillaDestino.textContent.trim();
    const esDestinoMismoColor = 
      (turnoActual === 'blancas' && piezasBlancas.includes(piezaDestino)) ||
      (turnoActual === 'negras' && piezasNegras.includes(piezaDestino));

    if (!esDestinoMismoColor && esMovimientoValido(pieza, origenIdx, destinoIdx, piezaDestino)) {
      if (piezaDestino === '') {
        casillaDestino.classList.add('movimiento-valido');
      } else {
        casillaDestino.classList.add('captura-valida');
      }
    }
  });
}

// Quita todos los indicadores visuales del tablero
function limpiarMarcas() {
  const casillas = document.querySelectorAll('.casilla');
  casillas.forEach(casilla => {
    casilla.classList.remove('movimiento-valido', 'captura-valida');
  });
}

// Convertir índice lineal (0 a 63) a coordenadas (fila, columna)
function obtenerCoordenadas(index) {
  return {
    fila: Math.floor(index / 8),
    columna: index % 8
  };
}

// Verificar si el camino está libre para piezas deslizantes
function caminoLimpio(origen, destino, dFila, dColumna) {
  const casillas = document.querySelectorAll('.casilla');
  let f = origen.fila + dFila;
  let c = origen.columna + dColumna;

  while (f !== destino.fila || c !== destino.columna) {
    const idx = f * 8 + c;
    if (casillas[idx].textContent.trim() !== '') {
      return false;
    }
    f += dFila;
    c += dColumna;
  }
  return true;
}

// Lógica de reglas específicas por pieza
function esMovimientoValido(pieza, origenIdx, destinoIdx, piezaDestino) {
  const orig = obtenerCoordenadas(origenIdx);
  const dest = obtenerCoordenadas(destinoIdx);

  const df = dest.fila - orig.fila;
  const dc = dest.columna - orig.columna;
  const absDf = Math.abs(df);
  const absDc = Math.abs(dc);

  const esCaptura = piezaDestino !== '';

  switch (pieza) {
    // PEÓN BLANCO
    case '♙':
      if (dc === 0 && !esCaptura) {
        if (df === -1) return true;
        if (orig.fila === 6 && df === -2 && caminoLimpio(orig, dest, -1, 0)) return true;
      }
      if (df === -1 && absDc === 1 && esCaptura) return true;
      return false;

    // PEÓN NEGRO
    case '♟':
      if (dc === 0 && !esCaptura) {
        if (df === 1) return true;
        if (orig.fila === 1 && df === 2 && caminoLimpio(orig, dest, 1, 0)) return true;
      }
      if (df === 1 && absDc === 1 && esCaptura) return true;
      return false;

    // TORRE
    case '♖': case '♜':
      if (df === 0 || dc === 0) {
        const stepF = df === 0 ? 0 : df / absDf;
        const stepC = dc === 0 ? 0 : dc / absDc;
        return caminoLimpio(orig, dest, stepF, stepC);
      }
      return false;

    // CABALLO
    case '♘': case '♞':
      return (absDf === 2 && absDc === 1) || (absDf === 1 && absDc === 2);

    // ALFIL
    case '♗': case '♝':
      if (absDf === absDc) {
        const stepF = df / absDf;
        const stepC = dc / absDc;
        return caminoLimpio(orig, dest, stepF, stepC);
      }
      return false;

    // DAMA
    case '♕': case '♛':
      if (df === 0 || dc === 0 || absDf === absDc) {
        const stepF = df === 0 ? 0 : df / absDf;
        const stepC = dc === 0 ? 0 : dc / absDc;
        return caminoLimpio(orig, dest, stepF, stepC);
      }
      return false;

    // REY
    case '♔': case '♚':
      return absDf <= 1 && absDc <= 1;

    default:
      return false;
  }
}