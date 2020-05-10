import * as React from 'react';
import {ReadableAdapter} from "./ReadableAdapter";
import {select} from "d3-selection";
import * as d3 from 'd3';
import {IVertex, Vertex, Edge, IEdge} from "graphlabs.core.graphs";
import {GeometricEdge, GeometricVertex} from "..";

export class WritableAdapter extends ReadableAdapter {

    public numberOfSelectedVertices():number{
        let circles = document.querySelectorAll('circle[style~="rgb(255,"]');
        console.log(circles);
        return circles.length;
    }

    public numberOfSelectedEdges():number{
        let lines = document.querySelectorAll('line[style~="green;"]');
        console.log(lines);
        return lines.length;
    }

    public addVertex() {
        super.addVertex();
        let vertex: Vertex;
        let isRepeated: boolean;
        // добаление вершины (именование вручную)
        if (this.props.vertexNaming == true) {
            let vertName = prompt('Enter the name of the vertex', '');
            if (vertName !== '' && vertName !== null) {
                if (vertName !== '_') {
                    vertex = new Vertex(vertName);
                }
                else {
                    vertex = new Vertex(vertName+this.graphVisualizer.geometric.vertices.length);
                }
            } else {
                return;
            }
        } else { //добавление вершины (именование автоматическое)
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
        // проверка вершины на уникальность
        if (this.props.graph.vertices.some(v => v.name === vertex.name)) {
            isRepeated = true;
        }
        // добавление вершины в модель, геом. граф и в svg
        if (isRepeated !== true) {
            this.props.graph.addVertex(vertex);
            this.graphVisualizer.geometric.vertices.push(new GeometricVertex(vertex));
            this.addVertexToSVG(new GeometricVertex<Vertex>(vertex));
            this.updateSvg();
        }
    }

    public addEdge() {
        console.log(this.graphVisualizer);
        super.addEdge();
        console.log('vert1' + this.vertexOne);
        console.log('vert2' + this.vertexTwo);
        let edge: Edge;
        if (this.vertexOne.name != '' && this.vertexTwo.name != '' && this.numberOfSelectedVertices() === 2) {
            // добавление ребра (именование вручную)
            if (this.props.edgeNaming === true) {
                let edgeName = prompt('Enter the name of the edge', '');
                if (edgeName !== '' && edgeName !== null) {
                   // if (this.vertexOne.name != '' && this.vertexTwo.name != '') {
                        edge = new Edge(new Vertex(this.vertexOne.name), new Vertex(this.vertexTwo.name), edgeName);
                       /* this.props.graph.addEdge(edge);
                        this.graphVisualizer.geometric.edges.push(new GeometricEdge(edge));
                        this.addEdgeToSVG(new GeometricEdge(edge));
                        this.updateSvg();*/
                   // }
                } else {
                    return;
                }
            } else {
               // if (this.vertexOne.name != '' && this.vertexTwo.name != '') {

                   /* let isRepeated: boolean;
                    for (let i = 0; i < this.props.graph.edges.length; i++) {
                        if (this.props.graph.edges[i].vertexOne.name == this.vertexOne.name && this.props.graph.edges[i].vertexTwo.name == this.vertexTwo.name
                            || this.props.graph.edges[i].vertexOne.name == this.vertexTwo.name && this.props.graph.edges[i].vertexTwo.name == this.vertexOne.name) {
                            isRepeated = true;
                        }
                    }
                    if (isRepeated == true) {
                        console.log("Repeated item!");
                    } else { */
                   // добавление ребра (автоматическое именование)
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
                        } else { // добавленеи неименованных ребер
                            edge = new Edge(new Vertex(this.vertexOne.name), new Vertex(this.vertexTwo.name));
                        }
                        /*console.log(edge);
                        this.props.graph.addEdge(edge);
                        this.graphVisualizer.geometric.edges.push(new GeometricEdge(edge));
                        this.addEdgeToSVG(new GeometricEdge(edge));
                        this.updateSvg();*/
                   // }
               // }
            }
            // проверка ребра на уникальность (нет ребер с таким же именем и нет ребер между данными двумя вершинами)
            let isRepeated2: boolean;
            if (this.props.graph.edges.some(e => e.name === edge.name
                || e.vertexOne.name === edge.vertexOne.name
                || e.vertexTwo.name === edge.vertexOne.name
                || e.vertexOne.name === edge.vertexTwo.name
                || e.vertexTwo.name === edge.vertexTwo.name)) {
                isRepeated2 = true;
                console.log('Repeated edge!');
            }
            // добавление ребра в модель, геом.граф и в svg
            if (isRepeated2 !== true) {
                console.log(edge);
                this.props.graph.addEdge(edge);
                this.graphVisualizer.geometric.edges.push(new GeometricEdge(edge));
                this.addEdgeToSVG(new GeometricEdge(edge));
                this.updateSvg();
            }
        }
        else {
            alert('Для добавления ребра необходимо выбрать две вершины!')
        }
            this.vertexOne.rename('');
            this.vertexTwo.rename('');
    }

    public removeVertex() {
        super.removeVertex();
        console.log('vert1' + this.vertexOne);
        console.log('vert2' + this.vertexTwo);
        let edges: GeometricEdge<Edge>[] = [];
        if ((this.vertexOne.name != '' || this.vertexTwo.name != '') && this.numberOfSelectedVertices() === 1) {
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
            this.vertexTwo.rename('');
        } else {
            alert('Необходимо выбрать одну и только одну вершину!');
        }
    }

    public removeEdge() {
        super.removeEdge();
        if (this.numberOfSelectedEdges() === 1) {
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
        } else {
            alert('Необходимо выбрать одно и только одно ребро!');
        }
        this.updateSvg();
        this.vertexOne.rename('');
        this.vertexTwo.rename('');
    }

}