export class SmallState {
    #state
    #initial
    #locked
    #subscriptions

    constructor() {
        this.#state = {}
        this.#initial = {}
        this.#locked = []
        this.#subscriptions = {}
    }

    create(property, value=undefined, locked=false) {
        if(this.#state.hasOwnProperty(property)) {
            console.error(`Specified state property already exists.`)
            return false
        }

        this.#initial[property] = value
        this.#state[property] = undefined
        this.#subscriptions[property] = []

        this.reset(property)

        locked && this.#locked.push(property)

        return this
    }

    get(property) {
        if(!this.#state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        return this.#state[property]
    }

    set(property, value) {
        if(!this.#state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        if(this.#locked.includes(property)) {
            console.error(`Specified state property is not alterable.`)
            return false
        }

        this.#state[property] = value

        this.emit(property)

        return value
    }

    reset(property) {
        if(!this.#state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        if(this.#locked.includes(property)) {
            console.error(`Specified state property is not alterable.`)
            return false
        }

        return this.set(property, this.#initial[property])
    }

    remove(property) {
        if(!this.#state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        if(this.#locked.includes(property)) {
            console.error(`Specified state property is not alterable.`)
            return false
        }

        delete this.#state[property]
        delete this.#initial[property]
        delete this.#subscriptions[property]
        this.#locked = this.#locked.filter((locked) => locked !== property)

        return this
    }

    subscribe(property, callback) {
        if(typeof property === "string" && !this.#state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return
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
        this.#subscriptions[property]
        .forEach((callback) => callback(this.get(property)))
    }
}
