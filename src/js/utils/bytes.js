export function readUint16(bytes, index) {
    return bytes[index] | (bytes[index + 1] << 8);
}

export function readUint32(bytes, [start, end]) {
    const view = new Uint8Array(
        bytes.buffer, start, end - start + 1 // n+1
    )

    return (view[0] << 0) | (view[1] << 8) | (view[2] << 16) | (view[3] << 24)
}