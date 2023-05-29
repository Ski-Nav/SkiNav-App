import { Node } from "./node";
import { Edge } from "./edge";
import { PriorityQueue } from "./priorityQueue";
import { trailStatusUrls } from "./../cfg/trailStatusUrls";
import fs from 'fs';
var cloneDeep = require('lodash.clonedeep');

interface Alias {
    name: string;
    node: Node;
}

export class SkiNavigator{
    graph: {[fromId: string]: {[toId: string]: Edge}};
    nodes: {[id: string]: Node};
    edges: {[name: string]: Edge};
    diff_map: {[diff: string]: number};
    resortName: string;

    constructor(){
        this.graph = {}
        this.nodes = {};
        this.edges = {};
        this.diff_map = {
            "": 1,
            "novice": 1,
            "easy": 1,
            "intermediate": 2,
            "advanced": 3,
            "expert": 3,
        }
        this.resortName = "";
    };
    
    getGraph() {
        return this.graph;
    }

    getNodes() {
        return this.nodes;
    }

    getEdges() {
        // fs.writeFileSync("edges.json", JSON.stringify(this.edges));
        return this.edges;
    }

    
    getSearchableNodes(): Alias[] {
        var searchableNodes: Alias[] = [];
        for (let nodeId in this.nodes) {
            const aliases = this.nodes[nodeId]["aliases"];
            for (let i in aliases) {
                searchableNodes.push({name: aliases[i], node: this.nodes[nodeId]});
            }
        }
        return searchableNodes;
    }

    /**
     * request graph from our server via api, then parse it into graph, nodes, and edges."
     */
    async requestGraph(graphName: string) {
        this.resortName = graphName;
        const url = "http://ec2-18-222-140-238.us-east-2.compute.amazonaws.com:3000/api/v1/maps/".concat(graphName);
        const response = await fetch(url);
        const graphJson = await response.json();
    
        this.graph = {};
        this.nodes = {};
        this.edges = {};
        
        Object.entries(graphJson["vertices"]).forEach(([_, v]) => {
            let vertex = v as any;
            let vertexId: string = vertex["id"].toString();
    
            this.nodes[vertexId] = new Node(vertexId, Number(vertex["latitude"]), Number(vertex["longitude"]), vertex["aliases"]);
            
            Object.entries(vertex["edges"]).forEach(([_, e]) => {
                let edge = e as any;
                edge["name"] = edge["name"].replace(/[()']/g, "");

                if(edge["edgeType"] == "SLOPE") {
                    this.edges[edge["name"]] = new Edge(edge["edgeType"], this.diff_map[edge["difficulty"]], edge["name"], vertexId, edge["to"].toString(), edge["weight"]);   
                } 
                if(edge["edgeType"] == "LIFT") {
                    this.edges[edge["name"]] = new Edge(edge["edgeType"], 0, edge["name"], vertexId, edge["to"].toString(), edge["weight"]);   
                }
                
                if (!this.graph[vertexId]) {
                    this.graph[vertexId] = {};
                }
                this.graph[vertexId][edge["to"].toString()] = this.edges[edge["name"]];
    
            })
        })
    }

    _dist(x: [number, number], y: [number, number]): number{
        let d = (x[0]-y[0])**2 + (x[1]-y[1])**2;
        return d
    }

    /**
     * Find the closest node to the coordinate the user pressed.
     */
    getClosestNode(lati: number, long: number): string {
        let ClosestNode: string = "",
            minDist: number = Infinity;
        
        for (let n in this.nodes) {
            let curDist = this._dist([lati, long], [this.nodes[n].getLatitude(), this.nodes[n].getLongitude()]);
            if (curDist < minDist){
                minDist = curDist;
                ClosestNode = n;
            }
        }

        return ClosestNode;
    }

    /**
     * Removes runs that are not included in the chosen diffculties or those that are not open.
     */
    _checkDifficultyAndStatus (graph: { [fromId: string]: { [toId: string]: Edge}}, 
                               difficulties: Set<number>) { 
        let newGraph = cloneDeep(graph);        
        for (let fromNode in newGraph) {
            for (let edge in newGraph[fromNode]) {
                if (!difficulties.has(newGraph[fromNode][edge].difficulty) || newGraph[fromNode][edge].status != "open") {
                    delete newGraph[fromNode][edge];
                }
            }
        }
        return newGraph;
    }


    /**
    * Find the shortest path between the startNode and endNode
    */
    _findShortestPath (graph: { [fromId: string]: { [toId: string]: Edge}}, 
                       startNode: string, 
                       endNode: string) {
        let weightsFromStart = new PriorityQueue(),
        predecessors: { [toNode: string]: [string, string]} = {}, // {toNode: [fromNode, EdgeName]}
        visited = new Set([startNode]);

        // establish object for recording weightsFromStart from the start node
        for (let node in graph[startNode]) {
            weightsFromStart.add(node, graph[startNode][node].weight)
        }

        // assign start as predecessor for the nodes pointed by start
        predecessors[endNode] = ["", ""];
        for (let child in graph[startNode]) {
            predecessors[child] = [startNode, graph[startNode][child].name]; 
        }

        // find the nearest node ([nodeId, weight])
        let node = weightsFromStart.remove(); 

        // traverse through all associated nodes 
        while (node) {
            // If the shortest weight node is the endNode, then exit early
            if (String(node[0]) === String(endNode)) {
                break;
            }

            let weight = node[1];
            let children = graph[node[0]];
            for (let childId in children) {
                // skip nodes that are in visited list
                if (visited.has(childId)) {
                    continue;
                } else {
                    let newWeight = weight + children[childId].weight;

                    if (!weightsFromStart.hasNode(childId)){
                        weightsFromStart.add(childId, newWeight);
                        predecessors[childId] = [node[0], graph[node[0]][childId].name];
                    } 
                    else if (weightsFromStart.getWeight(childId) > newWeight) {
                        weightsFromStart.decreaseValue(childId, newWeight);
                        predecessors[childId] = [node[0], graph[node[0]][childId].name];
                    } 
                }
            }

            visited.add(node[0]);
            node = weightsFromStart.remove();
        }

        return predecessors;
    }

    /**
     * Given a list of nodes, return a list of shortest path between each two consecutive nodes.
     */
    async findAllShortestPath(stops: string[], 
                              difficulties: Set<number> = new Set([1,2,3])) {
        difficulties.add(0);
        
        var startNode: any = stops.shift(),
            endNode: any,
            predecessors: { [toNode: string]: [string, string]} = {},
            allPath: (Edge|Node)[][] = [];

        // Check edges status everytime before routing.
        await this.updateEdgesStatus();
        var graph = this._checkDifficultyAndStatus(this.graph, difficulties);

        while (stops.length) {
            endNode = stops.shift();
            predecessors = this._findShortestPath(graph, startNode, endNode);

            // return error if can't find route
            if (predecessors[endNode][0] == "" && predecessors[endNode][1] == "") {
                throw new Error("Cannot find route");
            }

            // record path from start to end
            let shortestPath: (Edge|Node)[] = [this.nodes[endNode]];
            let pre = predecessors[endNode]; // [fromNode, EdgeName]
            while (pre) {
                shortestPath.push(this.edges[pre[1]], this.nodes[pre[0]]);
                pre = predecessors[pre[0]];
            }
            shortestPath.reverse();
            allPath.push(shortestPath);

            startNode = endNode;
        }

        return allPath;
    };

    /**
     * Check and Update the availability of the slope and lifts
     * Runs every time when invoking findAllShortestPath()
     */
    async updateEdgesStatus() {
        const url: string = trailStatusUrls[this.resortName];
        const response = await fetch(url);
        const responseJson = await response.json();

        const mountainAreas = responseJson["MountainAreas"];
        for (let i in mountainAreas) {
            const mountainArea = mountainAreas[i];
            const trails = mountainArea["Trails"];
            const lifts = mountainArea["Lifts"];
            const edges = trails.concat(lifts);

            for (let j in edges) {
                const edge = edges[j];

                var edgeName: string = edge["Name"];
                edgeName = edgeName.replace(/[()']/g, "");

                if (edgeName in this.edges) {
                    if (edge["StatusId"] === 0) {
                        this.edges[edgeName].status = "open";
                    } else {
                        this.edges[edgeName].status = "close";
                    } 
                }
            }
        }

        // TODO: some runs have different names from the mammoth website, hence they are not took into considered, needs to fix somehow.
        // e.g. (High 5, High Five), (Easy Over, Over Easy), (Saint Anton, St, Anton)
    }

}