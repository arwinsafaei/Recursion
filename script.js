const canvas = document.getElementById("fractal-canvas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("play-generation");

const depthSlider = document.getElementById("depth");
const depthValue = document.getElementById("depth-value");

function drawTriangle(x, y, size, depth) {
    const height = size * Math.sqrt(3) / 2;

    if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - size / 2, y + height);
        ctx.lineTo(x + size / 2, y + height);
        ctx.closePath();
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        return;
    }

    const half = size / 2;
    const halfHeight = height / 2;

    drawTriangle(x, y, half, depth - 1);
    drawTriangle(x - half / 2, y + halfHeight, half, depth - 1);
    drawTriangle(x + half / 2, y + halfHeight, half, depth - 1);
}

function render() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const size = Math.min(width * 0.85, height * 1);
    const x = width / 2;
    const y = (height - size * Math.sqrt(3) / 2) / 2;

    drawTriangle(x, y, size, Number(depthSlider.value));
}

depthSlider.addEventListener("input", () => {
    depthValue.textContent = depthSlider.value;
});
generateButton.addEventListener("click", render);
window.addEventListener("resize", render);

render();