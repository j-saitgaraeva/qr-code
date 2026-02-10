async function loadSvg(url) {
    const res = await fetch(url);
    const text = await res.text();
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(text);
    await img.decode();
    return img;
}

export async function renderQR(ctx, matrix) {
    const modules = matrix.length;

    const moduleSize = 5;
    const canvasSize = modules * moduleSize;

    ctx.canvas.width = canvasSize;
    ctx.canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#000";

    // Рисуем QR без 7×7 зон глазок
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {

            const inTopLeft = (r < 7 && c < 7);
            const inTopRight = (r < 7 && c >= modules - 7);
            const inBottomLeft = (r >= modules - 7 && c < 7);

            if (inTopLeft || inTopRight || inBottomLeft) continue;

            if (matrix[r][c] === 1) {
                ctx.fillRect(
                    c * moduleSize,
                    r * moduleSize,
                    moduleSize,
                    moduleSize
                );
            }
        }
    }

    // Глазки
    const eye = await loadSvg("./js/eyes/eye.svg");

    const eyePx = 7 * moduleSize;

    // Левый верхний
    ctx.drawImage(eye, 0, 0, eyePx, eyePx);

    // Правый верхний
    ctx.drawImage(eye, canvasSize - eyePx, 0, eyePx, eyePx);

    // Левый нижний
    ctx.drawImage(eye, 0, canvasSize - eyePx, eyePx, eyePx);
}
