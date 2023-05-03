# SmallState

This code defines a class called `SmallState` for managing state properties. Here's what each method does:

-   `#instance`: A private static property that is used to store a single instance of the `SmallState` class.
-   `#state`, `#initial`, `#locked`, and `#subscriptions`: Private instance properties that store the current state, initial state, locked properties, and subscriptions for each state property, respectively.
-   `constructor()`: The constructor ensures that only one instance of the `SmallState` class can exist at a time by checking whether `#instance` has already been set and returning it if so. If not, it sets `#instance` to `this`.
-   `add(property, value=null, locked=false)`: Adds a new state property to the object. Takes three arguments: the property name, an optional default value (defaults to null if no value is provided), and a boolean flag indicating whether the property should be locked and therefore unalterable. Throws an error if the property already exists.
-   `get(property)`: Gets the value of a specified state property. Throws an error if the property does not exist.
-   `set(property, value)`: Sets the value of a specified state property. Throws an error if the property does not exist or is locked. Emits an event to any subscribed callbacks.
-   `reset(property)`: Resets a specified state property to its original value. Throws an error if the property does not exist or is locked.
-   `remove(property)`: Removes a specified state property from the object. Throws an error if the property does not exist or is locked. Deletes the property and its initial value, as well as any subscriptions tied to it. Removes the property from the `#locked` array.
-   `subscribe(property, callback)`: Subscribes a callback function to a specified state property. If given a string, checks whether the property exists. If given an array of strings, calls `subscribe()` with each string in the array.
-   `unsubscribe(property, callback=null)`: Unsubscribes a callback function from a specified state property. If given a string, unsubscribes all callbacks from that property. If given an array of strings, calls `unsubscribe()` with each string in the array. If given both a string and a callback function, only unsubscribes that specific function from the property.
-   `emit(property)`: Emits an event to any subscribed callbacks for a specified state property, passing in the current value of the property. Does nothing if no callbacks are subscribed to the property.
