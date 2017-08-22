import {GeometricGraph} from "graphlabs.core.graphs";

export interface IGraphVisualizer {

    geometric: GeometricGraph;
    width: number;
    height: number;

    calculate: () => void;
}