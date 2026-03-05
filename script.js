// =====================================================
// 1. НАСТРОЙКА QR (СЕРЫЙ по умолчанию #CFCFD9)
// =====================================================
const qrCode = new QRCodeStyling({
  width: 320,
  height: 320,
  type: "canvas",
  data: "https://example.com",
  margin: 0,
  qrOptions: {
    errorCorrectionLevel: "H"
  },
  backgroundOptions: {
    color: "rgba(0,0,0,0)"
  },
  dotsOptions: {
    type: "square",
    color: "#CFCFD9"
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#CFCFD9"
  },
  cornersDotOptions: {
    type: "square",
    color: "#CFCFD9"
  }
});

const container = document.getElementById("qr-container");
qrCode.append(container);

const input = document.getElementById("url-input");
const downloadBtn = document.getElementById("download-btn");
const clearBtn = document.getElementById("clear-btn");
const errorEl = document.getElementById("char-error");

const MAX_LENGTH = 2000;

// =====================================================
// 2. УПРАВЛЕНИЕ ПОЛЕМ, КРЕСТИКОМ, КНОПКОЙ, QR И ОШИБКОЙ
// =====================================================
function updateInputState(value) {
  const length = value.length;
  const hasValue = value.trim().length > 0;
  const isTooLong = length > MAX_LENGTH;

  // Сообщение об ошибке + красная рамка
  if (isTooLong) {
    errorEl.textContent = `Достигнут лимит по символам: ${MAX_LENGTH}`;
    errorEl.style.display = "block";
    input.classList.add("error");
  } else {
    errorEl.textContent = "";
    errorEl.style.display = "none";
    input.classList.remove("error");
  }

  // Кнопка скачивания: активна только если есть текст и нет превышения лимита
  const canDownload = hasValue && !isTooLong;
  downloadBtn.disabled = !canDownload;
  downloadBtn.classList.toggle("btn-disabled", !canDownload);

  // Крестик виден только если есть какой-то текст (даже при ошибке)
  clearBtn.style.display = hasValue ? "flex" : "none";

  // Сброс QR на серый при пустом поле
  if (!hasValue) {
    qrCode.update({
      data: "https://example.com",
      dotsOptions: { color: "#CFCFD9" },
      cornersSquareOptions: { color: "#CFCFD9" },
      cornersDotOptions: { color: "#CFCFD9" }
    });
  }
}

// =====================================================
// 3. АВТООБРЕЗКА CANVAS
// =====================================================
function cropCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let top = canvas.height, bottom = 0, left = canvas.width, right = 0;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 10) {
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
  }

  const croppedWidth = right - left + 1;
  const croppedHeight = bottom - top + 1;
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = croppedWidth;
  croppedCanvas.height = croppedHeight;
  croppedCanvas.getContext("2d").drawImage(
    canvas,
    left,
    top,
    croppedWidth,
    croppedHeight,
    0,
    0,
    croppedWidth,
    croppedHeight
  );

  return croppedCanvas;
}

// =====================================================
// 4. ОБРАБОТЧИКИ ВВОДА И КРЕСТИКА
// =====================================================
input.addEventListener("input", () => {
  updateInputState(input.value);
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  input.value = "";
  input.focus();
  updateInputState("");
});

// Инициализация состояния
updateInputState("");

// =====================================================
// 5. КНОПКА СКАЧИВАНИЯ
// =====================================================
downloadBtn.addEventListener("click", async () => {
  const value = input.value.trim();

  if (!value) {
    alert("Пожалуйста, введите ссылку.");
    input.focus();
    return;
  }

  if (value.length > MAX_LENGTH) {
    alert(`Достигнут лимит по символам: ${MAX_LENGTH}`);
    return;
  }

  const url = /^https?:\/\//i.test(value) ? value : "https://" + value;

  // Чёрный QR
  qrCode.update({
    data: url,
    dotsOptions: { color: "#222222" },
    cornersSquareOptions: { color: "#222222" },
    cornersDotOptions: { color: "#222222" }
  });

  setTimeout(() => {
    const canvas = document.querySelector("#qr-container canvas");
    if (canvas) {
      const croppedCanvas = cropCanvas(canvas);

      let fileName = "qr-link.png";
      if (value) {
        const cleanName = value
          .replace(/^https?:\/\//i, "")
          .replace(/[^a-zA-Z0-9\-._]/g, "-")
          .substring(0, 35);
        fileName = "qr-" + (cleanName || "link") + ".png";
      }

      croppedCanvas.toBlob((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, "image/png");
    }
  }, 200);
});
