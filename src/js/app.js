import {
    isValidMemoryCard, getMemoryCardVersion, getPageSizeBytes, getPagesPerCluster, getPagesPerBlock,
    getClusterPerCard
} from "./mc/memorycard.js"

const file = document.querySelector("input")

file.onchange = () => {
    if (file.files) {
        const files = file.files[0]

        files.arrayBuffer().then(data).catch(() => alert("Deu ruim..."))
    }
}

function data(data) {

    const mc = new Uint8Array(data)

    if (isValidMemoryCard(mc)) {
        console.log("Formatado")
        console.log("Memory Card Version", getMemoryCardVersion(mc))
        console.log("Page Size Bytes", getPageSizeBytes(mc))
        console.log("Pages Per Cluster", getPagesPerCluster(mc))
        console.log("Pages Per Block", getPagesPerBlock(mc))
        console.log("Cluster Per Card", getClusterPerCard(mc))
    } else {
        console.log("Não formatado")
    }
}