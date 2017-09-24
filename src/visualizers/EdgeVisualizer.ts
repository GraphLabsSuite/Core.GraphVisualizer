import {Edge} from "graphlabs.core.graphs";
import {Point} from "../types/Point";
import {GeometricEdge} from "../geometrics/GeometricEdge";
export class EdgeVisualizer {

  public static calculate(edge: Edge, x: Point, y: Point): GeometricEdge<Edge> {
    const result = new GeometricEdge(edge);
    result.inPoint = y;
    result.outPoint = x;
    return result;
  }
}