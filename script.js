// ===============================
// 1. НАСТРОЙКА QR (серый по умолчанию)
// ===============================
const qrCode = new QRCodeStyling({
  width: 320,
  height: 320,
  type: "canvas",
  data: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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

// ===============================
// 2. Состояние поля, ошибки и QR
// ===============================
function updateInputState(rawValue) {
  const value = rawValue.trim(); // убираем пробелы по краям
  const length = value.length;
  const hasValue = length > 0;
  const isTooLong = length > MAX_LENGTH;

  // сообщение об ошибке + красная рамка
  if (isTooLong) {
    errorEl.textContent = `Достигнут лимит по символам: ${MAX_LENGTH}`;
    errorEl.style.display = "block";
    input.classList.add("error");
  } else {
    errorEl.textContent = "";
    errorEl.style.display = "none";
    input.classList.remove("error");
  }

  // кнопка скачивания
  const canDownload = hasValue && !isTooLong;
  downloadBtn.disabled = !canDownload;
  downloadBtn.classList.toggle("btn-disabled", !canDownload);

  // крестик
  clearBtn.style.display = hasValue ? "flex" : "none";

  // сброс QR на серый, если строки по факту нет
  if (!hasValue) {
    qrCode.update({
      data: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      dotsOptions: { color: "#CFCFD9" },
      cornersSquareOptions: { color: "#CFCFD9" },
      cornersDotOptions: { color: "#CFCFD9" }
    });
  }
}

// ===============================
// 3. Автообрезка canvas
// ===============================
function cropCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let top = canvas.height;
  let bottom = 0;
  let left = canvas.width;
  let right = 0;

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

  const croppedCtx = croppedCanvas.getContext("2d");
  croppedCtx.drawImage(
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

// ===============================
// 4. Обработчики ввода (запрет пробелов по краям) и крестика
// ===============================

// живой ввод: убираем пробелы/таб/переводы строк в начале и конце
input.addEventListener("input", () => {
  const before = input.value;
  const trimmedEdges = before.replace(/^\s+|\s+$/g, "");

  if (before !== trimmedEdges) {
    input.value = trimmedEdges;
    // курсор в конец строки (самый понятный вариант для URL)
    input.setSelectionRange(trimmedEdges.length, trimmedEdges.length);
  }

  updateInputState(input.value);
});

// вставка: обрезаем пробелы по краям вставляемого текста
input.addEventListener("paste", (event) => {
  event.preventDefault();
  const pasted = (event.clipboardData || window.clipboardData)
    .getData("text")
    .trim();

  const start = input.selectionStart;
  const end = input.selectionEnd;
  const current = input.value;

  const nextValue = current.slice(0, start) + pasted + current.slice(end);
  input.value = nextValue;

  const caretPos = start + pasted.length;
  input.setSelectionRange(caretPos, caretPos);

  updateInputState(input.value);
});

// крестик
clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  input.value = "";
  input.focus();
  updateInputState("");
});

// начальное состояние
updateInputState("");

// ===============================
// 5. Кнопка скачивания PNG
// ===============================
downloadBtn.addEventListener("click", () => {
  const value = input.value.trim(); // защита от случайных пробелов

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

  // делаем QR чёрным под скачивание
  qrCode.update({
    data: url,
    dotsOptions: { color: "#222222" },
    cornersSquareOptions: { color: "#222222" },
    cornersDotOptions: { color: "#222222" }
  });

  // даём QR библиотеке время перерисоваться
  setTimeout(() => {
    const canvas = document.querySelector("#qr-container canvas");
    if (!canvas) return;

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
      if (!blob) return;
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }, "image/png");
  }, 200);
});
