document.getElementById("generateBtn").addEventListener("click", () => {
    const url = document.getElementById("urlInput").value.trim();
    if (!url) return;

    // Генерация QR
    const qr = QRCode.generate(url);
    const matrix = qr.modules;

    console.log("Размер матрицы:", matrix.length, "x", matrix.length);

    // Рендер
    const qrContainer = document.getElementById("qr");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const modules = matrix.length;
    const moduleSize = 5;
    const canvasSize = modules * moduleSize;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.fillStyle = "#000";
    ctx.imageSmoothingEnabled = false;

    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            if (matrix[r][c]) {
                ctx.fillRect(
                    c * moduleSize,
                    r * moduleSize,
                    moduleSize,
                    moduleSize
                );
            }
        }
    }

    qrContainer.innerHTML = "";
    qrContainer.appendChild(canvas);

    // Кнопка скачать
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.style.display = "block";
    downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.download = "qr.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
});
