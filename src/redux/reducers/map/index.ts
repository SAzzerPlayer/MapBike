
import {BoxArray, Bike, BikeFetch, Station, StationFetch} from "../../../libs/classes";
import {combineReducers} from 'redux';

const initialStateData = {
    bikes : new BoxArray<Bike>(),
    stations : new BoxArray<Station>()
};

const initialStateLoading = {
    isLoading : false
};

const initialStateHasErrored = {
    hasErrored : false
};

export function reducerMapLoading(state = initialStateLoading, action : any){
    switch(action.type){

        case 'MAP_IS_LOADING': {
            state.isLoading = action.isLoading;
            return state;
        }
        default: return state;
    }
}

export function reducerMapHasErrored(state = initialStateHasErrored, action : any){
    switch(action.type){
        case 'MAP_HAS_ERRORED': {
            state.hasErrored = action.hasErrored;
            return state;
        }
        default: return state;
    }
}

export function reducerMapData(state = initialStateData, action : any) {

    switch (action.type) {

        case 'MAP_FETCH_DATA_SUCCESS': {
            const stations = action.stations.map((element : StationFetch) => new Station(element));
            const bikes = action.bikes.map((element : BikeFetch) => new Bike(element));
            state.stations.updateWithBox(stations, action.coordsBox);
            state.bikes.updateWithBox(bikes, action.coordsBox);
            return {
                ...state
            };
        }

        default:
            return state;
    }
}



