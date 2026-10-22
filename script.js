const canvas = document.getElementById("fractal-canvas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("play-generation");

const depthSlider = document.getElementById("depth");
const depthValue = document.getElementById("depth-value");

const formulas = [
    "h = s√3 / 2",
    "N(d) = 3^d",
    "A(d) = A₀(3/4)^d",
    "f(x) = f(f(x))",
    "∞ + 1 = ∞",
    "why is this working",
    "∑ sleep = 0",
    "TODO: understand fractals",
    "triangle.exe has stopped working",
    "√(-1) = i need coffee",
    "3^999 = probably enough",
    "if (life) keepRecursing();",
    "ERROR: reality not found",
    "prove it later",
    "π ≈ 3.14159 (trust me)",
    "Orpheus was here"
];

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

function scatterFormulas(width, height, x, y, size) {
    const placedFormulas = [];
    const spacing = 18;

    const triangleHeight = size * Math.sqrt(3) / 2;

    const left = x - size / 2;
    const right = x + size / 2;
    const top = y;
    const bottom = y + triangleHeight;

    ctx.save();
    ctx.fillStyle = "#dddddd";
    ctx.textAlign = "center";

    const shuffled = [...formulas].sort(() => Math.random() - 0.5);

    for (const formula of shuffled) {
        const fontSize = 16 + Math.random() * 5;

        ctx.font = `${fontSize}px Caveat, cursive`;

        const textWidth = ctx.measureText(formula).width;
        const textHeight = fontSize * 1.5;
        const boxWidth = textWidth + spacing * 2;
        const boxHeight = textHeight + spacing * 2;

        const padding = 12;

        let fx, fy;
        let placed = false;

        for (let attempt = 0; attempt < 100; attempt++) {
            fx = Math.random() * width;
            fy = Math.random() * height;

            const hitsWall =
                fx - boxWidth / 2 < 0 ||
                fx + boxWidth / 2 > width ||
                fy - boxHeight / 2 < 0 ||
                fy + boxHeight / 2 > height;

            if (hitsWall) continue;

            const hitsFormula = placedFormulas.some(other =>
                fx - boxWidth / 2 < other.x + other.width / 2 &&
                fx + boxWidth / 2 > other.x - other.width / 2 &&
                fy - boxHeight / 2 < other.y + other.height / 2 &&
                fy + boxHeight / 2 > other.y - other.height / 2
            );

            if (hitsFormula) continue;

            const halfW = boxWidth / 2;
            const halfH = boxHeight / 2;

            const rotatedW = halfW * 1.15 + halfH * 0.15
            const rotatedH = halfH * 1.15 + halfW * 0.15

            const boxTop = fy - rotatedH;
            const boxBottom = fy + rotatedH;

            const checkTop = Math.max(top, boxTop);
            const checkBottom = Math.min(bottom, boxBottom);

            const overlapsTriangle = checkTop <= checkBottom && (() => {
                const triangleHalfWidth =
                    (size / 2) * ((checkBottom - top) / triangleHeight);

                return (
                    fx + rotatedW > x - triangleHalfWidth &&
                    fx - rotatedW < x + triangleHalfWidth
                );
            })();
            
            if (overlapsTriangle) continue;

            if (!overlapsTriangle) {
                placedFormulas.push({
                    x: fx,
                    y: fy,
                    width: boxWidth,
                    height: boxHeight
                });

                placed = true;
                break;
            }
        }

        if (!placed) continue;

        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate((Math.random() -0.5) * 0.2);
        ctx.fillText(formula, 0, 0);
        ctx.restore();
    }

    ctx.restore();
}

function render() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const size = Math.min(width * 0.6, height * 1);
    const x = width / 2;
    const y = (height - size * Math.sqrt(3) / 2) / 2;

    scatterFormulas(width, height, x, y, size);
    drawTriangle(x, y, size, Number(depthSlider.value));
}

depthSlider.addEventListener("input", () => {
    depthValue.textContent = depthSlider.value;
});
generateButton.addEventListener("click", render);
window.addEventListener("resize", render);

render();