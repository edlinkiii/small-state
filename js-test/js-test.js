/**
 * JS Test is a small JS testing library
 * 
 * @type {Object}
 * @exports
 */
 const JSTest = {
    /** @type {String} */
    PASSED: "passed",
    /** @type {String} */
    FAILED: "failed",
    /** @type {Boolean} */
    testDebug: false,
    /** @type {Object} */
    logColor: {
        passed: "background: black; color: #00db3a;",
        failed: "background: black; color: #ff0a0a;",
        info: "background: black; color: #fff;",
    },
    /** @type {Object} */
    logSeparator: {
        begin: "\u25bc\u25bc\u25bc\u25bc\u25bc\u25bc\u25bc\u25bc\u25bc\u25bc",
        end: "\u25b2\u25b2\u25b2\u25b2\u25b2\u25b2\u25b2\u25b2\u25b2\u25b2",
    },

    /**
     * @type {Function}
     * @async
     * @param {SuiteObject} suite 
     */
    suiteTest: async (suite) => {
        const { logSeparator } = JSTest;
        const { description, collection, condition } = suite;

        if (condition === undefined || condition === null || condition === true) {
            let count = 0;
            let passed = 0;
            let skipped = 0;

            JSTest.infoLog(`${logSeparator.begin} Start test batch "${description}"`);

            await collection.reduce(async (promise, test) => {
                await promise;

                count++;

                const { condition, description, action, shallBe, waitSeconds, message } = test;

                if (condition === undefined || condition === null || condition === true) {
                    const result = await JSTest.test(test);

                    JSTest.log(result, description, message, count);

                    result && passed++;
                } else {
                    skipped++;

                    JSTest.infoLog(`${count}) SKIPPED: ${test.description} -- Condition not met`);
                }
            }, Promise.resolve());

            let failed = count - (passed + skipped);
            console.log(`%c ${logSeparator.end} End test batch "${description}" -- ${count} Tests | ${skipped > 0 ? skipped + " Skipped; " : ""}%c${passed > 0 ? passed + " Passed; " : ""} %c${failed > 0 ? failed + " Failed" : ""} `, JSTest.logColor.info, JSTest.logColor.passed, JSTest.logColor.failed);
        }
    },

    /**
     * @type {Function}
     * @async
     * @param {String} description 
     * @param {Array} testArray 
     */
    batch: async (description, testArray) => {
        const count = testArray.length;
        let passed = 0;

        JSTest.infoLog(`Start test batch "${description}"`);

        await testArray.reduce(async (promise, test) => {
            await promise;

            const result = await JSTest.run(test.description, test.testIt, test.message);

            result && passed++;
        }, Promise.resolve());

        console.log(`%c End test batch "${description}" | %cPassed ${passed} of ${count} `, JSTest.logColor.info, passed === count ? JSTest.logColor.passed : JSTest.logColor.failed);
    },

    /**
     * @type {Function}
     * @async
     * @param {TestObject}
     * @returns 
     */
    test: async ({ action, shallBe: { execute, expected, exactEqual }, waitSeconds }) => {
        const actionResult = await (action && action());

        await JSTest.wait(parseFloat(waitSeconds || 0) || 0);

        const executeResult = await (execute && execute());

        await JSTest.wait(parseFloat(waitSeconds || 0) || 0);

        const testResult = execute ? executeResult : actionResult;

        const result = await JSTest.shouldBe(testResult, expected, exactEqual);

        return result;
    },

    /**
     * @type {Function}
     * @async
     * @param {String} description 
     * @param {Object} testIt 
     * @param {String} message 
     * @param {Number} count 
     * @returns 
     */
    run: async (description, testIt, message = "", count = 0) => {
        const { log } = JSTest;
        const result = await testIt;

        log(result, description, message, count);

        return result;
    },

    /**
     * Log results to console
     * @type {Function}
     * @param {Object} result
     * @param {String} description 
     * @param {String} message 
     * @param {Number} count 
     * @returns {Void}
     */
    log: (result, description, message = "", count = 0) => {
        const { PASSED, FAILED, logColor, testDebug, logTemplate } = JSTest;

        const testResult = result.passed ? PASSED : FAILED;
        const output = `%c ${count > 0 ? count + ")" : ""} ${testResult.toUpperCase()}: ${description}${message.length > 0 ? " | " + message : ""} `;

        console.log(output, logColor[testResult], testDebug ? result : "")
    },

    /**
     * @type {Function}
     * @param {*} actual 
     * @param {*} expected 
     * @param {Boolean} strict 
     * @returns {Promise<ResultObject>}
     */
    shouldBe: async (actual, expected = true, strict = true) => {
        let value1, value2;

        if (!strict && (expected === true || expected === "true" || expected === "truthy" || !expected)) {
            value1 = !!actual;
            value2 = true;
        } else if (!strict && (expected === false || expected === "false" || expected === "falsy")) {
            value1 = !actual;
            value2 = false;
        } else {
            value1 = actual;
            value2 = expected;
        }

        const passed = strict ? value1 === value2 : value1 == value2;

        const result = {
            actual,
            expected,
            strict,
            passed,
        };

        return result;
    },

    /**
     * @type {Function}
     * @param {String} info 
     * @returns {Void}
     */
    infoLog: (info) => console.log(`%c ${info} `, JSTest.logColor.info),

    /**
     * @type {Function}
     * @returns {Void}
     */
    passLog: () => console.log(`%c PASSED `, JSTest.logColor.passed),

    /**
     * @type {Function}
     * @returns {Void}
     */
    failLog: () => console.log(`%c FAILED `, JSTest.logColor.failed),

    /**
     * @type {Function}
     * @async
     * @param {Number} seconds
     * @returns {Promise}
     */
    wait: async (seconds = 0) => await new Promise((resolve) => setTimeout(resolve, seconds * 1000)),
};

/**
 * @typedef ShallBeObject
 * @property {Function|Null} execute
 * @property {*} expected
 * @property {Boolean} exactEqual
 */

/**
 * @typedef TestObject
 * @property {Boolean|Null} condition
 * @property {String} description
 * @property {Function} action
 * @property {String} message
 * @property {Number} waitSecond
 * @property {ShallBeObject} shallBe
 */

/**
 * @typedef SuiteObject
 * @property {Boolean|Null} condition
 * @property {String} description
 * @property {Array<TestObject>} collection
 */

/**
 * @typedef ResultObject
 * @property {*} actual
 * @property {*} expected
 * @property {Boolean} strict
 * @property {Boolean} passed
 */


// const {testDebug, logColor, logSeparator, suite, batch, test, shouldBe, infoLog, passLog, failLog, wait} = JSTest;

export default JSTest;
