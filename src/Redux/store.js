import {createStore, combineReducers, applyMiddleware} from 'redux';
import promise from 'redux-promise-middleware';
import pngReducer from './Reducers/pngReducer'

const rootReducer = combineReducers({
    pngReducer
});

export default createStore(rootReducer, applyMiddleware(promise))