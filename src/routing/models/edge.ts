export class Edge {
    edgeType: string;
    difficulty: number;
    name: string;
    fromID: string;
    toID: string;
    weight: number;
    status: string;

    constructor(edgeType: string, difficulty: number, name: string, fromID: string, toID: string, weight: number) {
        this.edgeType = edgeType;
        this.difficulty = difficulty;
        this.name = name;
        this.fromID = fromID;
        this.toID = toID;
        this.weight = weight;
        this.status = "open";
    }

    getEdgeType(): string {
        return this.edgeType;
    }
    
    getDifficulty(): number {
        return this.difficulty;
    }
    
    getName(): string {
        return this.name;
    }
    
    getWeight(): number {
        return this.weight;
    }
}