
let chars, particles, canvas, ctx, w, h, current;
let duration = 5000; // Ajusta la duración a 5 segundos
let str = ['FELIZ', 'CUMPLE', 'NALLELY', '20<3'];

// Declaración del elemento de audio para la música
let music = new Audio('cumpleaños.mp3');

// Inicialización al hacer clic en el botón
document.getElementById('start-btn').addEventListener('click', function() {
    if (!canvas) {
        init();
        resize();
        requestAnimationFrame(render);
    }
    music.currentTime = 0; // Reiniciar la música
    music.play(); // Iniciar la reproducción de la música
    
    // Ocultar el botón después de hacer clic
    this.style.display = 'none';
});

// Función para crear los caracteres y partículas de fuegos artificiales
function makeChar(c) {
    let tmp = document.createElement('canvas');
    let size = tmp.width = tmp.height = w < 400 ? 150 : 250;
    let tmpCtx = tmp.getContext('2d');
    tmpCtx.font = 'bold ' + size + 'px Arial';
    tmpCtx.fillStyle = 'white';
    tmpCtx.textBaseline = "middle";
    tmpCtx.textAlign = "center";
    tmpCtx.fillText(c, size / 2, size / 2);
    let char2 = tmpCtx.getImageData(0, 0, size, size);
    let char2particles = [];
    for (var i = 0; char2particles.length < particles; i++) {
        let x = size * Math.random();
        let y = size * Math.random();
        let offset = parseInt(y) * size * 4 + parseInt(x) * 4;
        if (char2.data[offset])
            char2particles.push([x - size / 2, y - size / 2]);
    }
    return char2particles;
}

// Inicialización del canvas y ajustes de estilos
function init() {
    canvas = document.createElement('canvas');
    document.body.append(canvas);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';
    document.body.style.background = 'black';
    ctx = canvas.getContext('2d');
}

// Ajuste de tamaño del canvas al cambiar el tamaño de la ventana
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = window.innerWidth < 400 ? 60 : 120; // Reducido para evitar saturación
}

// Creación de los caracteres para la animación de fuegos artificiales
function makeChars(t) {
    let actual = parseInt(t / duration) % str.length;
    if (current === actual)
        return;
    current = actual;
    chars = [...str[actual]].map(makeChar);
}

// Función principal de renderizado
function render(t) {
    makeChars(t);
    requestAnimationFrame(render);
    ctx.fillStyle = '#00000020';
    ctx.fillRect(0, 0, w, h);
    chars.forEach((pts, i) => firework(t, i, pts));
}

// Animación de un solo fuego artificial
function firework(t, i, pts) {
    t -= i * 200;
    let id = i + chars.length * parseInt(t - t % duration);
    t = t % duration / duration;
    let dx = (i + 0.5) * w / chars.length; // Más espacio entre caracteres
    dx += Math.min(0.33, t) * 100 * Math.sin(id);
    let dy = h * 0.5;
    dy += Math.sin(id * 4547.411) * h * 0.1;
    if (t < 0.33) {
        rocket(dx, dy, id, t * 3);
    } else {
        explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t - 0.33) * 2));
    }
}

// Animación de cohete
function rocket(x, y, id, t) {
    ctx.fillStyle = `hsl(${id * 90}, 100%, 70%)`;
    let r = 3 - 3 * t + Math.pow(t, 15 * t) * 20;
    y = h - y * t;
    circle(x, y, r);
}

// Animación de explosión
function explosion(pts, x, y, id, t) {
    let dy = (t * t * t) * 30;
    let r = Math.sin(id) * 1 + 4;
    r = t < 0.5 ? (t + 0.5) * t * r : r - t * r;
    ctx.fillStyle = `hsl(${id * 75}, 100%, 50%)`;
    pts.forEach((xy, i) => {
        if (i % 10 === 0)
            ctx.fillStyle = `hsl(${id * 75}, 100%, ${50 + t * Math.sin(t * 75 + i) * 50}%)`;
        circle(t * xy[0] + x, h - y + t * xy[1] + dy, r);
    });
}

// Función para dibujar un círculo en el canvas
function circle(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, 6.283);
    ctx.fill();
}
