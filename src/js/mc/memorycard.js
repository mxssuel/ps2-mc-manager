import {
    SUPERBLOCK_SIZE_BYTES,
    EXPECTED_BYTE_RANGE_FORMATTED_CARD,
    EXPECTED_SUM_VALUE_FORMATTED_CARD,
    EXPECTED_FIRST_BYTE_FORMATTED_CARD,
    VERSION_CARD_RANGE,
    VALID_VERSION_CARD,
    PAGE_SIZE_BYTES_RANGE,
    PAGES_PER_CLUSTER_RANGE,
    PAGES_PER_BLOCK_RANGE,
    CLUSTERS_PER_CARD_RANGE
} from "./constants.js"

import { readUint16, readUint32 } from "../utils/bytes.js"

/**
 * Verifica se o cartão de memória é válido.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {boolean}
 */
export function isValidMemoryCard(mc) {
    /**
     * Optei por filtrar apenas pelo tamanho do Super Bloco,
     * devido ao fato de ter alguns mods que geram cartões
     * de memória fora do convencional de 8MB, 16MB, etc,
     * podendo chegar até 2GB.
     * 
     * Então, por hora, não vou focar no tamanho do cartão, mas sim,
     * na sua organização interna. Arquivos de qualquer tamanho que passarem
     * pela validação dessa função serão considerados válidos.
     */
    return mc.length > SUPERBLOCK_SIZE_BYTES
        && isMemoryCardFormatted(mc)
        && isValidMemoryCardVersion(
            getMemoryCardVersion(mc)
        )
}

/**
 * Verifica se o cartão de memória está formatado.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {boolean}
 */
export function isMemoryCardFormatted(mc) {
    const [start, end] = EXPECTED_BYTE_RANGE_FORMATTED_CARD

    /*
     * Se o primeiro byte não for igual ao esperado,
     * não faz o menor sentido ficar analisando os demais.
     */
    if (mc[start] !== EXPECTED_FIRST_BYTE_FORMATTED_CARD) {
        return false
    }

    /**
     * Agora, é só checarmos o valor dos primeiros 28 bytes.
     * Removi o slice e reduce, evitando cópias do array e
     * deixando toda operação em um único loop.
     */
    let sum = 0

    for (let i = start, len = end; i <= len; ++i) {
        sum += mc[i]
    }

    return sum === EXPECTED_SUM_VALUE_FORMATTED_CARD
}

/**
 * Retorna a versão do formato usado no cartão de memória.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {string}
 */
export function getMemoryCardVersion(mc) {
    const [start, end] = VERSION_CARD_RANGE

    /**
     * Optei por Uint8Array ao invés de slice,
     * pois o slice gera uma cópia do array,
     * enquanto o Uint8Array cria apenas uma view
     * para os dados.
     */
    return new TextDecoder().decode(new Uint8Array(
        mc.buffer, start, end - start + 1 // n+1
    )).replaceAll("\x00", "") // Tinha esquecido de remover os caracteres nulos
}

/**
 * Verifica se a versão do cartão de memória é válida.
 * É considerado válido uma versão no formato 1.x.0.0.
 * 
 * @param {string} version Versão do cartão.
 * @returns {boolean}
 */
export function isValidMemoryCardVersion(version) {
    return VALID_VERSION_CARD.test(version)
}

/**
 * Retorna o tamanho em bytes de uma página.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getPageSizeBytes(mc) {
    return readUint16(mc, PAGE_SIZE_BYTES_RANGE[0])
}

/**
 * Retorna o número de páginas em um cluster.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getPagesPerCluster(mc) {
    return readUint16(mc, PAGES_PER_CLUSTER_RANGE[0])
}

/**
 * Retorna o número de páginas em um erase block.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getPagesPerBlock(mc) {
    return readUint16(mc, PAGES_PER_BLOCK_RANGE[0])
}

/**
 * Retorna tamanho total do cartão de memória em clusters.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getClusterPerCard(mc) {
    return readUint32(mc, CLUSTERS_PER_CARD_RANGE[0])
}
