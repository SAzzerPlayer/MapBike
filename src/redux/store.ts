import rootReducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

function storeHandler() : void {
    //console.log("Store has been updated!");
}

const store = createStore(rootReducer, applyMiddleware(thunk));

store.subscribe(storeHandler);

export default store;
