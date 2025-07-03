import { MemoryCard } from "./memorycard.js"

/**
 * Realiza a leitura e escrita de dados
 * no sistema de arquivos do cartão de memória
 * do Playstation 2.
 */
export class FileSystem {
  /**
   * Construtor da Classe FileSystem.
   * @param {MemoryCard} mc Instância do Objeto MemoryCard.
   */
  constructor(mc) {}

  /**
   * Retorna uma lista com todos os saves.
   * @returns {Array<Object>} Um array de objetos contendo as seguintes propriedades:
   * - **name**: Nome do Jogo
   * - **icon**: Ícone do Jogo
   * - **clusterIndex**: Em qual cluster o jogo está salvo.
   */
  saveTree() {}
}
