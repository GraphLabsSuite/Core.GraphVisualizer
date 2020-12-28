import {Edge} from "graphlabs.core.graphs";
import {Color} from "../types/Color";
import {EdgeShape} from "../enums/EdgeShape";
import {Point} from "../types/Point";

export class GeometricEdge<T extends Edge> {
  public edge: T;

  public shape: EdgeShape = EdgeShape.WithoutArrow;

  public width: number;

  public color: Color = new Color(0,0,0);

  public inPoint: Point = new Point(0,0);

  public outPoint: Point = new Point(0,0);

  public weightLabel: string;

  public label: string;


  public constructor(edge: T) {
    this.edge = edge;
    this.label = edge.name;
    this.weightLabel = edge.weightLabel;
  }
}
