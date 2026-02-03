// qrMatrix.js

// Библиотека qrcode-generator должна быть подключена в index.html:
// <script src="https://cdn.jsdelivr.net/npm/qrcode-generator/qrcode.js"></script>

export function generateMatrix(data) {
  if (!data || typeof data !== "string") {
    throw new Error("QR data must be a non-empty string");
  }

  // Тип QR-кода: 0 = автоопределение версии
  const qr = qrcode(0, "H"); // уровень коррекции ошибок H (как в Python)
  qr.addData(data);
  qr.make();

  const size = qr.getModuleCount();
  const matrix = [];

  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push(qr.isDark(y, x)); // true = чёрный модуль
    }
    matrix.push(row);
  }

  return matrix;
}
