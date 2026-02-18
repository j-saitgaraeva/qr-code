// =====================================================
// 1. НАСТРОЙКА QR КОДА С H КОРЕКЦИЕЙ (для большого лого)
// =====================================================
let qrCode;

function createQR(data = "https://example.com", dynamicSize = true) {
  // Динамический размер canvas по длине ссылки
  const size = dynamicSize && data.length < 30 ? 280 : 320;
  
  qrCode = new QRCodeStyling({
    // ДИНАМИЧЕСКИЙ РАЗМЕР — убирает отступы
    width: size,
    height: size,
    
    type: "png",
    data: data,
    
    // КЛЮЧЕВОЙ ПАРАМЕТР — без отступов библиотеки
    margin: 0,
    
    // H = 30% коррекции — для ЛОГО до 25% площади!
    qrOptions: {
      errorCorrectionLevel: "H"
    },
    
    // Прозрачный фон для наложения лого
    backgroundOptions: {
      color: "rgba(0,0,0,0)"
    },
    
    // Твои настройки стиля (из базовой версии)
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
  container.innerHTML = ""; // очищаем старый QR
  qrCode.append(container);
}

// Создаём начальный QR
createQR();

// =====================================================
// 2. ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
// =====================================================
const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// =====================================================
// 3. ОБРАБОТЧИК КНОПКИ "СКАЧАТЬ"
// =====================================================
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

  // ГЕНЕРИРУЕМ QR с динамическим размером + H коррекцией
  createQR(url, true);

  // Скачиваем после отрисовки
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
