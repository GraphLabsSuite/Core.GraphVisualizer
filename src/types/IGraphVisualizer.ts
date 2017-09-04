import {Vertex, Edge, Graph} from "graphlabs.core.graphs";
import {GeometricGraph} from "../geometrics/GeometricGraph";

export interface IGraphVisualizer {

    geometric: GeometricGraph<Graph<Vertex, Edge>, Vertex, Edge>;
    width: number;
    height: number;

    calculate: () => void;
}