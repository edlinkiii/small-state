export class SmallState {
    static #instance
    #state = {}
    #initial = {}
    #locked = []
    #subscriptions = {}
    #propertyExists = (property) => this.#state.hasOwnProperty(property)
    #propertyIsLocked = (property) => this.#locked.includes(property)

    constructor() {
        if (SmallState.#instance) return SmallState.#instance

        this.ERROR_PROPERTY_ALREADY_EXISTS = "Specified state property already exists."
        this.ERROR_PROPERTY_DOES_NOT_EXIST = "Specified state property does not exist."
        this.ERROR_PROPERTY_IS_LOCKED = "Specified state property is not alterable."
        this.TYPE_STRING = "string"

        SmallState.#instance = this
    }

    add(property, value = null, locked = false) {
        const propertyAlredyExist = this.#propertyExists(property)
        if (propertyAlredyExist) throw new Error(this.ERROR_PROPERTY_ALREADY_EXISTS)

        this.#initial[property] = value
        this.#state[property] = undefined
        this.#subscriptions[property] = []

        this.reset(property)

        if (locked) this.#locked.push(property)

        return this
    }

    get(property) {
        if (!this.#propertyExists(property)) throw new Error(this.ERROR_PROPERTY_DOES_NOT_EXIST)

        return this.#state[property]
    }

    set(property, value) {
        if (!this.#propertyExists(property)) throw new Error(this.ERROR_PROPERTY_DOES_NOT_EXIST)
        if (this.#propertyIsLocked(property)) throw new Error(this.ERROR_PROPERTY_IS_LOCKED)

        this.#state[property] = value
        this.emit(property)

        return value
    }

    reset(property) {
        if (!this.#propertyExists(property)) throw new Error(this.ERROR_PROPERTY_DOES_NOT_EXIST)
        if (this.#propertyIsLocked(property)) throw new Error(this.ERROR_PROPERTY_IS_LOCKED)

        return this.set(property, this.#initial[property])
    }

    remove(property) {
        if (!this.#propertyExists(property)) throw new Error(this.ERROR_PROPERTY_DOES_NOT_EXIST)
        if (this.#propertyIsLocked(property)) throw new Error(this.ERROR_PROPERTY_IS_LOCKED)

        delete this.#state[property]
        delete this.#initial[property]
        delete this.#subscriptions[property]

        return this
    }

    subscribe(property, callback) {
        const propertyIsString = typeof property === this.TYPE_STRING
        if (propertyIsString && !this.#propertyExists(property)) throw new Error(this.ERROR_PROPERTY_DOES_NOT_EXIST)

        const subscriptions = this.#subscriptions[property]
        Array.isArray(property)
            ? property.forEach((prop) => this.subscribe(prop, callback))
            : subscriptions.push(callback)
    }

    unsubscribe(property, callback = null) {
        let subscriptions = this.#subscriptions[property]
        Array.isArray(property)
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
