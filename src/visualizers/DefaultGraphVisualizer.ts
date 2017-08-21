import {IGraph, IEdge, IVertex} from "graphlabs.core.graphs";
import {IGraphVisualizer} from "../types/IGraphVisualizer";
import {IVertexVisualizer} from "../types/IVertexVisualizer";

export class DefaultGraphVisualizer implements IGraphVisualizer {
    public graph: IGraph<IVertex, IEdge>;

    public width: number;
    public height: number;

    public vertices: IVertexVisualizer[];

    public constructor(graph: IGraph<IVertex, IEdge>) {
        this.graph = graph;
        this.width = graph.vertices.length * 100;
        this.height = graph.vertices.length * 100;
    }

    public calculate(): void {

    }
}