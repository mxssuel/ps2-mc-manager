import { readUint16, readInt32, readInt32List } from "../utils/bytes.js"

import {
    SUPERBLOCK, FILE_SYSTEM_STRUCTURE, FLAGS
} from "./constants.js"

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
    return mc.length > SUPERBLOCK.SIZE_BYTES
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
    const [start, end] = SUPERBLOCK.EXPECTED_BYTE_RANGE_FORMATTED_CARD

    /*
     * Se o primeiro byte não for igual ao esperado,
     * não faz o menor sentido ficar analisando os demais.
     */
    if (mc[start] !== SUPERBLOCK.EXPECTED_FIRST_BYTE_FORMATTED_CARD) {
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

    return sum === SUPERBLOCK.EXPECTED_SUM_VALUE_FORMATTED_CARD
}

/**
 * Retorna a versão do formato usado no cartão de memória.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {string}
 */
export function getMemoryCardVersion(mc) {
    const [start, end] = SUPERBLOCK.VERSION_CARD_RANGE

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
 * Verifica se a versão do cartão de memória é válido.
 * É considerado válido uma versão no formato 1.x.0.0.
 * 
 * @param {string} version Versão do cartão.
 * @returns {boolean}
 */
export function isValidMemoryCardVersion(version) {
    return SUPERBLOCK.VALID_VERSION_CARD.test(version)
}

/**
 * Retorna o tamanho em bytes de uma página.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getPageSizeBytes(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.PAGE_SIZE_BYTES_RANGE[0])
}

/**
 * Retorna o número de páginas em um cluster.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getPagesPerCluster(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.PAGES_PER_CLUSTER_RANGE[0])
}

/**
 * Retorna o número de páginas em um erase block.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getPagesPerBlock(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.PAGES_PER_BLOCK_RANGE[0])
}

/**
 * Retorna tamanho total do cartão de memória em clusters.
 * 
 * @param {Uint8Array} mc Memory Card
 * @returns {number}
 */
export function getClusterPerCard(mc) {
    return readInt32(mc, FILE_SYSTEM_STRUCTURE.CLUSTERS_PER_CARD_RANGE[0])
}

/**
 * Retorna o offset do primeiro cluster alocável.
 * 
 * @param {Uint8Array} mc - Memory Card
 * @returns {number}
 */
export function getAllocOffset(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.ALLOC_OFFSET[0]);
}

export function getAllocEnd(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.ALLOC_END[0]);
}

/**
 * Retorna o cluster do diretório raiz do cartão de memória.
 * 
 * @param {Uint8Array} mc - Memory Card
 * @returns {number}
 */
export function getRootDirCluster(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.ROOTDIR_CLUSTER);
}

/**
 * Retorna o bloco de backup 1 do cartão de memória.
 * O bloco de backup 1 é uma cópia de segurança de parte dos metadados
 * do cartão, usada para recuperação em caso de corrupção.
 * 
 * @param {Uint8Array} mc - Memory Card
 * @returns {number}
 */
export function getBackupBlock1(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.BACKUP_BLOCK1[0]);
}

/**
 * Retorna o bloco de backup 2 do cartão de memória.
 * O bloco de backup 2 é uma segunda cópia de segurança de parte dos metadados
 * do cartão, usada para recuperação em caso de corrupção.
 * 
 * @param {Uint8Array} mc - Memory Card
 * @returns {number}
 */
export function getBackupBlock2(mc) {
    return readUint16(mc, FILE_SYSTEM_STRUCTURE.BACKUP_BLOCK2[0]);
}

export function getIfcList(mc) {
    return readInt32List(mc, FILE_SYSTEM_STRUCTURE.IFC_LIST)
}

export function getBadBlockList(mc) {
    return readInt32List(mc, FILE_SYSTEM_STRUCTURE.BAD_BLOCK_LIST)
}

export function getCardType(mc) {
    return mc[FLAGS.CARD_TYPE]
}

export function getCardFlags(mc) {
    const cardFlags = mc[FLAGS.CARD_FLAGS]

    const flags = {}

    for (const [name, mask] of Object.entries(FLAGS.CARD_FLAGS_MASK)) {
        flags[name] = (cardFlags & mask) !== 0
    }

    return flags
}
