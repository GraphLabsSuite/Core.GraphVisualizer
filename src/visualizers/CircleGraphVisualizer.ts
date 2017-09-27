import {IGraphVisualizer} from "../types/IGraphVisualizer";
import {IGraph, IVertex, IEdge, Vertex, Edge, Graph} from "graphlabs.core.graphs";
import {CircleVertexVisualizer} from "./CircleVertexVisualizer";
import {GeometricGraph} from "../geometrics/GeometricGraph";
import {Point} from "../types/Point";
import {EdgeVisualizer} from "./EdgeVisualizer";

export class CircleGraphVisualizer implements IGraphVisualizer {
    public geometric: GeometricGraph<Graph<Vertex, Edge>, Vertex, Edge>;

    public width: number;
    public height: number;

    public constructor(graph: IGraph<IVertex, IEdge>) {
        this.geometric = new GeometricGraph<Graph<Vertex, Edge>, Vertex, Edge>(<Graph<Vertex, Edge>> graph);
        this.width = graph.vertices.length * 100;
        this.height = graph.vertices.length * 100;
    }

    /**
     * Function of calculating coordinates of the geometric graph
     */
    public calculate(): void {
        this.geometric.vertices = [];
        this.geometric.edges = [];
        const vertexAmount: number = this.geometric.graph.vertices.length;
        if (vertexAmount > 1) {
            // Calculating phi angle between two vertices
            const phi: number = 2 * Math.PI / vertexAmount;

            //Approximating vertexRadius value
            const radius1: number = (Math.min(this.width, this.height)) / 2;
            const grandCircleLength1: number = radius1 * 2 * Math.PI;
            const vertexRadius1: number = grandCircleLength1 / (vertexAmount * 4);

            // Get real data
            const radius: number = (Math.min(this.width, this.height) - vertexRadius1 * 2) / 2;
            const grandCircleLength: number = radius * 2 * Math.PI;
            const vertexRadius: number = grandCircleLength / (vertexAmount * 4);

            // Calculating radius of the vertex circle (10 - default radius, 2 * 10 - diametr, x2 - between two vertices
            // const radius: number = (vertexAmount * 4 * 10) / (2 * Math.PI);
            const x_center = this.width / 2;
            const y_center = this.height / 2;
            let n = 0;
            for (const vertex of this.geometric.graph.vertices) {
                const y: number = radius * Math.cos(n * phi) + y_center;
                const x: number = radius * Math.sin(n * phi) + x_center;
                this.geometric.vertices.push(CircleVertexVisualizer.calculate(vertex, x, y, vertexRadius));
                n++;
            }
            for (const edge of this.geometric.graph.edges) {
                const p1: Point = this.geometric.vertices.filter(v => v.label == edge.vertexOne.name)[0].center;
                const p2: Point = this.geometric.vertices.filter(v => v.label == edge.vertexTwo.name)[0].center;
                this.geometric.edges.push(EdgeVisualizer.calculate(edge, p1, p2));
            }
        } else if (vertexAmount == 1) {
            const length: number = (Math.min(this.width, this.height)) / 2;
            const vertex = this.geometric.graph.vertices[0];
            const x_center = this.width / 2;
            const y_center = this.height / 2;
            this.geometric.vertices.push(CircleVertexVisualizer.calculate(vertex, x_center, y_center, length / 5));
        }
    }
}