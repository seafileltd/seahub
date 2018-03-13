import { createStore, combineReducers, applyMiddleware } from 'redux';
import { repos, sort } from './reducers';

const logger = store => next => action => {
    let result
    console.groupCollapsed("dispatching", action.type)
    console.log('prev state', store.getState())
    console.log('action', action)
    result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
    return result
}

const saver = store => next => action => {
    let result = next(action)
    // localStorage['redux-store'] = JSON.stringify(store.getState())
  // console.log(result);
    return result
}

const storeFactory = (initialState={}) =>
    applyMiddleware(logger)(createStore)(
      combineReducers({repos, sort}),
      initialState
    )


// const storeFactory = (initialState={}) =>
//     createStore(
//       combineReducers({repos, sort}),
//       initialState)

export default storeFactory
