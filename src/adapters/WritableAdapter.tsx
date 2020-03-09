import * as React from 'react';
import {ReadableAdapter} from "./ReadableAdapter";
import {select} from "d3-selection";
import * as d3 from 'd3';
import {IVertex, Vertex, Edge, IEdge} from "graphlabs.core.graphs";
import {GeometricEdge, GeometricVertex} from "..";

export class WritableAdapter extends ReadableAdapter {

    public addVertex() {
        console.log(this.graphVisualizer);
        super.addVertex();
        let vertex: Vertex;
        if (this.props.vertexNaming == true){
            let vertName = prompt('Enter the name of the vertex','');
            if (vertName !== '' && vertName !== null){
                vertex = new Vertex(vertName);
            }
            else {
                return;
            }
        }
        else {
            if (this.graphVisualizer.geometric.vertices.length != 0) {
                let vertNumbers = [];
                for (let i = 0; i < this.graphVisualizer.geometric.vertices.length; i++) {
                    vertNumbers[i] = Number(this.graphVisualizer.geometric.vertices[i].vertex.name);
                }
                let maxNum = Math.max.apply(null, vertNumbers);
                vertex = new Vertex((maxNum + 1).toString());
            } else {
                vertex = new Vertex('0');
            }
        }
        this.props.graph.addVertex(vertex);
        this.graphVisualizer.geometric.vertices.push(new GeometricVertex(vertex));
        this.addVertexToSVG(new GeometricVertex<Vertex>(vertex));
        this.updateSvg();
    }

    public addEdge() {
        console.log(this.graphVisualizer);
        super.addEdge();
        console.log('vert1' + this.vertexOne);
        console.log('vert2' + this.vertexTwo);
        if (this.vertexOne.name != '' && this.vertexTwo.name != '') {
            /*let vertNumbers = [];
            for (let i = 0; i < this.graphVisualizer.geometric.edges.length; i++){
                vertNumbers[i] = Number(this.graphVisualizer.geometric.edges[i].edge.name);
            }
            let maxNum = Math.max.apply(null,vertNumbers);*/
            let isRepeated: boolean;
            for (let i = 0; i < this.props.graph.edges.length; i++) {
                if (this.props.graph.edges[i].vertexOne.name == this.vertexOne.name && this.props.graph.edges[i].vertexTwo.name == this.vertexTwo.name
                    || this.props.graph.edges[i].vertexOne.name == this.vertexTwo.name && this.props.graph.edges[i].vertexTwo.name == this.vertexOne.name) {
                    isRepeated = true;
                }
            }
            if (isRepeated == true) {
                console.log("Repeated item!");
            } else {
                let edge;
                if (this.props.namedEdges == true) {
                    if (this.graphVisualizer.geometric.edges.length != 0) {
                        let edgeNumbers = [];
                        for (let i = 0; i < this.graphVisualizer.geometric.edges.length; i++) {
                            edgeNumbers[i] = Number(this.graphVisualizer.geometric.edges[i].edge.name);
                        }
                        let maxNum = Math.max.apply(null, edgeNumbers);
                        edge = new Edge(new Vertex(this.vertexOne.name), new Vertex(this.vertexTwo.name), (maxNum + 1).toString());
                    } else {
                        edge = new Edge(new Vertex(this.vertexOne.name), new Vertex(this.vertexTwo.name), '0');
                    }
                } else {
                    edge = new Edge(new Vertex(this.vertexOne.name), new Vertex(this.vertexTwo.name));
                }
                console.log(edge);
                this.props.graph.addEdge(edge);
                this.graphVisualizer.geometric.edges.push(new GeometricEdge(edge));
                // const elem = this.graphVisualizer.geometric.edges[this.props.graph.edges.length-1];
                this.addEdgeToSVG(new GeometricEdge(edge));
                this.updateSvg();
            }
            this.vertexOne.rename('');
            this.vertexTwo.rename('');
        }
    }

    public removeVertex() {
        console.log(this.graphVisualizer);
        super.removeVertex();
        console.log('vert1' + this.vertexOne);
        let edges: GeometricEdge<Edge>[] = [];
        if (this.vertexOne.name != '') {
            for (let i = 0; i < this.graphVisualizer.geometric.vertices.length; i++) {
                if (this.graphVisualizer.geometric.vertices[i].label == this.vertexOne.name) {
                    console.log(this.props.graph.vertices[i].name);
                    for (let j = 0; j < this.graphVisualizer.geometric.edges.length; j++) {
                        if (this.graphVisualizer.geometric.edges[j].edge.vertexOne.name == this.vertexOne.name || this.graphVisualizer.geometric.edges[j].edge.vertexTwo.name == this.vertexOne.name) {
                            let elem = this.graphVisualizer.geometric.edges[j];
                            edges.push(elem);
                        }
                    }
                    if (edges.length != 0) {
                        for (let k = 0; k < edges.length; k++) {
                            this.removeEdgeFromSVG(edges[k]);
                            this.props.graph.removeEdge(edges[k].edge);
                            this.graphVisualizer.geometric.edges.splice(this.graphVisualizer.geometric.edges.indexOf(edges[k], 0), 1);
                            this.updateSvg();
                        }
                    }
                    this.removeVertexFromSVG(this.graphVisualizer.geometric.vertices[i]);
                    this.props.graph.removeVertex(this.props.graph.vertices[i]);
                    this.graphVisualizer.geometric.vertices.splice(i, 1);
                    this.updateSvg();
                }
            }
            this.vertexOne.rename('');
        }
    }

    public removeEdge() {
        console.log(this.graphVisualizer);
        super.removeEdge();
        let elem: GeometricEdge<Edge>;
        for (let i = 0; i < this.props.graph.edges.length; i++) {
            if (this.vertexOne.name != '' && this.vertexTwo.name != '') {
                if (this.props.graph.edges[i].vertexOne.name == this.vertexOne.name && this.props.graph.edges[i].vertexTwo.name == this.vertexTwo.name
                    || this.props.graph.edges[i].vertexOne.name == this.vertexTwo.name && this.props.graph.edges[i].vertexTwo.name == this.vertexOne.name) {
                    elem = this.graphVisualizer.geometric.edges[i];
                    this.removeEdgeFromSVG(elem);
                    this.props.graph.removeEdge(this.props.graph.edges[i]);
                    this.graphVisualizer.geometric.edges.splice(i, 1);
                    this.updateSvg();
                }
            }
        }
        this.vertexOne.rename('');
        this.vertexTwo.rename('');
    }

}