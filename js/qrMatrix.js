export function generateMatrix(text) {
    // Версия 4, уровень коррекции H (более живучий код)
    const qr = qrcode(4, "H");
    qr.addData(text);
    qr.make();

    const size = qr.getModuleCount();
    const matrix = [];

    for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) {
            row.push(qr.isDark(r, c) ? 1 : 0);
        }
        matrix.push(row);
    }

    return matrix;
}
