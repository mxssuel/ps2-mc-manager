import { memory_card_is_valid } from "./mc/memory_card.js"

const file = document.querySelector("input")

file.onchange = () => {
    if (file.files) {
        const files = file.files[0]

        files.arrayBuffer().then(data).catch(() => alert("Deu ruim..."))
    }
}

function data(data) {
    if (memory_card_is_valid(new Uint8Array(data))) {
        console.log("Correto")
    } else {
        console.log("Incorreto")
    }
}