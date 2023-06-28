export default class SmallState {
    static #instance
    #state = {}
    #initial = {}
    #locked = []
    #subscriptions = {}
    #check = {
        isString: (str) => typeof str === "string",
        isArray: (arr) => Array.isArray(arr),
        propertyExists: (property) => this.#state.hasOwnProperty(property),
        propertyIsLocked: (property) => this.#locked.includes(property),
    }
    #error = {
        propertyAlredyExists: (property) => `Specified state property [${property}] already exists.`,
        propertyDoesNotExist: (property) => `Specified state property [${property}] does not exist.`,
        propertyIsLocked: (property) => `Specified state property [${property}] is not alterable.`,
    }

    constructor() {
        if (SmallState.#instance) return SmallState.#instance

        this.ERROR_PROPERTY_ALREADY_EXISTS = ""
        this.ERROR_PROPERTY_DOES_NOT_EXIST = ""
        this.ERROR_PROPERTY_IS_LOCKED = ""
        this.TYPE_STRING = "string"

        SmallState.#instance = this

        return this
    }

    add(property, value = null, locked = false) {
        if (this.#check.propertyExists(property)) throw new Error(this.#error.propertyAlredyExists(property))

        this.#initial[property] = value
        this.#state[property] = undefined
        this.#subscriptions[property] = []

        this.reset(property)

        if (locked) this.#locked.push(property)

        return this
    }

    get(property) {
        if (!this.#check.propertyExists(property)) throw new Error(this.#error.propertyDoesNotExist(property))

        return this.#state[property]
    }

    set(property, value) {
        if (!this.#check.propertyExists(property)) throw new Error(this.#error.propertyDoesNotExist(property))
        if (this.#check.propertyIsLocked(property)) throw new Error(this.#error.propertyIsLocked(property))

        this.#state[property] = value
        this.emit(property)

        return this
    }

    reset(property) {
        if (!this.#check.propertyExists(property)) throw new Error(this.#error.propertyDoesNotExist(property))
        if (this.#check.propertyIsLocked(property)) throw new Error(this.#error.propertyIsLocked(property))

        return this.set(property, this.#initial[property])
    }

    remove(property) {
        if (!this.#check.propertyExists(property)) throw new Error(this.#error.propertyDoesNotExist(property))
        if (this.#check.propertyIsLocked(property)) throw new Error(this.#error.propertyIsLocked(property))

        delete this.#state[property]
        delete this.#initial[property]
        delete this.#subscriptions[property]

        return this
    }

    subscribe(property, callback) {
        if (this.#check.isString(property) && !this.#check.propertyExists(property)) throw new Error(this.#error.propertyDoesNotExist(property))

        const subscriptions = this.#subscriptions[property]
        this.#check.isArray(property)
            ? property.forEach((prop) => this.subscribe(prop, callback))
            : subscriptions.push(callback)
    }

    unsubscribe(property, callback = null) {
        let subscriptions = this.#subscriptions[property]
        this.#check.isArray(property)
            ? property.forEach((prop) => this.unsubscribe(prop, callback))
            : (subscriptions = callback === null
                ? []
                : subscriptions.filter((cb) => cb !== callback))
    }

    emit(property) {
        const subscriptions = this.#subscriptions[property]
        if (!subscriptions?.length) return

        const value = this.get(property)
        subscriptions.forEach((callback) => callback(value))
    }
}
