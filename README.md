# Readme

## how to build
build from xcode using the ios/FlashcardExpo.xcworkspace

## install pods
```bash
➜  ios git:(main) ✗ pod install
Using Expo modules
[Expo] Enabling modular headers for pod ExpoModulesCore
[Expo] Enabling modular headers for pod React-Core
[Expo] Enabling modular headers for pod React-RCTAppDelegate
```

## install node_modules
```bash
➜  FlashcardExpo git:(main) ✗ npx npm ci
npm WARN deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs
npm WARN deprecated @babel/plugin-proposal-optional-catch-binding@7.18.6: This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transf
```

## file breakdown
package.json
    contains the 3rd party js libraries and dependencies

App.js
    app entry point

## redux
### Redux Store
the current redux app state lives in an object called `store`

the `store` is created by passing in a reducer and has method
called `getState` which returns the current state value. it also
has a method called `dispatch` which is used to update the
state and it takes in a `action obj`, and runs the reducer func

### Redux Reducers
this is a function that receives the current `state` and and `action obj`, decides
how to update state, and returns the new state

this is essentially an event listener which handles events based on recv actions

### Redux actions
an event describes something that has happened in an app
actions contain a "type" field which is a descriptive name of the action
actions can contain other fields for additional info

the functions below are "Action Creators" which create and returns
an action object

### Redux-React hooks
#### useSelector()
the useSelector is a hook used get the value from the global `store` in redux.
it takes in a function with `state` as a param to extract values out of it.

i.e
```javascript
const value = useSelector((state) => state.value)
```

#### useDispatch()
the useDispatch is a hook used send actions to the redux store.
this returns a dispatch function which takes in an `action obj` which will be used
against the `store` and `reducer`.
 
i.e
```javascript
function App() {
    const dispatch = useDispatch()

    const increment = {
        type: 'INCREMENT',
    }

    const handleIncre = () => {
        dispatch(increment)
    }

  return (
    <div>
      <button onClick={handleIncre}>Increment</button>
    </div>
  )
}
```

## Gotchus
1. when making ios changes (swift/obj-c), you must rebuild using xcodde for those changes to be reflected on your app
2. when using a new 3rd-party module in xcode, you must call `pod install` and look in the `Pods` dir to find out how to import the lib