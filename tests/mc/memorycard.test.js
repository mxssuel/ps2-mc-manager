import { describe, it, expect } from "vitest"

import { MemoryCard } from "../../src/js/mc/memorycard"
import { SuperBlock } from "../../src/js/mc/superblock"
import {
  MEMORYCARD,
  NOT_MIN_SIZE_MEMORYCARD,
  NOT_FORMATTED_MEMORYCARD,
} from "../../mock/memorycard.mock"

describe("MemoryCard", () => {
  const mc = new MemoryCard(MEMORYCARD)

  it("get bytes", () => {
    expect(mc.bytes).toBe(MEMORYCARD)
  })

  it("Valid MemoryCard", () => {
    expect(mc.isValid).toEqual([true, ""])
  })

  it("get superBlock", () => {
    expect(mc.superblock).instanceOf(SuperBlock)
  })
})

describe("Invalid MemoryCard", () => {
  it("Not Min 341 Bytes", () => {
    const not_min_size_mc = new MemoryCard(NOT_MIN_SIZE_MEMORYCARD)
    const result = [false, "The memory card must have at least 341 bytes."]

    expect(not_min_size_mc.isValid).toEqual(result)
  })

  it("Not Formatted", () => {
    const not_formatted_mc = new MemoryCard(NOT_FORMATTED_MEMORYCARD)
    const result = [false, "The memory card is not formatted."]

    expect(not_formatted_mc.isValid).toEqual(result)
  })

  it("Not PS2 MemoryCard", () => {
    const NOT_PS2_MEMORYCARD = new Uint8Array(MEMORYCARD)

    /**
     * Alteramos o offset 336 que
     * normalmente tem o número 2
     * para indicar que se trata de um
     * MC do PS2 para o valor 1, falhando
     * a validação e aprovando o teste.
     */
    NOT_PS2_MEMORYCARD[336] = 1

    const not_ps2_mc = new MemoryCard(NOT_PS2_MEMORYCARD)
    const result = [false, "The memory card must be for the PlayStation 2."]

    expect(not_ps2_mc.isValid).toEqual(result)
  })

  it("Not Valid Version", () => {
    const NOT_VALID_MEMORYCARD_VERSION = new Uint8Array(MEMORYCARD)

    /**
     * Trocamos o byte logo após o offset 29 (.)
     * pela letra a, assim tornando a versão inválida.
     */
    NOT_VALID_MEMORYCARD_VERSION[30] = 97

    const not_valid_mc_version = new MemoryCard(NOT_VALID_MEMORYCARD_VERSION)
    const result = [
      false,
      `The version ${not_valid_mc_version.superblock.version} is invalid and not in the format 1.x.0.0 on the memory card.`,
    ]

    expect(not_valid_mc_version.isValid).toEqual(result)
  })

  it("Not Valid Card Size By Total Clusters", () => {
    /**
     * Aqui o truque é simples, reduzimos uns 10% do valor
     * do MC, isso faz com que o valor dos clusters seja
     * maior que o valor do MC, não deixando espaço para
     * clusters reservados.
     */
    const NOT_VALID_CARD_BY_TOTAL_CLUSTERS = new Uint8Array(
      MEMORYCARD.buffer,
      0,
      MEMORYCARD.length * 0.9
    )

    const not_valid_mc_card_by_total_clusters = new MemoryCard(NOT_VALID_CARD_BY_TOTAL_CLUSTERS)
    const result = [false, "The memory card must be larger than the total size of usable clusters."]

    expect(not_valid_mc_card_by_total_clusters.isValid).toEqual(result)
  })
})
