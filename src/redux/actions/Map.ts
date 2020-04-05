
export function mapHasErrored(bool : boolean) : object {
    return {
        type: 'MAP_HAS_ERRORED',
        hasErrored: bool
    };
}

export function mapIsLoading(bool : boolean) : object {
    return {
        type: 'MAP_IS_LOADING',
        isLoading: bool
    };
}

export function mapFetchDataSuccess(bikes : Array<object>, stations : Array<object>, coordsBox : Array<Array<number>>) : object {
    return {
        type: 'MAP_FETCH_DATA_SUCCESS',
        bikes,
        stations,
        coordsBox
    };
}

export function mapFetchData(coordsBox : Array<Array<number>>, coordsCenter : Array<number>, radius : number, controller : AbortController) {
    return async (dispatch : any) => {

        dispatch(mapIsLoading(true));

        const url = "http://wheel-api-01.backend.bestmap.net:8080/api/v1/";
        const urlBikes = "bikes?";
        const urlStations = "stations?";
        const longitudeParam = `longitude=${coordsCenter[0].toFixed(6)}`;
        const latitudeParam = `&latitude=${coordsCenter[1].toFixed(5)}`;
        const radiusParam = `&radius=${radius.toFixed()}`;

        const requestBike = url + urlBikes + longitudeParam + latitudeParam + radiusParam;
        const requestStations = url + urlStations + longitudeParam + latitudeParam + radiusParam;

        let start = new Date().getTime();
        let bikesData = await fetch(requestBike, {
            method : "GET",
            signal : controller.signal,
            headers : {
                "Keep-Alive" : "timeout=20, max=1000"
            },
            keepalive : true
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                const end = new Date().getTime();
                console.log("SUCCESS FETCH BIKES: ",end-start,"MS");

                return response.json();
            })
            .then((responseJSON) => responseJSON)
            .catch((err) => {
                console.log("ERROR",err);
                dispatch(mapIsLoading(false));
                dispatch(mapHasErrored(true));
                return null
            });


        start = new Date().getTime();
        let stationsData = await fetch(requestStations, {
            method : "GET",
            signal : controller.signal,
            headers : {
                "Keep-Alive" : "timeout=20, max=1000"
            },
            keepalive : true})
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                const end = new Date().getTime();
                console.log("SUCCESS FETCH STATIONS: ",end-start,"MS");

                return response.json();
            })
            .then((responseJSON) => responseJSON)
            .catch((err) => {
                console.log("ERROR",err);
                dispatch(mapIsLoading(false));
                dispatch(mapHasErrored(true));
                return null;
            });

        dispatch(mapIsLoading(false));
        if(bikesData && stationsData){
            dispatch(mapFetchDataSuccess(bikesData.bikes, stationsData.stations,coordsBox));
        }

    };
}



