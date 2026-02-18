// Базовые настройки QR с фиксированным стилем глазков
const qrCode = new QRCodeStyling({
  width: 320,
  height: 320,
  type: "png",
  data: "https://example.com",
  margin: 0,
  qrOptions: {
    errorCorrectionLevel: "H"  // для лого (30% коррекции)
  },
  backgroundOptions: {
    color: "rgba(0,0,0,0)"  // прозрачный фон
  },
  dotsOptions: {
    type: "square",
    color: "#222222"
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#222222"
  },
  cornersDotOptions: {
    type: "extra-rounded",
    color: "#222222"
  }
});

const container = document.getElementById("qr-container");
qrCode.append(container);

const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// Обновляем данные и скачиваем PNG
downloadBtn.addEventListener("click", async () => {
  const raw = (input.value || "").trim();

  if (!raw) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

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
