import { MemoryCard } from "./mc/memorycard.js"

const file = document.querySelector("input")

file.addEventListener("change", () => {
  if (file.files) {
    const files = file.files[0]

    files.arrayBuffer().then(playground)
  }
})

const run = [
  (mc) => ["Versão:", mc.superblock.version],

  (mc) => ["Page Size:", mc.superblock.pageSize],
  (mc) => ["Pages Per Cluster:", mc.superblock.pagesPerCluster],
  (mc) => ["Cluster Size:", mc.superblock.clusterSize],
  (mc) => ["Pages Per Erase Block:", mc.superblock.pagesPerEraseBlock],
  (mc) => ["Clusters Per Card:", mc.superblock.clustersPerCard],
  (mc) => ["Root Dir Offset:", mc.superblock.rootDirOffset],
  (mc) => ["Root Dir Cluster:", mc.superblock.rootDirCluster],
  (mc) => ["Backup Block 1:", mc.superblock.backupBlock1],
  (mc) => ["Backup Block 2:", mc.superblock.backupBlock2],
  (mc) => ["Indirect FAT Cluster List:", mc.superblock.indirectFATClusterList],
  (mc) => ["BadBlock Erase List:", mc.superblock.badBlockEraseList],
  (mc) => ["Memory Card Type:", mc.superblock.memoryCardType],
  (mc) => ["Memory Card Flags:", mc.superblock.memoryCardFlags],
]

function playground(data) {
  const bytes = new Uint8Array(data)
  const mc = new MemoryCard(bytes)

  const [validCard, error] = mc.isValid

  if (validCard) {
    console.log("Formatado!!!")
    console.log("Total de bytes:", bytes.length)

    run.forEach((func) => console.log(...func(mc)))
  } else {
    console.error(error)
  }
}
