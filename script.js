// Базовые настройки QR с фиксированным стилем глазков
const qrCode = new QRCodeStyling({
  width: 320,
  height: 320,
  type: "png",
  data: "https://example.com", // дефолт, пока пользователь не ввёл ссылку
  margin: 0,
  qrOptions: {
    // баланс между надёжностью и размером файла
    errorCorrectionLevel: "M"
  },
  backgroundOptions: {
    // полностью прозрачный фон
    color: "rgba(0,0,0,0)"
  },
  dotsOptions: {
    // квадратный паттерн модулей, как классический QR
    type: "square",
    color: "#000000"
  },
  // Рамка глазков — максимально «жирный» скруглённый квадрат
  cornersSquareOptions: {
    /**
     * Поддерживаемые типы зависят от версии библиотеки.
     * Здесь ставим extra-rounded (или rounded, если extra-rounded не сработает).
     * Это создаёт рамку с сильным радиусом, похожим на твой SVG.
     */
    type: "dots", // было "extra-rounded", "classy-rounded", "square", "rounded"
    color: "#000000"
  },
  // Центр глазков — скруглённый квадрат
  cornersDotOptions: {
    type: "dots", // было "rounded", "square", "classy", "classy-rounded", "extra-rounded"
    color: "#000000"
  }
});

const container = document.getElementById("qr-container");
qrCode.append(container);

const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// Обновляем данные и сразу скачиваем PNG
downloadBtn.addEventListener("click", async () => {
  const raw = (input.value || "").trim();

  if (!raw) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  // Если пользователь не указал схему, добавляем https://
  const url =
    /^https?:\/\//i.test(raw) || /^mailto:/i.test(raw) ? raw : "https://" + raw;

  qrCode.update({ data: url });

  try {
    await qrCode.download({
      name: "qr-link",
      extension: "png"
    });
  } catch (err) {
    console.error(err);
    alert("Не удалось скачать QR‑код. Попробуйте ещё раз.");
  }
});
