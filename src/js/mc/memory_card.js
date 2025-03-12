import {
    EXPECTED_BYTE_RANGE_FORMATTED_CARD,
    EXPECTED_SUM_VALUE_FORMATTED_CARD,
    EXPECTED_FIRST_BYTE_FORMATTED_CARD,
    VERSION_CARD_RANGE,
    PAGE_SIZE_BYTES_RANGE,
    PAGES_PER_CLUSTER_RANGE,
    PAGES_PER_BLOCK_RANGE,
    CLUSTERS_PER_CARD_RANGE
} from "./constants.js"

/**
 * Verifica se o cartão de memória é válido.
 * 
 * Optei por filtrar apenas pelos primeiros 28 bytes
 * devido ao fato de ter alguns mods que geram cartões
 * de memória fora do convencional de 8MB, 16MB, etc,
 * podendo chegar até 2GB.
 * 
 * Então, por hora, não vou focar no tamanho do cartão, mas sim,
 * na sua organização interna. Arquivos de qualquer tamanho que passarem
 * pela validação dessa função serão considerados válidos.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {boolean}
 */
export function isValidMemoryCard(mc) {
    /*
     * O cartão de memória do PS2 deve conter ao menos
     * 28 bytes com a frase de identificação.
     */
    if (mc.length < EXPECTED_BYTE_RANGE_FORMATTED_CARD[1] + 1 // n+1
    ) {
        return false
    }

    return isMemoryCardFormatted(mc)
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
     * Optei por Uint8Array ao invés de slicer,
     * pois o slicer gera uma cópia do array,
     * enquanto o Uint8Array cria apenas uma view
     * para os dados.
     */
    return new TextDecoder().decode(new Uint8Array(
        mc.buffer, start, end - start + 1 // n+1
    ))
}

export function getPageSizeBytes(mc) {
    const [start, end] = PAGE_SIZE_BYTES_RANGE

    return mc[start] | (mc[end] << 8)
}

export function getPagesPerCluster(mc) {
    const [start, end] = PAGES_PER_CLUSTER_RANGE

    return mc[start] | (mc[end] << 8)
}

export function getPagesPerBlock(mc) {
    const [start, end] = PAGES_PER_BLOCK_RANGE

    return mc[start] | (mc[end] << 8)
}

export function getClusterPerCard(mc) {
    const [start, end] = CLUSTERS_PER_CARD_RANGE
    const bytes = new Uint8Array(
        mc.buffer, start, end - start + 1 // n+1
    )

    return (bytes[0] << 0) | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)
}
