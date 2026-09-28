// Disposición de las piezas según el orden de las casillas en el HTML
const piezasIniciales = [
  // Fila 8 (Piezas negras)
  '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
  // Fila 7 (Peones negros)
  '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
  // Filas 6 a 3 (Vacías)
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  // Fila 2 (Peones blancos)
  '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
  // Fila 1 (Piezas blancas)
  '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
];

document.getElementById('btnComenzar').addEventListener('click', function() {
  const casillas = document.querySelectorAll('.casilla');
  
  // Colocar cada pieza en su casilla correspondiente
  casillas.forEach((casilla, index) => {
    casilla.textContent = piezasIniciales[index];
  });
});