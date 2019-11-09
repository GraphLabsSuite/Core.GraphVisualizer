import * as React from 'react';
import {ReadableAdapter} from "./ReadableAdapter";
import {select} from "d3-selection";
import * as d3 from 'd3';
import {Vertex, Edge} from "graphlabs.core.graphs";
import {GeometricEdge, GeometricVertex} from "..";

export class WritableAdapter extends ReadableAdapter{

    public addVertex() {
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
        super.addEdge();
        console.log('vert1'+this.vertexOne);
        console.log('vert2'+this.vertexTwo);
        if (this.vertexOne && this.vertexTwo){
            const edge = new Edge(this.props.graph.vertices[Number(this.vertexOne)], this.props.graph.vertices[Number(this.vertexTwo)]);
            this.props.graph.addEdge(edge);
            this.graphVisualizer.geometric.edges.push(new GeometricEdge(edge));
            const elem = this.graphVisualizer.geometric.edges[this.props.graph.edges.length-1];
            //this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
            //this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
            //this.graphVisualizer.calculate();
            this.addEdgeToSVG(elem);
            this.updateSvg();
            this.vertexOne = null;
            this.vertexTwo = null;
        }
    }

    public removeVertex() {
        super.removeVertex();
        console.log('vert1'+this.vertexOne);
        //console.log(this.vertexTwo);
        let elem: GeometricVertex<Vertex>;
        if (this.vertexOne) {
            for (let i = 0; i < this.graphVisualizer.geometric.vertices.length; i++) {
                if (this.graphVisualizer.geometric.vertices[i].label == this.vertexOne){
                    console.log(this.graphVisualizer.geometric.vertices[i].label);
                    console.log(this.props.graph.vertices[i].name);
                    const elem = this.graphVisualizer.geometric.vertices[i];
                    this.removeVertexFromSVG(elem);
                    this.updateSvg();
                    this.props.graph.removeVertex(this.props.graph.vertices[i]);
                    this.graphVisualizer.geometric.vertices.splice(i,1);
                    //this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
                    //this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
                    //this.graphVisualizer.calculate();
                    this.vertexOne = null;
                }
            }
        }
    }

    public removeEdge() {
        super.removeEdge();
        let elem: GeometricEdge<Edge>;
        for (let i=0;i<this.props.graph.edges.length;i++) {
            if (this.vertexOne && this.vertexTwo) {
                if(this.props.graph.edges[i].vertexOne.name==this.vertexOne && this.props.graph.edges[i].vertexTwo.name==this.vertexTwo
                || this.props.graph.edges[i].vertexOne.name==this.vertexTwo && this.props.graph.edges[i].vertexTwo.name==this.vertexOne){
                    elem = this.graphVisualizer.geometric.edges[i];
                    this.removeEdgeFromSVG(elem);
                    this.updateSvg();
                    this.props.graph.removeEdge(this.props.graph.edges[i]);
                    this.graphVisualizer.geometric.edges.splice(i,1);
                }
            }
        }
        //this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        //this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        //this.graphVisualizer.calculate();
        this.vertexOne = null;
        this.vertexTwo = null;
    }





}