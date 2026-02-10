// Загружаем SVG глазка и превращаем в <img>
async function loadSvg(url) {
    const res = await fetch(url);
    const text = await res.text();
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(text);
    await img.decode();
    return img;
}

// Основной рендер QR-кода
export async function renderQR(ctx, matrix) {
    const modules = matrix.length;

    // Размер модуля вычисляем строго от canvas
    const canvasSize = ctx.canvas.width; // 165
    const moduleSize = canvasSize / modules; // 5px при 33×33

    // Чистим фон
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#000";

    // 1. Рисуем QR без глазков
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {

            // Пропускаем зоны глазков (8×8 модулей)
            const inTopLeft = r < 8 && c < 8;
            const inTopRight = r < 8 && c >= modules - 8;
            const inBottomLeft = r >= modules - 8 && c < 8;

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

    // 2. Загружаем SVG глазка
    const eye = await loadSvg("./js/eyes/eye.svg");

    // Зона глазка = 8 модулей = 40px
    const eyeZone = 8 * moduleSize;

    // Вставляем SVG 1:1, без масштабирования
    const eyePx = 35;

    // Центрируем глазок внутри зоны
    const offset = (eyeZone - eyePx) / 2;

    // 3. Рисуем глазки

    // Левый верхний
    ctx.drawImage(
        eye,
        offset,
        offset,
        eyePx,
        eyePx
    );

    // Правый верхний
    ctx.drawImage(
        eye,
        (modules - 8) * moduleSize + offset,
        offset,
        eyePx,
        eyePx
    );

    // Левый нижний
    ctx.drawImage(
        eye,
        offset,
        (modules - 8) * moduleSize + offset,
        eyePx,
        eyePx
    );
}
