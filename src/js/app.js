import { MemoryCard } from "./mc/memorycard.js"

const file = document.querySelector("input")

file.addEventListener("change", () => {
    if (file.files) {
        const files = file.files[0]

        files.arrayBuffer().then(playground)
    }
})

const run = [
    (mc) => ["Versão:", mc.version],

    (mc) => ["Page Size:", mc.pageSize],
    (mc) => ["Pages Per Cluster:", mc.pagesPerCluster],
    (mc) => ["Pages Per Erase Block:", mc.pagesPerEraseBlock],
    (mc) => ["Clusters Per Card:", mc.clustersPerCard],
    (mc) => ["Root Dir Offset:", mc.rootDirOffset],
    (mc) => ["Root Dir Cluster:", mc.rootDirCluster],
    (mc) => ["Backup Block 1:", mc.backupBlock1],
    (mc) => ["Backup Block 2:", mc.backupBlock2],
    (mc) => ["Indirect FAT Cluster List:", mc.indirectFATClusterList],
    (mc) => ["BadBlock Erase List:", mc.badBlockEraseList],
    (mc) => ["Memory Card Type:", mc.memoryCardType],
    (mc) => ["Memory Card Flags:", mc.memoryCardFlags],
]

function playground(data) {
    const bytes = new Uint8Array(data)
    const mc = new MemoryCard(bytes)

    const [validCard, error] = mc.isValid

    if (validCard) {
        console.log("Formatado!!! Total de bytes:", bytes.length)

        run.forEach((func) => console.log(...func(mc)))
    } else {
        console.error(error)
    }
}