export class SmallState {
    static #instance
    #state = {}
    #initial = {}
    #locked = []
    #subscriptions = {}

    constructor() {
        if(SmallState.#instance) return SmallState.#instance

        SmallState.#instance = this
    }

    add(property, value=null, locked=false) {
        if(this.#state.hasOwnProperty(property)) {
            throw new Error("Specified state property already exists.")
        }

        this.#initial[property] = value
        this.#state[property] = undefined
        this.#subscriptions[property] = []

        this.reset(property)

        if(locked) this.#locked.push(property)

        return this
    }

    get(property) {
        if(!this.#state.hasOwnProperty(property)) {
            throw new Error("Specified state property does not exist.")
        }

        return this.#state[property]
    }

    set(property, value) {
        if(!this.#state.hasOwnProperty(property)) {
            throw new Error("Specified state property does not exist.")
        }

        if(this.#locked.includes(property)) {
            throw new Error("Specified state property is not alterable.")
        }

        this.#state[property] = value

        this.emit(property)

        return value
    }

    reset(property) {
        if(!this.#state.hasOwnProperty(property)) {
            throw new Error("Specified state property does not exist.")
        }

        if(this.#locked.includes(property)) {
            throw new Error("Specified state property is not alterable.")
        }

        return this.set(property, this.#initial[property])
    }

    remove(property) {
        if(!this.#state.hasOwnProperty(property)) {
            throw new Error("Specified state property does not exist.")
        }

        if(this.#locked.includes(property)) {
            throw new Error("Specified state property is not alterable.")
        }

        delete this.#state[property]
        delete this.#initial[property]
        delete this.#subscriptions[property]
        this.#locked = this.#locked.filter((locked) => locked !== property)

        return this
    }

    subscribe(property, callback) {
        if(typeof property === "string" && !this.#state.hasOwnProperty(property)) {
            throw new Error("Specified state property does not exist.")
        }

        Array.isArray(property)
            ? property.forEach((prop) => this.subscribe(prop, callback))
            : this.#subscriptions[property].push(callback)
    }

    unsubscribe(property, callback=null) {
        Array.isArray(property)
            ? property.forEach((prop) => this.unsubscribe(prop, callback))
            : this.#subscriptions[property] = callback === null
                ? []
                : this.#subscriptions[property].filter((cb) => cb !== callback)
    }

    emit(property) {
        if (!this.#subscriptions[property]?.length) return
  
        const value = this.get(property)
        this.#subscriptions[property].forEach((callback) => callback(value))
    }
}
