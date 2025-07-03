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

describe("Byte Functions", () => {
    it("Reads Uint16 values with little-endian byte order", () => {
        const bytes = new Uint8Array([1, 1, 2, 3])
        const offset = 1
        const result = 513

        expect(readUint16(bytes, offset)).toBe(result)
    })

    it("Reads Int32 values with little-endian byte order", () => {
        const bytes = new Uint8Array([1, 1, 2, 3, 4])
        const offset = 1
        const result = 67305985

        expect(readInt32(bytes, offset)).toBe(result)
    })

    it("Read Int32 List Values Not Inclusive with little-endian byte order", () => {
        const bytes = SUPERBLOCK
        const offsetStart = 80
        const offsetEnd = 80 + (BYTES.WORD * 32)
        const result = new Int32Array([
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ])

        expect(readInt32List(bytes, [offsetStart, offsetEnd], false)).toEqual(result)
    })

    it("Read Int32 List Values Inclusive with little-endian byte order", () => {
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

describe("Error Byte Functions", () => {
    describe("Read Uint16", () => {
        it("Is Not Uint8Array", () => {
            const bytes = [10, 20]
            const offset = 0
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readUint16(bytes, offset)).toThrow(result)
        })

        it("Is Empty Uint8Array", () => {
            const bytes = new Uint8Array([])
            const offset = 0
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readUint16(bytes, offset)).toThrow(result)
        })

        it("Offset Is NaN", () => {
            const bytes = new Uint8Array([1, 2, 3])
            const offset = "2s"
            const result = "Invalid 'offset' parameter. It must be a non-negative number."

            expect(() => readUint16(bytes, offset)).toThrow(result)
        })

        it("Offset Is Negative", () => {
            const bytes = new Uint8Array([1, 2, 3])
            const offset = -1
            const result = "Invalid 'offset' parameter. It must be a non-negative number."

            expect(() => readUint16(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds", () => {
            const bytes = new Uint8Array([1, 2, 3])
            const offset = 2
            const result = "Attempted to read out of bounds. Offset 2 (length 2) exceeds available bytes length 3."

            expect(() => readUint16(bytes, offset)).toThrow(result)
        })
    })

    describe("Read Int32", () => {
        it("Is Not Uint8Array", () => {
            const bytes = [10, 20, 30, 40]
            const offset = 0
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readInt32(bytes, offset)).toThrow(result)
        })

        it("Is Empty Uint8Array", () => {
            const bytes = new Uint8Array([])
            const offset = 0
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readInt32(bytes, offset)).toThrow(result)
        })

        it("Offset Is NaN", () => {
            const bytes = new Uint8Array([1, 2, 3, 4])
            const offset = "2s"
            const result = "Invalid 'offset' parameter. It must be a non-negative number."

            expect(() => readInt32(bytes, offset)).toThrow(result)
        })

        it("Offset Is Negative", () => {
            const bytes = new Uint8Array([1, 2, 3, 4])
            const offset = -1
            const result = "Invalid 'offset' parameter. It must be a non-negative number."

            expect(() => readInt32(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds", () => {
            const bytes = new Uint8Array([1, 2, 3, 4])
            const offset = 1
            const result = "Attempted to read out of bounds. Offset 1 (length 4) exceeds available bytes length 4."

            expect(() => readInt32(bytes, offset)).toThrow(result)
        })
    })

    describe("Read Int 32 List", () => {
        it("Is Not Uint8Array", () => {
            const bytes = [10, 20, 30, 40, 50, 60, 70, 80]
            const offset = [0, 1]
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Is Empty Uint8Array", () => {
            const bytes = new Uint8Array([])
            const offset = [0, 1]
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start NaN", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = ["a", 0]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - End NaN", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, "a"]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start < 0", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [-1, 1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - End < 0", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, -1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start & End < 0", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [-1, -1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start === End", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [1, 1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start > End", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [2, 1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Exceeded maximum number of bytes - Inclusive", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, 12]
            const result = "Attempted to read out of bounds. Range [0, 12] (length 4) exceeds available bytes length 12."

            expect(() => readInt32List(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Exceeded maximum number of bytes - Exclusive", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, 13]
            const result = "Attempted to read out of bounds. Range [0, 13] (length 4) exceeds available bytes length 12."

            expect(() => readInt32List(bytes, offset, false)).toThrow(result)
        })

        it("Offset Out Of Bounds - It is not a multiple of 4 - Uint8", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
            const offset = [0, 13]
            const result = "Calculated byte length (13 bytes) is not a multiple of 4 size, which is required for reading values."

            expect(() => readInt32List(bytes, offset, false)).toThrow(result)
        })

        it("Offset Out Of Bounds - It is not a multiple of 4 - Range", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, 11]
            const result = "Calculated byte length (11 bytes) is not a multiple of 4 size, which is required for reading values."

            expect(() => readInt32List(bytes, offset, false)).toThrow(result)
        })
    })

    describe("Read Byte As String", () => {
        it("Is Not Uint8Array", () => {
            const bytes = [10, 20]
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readBytesAsString(bytes)).toThrow(result)
        })

        it("Is Empty Uint8Array", () => {
            const bytes = new Uint8Array([])
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => readBytesAsString(bytes)).toThrow(result)
        })
    })

    describe("Validate Byte Checksum", () => {
        it("Is Not Uint8Array", () => {
            const bytes = [10, 20, 30, 40, 50, 60, 70, 80]
            const offset = [0, 1]
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Is Empty Uint8Array", () => {
            const bytes = new Uint8Array([])
            const offset = [0, 1]
            const result = "Input 'bytes' must be a non-empty Uint8Array."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start NaN", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = ["a", 0]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - End NaN", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, "a"]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start < 0", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [-1, 1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - End < 0", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, -1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start & End < 0", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [-1, -1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start === End", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [1, 1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Start > End", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [2, 1]
            const result = "Invalid 'start' or 'end' parameters. They must be non-negative numbers where 'start' <= 'end'."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })

        it("Offset Out Of Bounds - Exceeded maximum number of bytes - Only Exclusive", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            const offset = [0, 13]
            const result = "Attempted to read out of bounds. Range [0, 13] (length 1) exceeds available bytes length 12."

            expect(() => validateByteChecksum(bytes, offset)).toThrow(result)
        })
    })
})
