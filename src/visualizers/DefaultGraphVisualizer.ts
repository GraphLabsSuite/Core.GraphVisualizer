import {IGraph, IEdge, IVertex, Vertex, GeometricGraph, GeometricVertex} from "graphlabs.core.graphs";
import {IGraphVisualizer} from "../types/IGraphVisualizer";
import {IVertexVisualizer} from "../types/IVertexVisualizer";
import {DefaultVertexVisualizer} from "./DefaultVertexVisualizer";

export class DefaultGraphVisualizer implements IGraphVisualizer {
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

    public calculate(): void {
        this.vertices = DefaultVertexVisualizer.calculateN(
            <Vertex[]> this.geometric.graph.vertices,
            this.width,
            this.height
        );
    }
}