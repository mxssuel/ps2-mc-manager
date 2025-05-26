import { describe, it, expect } from "vitest"
import { BYTES, readUint16, readInt32, readInt32List, readBytesAsString, validateByteChecksum } from "../../src/js/utils/bytes"

import { SUPERBLOCK } from "../../mock/superblock.mock"

describe("Const Bytes", () => {
    it("Single Byte", () => {
        expect(BYTES.SINGLE_BYTE).toBe(1)
    })

    it("Half Word", () => {
        expect(BYTES.HALF_WORD).toBe(2)
    })

    it("Word", () => {
        expect(BYTES.WORD).toBe(4)
    })
})

describe("Functions", () => {
    it("Read Uint16", () => {
        const bytes = new Uint8Array([1, 1, 2, 3])
        const offset = 1
        const result = 513

        expect(readUint16(bytes, offset)).toBe(result)
    })

    it("Read Int32", () => {
        const bytes = new Uint8Array([1, 1, 2, 3, 4])
        const offset = 1
        const result = 67305985

        expect(readInt32(bytes, offset)).toBe(result)
    })

    it("Read Int32 List Not Inclusive", () => {
        const bytes = SUPERBLOCK
        const offsetStart = 80
        const offsetEnd = 80 + (BYTES.WORD * 32)
        const result = new Int32Array([
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ])

        expect(readInt32List(bytes, [offsetStart, offsetEnd], false)).toEqual(result)
    })

    it("Read Int32 List Inclusive", () => {
        const bytes = SUPERBLOCK
        const offsetStart = 80
        const offsetEnd = 79 + (BYTES.WORD * 32)
        const result = new Int32Array([
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ])

        expect(readInt32List(bytes, [offsetStart, offsetEnd], true)).toEqual(result)
    })

    it("Read Byte As String", () => {
        const bytes = new Uint8Array(SUPERBLOCK.buffer, 0, 28)
        const offsetStart = 0
        const offsetEnd = 28
        const result = "Sony PS2 Memory Card Format "

        expect(readBytesAsString(bytes, [offsetStart, offsetEnd])).toBe(result)
    })

    it("Validate Byte Checksum", () => {
        const bytes = SUPERBLOCK
        const offsetStart = 0
        const offsetEnd = 28
        const signature = 2426
        const result = true

        expect(validateByteChecksum(bytes, [offsetStart, offsetEnd], signature)).toBe(result)
    })
})
