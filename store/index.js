import reducers from '../redux/reducers';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
const store = createStore(reducers, applyMiddleware(thunk));
export default store;
