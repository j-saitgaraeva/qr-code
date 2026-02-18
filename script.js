// Настройки QR с фиксированным стилем
const qrCode = new QRCodeStyling({
  width: 320,
  height: 320,
  type: "png",
  data: "https://example.com", // дефолт, пока пользователь не ввёл своё
  margin: 0,
  image: null,
  qrOptions: {
    errorCorrectionLevel: "M" // баланс надёжности и размера файла
  },
  backgroundOptions: {
    color: "rgba(0,0,0,0)" // прозрачный фон
  },
  dotsOptions: {
    type: "square", // квадратный паттерн модулей
    color: "#000000"
  },
  cornersSquareOptions: {
    // рамка глазков
    type: "rounded", // скруглённый квадрат
    color: "#000000"
  },
  cornersDotOptions: {
    // центр глазков
    type: "rounded", // скруглённый квадрат
    color: "#000000"
  }
});

const container = document.getElementById("qr-container");
qrCode.append(container);

const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// Обновление QR при клике на «Скачать»
downloadBtn.addEventListener("click", async () => {
  const value = (input.value || "").trim();

  if (!value) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  // Простая нормализация: если нет схемы — добавляем https://
  const url =
    /^https?:\/\//i.test(value) || /^mailto:/i.test(value)
      ? value
      : "https://" + value;

  qrCode.update({
    data: url
  });

  try {
    await qrCode.download({
      extension: "png",
      name: "qr-link"
    });
  } catch (e) {
    console.error(e);
    alert("Не удалось скачать QR‑код. Попробуйте ещё раз.");
  }
});
