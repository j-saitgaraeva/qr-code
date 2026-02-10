import { generateMatrix } from "./qrMatrix.js";
import { renderMatrixToPng } from "./qrRenderer.js";

const input = document.getElementById("urlInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const qrBox = document.getElementById("qr");

let lastPngDataUrl = null;

generateBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    try {
        const matrix = generateMatrix(text);
        const png = await renderMatrixToPng(matrix, 150);

        lastPngDataUrl = png;

        qrBox.innerHTML = `<img src="${png}" alt="QR code">`;

        generateBtn.style.display = "none";
        downloadBtn.style.display = "block";

    } catch (err) {
        console.error(err);
        alert("Ошибка при генерации QR-кода");
    }
};

downloadBtn.onclick = () => {
    if (!lastPngDataUrl) return;

    const a = document.createElement("a");
    a.href = lastPngDataUrl;
    a.download = "qr.png";
    a.click();
};
