const canvas = document.getElementById('game');
const gl = canvas.getContext('webgl');

// Error cheking
function getError() {
  if (!canvas) throw new Error("canvas not found.");
  if (!gl) throw new Error("WebGl not supported or not found.");
}
getError(); // Initial error checking

function resizeCanvas() {
  canvas.height = window.innerHeight; // I know it is out of order but I will not change it because fuck you thats why
  canvas.width = window.innerWidth;

  gl.viewport(0, 0, canvas.width, canvas.height); // resize GL viewport to match canvas scale
}

window.addEventListener('resize', resizeCanvas); // resize on resize
resizeCanvas(); // resize again
