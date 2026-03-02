// =====================================================
// 1. НАСТРОЙКА QR (H коррекция + твои стили #222222)
// =====================================================
const qrCode = new QRCodeStyling({
  width: 320,
  height: 320,
  type: "canvas",  // ← важно для обрезки
  data: "https://example.com",
  margin: 0,
  qrOptions: {
    errorCorrectionLevel: "H"  // 30% для большого лого
  },
  backgroundOptions: {
    color: "rgba(0,0,0,0)"     // прозрачный фон
  },
  dotsOptions: {
    type: "square",
    color: "#222222"            // твой цвет
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
qrCode.append(container);

const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");

// =====================================================
// 2. АВТООБРЕЗКА CANVAS (убирает все отступы)
// =====================================================
function cropCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Ищем границы непрозрачных пикселей (альфа > 10)
  let top = canvas.height, bottom = 0, left = canvas.width, right = 0;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 10) { // QR пиксель (альфа > 10)
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
  }
  
  // Новый canvas только с QR (без отступов)
  const croppedWidth = right - left + 1;
  const croppedHeight = bottom - top + 1;
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = croppedWidth;
  croppedCanvas.height = croppedHeight;
  croppedCanvas.getContext('2d').drawImage(
    canvas, 
    left, top, croppedWidth, croppedHeight,
    0, 0, croppedWidth, croppedHeight
  );
  
  return croppedCanvas;
}

// =====================================================
// 3. ОБРАБОТЧИК КНОПКИ (генерация + обрезка + ИМЯ ФАЙЛА)
// =====================================================
downloadBtn.addEventListener("click", async () => {
  const value = (input.value || "").trim();
  
  if (!value) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  // Нормализуем ссылку для QR
  const url = /^https?:\/\//i.test(value) ? value : "https://" + value;

  // Обновляем QR
  qrCode.update({ data: url });

  // Ждём отрисовки → обрезаем → скачиваем
  setTimeout(() => {
    const canvas = document.querySelector('#qr-container canvas');
    if (canvas) {
      const croppedCanvas = cropCanvas(canvas);
      
      // 🎯 УМНОЕ ИМЯ ФАЙЛА ИЗ ССЫЛКИ
      const fullUrl = input.value.trim();
      let fileName = 'qr-link.png';
      
      if (fullUrl) {
        const cleanName = fullUrl
          .replace(/^https?:\/\//i, '')  // Убираем https:// 
          .replace(/[^a-zA-Z0-9\-._]/g, '-')  // Безопасные символы
          .substring(0, 40);  // Макс 40 символов
          
        fileName = cleanName || 'link';
        fileName += '.png';
      }
      
      // Скачиваем с новым именем
      croppedCanvas.toBlob((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, 'image/png');
    } else {
      alert("Ошибка генерации QR. Попробуйте ещё раз.");
    }
  }, 200);
});
