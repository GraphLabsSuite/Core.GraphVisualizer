import {IGraph, IVertex, IEdge} from "graphlabs.core.graphs";

export interface IGraphVisualizer {

    graph: IGraph<IVertex, IEdge>;
    width: number;
    height: number;

    calculate: () => void;
}