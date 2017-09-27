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
        graph.addEdge(new Edge(vertexOne, vertexTwo));
        const visualizer: CircleGraphVisualizer = new CircleGraphVisualizer(graph);

        it("calculate graph coordinates with 2 vertices", () => {
            visualizer.calculate();
            chai.assert(visualizer.geometric.vertices.length == 2);
            // chai.assert(visualizer.geometric.vertices[0].center.X == 100);
            // chai.assert(Math.floor(visualizer.geometric.vertices[0].center.Y) == 112);
            // chai.assert(visualizer.geometric.vertices[1].center.X == 100);
            // chai.assert(Math.floor(visualizer.geometric.vertices[1].center.Y) == 87);
        });

        it("Adding edges to geometric", () => {
           visualizer.calculate();
           chai.assert(visualizer.geometric.edges.length == 1);
        });

        const graph1: IGraph<IVertex, IEdge> = new Graph<Vertex, Edge>();
        const vertexOne1: IVertex = new Vertex("one", graph1);
        graph1.addVertex(vertexOne1);
        const visualizer1: CircleGraphVisualizer = new CircleGraphVisualizer(graph1);
        it("Calculate graph with the single vertex", () => {
            visualizer1.calculate();
            chai.assert(visualizer1.geometric.vertices.length == 1);
        });

        const graph2: IGraph<IVertex, IEdge> = new Graph<Vertex, Edge>();
        const visualizer2: CircleGraphVisualizer = new CircleGraphVisualizer(graph2);
        it("Calculate graph with no vertices", () => {
            visualizer2.calculate();
            chai.assert(visualizer2.geometric.vertices.length == 0);
        });
    });
});