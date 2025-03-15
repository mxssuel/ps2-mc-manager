/**
 * Os primeiros 340 bytes de um memory card
 * são responsáveis por armazenar os metadados
 * do sistema de arquivo.
 */
export const SUPERBLOCK_SIZE_BYTES = 340

/**
 * Os primeiros 28 bytes do cartão de memória são considerados
 * "mágicos".
 */
export const EXPECTED_BYTE_RANGE_FORMATTED_CARD = [0, 27]
/**
 * Se o cartão de memória do PS2 estiver formatado,
 * teremos nos bytes mágicos a seguinte mensagem:
 * "Sony PS2 Memory Card Format ".
 * 
 * Essa mensagem corresponde ao seguinte vetor de bytes: [
 * 83, 111, 110, 121, 32, 80, 83, 50, 32, 77, 101, 109, 111, 114,
 * 121, 32, 67, 97, 114, 100, 32, 70, 111, 114, 109, 97, 116, 32
 * ].
 * 
 * Some todos os bytes e teremos o valor 2426, então
 * poderemos presumir que nosso Memory Card está devidamente
 * formatado para uso.
 */
export const EXPECTED_SUM_VALUE_FORMATTED_CARD = 2426
/**
 * Para verificarmos se o cartão é válido, podemos inicialmente
 * verificar o primeiro byte e checar se ele coincide com o
 * valor esperado para um cartão formatado.
 */
export const EXPECTED_FIRST_BYTE_FORMATTED_CARD = 83
/**
 * Os bytes no intervalo de 28 a 39 são reservados para a
 * versão do formato usado no sistema de arquivos no padrão
 * 1.x.0.0.
 */
export const VERSION_CARD_RANGE = [28, 39]
/**
 * Regex para validar se a versão está no formato
 * esperado.
 */
export const VALID_VERSION_CARD = /^1\.\d+\.0\.0$/

export const PAGE_SIZE_BYTES_RANGE = [40, 41]

export const PAGES_PER_CLUSTER_RANGE = [42, 43]

export const PAGES_PER_BLOCK_RANGE = [44, 45]

export const CLUSTERS_PER_CARD_RANGE = [48, 51]

export const ALLOC_OFFSET = [52, 55]

export const ALLOC_END = [56, 59]

export const ROOTDIR_CLUSTER = [60, 63]

export const BACKUP_BLOCK1 = [64, 67]

export const BACKUP_BLOCK2 = [68, 71]

export const IFC_LIST = [80, 207]

export const BAD_BLOCK_LIST = [208, 335]

export const CARD_TYPE = 336

export const CARD_FLAGS = 337

export const CARD_FLAGS_MASK = {
    ECC: 0x01, // Informa se o cartão suporta código de correção de erros.
    BAD_BLOCKS: 0x08, // Informa que o cartão pode ter blocos corrompidos.
    ERASE_ZEROS: 0x10 // Informa se o cartão está com os blocos apagados (todos preenchidos com zero).
}
