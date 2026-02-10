// Загружаем SVG и превращаем в <img>
async function loadSvg(url) {
    const res = await fetch(url);
    const text = await res.text();
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(text);
    await img.decode();
    return img;
}

export async function renderMatrixToPng(matrix, sizePx) {
    const modules = matrix.length;
    const scale = sizePx / modules;

    const canvas = document.createElement("canvas");
    canvas.width = sizePx;
    canvas.height = sizePx;
    const ctx = canvas.getContext("2d");

    // 1. Рисуем QR без глазков
    ctx.fillStyle = "#000";
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {

            // Пропускаем зоны глазков (8×8)
            const inTopLeft = r < 8 && c < 8;
            const inTopRight = r < 8 && c >= modules - 8;
            const inBottomLeft = r >= modules - 8 && c < 8;

            if (inTopLeft || inTopRight || inBottomLeft) continue;

            if (matrix[r][c] === 1) {
                ctx.fillRect(
                    c * scale,
                    r * scale,
                    scale,
                    scale
                );
            }
        }
    }

    // 2. Загружаем SVG глазок
    const eye = await loadSvg("./js/eyes/eye.svg");

    // Размер зоны глазка = 8 модулей
    // Уменьшаем глазок на 10% для идеальной посадки
    const eyePx = 8 * scale * 0.9;

    // Смещение, чтобы глазок был по центру зоны
    const offset = (8 * scale - eyePx) / 2;

    // 3. Рисуем глазки строго по сетке QR

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
        (modules - 8) * scale + offset,
        offset,
        eyePx,
        eyePx
    );

    // Левый нижний
    ctx.drawImage(
        eye,
        offset,
        (modules - 8) * scale + offset,
        eyePx,
        eyePx
    );

    return canvas.toDataURL("image/png");
}
