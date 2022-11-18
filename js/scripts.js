import { SmallState } from "../src/SmallState.js"

const STORE = new SmallState()

const elOutput = document.getElementById("output")
const elPlus = document.getElementById("plus")
const elMinus = document.getElementById("minus")

const updateOutput = (val) => elOutput.textContent = val
const logResult = (val) => console.log(`current value of 'clicked' -- ${val}`)

STORE.create("clicked", 0)

STORE.subscribe("clicked", updateOutput)
STORE.subscribe("clicked", logResult)

elPlus.addEventListener("click", () => STORE.set("clicked", STORE.get("clicked") + 1))
elMinus.addEventListener("click", () => STORE.set("clicked", STORE.get("clicked") - 1))

elPlus.click()
elPlus.click()
elPlus.click()
elPlus.click()
elMinus.click()
elPlus.click()
elMinus.click()
elMinus.click()
elPlus.click()

STORE.unsubscribe("clicked", logResult)
console.log("No more logging on change!")

elPlus.click()
elPlus.click()
elPlus.click()
elMinus.click()
elPlus.click()
