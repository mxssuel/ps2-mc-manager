import { BYTES, readBytesAsString, validateByteChecksum, readUint16, readInt32, readInt32List } from "../utils/bytes.js"

/**
 * Realiza a leitura e escrita em uma imagem do
 * cartão de memória do Playstation 2.
 */
export class MemoryCard {
    /**
     * Construtor da classe MemoryCard.
     * Inicializa o cartão de memória com os bytes fornecidos e realiza a validação inicial.
     * 
     * @param {Uint8Array} bytes Array de bytes que representa o conteúdo do cartão de memória.
     */
    constructor(bytes) {
        this._mc = bytes

        if (
            /*
             * Inicialmente, é preciso garantir ao menos
             * os 340 bytes para leitura dos metadados.
             */
            this._checkMinSize()
        ) {
            this._setMetaData()
            this._validateCard()
        } else {
            this._setInvalidCardMessage("The memory card must have at least 340 bytes.")
        }
    }

    /**
     * Retorna se o cartão de memória é válido.
     * 
     * @returns {[boolean, string]} Um array onde:
     * - O primeiro elemento (boolean) indica se o cartão é válido.
     * - O segundo elemento (string) contém uma mensagem de erro, se houver.
     */
    get isValid() {
        return this._isValid
    }

    /**
     * Retorna a versão do formato usado no cartão de memória (padrão: 1.2.0.0).
     * 
     * @returns {string} 1.x.0.0
     */
    get version() {
        return this._version
    }

    /**
     * Retorna o tamanho em bytes de cada página (padrão: 512 bytes).
     * 
     * @returns {number}
     */
    get pageSize() {
        return this._pageSize
    }

    /**
     * Retorna a quantidade páginas que um cluster possui (padrão: 2 páginas).
     * 
     * @returns {number}
     */
    get pagesPerCluster() {
        return this._pagesPerCluster
    }

    /**
     * Retorna a quantidade de páginas que devem ser apagadas por vez (padrão: 16).
     * 
     * No sistema do Memory Card ao apagar um dado, deve-se apagar
     * uma certa quantidade de páginas de uma única vez e depois
     * reescrever as informações que não eram para serem apagadas.
     * 
     * @returns {number}
     */
    get pagesPerEraseBlock() {
        return this._pagesPerEraseBlock
    }

    /**
     * Retorna a quantidade total de clusters
     * no cartão de memória (padrão: 8192).
     * 
     * @returns {number}
     */
    get clustersPerCard() {
        return this._clustersPerCard
    }

    /**
     * Retorna o offset para o diretório raiz (padrão: 41).
     * 
     * @returns {number} 
     */
    get rootDirOffset() {
        return this._rootDirOffset
    }

    /**
     * Retorna o primeiro cluster do diretório raiz
     * relativo ao rootDirOffset (padrão: 0).
     * 
     * @returns {number} 
     */
    get rootDirCluster() {
        return this._rootDirCluster
    }

    /**
     * Retorna o primeiro bloco usado como
     * backup quando for apagar os dados (padrão: 1023).
     * 
     * @returns {number} 
     */
    get backupBlock1() {
        return this._backupBlock1
    }

    /**
     * Retorna o segundo bloco usado como
     * backup quando for apagar os dados (padrão: 1022).
     * 
     * Este bloco deve ser apagado para conter apenas uns.
     * 
     * @returns {number} 
     */
    get backupBlock2() {
        return this._backupBlock2
    }

    /**
     * Retorna uma Lista
     * de Clusters Indiretos (padrão: 8).
     * 
     * Em um Memory Card de 8MB deve
     * haver apenas um Cluster indireto.
     * 
     * @returns {Int32Array} 
     */
    get indirectFATClusterList() {
        return this._indirectFATClusterList
    }

    /**
     * Retorna uma Lista De Blocos de Apagamento
     * defeituosos e que não devem
     * ser usados (padrão: -1).
     * 
     * @returns {Int32Array} 
     */
    get badBlockEraseList() {
        return this._badBlockEraseList
    }

    /**
     * Retorna o tipo do Memory Card (padrão: 2).
     * 
     * Deve retornar o número 2 para indicar que é
     * um Memory Card do Playstation 2.
     * 
     * @returns {number}
     */
    get memoryCardType() {
        return this._memoryCardType
    }

    /**
     * Retorna as flags de configuração do Memory Card.
     * 
     * @returns {Object} Um objeto contendo as seguintes propriedades:
     * - **ECC**: Indica se o cartão suporta código de correção de erros (Error Correction Code).
     * - **BAD_BLOCKS**: Indica se o cartão pode conter blocos corrompidos.
     * - **ERASE_ZEROS**: Indica se os blocos apagados têm todos os bits definidos como zero.
     */
    get memoryCardFlags() {
        return this._memoryCardFlags
    }

    /**
     * Define uma mensagem de erro e marca o cartão como inválido.
     * 
     * @param {string} message Mensagem de erro a ser associada ao estado inválido.
     */
    _setInvalidCardMessage(message) {
        this._isValid = [false, message]
    }

    /**
     * Define os metadados contidos no Super Bloco.
     */
    _setMetaData() {
        this._version = this._getVersion()

        this._pageSize = this._getPageSize()
        this._pagesPerCluster = this._getPagesPerCluster()
        this._pagesPerEraseBlock = this._getPagesPerEraseBlock()
        this._clustersPerCard = this._getClustersPerCard()

        this._rootDirOffset = this._getRootDirOffset()
        this._rootDirCluster = this._getRootDirCluster()

        this._backupBlock1 = this._getBackupBlock1()
        this._backupBlock2 = this._getBackupBlock2()

        this._indirectFATClusterList = this._getIndirectFATClusterList()
        this._badBlockEraseList = this._getBadBlockEraseList()

        this._memoryCardType = this._getMemoryCardType()
        this._memoryCardFlags = this._getMemoryCardFlags()
    }

    /**
     * Verifica se o cartão de memória é válido.
     */
    _validateCard() {
        if (!this._checkIsFormatted()) {
            this._setInvalidCardMessage("The memory card is not formatted.")
        }

        if (this.memoryCardType !== 2) {
            this._setInvalidCardMessage("The memory card must be for the PlayStation 2.")
            return
        }

        if (!this._checkIsValidVersion()) {
            this._setInvalidCardMessage(`The version ${this.version} is invalid and not in the format 1.x.0.0 on the memory card.`)
            return
        }

        if (!this._checkCardSizeByTotalClusters()) {
            this._setInvalidCardMessage("The memory card must be larger than the total size of usable clusters.")
            return
        }

        this._isValid = [true, ""]
    }

    /**
     * Verifica se o cartão de memória
     * tem ao menos os 340 bytes do Super Bloco.
     * 
     * @returns {boolean}
     */
    _checkMinSize() {
        /**
         * Se o super bloco não estiver presente, não é possível
         * fazer a leitura dos metadados necessários.
         */
        return this._mc.length > 340
    }

    /**
     * Verifica se o cartão de memória está formatado.
     * 
     * @returns {boolean}
     */
    _checkIsFormatted() {
        /*
         * A string "Sony PS2 Memory Card Format " está
         * definida no offset 0 e ocupa 7 palavras (28 bytes).
         */
        const [offsetStart, offsetEnd] = [0, BYTES.WORD * 7]
        const firstLetter = 83 // Letra S

        if (this._mc[offsetStart] !== firstLetter) { // Se o primeiro byte falhar, os demais não serão verificados.
            return false
        }

        /*
         * A soma de todos os 28 bytes deve ser
         * igual ao valor da constante abaixo
         * para validarmos a string esperada.
         */
        const expectedSignature = 2426
        return validateByteChecksum(this._mc, [offsetStart, offsetEnd], expectedSignature)
    }

    /**
     * Verifica se há mais bytes no cartão de memória
     * do que os para os clusters utilizáveis.
     * 
     * @returns {boolean}
     */
    _checkCardSizeByTotalClusters() {
        /*
         * Descobrindo o tamanho do cluster em bytes
         * por meio do tamanho da página e da quantidade
         * de páginas por cluster.
         */
        const clusterSize = this.pageSize * this.pagesPerCluster
        /*
         * Descobrindo o tamanho total em bytes
         * que todos os cluster ocupam.
         */
        const totalClusterSize = clusterSize * this.clustersPerCard

        /*
         * O cartão de memória deve ter mais bytes que os cluster,
         * pois ainda há clusters reservados.
         */
        return this._mc.length > totalClusterSize
    }

    /**
     * Obtêm a versão do formato usado no cartão de memória.
     * 
     * @returns {string}
     */
    _getVersion() {
        /*
         * A versão do Memory Card está definida no offset 28
         * e ocupa 3 palavras (12 bytes).
         */
        const [offset, size] = [28, BYTES.WORD * 3]
        const bytes = new Uint8Array(this._mc.buffer, offset, size)

        return readBytesAsString(bytes)
    }

    /**
     * Verifica se a versão do cartão de memória é válido (padrão: 1.x.0.0).
     * 
     * @returns {boolean}
     */
    _checkIsValidVersion() {
        const expectedVersion = /^1\.\d+\.0\.0$/

        return expectedVersion.test(this.version)
    }

    /**
     * Obtêm o tamanho da página em bytes.
     * 
     * @returns {number}
     */
    _getPageSize() {
        /*
         * O tamanho da página está definido
         * no offset 40 e ocupa meia-palavra (2 bytes).
         */
        const offset = 40
        return readUint16(this._mc, offset)
    }

    /**
     * Obtêm a quantidade de páginas por cluster.
     * 
     * @returns {number}
     */
    _getPagesPerCluster() {
        /*
         * A quantidade de páginas por cluster está definido
         * no offset 42 e ocupa meia-palavra (2 bytes).
         */
        const offset = 42
        return readUint16(this._mc, offset)
    }

    /**
     * Obtêm o número de páginas que devem ser apagadas por vez.
     * 
     * @returns {number}
     */
    _getPagesPerEraseBlock() {
        /*
         * A quantidade de páginas que devem
         * ser apagadas por vez está definida
         * no offset 44 e ocupa meia-palavra (2 bytes).
         */
        const offset = 44
        return readUint16(this._mc, offset)
    }

    /**
     * Obtêm a quantidade total de clusters no cartão de memória.
     * 
     * @returns {number}
     */
    _getClustersPerCard() {
        /*
         * A quantidade de clusters que o
         * cartão possui está definida
         * no offset 48 e ocupa 1 palavra (4 bytes).
         */
        const offset = 48
        return readInt32(this._mc, offset)
    }

    /**
     * Obtêm o offset do diretório raiz.
     * 
     * @returns {number}
     */
    _getRootDirOffset() {
        /*
         * O diretório raiz está definido
         * no offset 52 e ocupa 1 palavra (4 bytes).
         */
        const offset = 52
        return readInt32(this._mc, offset)
    }

    /**
     * Obtêm o primeiro cluster do diretório raiz.
     * 
     * @returns {number}
     */
    _getRootDirCluster() {
        /*
         * O cluster está definido
         * no offset 60 e ocupa 1 palavra (4 bytes).
         */
        const offset = 60
        return readInt32(this._mc, offset)
    }

    /**
     * Obtêm o bloco de backup 1.
     * 
     * @returns {number}
     */
    _getBackupBlock1() {
        /*
         * O bloco de backup 1 está definido
         * no offset 64 e ocupa 1 palavra (4 bytes).
         */
        const offset = 64
        return readInt32(this._mc, offset)
    }

    /**
    * Obtêm o bloco de backup 2.
    * 
    * @returns {number}
    */
    _getBackupBlock2() {
        /*
         * O bloco de backup 2 está definido
         * no offset 68 e ocupa 1 palavra (4 bytes).
         */
        const offset = 68
        return readInt32(this._mc, offset)
    }

    /**
     * Obtêm uma Lista de Clusters Indiretos.
     * 
     * @returns {Int32Array}
     */
    _getIndirectFATClusterList() {
        /**
         * Uma lista de 32 posições, cada posição ocupando
         * 1 palavra (4 bytes), começando no offset 80.
         */
        const [offsetStart, offsetEnd] = [80, 80 + (BYTES.WORD * 32)]
        return readInt32List(this._mc, [offsetStart, offsetEnd], false)
    }

    /**
     * Obtêm uma Lista de BadBlocks defeituosos.
     * 
     * @returns {Int32Array}
     */
    _getBadBlockEraseList() {
        /**
         * Uma lista de 32 posições, cada posição ocupando
         * 1 palavra (4 bytes), começando no offset 208.
         */
        const [offsetStart, offsetEnd] = [208, 208 + (BYTES.WORD * 32)]
        return readInt32List(this._mc, [offsetStart, offsetEnd], false)
    }

    /**
     * Obtêm o tipo do Cartão de Memória.
     * 
     * @returns {number}
     */
    _getMemoryCardType() {
        /*
         * O tipo do Memory Card está definido
         * no offset 336 e ocupa 1 byte.
         */
        const offset = 336

        return this._mc[offset]
    }

    /**
     * Obtém as flags de configuração do Memory Card.
     * 
     * @returns {Object}
     */
    _getMemoryCardFlags() {
        /*
         * As flags estão definidas no offset 337
         * e são representadas por um único byte que
         * contêm informações sobre suporte a ECC, blocos corrompidos
         * e comportamento de apagamento.
         */
        const offset = 337
        const flags = this._mc[offset]

        return {
            ECC: (flags & 1 << 0) !== 0,
            BAD_BLOCKS: (flags & 1 << 3) !== 0,
            ERASE_ZEROS: (flags & 1 << 4) !== 0
        }
    }
}
