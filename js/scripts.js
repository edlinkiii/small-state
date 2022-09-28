import { SmallState } from "../src/SmallState.js"

const STORE = new SmallState()

const elOutput = document.getElementById("output")
const elPlus = document.getElementById("plus")
const elMinus = document.getElementById("minus")

STORE.subscribe("clicked", (val) => elOutput.textContent = val)
STORE.subscribe("clicked", (val) => console.log(`current value of 'clicked' -- ${val}`))

STORE.create("clicked", 0)

elPlus.addEventListener("click", () => STORE.set("clicked", STORE.get("clicked") + 1))
elMinus.addEventListener("click", () => STORE.set("clicked", STORE.get("clicked") - 1))
