import * as chai from "chai";
import {CircleGraphVisualizer} from "../../src/visualizers/CircleGraphVisualizer";
import {IGraph, IVertex, IEdge, Vertex, Graph, Edge} from "graphlabs.core.graphs";

describe('CircleGraphVisualizer', () => {
    describe('#calculate()', () => {
        const graph: IGraph<IVertex, IEdge> = new Graph<Vertex, Edge>();
        const vertexOne: IVertex = new Vertex("one", graph);
        const vertexTwo: IVertex = new Vertex("two", graph);
        graph.addVertex(vertexOne);
        graph.addVertex(vertexTwo);
        const visualizer: CircleGraphVisualizer = new CircleGraphVisualizer(graph);

            it("calculate graph coordinates with 2 vertices", () => {
            visualizer.calculate();
            chai.assert(visualizer.geometric.vertices.length == 2);
            // chai.assert(visualizer.geometric.vertices[0].center.X == 100);
            // chai.assert(Math.floor(visualizer.geometric.vertices[0].center.Y) == 112);
            // chai.assert(visualizer.geometric.vertices[1].center.X == 100);
            // chai.assert(Math.floor(visualizer.geometric.vertices[1].center.Y) == 87);
        });
    });
});