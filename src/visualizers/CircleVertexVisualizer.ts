import {IVertexVisualizer} from "../types/IVertexVisualizer";
import {Vertex} from "graphlabs.core.graphs";
import {GeometricVertex} from "../geometrics/GeometricVertex";
import {Point} from "../types/Point";

export class CircleVertexVisualizer implements IVertexVisualizer {

    public static calculate(vertex: Vertex, x: number, y: number, radius?: number): GeometricVertex<Vertex> {
        const result = new GeometricVertex(vertex);
        result.center = new Point(x, y);
        result.radius = radius;
        return result;
    }
}