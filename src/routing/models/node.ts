export class Node {
    nodeId: string;
    latitude: number;
    longitude: number;
    aliases: string[];
    
    constructor(nodeId: string, latitude: number, longitude: number, aliases: string[]){
        this.nodeId = nodeId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.aliases = aliases;
    }

    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }
}