// =====================================================
// БАЗОВАЯ НАСТРОЙКА (твоя рабочая версия)
// =====================================================
let qrCode;

function createQR(data = "https://example.com", dynamicSize = true) {
  // Если короткая ссылка — делаем маленький canvas
  const size = dynamicSize && data.length < 30 ? 280 : 320;
  
  qrCode = new QRCodeStyling({
    width: size,
    height: size,
    type: "png",
    data: data,
    margin: 0,
    qrOptions: {
      errorCorrectionLevel: "M"
    },
    backgroundOptions: {
      color: "rgba(0,0,0,0)"
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
      type: "square",
      color: "#222222"
    }
  });
  
  const container = document.getElementById("qr-container");
  container.innerHTML = "";
  qrCode.append(container);
}

// Начальный QR
createQR();

// ЭЛЕМЕНТЫ
const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// ОБРАБОТЧИК
downloadBtn.addEventListener("click", async () => {
  const value = (input.value || "").trim();

  if (!value) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  const url =
    /^https?:\/\//i.test(value) || /^mailto:/i.test(value)
      ? value
      : "https://" + value;

  // ДИНАМИЧЕСКИЙ РАЗМЕР ПО ДЛИНЕ ССЫЛКИ
  createQR(url, true);

  // Скачиваем с задержкой
  setTimeout(async () => {
    try {
      await qrCode.download({
        extension: "png",
        name: "qr-link"
      });
    } catch (e) {
      console.error(e);
      alert("Не удалось скачать QR‑код. Попробуйте ещё раз.");
    }
  }, 100);
});
