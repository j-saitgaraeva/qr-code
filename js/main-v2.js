import { generateMatrix } from './qrMatrix.js';
import { renderQR } from './qrRenderer.js';

const size = 165;              // Размер QR-кода в пикселях
const moduleSize = 5;          // 165 / 33 = 5 px на модуль

const qrContainer = document.getElementById('qr');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');
const urlInput = document.getElementById('urlInput');

generateBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    // Генерируем матрицу QR
    const matrix = generateMatrix(url);

    // Создаём canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    // Важно: отключаем сглаживание, чтобы всё было пиксельно-чётко
    ctx.imageSmoothingEnabled = false;

    // Рисуем QR-код с учётом зон под глазки и SVG-глазков
    await renderQR(ctx, matrix, moduleSize);

    // Показываем QR-код
    qrContainer.innerHTML = '';
    qrContainer.appendChild(canvas);

    // Кнопка скачивания
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = 'qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
});
