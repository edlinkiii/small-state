import { SmallState } from "../src/SmallState.js"

// Create new instance of SmallState
const STORE = new SmallState()

// Add new storage property (state)
const CLICKED_COUNT = 'CLICKED_COUNT'
STORE.add(CLICKED_COUNT, 0)

// Create element variables
const elOutput = document.getElementById("output")
const elPlus = document.getElementById("plus")
const elMinus = document.getElementById("minus")

// Create subscription callbacks
const updateOutput = (val) => elOutput.textContent = val
const logResult = (val) => console.log(`current value of 'clicked' -- ${val}`)

// Subscribe to state changes
STORE.subscribe(CLICKED_COUNT, updateOutput)
STORE.subscribe(CLICKED_COUNT, logResult)

// Create action functions to manipulate state
const ACTION_ADD_CLICKED_COUNT = () => STORE.set(CLICKED_COUNT, STORE.get(CLICKED_COUNT) + 1)
const ACTION_MINUS_CLICKED_COUNT = () => STORE.set(CLICKED_COUNT, STORE.get(CLICKED_COUNT) - 1)
const ACTION_RESET_CLICKED_COUNT = () => STORE.reset(CLICKED_COUNT)

// ACTION TESTS
ACTION_ADD_CLICKED_COUNT()
ACTION_ADD_CLICKED_COUNT()
ACTION_ADD_CLICKED_COUNT()
ACTION_MINUS_CLICKED_COUNT()
ACTION_ADD_CLICKED_COUNT()
ACTION_ADD_CLICKED_COUNT()
ACTION_MINUS_CLICKED_COUNT()

// RESET (0)
ACTION_RESET_CLICKED_COUNT()

// Add click listeners/callbacks to update state
elPlus.addEventListener("click", ACTION_ADD_CLICKED_COUNT)
elMinus.addEventListener("click", ACTION_MINUS_CLICKED_COUNT)

// LISTENER TESTS
elPlus.click()
elPlus.click()
elPlus.click()
elPlus.click()
elMinus.click()
elPlus.click()
elMinus.click()
elMinus.click()
elPlus.click()

STORE.unsubscribe(CLICKED_COUNT, logResult)
console.log("No more logging on change!")

elPlus.click()
elPlus.click()
elPlus.click()
elMinus.click()
elPlus.click()
