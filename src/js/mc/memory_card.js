/**
 * Os primeiros 28 bytes do cartão de memória são considerados
 * "mágicos".
 */
export const EXPECTED_BYTE_RANGE_FORMATTED_CARD = [0, 28]
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
    if (mc.length < EXPECTED_BYTE_RANGE_FORMATTED_CARD[1]) {
        return false
    }

    return isMemoryCardFormatted(mc)
}

/**
 * Verifica se o cartão de memória está formatado por
 * meio da checagem dos primeiros 28 bytes do arquivo.
 * 
 * @param {*} mc Memory Card
 * @returns {boolean}
 */
export function isMemoryCardFormatted(mc) {
    /*
     * Se o primeiro byte não for igual ao esperado,
     * não faz o menor sentido ficar analisando os demais.
     */
    if (mc[EXPECTED_BYTE_RANGE_FORMATTED_CARD[0]] !== EXPECTED_FIRST_BYTE_FORMATTED_CARD) {
        return false
    }

    /*
     * Agora, é só checarmos o valor dos primeiros 28 bytes.
     */
    return mc.slice(
        EXPECTED_BYTE_RANGE_FORMATTED_CARD[0], EXPECTED_BYTE_RANGE_FORMATTED_CARD[1]
    ).reduce((acc, cc) => acc + cc, 0) === EXPECTED_SUM_VALUE_FORMATTED_CARD
}
