export class Node {
    latitude: number;
    longitude: number;
    
    constructor(latitude: number, longitude: number){
        this.latitude = latitude
        this.longitude = longitude
    }

    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }
}