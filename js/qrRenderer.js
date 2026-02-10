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

    // === ЭТАП 1: внутренний canvas для пиксель‑перфект QR ===

    // Базовый размер модуля для честного рендера
    const baseModuleSize = 5;
    const internalSize = modules * baseModuleSize;

    const internalCanvas = document.createElement("canvas");
    internalCanvas.width = internalSize;
    internalCanvas.height = internalSize;

    const internalCtx = internalCanvas.getContext("2d");
    internalCtx.clearRect(0, 0, internalSize, internalSize);

    // Рисуем модули
    internalCtx.fillStyle = "#000";

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {

            // Зоны глаз: 9×9 модулей
            const inTopLeft = (r < 9 && c < 9);
            const inTopRight = (r < 9 && c >= modules - 9);
            const inBottomLeft = (r >= modules - 9 && c < 9);

            if (inTopLeft || inTopRight || inBottomLeft) continue;

            if (matrix[r][c] === 1) {
                internalCtx.fillRect(
                    c * baseModuleSize,
                    r * baseModuleSize,
                    baseModuleSize,
                    baseModuleSize
                );
            }
        }
    }

    // === ЭТАП 1.1: вырезаем зоны под глазки ===
    const eyeModules = 7;
    const quietModules = 1;
    const eyeBlockModules = eyeModules + quietModules * 2;
    const eyeBlockSize = eyeBlockModules * baseModuleSize;

    clearEyeZone(internalCtx, 0, 0, eyeBlockSize);
    clearEyeZone(internalCtx, internalSize - eyeBlockSize, 0, eyeBlockSize);
    clearEyeZone(internalCtx, 0, internalSize - eyeBlockSize, eyeBlockSize);

    // === ЭТАП 1.2: вставляем SVG‑глазки ===
    const eye = await loadSvg("./js/eyes/eye.svg");

    const eyePx = eyeModules * baseModuleSize;
    const offset = baseModuleSize; // 1 модуль разделителя

    // Левый верхний
    internalCtx.drawImage(eye, offset, offset, eyePx, eyePx);

    // Правый верхний
    internalCtx.drawImage(
        eye,
        internalSize - offset - eyePx,
        offset,
        eyePx,
        eyePx
    );

    // Левый нижний
    internalCtx.drawImage(
        eye,
        offset,
        internalSize - offset - eyePx,
        eyePx,
        eyePx
    );

    // === ЭТАП 2: Масштабирование в твой DOM‑canvas до фиксированного размера ===

    const finalSize = 130; // фиксированный итоговый размер

    ctx.canvas.width = finalSize;
    ctx.canvas.height = finalSize;

    ctx.clearRect(0, 0, finalSize, finalSize);
    ctx.imageSmoothingEnabled = false; // чтобы не было мыла

    ctx.drawImage(
        internalCanvas,
        0, 0, internalSize, internalSize,
        0, 0, finalSize, finalSize
    );
}

// Вспомогательная функция: очистка зоны под глазок
function clearEyeZone(ctx, x, y, size) {
    ctx.clearRect(x, y, size, size);
}
