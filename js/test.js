import JSTest from "../js-test/js-test.js"
import SmallState from "../src/SmallState.js"

// ------------------------------- //
// ----- BASIC FUNCTIONALITY ----- //

// create instance
const STORE = new SmallState();
const PROPERTY_1 = `test`;
const VALUE_1 = `stuff`;
const VALUE_2 = `more stuff`;
const VALUE_3 = `no stuff`;

var testValue;

// create test suite
const BASIC = {
    description: "Tests: Basic Functionality",
    // make sure STORE exists
    condition: (STORE instanceof SmallState),
    collection: [
        {
            description: "Add PROPERTY_1 with no value",
            action: () => STORE.add(PROPERTY_1),
            shallBe: {
                execute: () => STORE.has(PROPERTY_1),
                expected: true,
            },
        },
        {
            description: "Set value of PROPERTY_1 to VALUE_1",
            action: () => STORE.set(PROPERTY_1, VALUE_1),
            shallBe: {
                execute: () => STORE.get(PROPERTY_1),
                expected: "stuff",
            },
        },
        {
            description: "Subscribe to PROPERTY_1",
            action: () => STORE.subscribe(PROPERTY_1, (value) => { testValue = value }),
            shallBe: {
                execute: () => true,
                expected: true,
            },
        },
        {
            description: "Set value of PROPERTY_1 to VALUE_2 & verify subscriber",
            action: () => STORE.set(PROPERTY_1, VALUE_2),
            shallBe: {
                execute: () => (STORE.get(PROPERTY_1) === testValue),
                expected: true,
            },
        },
        {
            description: "Unsubscribe from PROPERTY_1",
            action: () => STORE.unsubscribe(PROPERTY_1),
            shallBe: {
                execute: () => true,
                expected: true,
            },
        },
        {
            description: "Set value of PROPERTY_1 to VALUE_3 & verify no subscriber",
            action: () => STORE.set(PROPERTY_1, VALUE_3),
            shallBe: {
                execute: () => (STORE.get(PROPERTY_1) !== testValue),
                expected: true,
            },
        },
        {
            description: "Lock PROPERTY_1",
            action: () => STORE.lock(PROPERTY_1),
            shallBe: {
                execute: () => true,
                expected: true,
            },
        },
        {
            description: "Cannot set value of PROPERTY_1 to VALUE_1",
            message: "console error expected",
            action: () => STORE.set(PROPERTY_1, VALUE_1),
            shallBe: {
                execute: () => (STORE.get(PROPERTY_1) !== VALUE_1),
                expected: true,
            },
        },
        {
            description: "Unlock PROPERTY_1",
            action: () => STORE.unlock(PROPERTY_1),
            shallBe: {
                execute: () => true,
                expected: true,
            },
        },
        {
            description: "Set value of PROPERTY_1 to VALUE_2",
            action: () => STORE.set(PROPERTY_1, VALUE_2),
            shallBe: {
                execute: () => (STORE.get(PROPERTY_1) === VALUE_2),
                expected: true,
            },
        },
        {
            description: "Reset value of PROPERTY_1 to initial value",
            message: "null",
            action: () => STORE.reset(PROPERTY_1),
            shallBe: {
                execute: () => (STORE.get(PROPERTY_1) === null),
                expected: true,
            },
        },
        {
            description: "Remove PROPERTY_1",
            action: () => STORE.remove(PROPERTY_1),
            shallBe: {
                execute: () => (STORE.has(PROPERTY_1)),
                expected: false,
            },
        },
    ]
};

JSTest.suiteTest(BASIC);
