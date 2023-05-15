import { Node } from "./node";
import { Edge } from "./edge";
import { PriorityQueue } from "./priorityQueue";
import { API_URL } from "../constants/constants";
var cloneDeep = require('lodash.clonedeep');

export class SkiNavigator{
    graph: {[fromId: string]: {[toId: string]: Edge}};
    nodes: {[id: string]: Node};
    edges: {[name: string]: Edge};

    constructor(){
        this.graph = {}
        this.nodes = {};
        this.edges = {};
    };
    
    getGraph() {
        return this.graph;
    }

    getNodes() {
        return this.nodes;
    }

    getEdges() {
        return this.edges;
    }

    /**
     * request graph from our server via api, then parse it into graph, nodes, and edges."
     */
    async requestGraph(graphName: string) {
        const url = API_URL + "maps/" + graphName;
        const response = await fetch(url);
        const graphJson = await response.json();
    
        this.graph = {};
        this.nodes = {};
        this.edges = {};
        
        Object.entries(graphJson["vertices"]).forEach(([_, v]) => {
            console.log(v);
            let vertex = v as any;
            let vertexId: string = vertex["id"].toString();
    
            this.nodes[vertexId] = new Node(Number(vertex["latitude"]), Number(vertex["longitude"]));
            
            Object.entries(vertex["edges"]).forEach(([_, e]) => {
                let edge = e as any;
    
                this.edges[edge["name"]] = new Edge(edge["edgeType"], edge["difficulty"], edge["name"], vertexId, edge["to"].toString(), edge["weight"]);   
                
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
     * Removes runs that are not included in the chosen diffculties
     */
    _checkDifficulty = (graph: { [fromId: string]: { [toId: string]: Edge}}, 
                        difficulties: Set<number>) => {
        let newGraph = cloneDeep(graph);        
        for (let fromNode in newGraph) {
            for (let edge in newGraph[fromNode]) {
                if (!difficulties.has(newGraph[fromNode][edge].difficulty)) {
                    delete newGraph[fromNode][edge];
                }
            }
        }
        return newGraph;
    }


    /**
    * Find the shortest path between the startNode and endNode
    */
    _findShortestPath = (graph: { [fromId: string]: { [toId: string]: Edge}}, 
                         startNode: string, 
                         endNode: string) => {
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
    findAllShortestPath = (stops: string[], 
                           difficulties: Set<number> = new Set([0,1,2,3])) => {
        var startNode: any = stops.shift(),
            endNode: any,
            predecessors: { [toNode: string]: [string, string]} = {},
            allPath: (Edge|Node)[][] = [],

        graph = this._checkDifficulty(this.graph, difficulties);

        while (stops.length) {
            endNode = stops.shift();
            predecessors = this._findShortestPath(graph, startNode, endNode);

            // return error if can't find route
            if (!predecessors[endNode]) {
                throw new Error("cannot find route");
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
}