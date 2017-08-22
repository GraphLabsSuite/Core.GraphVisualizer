import {IGraphVisualizer} from "../types/IGraphVisualizer";
import {IGraph, IVertex, IEdge, GeometricGraph, GeometricVertex, Vertex} from "graphlabs.core.graphs";
import {CircleVertexVisualizer} from "./CircleVertexVisualizer";

export class CircleGraphVisualizer implements IGraphVisualizer {
    public geometric: GeometricGraph;

    public width: number;
    public height: number;

    public vertices: GeometricVertex<Vertex>[];

    public constructor(graph: IGraph<IVertex, IEdge>) {
        this.geometric = new GeometricGraph(graph);
        this.width = graph.vertices.length * 100;
        this.height = graph.vertices.length * 100;
        this.vertices = [];
    }

    /**
     * Function of calculating coordinates of the geometric graph
     */
    public calculate(): void {
        // Calculating phi angle between two vertices
        const phi: number = 360 / this.geometric.graph.vertices.length;
        // Calculating radius of the vertex circle (10 - default radius
        const radius: number = (2 * 2 * 10) / (2 * Math.PI);
        const x_center = this.width / 2;
        const y_center = this.height / 2;
        let n = 0;
        for (const vertex of this.geometric.graph.vertices) {
            const y: number = radius * Math.cos(n * phi) + y_center;
            const x: number = radius * Math.sin(n * phi) + x_center;
            this.geometric.vertices.push(CircleVertexVisualizer.calculate(vertex, x, y));
            n++;
        }
    }
}