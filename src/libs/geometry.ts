
export function distanceBetweenTwoGeoDots(dot1 : Array<number>, dot2 : Array<number>) : number{
    //dot => [ lon , lat ]
    let distance = 0;
    // coordinates of dots in radians
    const [lon1, lon2, lat1, lat2] = [
        dot1[0] * Math.PI / 180,
        dot2[0] * Math.PI / 180,
        dot1[1] * Math.PI / 180,
        dot2[1] * Math.PI / 180
    ];
    // cosines and sines of latitudes and differences of longitudes
    const [cosLat1, cosLat2, sinLat1, sinLat2] = [
        Math.cos(lat1),
        Math.cos(lat2),
        Math.sin(lat1),
        Math.sin(lat2)
    ];
    const delta = lon2 - lon1;
    const [cosDelta, sinDelta] = [
        Math.cos(delta),
        Math.sin(delta)
    ];
    //large circle length calculations
    const y = Math.sqrt(Math.pow(cosLat2 * sinDelta, 2) +
        Math.pow(cosLat1 * sinLat2 - sinLat1 * cosLat2 * cosDelta, 2));
    const x = sinLat1 * sinLat2 + cosLat1 * cosLat2 * cosDelta;
    const ad = Math.atan2(y, x);
    // calculate distance
    const radiusEarth = 6372795; // radius of the Earth in metres
    distance = ad * radiusEarth;

    return distance;
}
