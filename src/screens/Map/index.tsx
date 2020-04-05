import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {connect} from 'react-redux';
import {Dimensions} from 'react-native';
import {mapFetchData} from "../../redux/actions/Map";
import {distanceBetweenTwoGeoDots} from "../../libs/geometry";
import {Bike, Station} from "../../libs/classes";

const mapboxToken = "sk.eyJ1Ijoic2F6emVycGxheWVyIiwiYSI6ImNqdHIyNGg1bDBmd2czeW1yNmh0ajVwaHQifQ.BmrkJALtlGvxi4aT78dq1g";
MapboxGL.setAccessToken(mapboxToken);

const {width, height} = Dimensions.get("window");

type MapScreenProps = {
    bikes : Array<Bike>,
    stations : Array<Station>,
    isLoading : boolean,
    hasErrored : boolean,
    updateMapUnits : (coordsBox : Array<Array<number>>,
                   coordsCenter : Array<number>,
                   radius : number,
                   controller : AbortController) => any
}

class MapScreen extends React.Component<MapScreenProps> {
    private _map : any;
    private _camera : any;
    private _stayInterval : any;
    private fetchController : AbortController;

    constructor(props : any){
        super(props);
        this.fetchController = new AbortController;
        ///binding funcs
        this.mapRegionDidChange = this.mapRegionDidChange.bind(this);
        this.mapRegionWillChange = this.mapRegionWillChange.bind(this);
    }

    async mapRegionDidChange() {
        const coordsBox = await this._map.getVisibleBounds();
        const centerDot = await this._map.getCoordinateFromView([width/2,height/2]);
        const leftCenterDot = await this._map.getCoordinateFromView([0,height/2]);
        const rightCenterDot = await this._map.getCoordinateFromView([width,height/2]);
        const searchRadius = distanceBetweenTwoGeoDots(leftCenterDot, rightCenterDot);

        this.props.updateMapUnits(coordsBox, centerDot, searchRadius, this.fetchController);

        clearInterval(this._stayInterval);
        this._stayInterval = setInterval(
            () => {
                if(!this.props.isLoading) {
                    this.props.updateMapUnits(coordsBox, centerDot, searchRadius, this.fetchController);
                }
            }, 3000);

    }

    mapRegionWillChange() : void {
        clearInterval(this._stayInterval);
        this.fetchController.abort();
        this.fetchController = new AbortController();
    }

    componentWillUnmount() : void {
        clearInterval(this._stayInterval);
        this.fetchController.abort();
    }

    shouldComponentUpdate(nextProps : any, nextState : any) : boolean {
        //simple way to detect new data
        /*if(
            (nextProps.bikes.length === this.props.bikes.length &&
            nextProps.stations.length === this.props.stations.length) ||
            nextProps.hasErrored !== this.props.hasErrored
        ) {
            return false;
        }*/
        return true;
    }

    render(){

        const RenderedBikes = () : any => {return this.props.bikes.map((element : Bike, index : number) => {

                const cycleImage = require("../../assets/icons/cycle_enabled.png");

                return (
                    <MapboxGL.ShapeSource
                        key={"ShapeBike_"+index}
                        id={"ShapeBike_"+index}
                        shape={element.getLocation()}
                        buffer={32}
                    >
                        <MapboxGL.SymbolLayer
                            key={"SymbolBike_"+index}
                            id={"SymbolBike_"+index}
                            style={{
                                iconImage : cycleImage,
                                iconSize : 0.75,
                                iconIgnorePlacement : false,
                                iconAllowOverlap : true
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )
            });
        };

        const RenderedStations = () : any => {return this.props.stations.map((element : Station, index : number) => {

                const stationImage = require("../../assets/icons/stationBike.png");

                return (
                    <MapboxGL.ShapeSource
                        key={"ShapeStation"+index}
                        id={"ShapeStation"+index}
                        shape={element.getLocation()}
                        buffer={32}
                    >
                        <MapboxGL.SymbolLayer
                            id={"SymbolStation"+index}
                            key={"SymbolStation"+index}
                            style={{
                                iconImage : stationImage,
                                iconSize : 1,
                                iconIgnorePlacement : false,
                                iconAllowOverlap : true
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )
            });
        };

        return (
            <MapboxGL.MapView
                style = {{
                    width,
                    height,
                    position : "absolute"
                }}
                ref = {(map) => this._map = map}
                onRegionDidChange={this.mapRegionDidChange}
                onRegionWillChange={this.mapRegionWillChange}
                regionDidChangeDebounceTime={1000}
                regionWillChangeDebounceTime={10}
                styleURL = {MapboxGL.StyleURL.Street}

            >
                <MapboxGL.Camera
                    ref={(camera) => this._camera = camera}
                    centerCoordinate = {[-122.335260, 47.60377]}
                    zoomLevel = {10}
                />
                <RenderedBikes/>
                <RenderedStations/>
            </MapboxGL.MapView>
        );
    }
}

function mapDispatchToProps(dispatch : any) : object {
    return {
        updateMapUnits: (coordsBox: Array<Array<number>>,
                      coordsCenter: Array<number>,
                      radius: number,
                      controller: AbortController) => dispatch(mapFetchData(coordsBox, coordsCenter, radius, controller)),
    }
}

function mapStateToProps(state : any) : object {
    return {
        bikes : state.mapData.bikes.getCollection(),
        stations : state.mapData.stations.getCollection(),

        hasErrored : state.hasErrored,
        isLoading : state.isLoading,

    };
}

const MapScreenWithStore = connect(mapStateToProps, mapDispatchToProps)(MapScreen);

export default MapScreenWithStore;
