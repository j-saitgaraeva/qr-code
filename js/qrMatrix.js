export function generateMatrix(text) {
    const qr = qrcode(4, "M"); // фиксированная версия 4
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
