import {Vertex} from "graphlabs.core.graphs";
import {GeometricVertex} from "../geometrics/GeometricVertex";
import {Point} from "../types/Point";

export class DefaultVertexVisualizer {

    public static calculate(vertex: Vertex, maxWidth: number, maxHeight: number): GeometricVertex<Vertex> {
        const result = new GeometricVertex<Vertex>(vertex);
        result.center = new Point(
            Math.floor(Math.random() * (maxWidth + 1)),
            Math.floor(Math.random() * (maxHeight + 1)));
        return result;
    }

    public static calculateN(vertices: Vertex[], min: number, max: number): GeometricVertex<Vertex>[] {
        const result = [];
        for (const vertex of vertices) {
            result.push(DefaultVertexVisualizer.calculate(vertex, min, max));
        }
        return result;
    }
}