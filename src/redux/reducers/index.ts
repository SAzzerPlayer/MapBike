import {combineReducers} from 'redux';
import {
    reducerMapLoading,
    reducerMapHasErrored,
    reducerMapData
} from "./map";


export default combineReducers({
    isLoading : reducerMapLoading,
    hasErrored : reducerMapHasErrored,
    mapData : reducerMapData
});
