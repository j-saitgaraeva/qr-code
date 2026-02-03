// main.js

import { generateMatrix } from "./qrMatrix.js";
import { renderMatrixToPng } from "./qrRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("qr-input");
  const button = document.getElementById("qr-generate");
  const img = document.getElementById("qr-result");

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      alert("Введите текст для QR-кода");
      return;
    }

    try {
      const matrix = generateMatrix(text);
      const pngDataUrl = renderMatrixToPng(matrix, 150);
      img.src = pngDataUrl;
    } catch (err) {
      console.error(err);
      alert("Ошибка при генерации QR-кода");
    }
  });
});
