// qrRenderer.js

// matrix — это результат generateMatrix(text)
// containerCanvas — тот canvas, который у тебя уже есть в верстке
export function renderQR(matrix, containerCanvas) {
    const modules = matrix.length;

    // === ЭТАП 1: рисуем QR пиксель‑перфект на внутреннем canvas ===

    // Базовый размер модуля для "честного" рендера
    const baseModuleSize = 5; // можно 4–6, это только для внутреннего рендера

    const canvasSize = modules * baseModuleSize;

    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Прозрачный фон — ничего не заливаем

    // Рисуем модули
    ctx.fillStyle = "#000000";

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (matrix[r][c]) {
                ctx.fillRect(
                    c * baseModuleSize,
                    r * baseModuleSize,
                    baseModuleSize,
                    baseModuleSize
                );
            }
        }
    }

    // === ЭТАП 1.1: вырезаем зоны под глазки (3 finder patterns) ===
    // Размер finder pattern — 7×7 модулей, плюс 1 модуль разделителя вокруг
    const eyeSizeModules = 7;
    const quietModules = 1;
    const eyeBlockModules = eyeSizeModules + quietModules * 2;
    const eyeBlockSize = eyeBlockModules * baseModuleSize;

    // Левый верхний глаз
    clearEyeZone(ctx, 0, 0, eyeBlockSize);
    // Правый верхний глаз
    clearEyeZone(ctx, canvasSize - eyeBlockSize, 0, eyeBlockSize);
    // Левый нижний глаз
    clearEyeZone(ctx, 0, canvasSize - eyeBlockSize, eyeBlockSize);

    // === ЭТАП 1.2: рисуем SVG‑глазки поверх (если они у тебя есть) ===
    // Здесь я оставляю заглушку — ты подставишь свой код вставки SVG
    // drawEye(ctx, x, y, eyeBlockSize);
    // ...

    // === ЭТАП 2: Масштабируем готовый QR до фиксированного размера ===

    const finalSize = 130; // Желаемый итоговый размер QR-кода

    // Привязываем итог к твоему основному canvas из верстки
    const finalCanvas = containerCanvas || document.createElement("canvas");
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;

    const finalCtx = finalCanvas.getContext("2d");
    finalCtx.clearRect(0, 0, finalSize, finalSize);

    // ВАЖНО: отключаем сглаживание, чтобы не было мыла
    finalCtx.imageSmoothingEnabled = false;

    finalCtx.drawImage(
        canvas,          // исходный QR
        0, 0, canvasSize, canvasSize,   // что берём
        0, 0, finalSize, finalSize      // куда и как масштабируем
    );

    return finalCanvas;
}

// Вспомогательная функция: очистка зоны под глазок
function clearEyeZone(ctx, x, y, size) {
    ctx.clearRect(x, y, size, size);
}
