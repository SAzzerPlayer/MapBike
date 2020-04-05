
export type BikeFetch = {
    bike_id : string,
    lat : number,
    lon : number,
    system_id : string,
}

export type StationFetch = {
    station_id : string,
    lat : number,
    lon : number,
    system_id : string,
}

export class BoxUnit {
    private _id : string;

    private _lat : number;

    private _lon : number;

    private _systemId : string;

    constructor(id : string, lon : number, lat : number, systemId : string){
        this._id = id;
        this._lat = lat;
        this._lon = lon;
        this._systemId = systemId;
    }

    public getLocation() : object {
        const location = {
            type : "Point",
            coordinates : [this._lon, this._lat]
        };
        return location;
    }

    public getCoords() : Array<number> {
        return [this._lon, this._lat];
    }

    public getId() : string {
        return this._id;
    }
}

export class Bike extends BoxUnit{

    constructor(bike : BikeFetch){
        super(bike["bike_id"], bike.lon, bike.lat, bike["system_id"]);
    }

}

export class Station extends BoxUnit {

    constructor(station : StationFetch){
        super(station["station_id"], station.lon, station.lat, station["system_id"]);
    }

}

export class BoxArray<T extends BoxUnit> {

    private _collection : Array<T>;

    constructor(){
        this._collection = [];
    }

    public updateWithBox(units : Array<T>, coordsBox : Array<Array<number>>) : void {
        // Filtering method for collecting points in a box
        const filterMethod = (element : T) => {
            const coords = element.getCoords();
            const unitInBox = (coords[0] <= coordsBox[0][0] &&
                coords[0] >= coordsBox[1][0] &&
                coords[1] <= coordsBox[0][1] &&
                coords[1] >= coordsBox[1][1]);
            return unitInBox;
        };
        //filter already collected elements in the memory
        this._collection = this._collection.filter(filterMethod);
        //filter fetched units
        units = units.filter(filterMethod);
        //
        units.forEach((newUnit : T) => {
            const oldUnitExist = this._collection.find((oldUnit) => oldUnit.getId() === newUnit.getId());
            if(oldUnitExist){
                this._collection[this._collection.indexOf(oldUnitExist)] = newUnit;
            }
            else {
                this._collection.push(newUnit);
            }
        });
        //cleaning
        units.length = 0;
    }

    public getCollection() : Array<T> {
        return this._collection;
    }

    public length() : number {
        return this._collection.length;
    }

    public clean() : void {
        this._collection.length = 0;
    }

}

