/**
 * Tamanho em Bytes.
 */
export const BYTES = Object.freeze({
    /**
     * Single Byte ou Único Byte
     * é utilizado para informar um
     * tamanho de apenas 1 byte.
     */
    SINGLE_BYTE: 1,
    /**
     * Word ou Palavra é utilizado para
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
 * Verifica se é um Array de Bytes e se não está vazio.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 */
export function validateByte(bytes) {
    if (!(bytes instanceof Uint8Array) || bytes.length === 0) {
        throw "Input 'bytes' must be a non-empty Uint8Array."
    }
}

/**
 * Verifica se o Offset é um número e se não é negativo.
 * 
 * @param {number} offset Índice inicial para leitura.
 */
export function validateOffset(offset) {
    if (typeof offset !== 'number' || offset < 0) {
        throw "Invalid 'offset' parameter. It must be a non-negative number."
    }
}

/**
 * Realiza a validação do Offset no Intervalo do Array de Bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} offset Índice inicial para leitura.
 * @param {*} byteSize Tamanho do Byte que será trabalhado (SINGLE_BYTE, HALF_WORD, WORD).
 */
export function validateOffsetRange(bytes, offset, byteSize) {
    if (offset + byteSize > bytes.length) {
        throw `Attempted to read out of bounds. Offset ${offset} (length ${byteSize}) exceeds available bytes length ${bytes.length}.`
    }
}

/**
 * Verifica se um intervalo (start, end) é do tipo numérico e se
 * estão em um intervalo válido.
 * 
 * @param {[number, number]} range - Intervalo de bytes [start, end] a ser lido.
 */
export function validateByteRange([start, end]) {
    if (typeof start !== 'number' || typeof end !== 'number' || start < 0 || end < 0 || start > end) {
        throw "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."
    }
}

/**
 * Realiza a validação do intervalo (start e end) em relação ao tamanho total do array.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {[number, number]} range - Intervalo de bytes [start, end] a ser lido.
 * @param {*} byteSize Tamanho do Byte que será trabalhado (SINGLE_BYTE, HALF_WORD, WORD).
 * @param {boolean} inclusive Define se o intervalo é inclusivo (padrão: true).
 */
export function validateByteListRangeSize(bytes, [start, end], byteSize, inclusive = true) {
    const inclusiveOffset = inclusive ? 1 : 0
    const bytesLen = end - start + inclusiveOffset

    if (start + bytesLen > bytes.length) {
        throw `Attempted to read out of bounds. Range [${start}, ${end}] (length ${byteSize}) exceeds available bytes length ${bytes.length}.`
    }

    if (bytesLen % byteSize !== 0) {
        throw `Calculated byte length (${bytesLen} bytes) is not a multiple of ${byteSize} size, which is required for reading values.`
    }
}

/**
 * Realiza a validação do Array de Bytes que será trabalhado.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} offset Índice inicial para leitura.
 * @param {*} byteSize Tamanho do Byte que será trabalhado (SINGLE_BYTE, HALF_WORD, WORD).
 */
export function validateBytes(bytes, offset, byteSize) {
    validateByte(bytes)
    validateOffset(offset)
    validateOffsetRange(bytes, offset, byteSize)
}

/**
 * Realiza a validação de uma lista de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {[number, number]} range - Intervalo de bytes [start, end] a ser lido.
 * @param {*} byteSize Tamanho do Byte que será trabalhado (SINGLE_BYTE, HALF_WORD, WORD).
 * @param {boolean} inclusive Define se o intervalo é inclusivo (padrão: true). 
 */
export function validateByteList(bytes, [start, end], byteSize, inclusive = true) {
    validateByte(bytes)
    validateByteRange([start, end])
    validateByteListRangeSize(bytes, [start, end], byteSize, inclusive)
}

/**
 * Lê um valor de 16 bits (uint16) a partir de um array de bytes.
 * 
 * @param {Uint8Array} bytes Array de bytes.
 * @param {number} offset Índice inicial para leitura.
 * @returns {number} Valor de 16 bits.
 */
export function readUint16(bytes, offset) {
    //return bytes[offset] | (bytes[offset + 1] << 8)

    const byteSize = BYTES.HALF_WORD
    validateBytes(bytes, offset, byteSize)

    const view = new DataView(bytes.buffer, offset, byteSize)
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

    const byteSize = BYTES.WORD
    validateBytes(bytes, offset, byteSize)

    /*
     * Aprendi muito com a solução acima, entretanto, assim
     * fica mais simples de manter, sem falar que já lida com
     * os inteiros (com e sem sinal) de uma melhor maneira, o que
     * não ocorre na expressão acima.
     */
    const view = new DataView(bytes.buffer, offset, byteSize)
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
    const byteSize = BYTES.WORD
    validateByteList(bytes, [start, end], byteSize, inclusive)

    // Ajusta o cálculo do tamanho do intervalo com base no tipo (inclusivo/exclusivo)
    const inclusiveOffset = inclusive ? 1 : 0
    const bytesLen = end - start + inclusiveOffset

    const arrayLen = bytesLen / byteSize
    const view = new DataView(bytes.buffer, start, bytesLen)

    const list = new Int32Array(arrayLen)
    for (let i = 0; i < arrayLen; ++i) {
        list[i] = view.getInt32(i * byteSize, true) // true = little-endian
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
    validateByte(bytes)

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
    const byteSize = BYTES.SINGLE_BYTE
    validateByteList(bytes, [start, end], byteSize, false)

    let signature = 0

    for (let i = start; i < end; ++i) {
        signature += bytes[i]
    }

    return signature === expectedSignature
}
