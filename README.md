# SmallState
Just a simple state management class for JavaScript

💡 Try it out on [CodePen](https://codepen.io/edlinkiii/pen/zYjPqRr)

🔥 This project has been approved for use in a live production system by my employer!


# ChatGPT Analysis

This JavaScript class is a simple state management tool that allows users to add, get, set, reset, remove, subscribe to, and unsubscribe from state properties. It uses private class fields to store the state, initial state, locked properties, and subscriptions.

When the constructor is called, it checks if an instance of the class has already been created and returns it if it has. If not, it initializes the state, initial state, locked properties, and subscriptions, and sets the class instance to a private field.

The **add()** method adds a new state property with an optional initial value and lock status. It returns the class instance.

The **get()** method retrieves the value of an existing state property. It returns the value.

The **set()** method sets the value of an existing state property if it is not locked. It emits a change event to all subscribed callbacks. It returns the new value.

The **reset()** method resets an existing state property to its initial value if it is not locked. It emits a change event to all subscribed callbacks. It returns the new value.

The **remove()** method removes an existing state property and its corresponding initial value and subscriptions if it is not locked. It returns the class instance.

The **subscribe()** method adds a callback function to be called whenever a specified state property changes. It can accept either a single property or an array of properties to subscribe to.

The **unsubscribe()** method removes a callback function from a specified state property's subscription list. It can accept either a single property or an array of properties to unsubscribe from. If a callback function is specified, it will only remove that function from the subscription list.

The **emit()** method calls all subscribed callbacks for a specified property and passes in the current value of that property.
