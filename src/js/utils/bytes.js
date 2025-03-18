/**
 * Tamanho em Bytes.
 */
export const BYTES = Object.freeze({
    /**
     * Word ou Palavara é utilizado para
     * informar um tamanho de 4 bytes.
     */
    WORD: 4,
    /**
     * Half Word ou Meia-Palavra é utilizado para
     * informar um tamanho de 2 bytes.
     */
    HALF_WORD: 2
})

/**
 * Lê um valor de 16 bits (uint16) a partir de um array de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} offset Índice inicial para leitura.
 * @returns {number} Valor de 16 bits.
 */
export function readUint16(bytes, offset) {
    //return bytes[offset] | (bytes[offset + 1] << 8)

    const view = new DataView(bytes.buffer, offset, BYTES.HALF_WORD)
    return view.getUint16(0, true) // true = little-endian
}

/**
 * Lê um valor de 32 bits a partir de um array de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} offset Índice inicial para leitura.
 * @returns {number} Valor de 32 bits.
 */
export function readInt32(bytes, offset) {
    //return (view[0] << 0) | (view[1] << 8) | (view[2] << 16) | (view[3] << 24)

    /*
     * Aprendi muito com a solução acima, entretanto, assim
     * fica mais simples de manter, sem falar que já lida com
     * os inteiros (com e sem sinal) de uma melhor maneira, o que
     * não ocorre na expressão acima.
     */
    const view = new DataView(bytes.buffer, offset, BYTES.WORD)
    return view.getInt32(0, true) // true = little-endian
}

/**
 * Lê uma lista de valores de 32 bits a partir de uma lista de bytes.
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

    const arrayLen = bytesLen / BYTES.WORD
    const view = new DataView(bytes.buffer, start, bytesLen)

    const list = new Int32Array(arrayLen)
    for (let i = 0; i < arrayLen; ++i) {
        list[i] = view.getInt32(i * BYTES.WORD, true)
    }

    return list
}

/**
 * Converte um intervalo de bytes em uma string, removendo caracteres nulos (\x00).
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @returns {string} String resultante, sem caracteres nulos.
 */
export function readBytesAsString(bytes) {
    return new TextDecoder()
        .decode(bytes)
        .replaceAll("\x00", "")
}

/**
 * Verifica se a soma dos bytes no intervalo [start, end] corresponde à assinatura esperada.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {[number, number]} range Intervalo de bytes [start, end] a ser verificado.
 * @param {number} expectedSignature Assinatura esperada (soma dos bytes no intervalo).
 * @returns {boolean} True se a assinatura for válida, caso contrário, false.
 */
export function validateByteChecksum(bytes, [start, end], expectedSignature) {
    let signature = 0

    for (let i = start; i < end; ++i) {
        signature += bytes[i]
    }

    return signature === expectedSignature
}
