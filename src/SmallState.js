export class SmallState {
    constructor() {
        this.state = {}
        this.initial = {}
        this.locked = []
        this.subscriptions = []
    }

    create(property, value=undefined, locked=false) {
        if(this.state.hasOwnProperty(property)) {
            console.error(`Specified state property already exists.`)
            return false
        }

        this.initial[property] = value
        this.state[property] = undefined

        this.reset(property)

        locked && this.locked.push(property)

        return this
    }

    get(property) {
        if(!this.state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        return this.state[property]
    }

    set(property, value) {
        if(!this.state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        if(this.locked.includes(property)) {
            console.error(`Specified state property is not alterable.`)
            return false
        }

        this.state[property] = value

        this.checkSubscriptions(property)

        return value
    }

    reset(property) {
        if(!this.state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        if(this.locked.includes(property)) {
            console.error(`Specified state property is not alterable.`)
            return false
        }

        return this.set(property, this.initial[property])
    }

    remove(property) {
        if(!this.state.hasOwnProperty(property)) {
            console.error(`Specified state property does not exist.`)
            return false
        }

        if(this.locked.includes(property)) {
            console.error(`Specified state property is not alterable.`)
            return false
        }

        delete this.state[property]

        return this
    }

    subscribe(property, callback) {
        Array.isArray(property)
            ? property.forEach((prop) => this.subscriptions.push({prop, callback}))
            : this.subscriptions.push({property, callback})
        console.log(this.subscriptions)
    }

    checkSubscriptions(property) {
        this.subscriptions.forEach((subscription) => { // console.log(subscription)
            subscription.property == property && subscription.callback(this.get(property))
        })
    }
}
