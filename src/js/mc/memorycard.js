import { SuperBlock } from "./superblock.js"

/**
 * Realiza a leitura, validação e escrita em uma imagem do
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
            this._superblock = new SuperBlock(this.bytes)
            this._validateCard()
        } else {
            this._setInvalidCardMessage("The memory card must have at least 341 bytes.")
        }
    }

    /**
     * Retorna os bytes do cartão de memória.
     * 
     * @returns {Uint8Array}
     */
    get bytes() {
        return this._mc
    }

    get superblock() {
        return this._superblock
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
        return this.bytes.length > 340
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
     * Verifica se o cartão de memória é válido com base nos bytes do super bloco.
     */
    _validateCard() {
        if (!this.superblock.isFormatted) {
            this._setInvalidCardMessage("The memory card is not formatted.")
            return
        }

        if (this.superblock.memoryCardType !== 2) {
            this._setInvalidCardMessage("The memory card must be for the PlayStation 2.")
            return
        }

        if (!this.superblock.isValidVersion) {
            this._setInvalidCardMessage(`The version ${this.superblock.version} is invalid and not in the format 1.x.0.0 on the memory card.`)
            return
        }

        if (!this.superblock.isValidCardSizeByTotalClusters) {
            this._setInvalidCardMessage("The memory card must be larger than the total size of usable clusters.")
            return
        }

        this._isValid = [true, ""]
    }
}
