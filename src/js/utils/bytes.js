/**
 * Lê um valor de 16 bits (uint16) a partir de um array de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} index Índice inicial.
 * @returns {number} Valor de 16 bits.
 */
export function readUint16(bytes, index) {
    return bytes[index] | (bytes[index + 1] << 8)
}

/**
 * Lê um valor de 32 bits (uint32) a partir de um array de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} index Índice inicial.
 * @returns {number} Valor de 32 bits.
 */
export function readUint32(bytes, index) {
    //return (view[0] << 0) | (view[1] << 8) | (view[2] << 16) | (view[3] << 24)

    /**
     * Aprendi muito com a solução acima, entretanto, assim
     * fica mais simples de manter.
     */
    const view = new DataView(bytes.buffer, index, 4)
    return view.getUint32(0, true); // true = little-endian
}