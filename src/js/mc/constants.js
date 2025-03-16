export const SUPERBLOCK = {
    /**
     * Os primeiros 340 bytes de um memory card
     * são responsáveis por armazenar informações
     * relativas ao memory card e os metadados
     * do sistema de arquivo.
     */
    SIZE_BYTES: 340,
    /**
     * Os primeiros 28 bytes do cartão de memória são considerados
     * "mágicos".
     */
    EXPECTED_BYTE_RANGE_FORMATTED_CARD: [0, 27],
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
    EXPECTED_SUM_VALUE_FORMATTED_CARD: 2426,
    /**
     * Para verificarmos se o cartão é válido, podemos inicialmente
     * verificar o primeiro byte e checar se ele coincide com o
     * valor esperado para um cartão formatado.
     */
    EXPECTED_FIRST_BYTE_FORMATTED_CARD: 83,
    /**
     * Os bytes no intervalo de 28 a 39 são reservados para a
     * versão do formato usado no sistema de arquivos no padrão
     * 1.x.0.0.
     */
    VERSION_CARD_RANGE: [28, 39],
    /**
     * Regex para validar se a versão está no formato
     * esperado.
     */
    VALID_VERSION_CARD: /^1\.\d+\.0\.0$/
}

export const FILE_SYSTEM_STRUCTURE = {
    PAGE_SIZE_BYTES_RANGE: [40, 41],
    PAGES_PER_CLUSTER_RANGE: [42, 43],
    PAGES_PER_BLOCK_RANGE: [44, 45],
    CLUSTERS_PER_CARD_RANGE: [48, 51],
    ALLOC_OFFSET: [52, 55],
    ALLOC_END: [56, 59],
    ROOTDIR_CLUSTER: [60, 63],
    BACKUP_BLOCK1: [64, 67],
    BACKUP_BLOCK2: [68, 71],
    IFC_LIST: [80, 207],
    BAD_BLOCK_LIST: [208, 335]
}

export const FLAGS = {
    CARD_TYPE: 336,
    CARD_FLAGS: 337,
    CARD_FLAGS_MASK: {
        ECC: 1 << 0, // Informa se o cartão suporta código de correção de erros.
        BAD_BLOCKS: 1 << 3, // Informa que o cartão pode ter blocos corrompidos.
        /**
         * Informa se os blocos apagados têm todos os bits definidos como zero.
         * Dependendo do cartão, o bit 0 será usado para sinalizar se o bloco
         * está apagado, nos demais, essa função é atribuida ao bit 1.
         */
        ERASE_ZEROS: 1 << 4
    }
}
