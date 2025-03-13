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
 * Verifica se o cartão de memória é válido,
 * checando se o arquivo de imagem informado
 * possui ao menos o tamanho do super bloco e,
 * se está formatado contendo um número de versão
 * no padrão 1.x.0.0.
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

    if (mc.length < SUPERBLOCK_SIZE_BYTES) {
        return false
    }

    if (!isMemoryCardFormatted(mc)) {
        return false
    }

    return isValidMemoryCardVersion(
        getMemoryCardVersion(mc)
    )
}

/**
 * Verifica se o cartão de memória está formatado por
 * meio da checagem dos primeiros 28 bytes do arquivo.
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
    )).replace(/\x00/g, '') // Esqueci de remover os caracteres nulos
}

export function isValidMemoryCardVersion(version) {
    return VALID_VERSION_CARD.test(version)
}

export function getPageSizeBytes(mc) {
    return readUint16(mc, PAGE_SIZE_BYTES_RANGE[0]);
}

export function getPagesPerCluster(mc) {
    return readUint16(mc, PAGES_PER_CLUSTER_RANGE[0]);
}

export function getPagesPerBlock(mc) {
    return readUint16(mc, PAGES_PER_BLOCK_RANGE[0]);
}

export function getClusterPerCard(mc) {
    return readUint32(mc, CLUSTERS_PER_CARD_RANGE)
}
