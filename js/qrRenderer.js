// Загружаем SVG глазка и превращаем в <img>
async function loadSvg(url) {
    const res = await fetch(url);
    const text = await res.text();
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(text);
    await img.decode();
    return img;
}

// Основной рендер QR-кода (чёткий, пиксельный)
export async function renderQR(ctx, matrix, moduleSize) {
    const modules = matrix.length;

    // 1. Рисуем QR без глазков
    ctx.fillStyle = "#000";

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

    // Размер зоны глазка = 8 модулей
    const eyeZone = 8 * moduleSize;

    // Уменьшаем глазок на 10% для идеальной посадки
    const eyePx = eyeZone * 0.9;

    // Смещение, чтобы глазок был по центру зоны
    const offset = (eyeZone - eyePx) / 2;

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

