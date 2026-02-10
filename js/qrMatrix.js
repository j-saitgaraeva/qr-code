export function generateMatrix(text) {
    const qr = QRCode.generate(text);
    return qr.modules;
}
