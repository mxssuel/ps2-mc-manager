import {
    isValidMemoryCard,
    getMemoryCardVersion,
    getPageSizeBytes,
    getPagesPerCluster,
    getPagesPerBlock,
    getClusterPerCard,
    getAllocOffset,
    getAllocEnd,
    getRootDirCluster,
    getBackupBlock1,
    getBackupBlock2,
    getIfcList,
    getBadBlockList,
    getCardType,
    getCardFlags
} from "./mc/memorycard.js"

const file = document.querySelector("input")

file.onchange = () => {
    if (file.files) {
        const files = file.files[0]

        files.arrayBuffer().then(data).catch(() => alert("Deu ruim..."))
    }
}

const logs = [
    ["Memory Card Version", (mc) => getMemoryCardVersion(mc)],
    ["Page Size Bytes", (mc) => getPageSizeBytes(mc)],
    ["Pages Per Cluster", (mc) => getPagesPerCluster(mc)],
    ["Pages Per Block", (mc) => getPagesPerBlock(mc)],
    ["Cluster Per Card", (mc) => getClusterPerCard(mc)],
    ["Alloc Offset", (mc) => getAllocOffset(mc)],
    ["Alloc End", (mc) => getAllocEnd(mc)],
    ["Root Dir Cluster", (mc) => getRootDirCluster(mc)],
    ["Backup Block 1", (mc) => getBackupBlock1(mc)],
    ["Backup Block 2", (mc) => getBackupBlock2(mc)],
    ["IFC List", (mc) => getIfcList(mc)],
    ["Bad Block List", (mc) => getBadBlockList(mc)],
    ["Card Type", (mc) => getCardType(mc)],
    ["Card Flags", (mc) => getCardFlags(mc)],
]

function data(data) {

    const mc = new Uint8Array(data)

    if (isValidMemoryCard(mc)) {
        console.log("Formatado")

        logs.forEach(log => console.log(log[0], log[1](mc)))
    } else {
        console.log("Não formatado")
    }
}