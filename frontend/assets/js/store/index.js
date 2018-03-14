import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { repos, sort, loading, error } from './reducers';

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
    applyMiddleware(logger,
                    thunkMiddleware, // lets us dispatch() functions
                   )(createStore)(
      combineReducers({repos, sort, loading, error}),
      initialState
    )


// const storeFactory = (initialState={}) =>
//     createStore(
//       combineReducers({repos, sort}),
//       initialState)

export default storeFactory
