import {IGraph, IEdge, IVertex, Vertex, Edge, Graph} from "graphlabs.core.graphs";
import {IGraphVisualizer} from "../types/IGraphVisualizer";
import {IVertexVisualizer} from "../types/IVertexVisualizer";
import {DefaultVertexVisualizer} from "./DefaultVertexVisualizer";
import {GeometricGraph} from "../geometrics/GeometricGraph";
import {GeometricVertex} from "../geometrics/GeometricVertex";

export class DefaultGraphVisualizer implements IGraphVisualizer {
    public geometric: GeometricGraph<Graph<Vertex, Edge>, Vertex, Edge>;

    public width: number;
    public height: number;

    public vertices: GeometricVertex<Vertex>[];

    public constructor(graph: IGraph<IVertex, IEdge>) {
        this.geometric = new GeometricGraph<Graph<Vertex, Edge>, Vertex, Edge>(<Graph<Vertex, Edge>> graph);
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