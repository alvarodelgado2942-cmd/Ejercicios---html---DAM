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
let juegoTerminado = false;

document.getElementById('btnComenzar').addEventListener('click', function() {
  const casillas = document.querySelectorAll('.casilla');
  
  casillas.forEach((casilla, index) => {
    casilla.textContent = piezasIniciales[index];
    casilla.addEventListener('click', () => manejarClicCasilla(casilla, index));
  });

  this.style.display = 'none';
  actualizarIndicadoresTurno();
});

function manejarClicCasilla(casilla, index) {
  if (juegoTerminado) return; // Si la partida acabó, congelar movimientos

  const textoPieza = casilla.textContent.trim();

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

    if (esMovimientoValido(piezaOrigen, indiceSeleccionado, index, textoPieza)) {
      // Verificar si la pieza capturada es un Rey
      if (textoPieza === '♔' || textoPieza === '♚') {
        casilla.textContent = piezaOrigen;
        casillaSeleccionada.textContent = '';
        deseleccionar();
        
        juegoTerminado = true;
        const ganador = turnoActual === 'blancas' ? '¡Ganan las Blancas!' : '¡Ganan las Negras!';
        setTimeout(() => alert(`¡Fin del juego! ${ganador}`), 100);
        return;
      }

      casilla.textContent = piezaOrigen;
      casillaSeleccionada.textContent = '';
      deseleccionar();
      
      // Cambiar de turno y actualizar indicadores
      turnoActual = (turnoActual === 'blancas') ? 'negras' : 'blancas';
      actualizarIndicadoresTurno();
    }

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

// Actualizar la apariencia de los recuadros según el turno activo
function actualizarIndicadoresTurno() {
  const panelBlancas = document.getElementById('turnoBlancas');
  const panelNegras = document.getElementById('turnoNegras');

  if (turnoActual === 'blancas') {
    panelBlancas.classList.add('activo');
    panelNegras.classList.remove('activo');
  } else {
    panelNegras.classList.add('activo');
    panelBlancas.classList.remove('activo');
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

function limpiarMarcas() {
  const casillas = document.querySelectorAll('.casilla');
  casillas.forEach(casilla => {
    casilla.classList.remove('movimiento-valido', 'captura-valida');
  });
}

function obtenerCoordenadas(index) {
  return {
    fila: Math.floor(index / 8),
    columna: index % 8
  };
}

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

function esMovimientoValido(pieza, origenIdx, destinoIdx, piezaDestino) {
  const orig = obtenerCoordenadas(origenIdx);
  const dest = obtenerCoordenadas(destinoIdx);

  const df = dest.fila - orig.fila;
  const dc = dest.columna - orig.columna;
  const absDf = Math.abs(df);
  const absDc = Math.abs(dc);

  const esCaptura = piezaDestino !== '';

  switch (pieza) {
    case '♙':
      if (dc === 0 && !esCaptura) {
        if (df === -1) return true;
        if (orig.fila === 6 && df === -2 && caminoLimpio(orig, dest, -1, 0)) return true;
      }
      if (df === -1 && absDc === 1 && esCaptura) return true;
      return false;

    case '♟':
      if (dc === 0 && !esCaptura) {
        if (df === 1) return true;
        if (orig.fila === 1 && df === 2 && caminoLimpio(orig, dest, 1, 0)) return true;
      }
      if (df === 1 && absDc === 1 && esCaptura) return true;
      return false;

    case '♖': case '♜':
      if (df === 0 || dc === 0) {
        const stepF = df === 0 ? 0 : df / absDf;
        const stepC = dc === 0 ? 0 : dc / absDc;
        return caminoLimpio(orig, dest, stepF, stepC);
      }
      return false;

    case '♘': case '♞':
      return (absDf === 2 && absDc === 1) || (absDf === 1 && absDc === 2);

    case '♗': case '♝':
      if (absDf === absDc) {
        const stepF = df / absDf;
        const stepC = dc / absDc;
        return caminoLimpio(orig, dest, stepF, stepC);
      }
      return false;

    case '♕': case '♛':
      if (df === 0 || dc === 0 || absDf === absDc) {
        const stepF = df === 0 ? 0 : df / absDf;
        const stepC = dc === 0 ? 0 : dc / absDc;
        return caminoLimpio(orig, dest, stepF, stepC);
      }
      return false;

    case '♔': case '♚':
      return absDf <= 1 && absDc <= 1;

    default:
      return false;
  }
}