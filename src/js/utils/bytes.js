/**
 * Lê um valor de 16 bits (uint16) a partir de um array de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} index Índice inicial.
 * @returns {number} Valor de 16 bits.
 */
export function readInt16(bytes, index) {
    return bytes[index] | (bytes[index + 1] << 8)
}

/**
 * Lê um valor de 32 bits (uint32) a partir de um array de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} index Índice inicial.
 * @returns {number} Valor de 32 bits.
 */
export function readInt32(bytes, index) {
    //return (view[0] << 0) | (view[1] << 8) | (view[2] << 16) | (view[3] << 24)

    /**
     * Aprendi muito com a solução acima, entretanto, assim
     * fica mais simples de manter.
     */
    const view = new DataView(bytes.buffer, index, 4)
    return view.getInt32(0, true); // true = little-endian
}

/**
 * Lê uma lista de valores de 32 bits (uint32) a partir de uma lista de bytes.
 * 
 * @param {Uint8Array} bytes Lista de bytes.
 * @param {[number, number]} range - Intervalo de bytes [start, end] a ser lido.
 * @param {boolean} inclusive Define se o intervalo é inclusivo (padrão: true).
 * @returns {Int32Array} Lista de valores de 32 bits.
 */
export function readInt32List(bytes, [start, end], inclusive = true) {
    // Ajusta o cálculo do tamanho do intervalo com base no tipo (inclusivo/exclusivo)
    const inclusiveOffset = inclusive ? 1 : 0
    const bytesLen = end - start + inclusiveOffset

    const arrayLen = bytesLen / 4
    const view = new DataView(bytes.buffer, start, bytesLen)

    const list = new Int32Array(arrayLen)
    for (let i = 0; i < arrayLen; ++i) {
        list[i] = view.getInt32(i * 4, true)
    }
    return list
}
