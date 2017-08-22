import {IVertexVisualizer} from "../types/IVertexVisualizer";
import {GeometricVertex, Vertex, Point} from "graphlabs.core.graphs";

export class CircleVertexVisualizer implements IVertexVisualizer {

    public static calculate(vertex: Vertex, x: number, y: number): GeometricVertex<Vertex> {
        const result = new GeometricVertex<Vertex>(vertex);
        result.center = new Point(x, y);
        return result;
    }
}