/**
 * SmallState is a lightweight State Management tool
 *
 * @export
 * @class SmallState
 */
export default class SmallState {
    /**
     * @static
     * @type {SmallState}
     */
    static #instance
    /** @type {Object} */
    #state = {}
    /** @type {Object} */
    #initial = {}
    /** @type {Array} */
    #locked = []
    /** @type {Object} */
    #subscriptions = {}
    /** @type {Object} */
    #check = {
        /**
         * Return the type of _anything_
         * 
         * @param {*} x
         * @return {String}
         */
        typeOf: (x) => {
            if(x === undefined) return "undefined"
            if(x === null) return "null"
            return x.constructor.name.toLowerCase()
        },
        /**
         * Is param a String
         * 
         * @param {*} str assuming it's a string...
         * @return {Boolean}
         */
        isString: (str) => this.#check.typeOf(str) === "string",
        /**
         * Is param an Array
         * 
         * @param {*} arr assuming it's an array...
         * @return {Boolean}
         */
        isArray: (arr) => this.#check.typeOf(arr) === "array",
        /**
         * Is param a Function
         * 
         * @param {*} func assuming it's a function...
         * @return {Boolean}
         */
        isFunction: (func) => this.#check.typeOf(func) === "function",
        /**
         * Does property exist in State
         * 
         * @param {String} property
         * @return {Boolean}
         */
        propertyExists: (property) => Object.hasOwn(this.#state, property),
        /**
         * Is property locked
         * 
         * @param {String} property
         * @return {Boolean}
         */
        propertyIsLocked: (property) => this.#locked.includes(property),
    }
    /** @type {Object} */
    #error = {
        /**
         * @param {String} property
         * @return {String}
         */
        propertyAlredyExists: (property) => `Specified state property [${property}] already exists.`,
        /**
         * @param {String} property
         * @return {String}
         */
        propertyDoesNotExist: (property) => `Specified state property [${property}] does not exist.`,
        /**
         * @param {String} property
         * @return {String}
         */
        propertyIsLocked: (property) => `Specified state property [${property}] is not alterable.`,
        /**
         * @param {String} property
         * @return {String}
         */
        functionIsRequired: (property) => `A function is required to add a subscriber for property (${property})`,
    }

    /**
     * Creates a static instance of SmallState.
     *
     * @constructor
     */
    constructor() {
        if (SmallState.#instance) return SmallState.#instance

        SmallState.#instance = this
    }

    /**
     * Display errors in the console
     *
     * @param {String} errorMessage
     */
    error(errorMessage) {
        console.error(`SmallStateError: ${errorMessage}`)
    }

    /**
     * Add a new property to state
     *
     * @param {String} property  the new property to add to state
     * @param {*} [value=null]  initial value of property, or null
     * @param {Boolean} [lock=false]    prevents changing the value of or removing the property
     * @returns {?SmallState}
     */
    add(property, value = null, lock = false) {
        if (this.#check.propertyExists(property)) {
            this.error(this.#error.propertyAlredyExists(property))
            return null
        }

        this.#initial[property] = value
        this.#state[property] = undefined
        this.#subscriptions[property] = []

        this.reset(property)

        if (lock) this.lock(property)

        return this
    }

    /**
	 * Does the property exist in State
	 *
     * @param {String} property 
     * @returns {Boolean}
     */
    has(property) {
        const hasProperty = this.#check.propertyExists(property)

        return hasProperty
    }

    /**
     * Get the current value of the property
     *
     * @param {String} property property name
     * @returns {*}     property value
     */
    get(property) {
        if (!this.#check.propertyExists(property)) throw new Error(this.#error.propertyDoesNotExist(property))

        return this.#state[property]
    }

    /**
     * Set the value of a property
     *
     * @param {String} property property name
     * @param {*} value new value of property
     * @returns {?SmallState}
     */
    set(property, value) {
        if (!this.#check.propertyExists(property)) {
            this.error(this.#error.propertyDoesNotExist(property))
            return null
        }
        if (this.#check.propertyIsLocked(property)) {
            this.error(this.#error.propertyIsLocked(property))
            return null
        }

        this.#state[property] = value
        this.emit(property)

        return this
    }

    /**
     * Reset original value of property
     *
     * @param {String} property property name
     * @returns {?SmallState}
     */
    reset(property) {
        if (!this.#check.propertyExists(property)) {
            this.error(this.#error.propertyDoesNotExist(property))
            return null
        }
        if (this.#check.propertyIsLocked(property)) {
            this.error(this.#error.propertyIsLocked(property))
            return null
        }

        return this.set(property, this.#initial[property])
    }

    /**
     * Remove the property from State
     *
     * @param {String} property property name
     * @returns {?SmallState}
     */
    remove(property) {
        if (!this.#check.propertyExists(property)) {
            this.error(this.#error.propertyDoesNotExist(property))
            return null
        }
        if (this.#check.propertyIsLocked(property)) {
            this.error(this.#error.propertyIsLocked(property))
            return null
        }

        delete this.#state[property]
        delete this.#initial[property]
        delete this.#subscriptions[property]

        return this
    }

    /**
     * Lock the property to prevent changing or removal
     *
     * @param {String} property property name
	 * @returns {SmallState}
     */
    lock(property) {
        this.#locked = [...new Set([...this.#locked, property])]

        return this
    }

    /**
     * Unlock the property to allow changes and/or removal
     *
     * @param {String} property property name
	 * @returns {SmallState}
     */
    unlock(property) {
        this.#locked = this.#locked.filter((locked) => locked !== property)

        return this
    }

    /**
     * Subscribe to changes
     *
     * @param {String|Array<String>} property property name
     * @param {Function} callback    function to execute when property value changes
     */
    subscribe(property, callback) {
        if (!this.#check.isFunction(callback)) {
            this.error(this.#error.functionIsRequired(/** @type {String} */ (property)))
            return
        }

        if(this.#check.isArray(property)) {
            /** @type {Array<String>} */ (property).forEach((prop) => this.subscribe(prop, callback))
            return
        }

        if (this.#check.isString(property)) {
            if (!this.#check.propertyExists(property)) {
                this.error(this.#error.propertyDoesNotExist(property))
                return
            }
            this.#subscriptions[/** @type {String} */ (property)].push(callback)
        }
    }

    /**
     * Unsubscribe removes a subscriber
     *
     * @param {String|Array<String>} property property name
     * @param {?Function} [callback=null]   callback function to remove, remove all if null
     */
    unsubscribe(property, callback = null) {
        if(this.#check.isArray(property)) {
            /** @type {Array<String>} */ (property).forEach((prop) => this.unsubscribe(prop, callback))
            return
        } else if (this.#check.isString(property)) {
            if (!this.#check.propertyExists(property)) {
                this.error(this.#error.propertyDoesNotExist(property))
                return
            }


            if (callback === null) {
                this.#subscriptions[/** @type {String} */ (property)] = null;
            } else if (!this.#check.isFunction(callback)) {
                /**
                 * @param {Function} cb 
                 * @returns {Boolean}
                 */
                const filterFunction = (cb) => cb !== callback
                this.#subscriptions[/** @type {String} */ (property)].filter(filterFunction)
            }
        }
    }

    /**
     * Emit executes subscriber functions
     *
     * @param {String} property
     */
    emit(property) {
        const subscriptions = this.#subscriptions[property]
        if (!subscriptions?.length) return

        const value = this.get(property)
        subscriptions.forEach((callback) => callback(value))
    }
}
