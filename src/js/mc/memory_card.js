/**
 * Se o cartão de memória do PS2 estiver formatado,
 * teremos nos primeiros 28 bytes a seguinte mensagem:
 * "Sony PS2 Memory Card Format ".
 * 
 * Essa mensagem corresponde aos seguinte vetor de bytes: [
 * 83, 111, 110, 121, 32, 80, 83, 50, 32, 77, 101, 109, 111, 114,
 * 121, 32, 67, 97, 114, 100, 32, 70, 111, 114, 109, 97, 116, 32
 * ].
 * 
 * Some todos os bytes e teremos o valor 2426, então
 * poderemos presumir que nosso MemoryCard está devidamente
 * formatado para uso.
 */

export const range_expected_value_for_formatted_card = [0, 28]
export const first_byte_expected_for_valid_card = 83
export const expected_sum_value_for_formatted_card = 2426

export function memory_card_is_valid(mc) {
    /**
     * O cartão de memória do PS2 deve conter ao menos
     * 28 bytes com a frase de identificação.
     */
    if (mc.length < range_expected_value_for_formatted_card[1]) {
        return false
    }

    return memory_card_is_formatted(mc)
}

export function memory_card_is_formatted(mc) {
    /**
     * Se o primeiro byte não for igual ao esperado,
     * não faz o menor sentido ficar analisando os demais.
     */
    if (mc[range_expected_value_for_formatted_card[0]] !== first_byte_expected_for_valid_card) {
        return false
    }

    /**
     * Agora, é só checarmos o valor dos primeiros 28 bytes.
     */
    return mc.slice(
        range_expected_value_for_formatted_card[0], range_expected_value_for_formatted_card[1]
    ).reduce((acc, cc) => acc + cc, 0) === expected_sum_value_for_formatted_card
}
