import {Vertex, Edge, Graph, GeometricGraph} from "graphlabs.core.graphs";

export interface IGraphVisualizer {

    geometric: GeometricGraph<Graph, Vertex, Edge>;
    width: number;
    height: number;

    calculate: () => void;
}