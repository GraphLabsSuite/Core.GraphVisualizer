import * as React from 'react';
import {ReadableAdapter} from "./ReadableAdapter";
import {select} from "d3-selection";
import * as d3 from 'd3';
import {Vertex, Edge} from "graphlabs.core.graphs";
import {GeometricEdge, GeometricVertex} from "..";

export class WritableAdapter extends ReadableAdapter{

    public addVertex() {
        console.log(this.graphVisualizer);
        super.addVertex();
        const vertex = new Vertex((this.props.graph.vertices.length).toString());
        this.props.graph.addVertex(vertex);
        this.graphVisualizer.geometric.vertices.push(new GeometricVertex(vertex));
        const elem = this.graphVisualizer.geometric.vertices[this.props.graph.vertices.length-1];
        //this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        //this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        //this.graphVisualizer.calculate();
        this.addVertexToSVG(elem);
        this.updateSvg();
    }

    public addEdge() {
        console.log(this.graphVisualizer);
        super.addEdge();
        console.log('vert1'+this.vertexOne);
        console.log('vert2'+this.vertexTwo);
        if (this.vertexOne.name != '' && this.vertexTwo.name != ''){
            const edge = new Edge(this.props.graph.vertices[Number(this.vertexOne.name)], this.props.graph.vertices[Number(this.vertexTwo.name)]);
            this.props.graph.addEdge(edge);
            this.graphVisualizer.geometric.edges.push(new GeometricEdge(edge));
            const elem = this.graphVisualizer.geometric.edges[this.props.graph.edges.length-1];
            //this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
            //this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
            //this.graphVisualizer.calculate();
            this.addEdgeToSVG(elem);
            this.updateSvg();
            this.vertexOne.rename('');
            this.vertexTwo.rename('');
        }
    }

    public removeVertex() {
        console.log(this.graphVisualizer);
        super.removeVertex();
        console.log('vert1'+this.vertexOne);
        let edges: GeometricEdge<Edge>[];
        if (this.vertexOne.name != '') {
            for (let i = 0; i < this.graphVisualizer.geometric.vertices.length; i++) {
                if (this.graphVisualizer.geometric.vertices[i].label == this.vertexOne.name){
                    //console.log(this.props.graph.vertices[i].name);
                    for (let j = 0; j < this.graphVisualizer.geometric.edges.length; j++) {
                        if(this.graphVisualizer.geometric.edges[j].edge.vertexOne.name==this.vertexOne.name || this.graphVisualizer.geometric.edges[j].edge.vertexTwo.name==this.vertexOne.name) {
                            this.removeEdgeFromSVG(this.graphVisualizer.geometric.edges[j]);
                            this.props.graph.removeEdge(this.props.graph.edges[j]);
                            this.graphVisualizer.geometric.edges.splice(j,1);
                        }
                    }
                    this.removeVertexFromSVG(this.graphVisualizer.geometric.vertices[i]);
                    this.props.graph.removeVertex(this.props.graph.vertices[i]);
                    this.graphVisualizer.geometric.vertices.splice(i,1);
                    this.updateSvg();
                    }
                    this.vertexOne.rename('');
                }
            }

    }

    public removeEdge() {
        console.log(this.graphVisualizer);
        super.removeEdge();
        let elem: GeometricEdge<Edge>;
        for (let i=0;i<this.props.graph.edges.length;i++) {
            if (this.vertexOne.name != '' && this.vertexTwo.name != '') {
                if(this.props.graph.edges[i].vertexOne.name==this.vertexOne.name && this.props.graph.edges[i].vertexTwo.name==this.vertexTwo.name
                || this.props.graph.edges[i].vertexOne.name==this.vertexTwo.name && this.props.graph.edges[i].vertexTwo.name==this.vertexOne.name) {
                    elem = this.graphVisualizer.geometric.edges[i];
                    this.removeEdgeFromSVG(elem);
                    this.props.graph.removeEdge(this.props.graph.edges[i]);
                    this.graphVisualizer.geometric.edges.splice(i,1);
                    this.updateSvg();
                }
            }
        }
        //this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        //this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        //this.graphVisualizer.calculate();
        this.vertexOne.rename('');
        this.vertexTwo.rename('');
    }

}