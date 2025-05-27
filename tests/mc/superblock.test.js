import { describe, it, expect } from "vitest"

import { SuperBlock } from "../../src/js/mc/superblock"
import { SUPERBLOCK, NOT_FORMATTED_SUPERBLOCK } from "../../mock/superblock.mock"

describe("SuperBlock", () => {
    const sb = new SuperBlock(SUPERBLOCK)

    it("get bytes", () => {
        expect(sb.bytes).toBe(SUPERBLOCK)
    })

    it("get version", () => {
        expect(sb.version).toBe("1.2.0.0")
    })

    it("get isFormatted", () => {
        expect(sb.isFormatted).toBe(true)
    })

    it("get isValidVersion", () => {
        expect(sb.isValidVersion).toBe(true)
    })

    it("get isValidCardSizeByTotalClusters", () => {
        expect(sb.isValidCardSizeByTotalClusters).not.toBe(true)
    })

    it("get pageSize", () => {
        expect(sb.pageSize).toBe(512)
    })

    it("get pagesPerCluster", () => {
        expect(sb.pagesPerCluster).toBe(2)
    })

    it("get clusterSize", () => {
        expect(sb.clusterSize).toBe(1024)
    })

    it("get pagesPerEraseBlock", () => {
        expect(sb.pagesPerEraseBlock).toBe(16)
    })

    it("get clustersPerCard", () => {
        expect(sb.clustersPerCard).toBe(8192)
    })

    it("get rootDirOffset", () => {
        expect(sb.rootDirOffset).toBe(41)
    })

    it("get rootDirCluster", () => {
        expect(sb.rootDirCluster).toBe(0)
    })

    it("get backupBlock1", () => {
        expect(sb.backupBlock1).toBe(1023)
    })

    it("get backupBlock2", () => {
        expect(sb.backupBlock2).toBe(1022)
    })

    it("get indirectFATClusterList", () => {
        expect(sb.indirectFATClusterList).toEqual(new Int32Array([
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]))
    })

    it("get badBlockEraseList", () => {
        expect(sb.badBlockEraseList).toEqual(new Int32Array([
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
        ]))
    })

    it("get memoryCardType", () => {
        expect(sb.memoryCardType).toBe(2)
    })

    it("get memoryCardFlags", () => {
        expect(sb.memoryCardFlags).toEqual({
            ECC: true, BAD_BLOCKS: true, ERASE_ZEROS: false
        })
    })
})

describe("Invalid SuperBlock", () => {
    it("Not Formatted", () => {
        const not_formattted_sb = new SuperBlock(NOT_FORMATTED_SUPERBLOCK)
        expect(not_formattted_sb.isFormatted).not.toBe(true)
    })

    it("Not Valid Version", () => {
        const NOT_VALID_VERSION_SUPERBLOCK = new Uint8Array(SUPERBLOCK)
        /**
         * Trocamos o byte logo após o offset 29 (.)
         * pela letra a, assim tornando a versão inválida.
         */
        NOT_VALID_VERSION_SUPERBLOCK[30] = 97

        const not_valid_version_sb = new SuperBlock(NOT_VALID_VERSION_SUPERBLOCK)

        expect(not_valid_version_sb.isValidVersion).not.toBe(true)
    })

    it("Not Valid Card Size By Total Clusters", () => {
        const sb = new SuperBlock(SUPERBLOCK)
        /**
         * Como nosso super bloco mocado tem apenas 340 bytes
         * esse método deve retornar verdadeiro, já que nossos bytes
         * não são superior ao tamanho total dos clusters.
         */
        expect(sb.isValidCardSizeByTotalClusters).toBe(false)
    })
})
