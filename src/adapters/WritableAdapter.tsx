import * as React from 'react';
import {ReadableAdapter} from "./ReadableAdapter";
import {select} from "d3-selection";
import * as d3 from 'd3';
import {Vertex, Edge} from "graphlabs.core.graphs";
import {GeometricEdge, GeometricVertex} from "..";

export class WritableAdapter extends ReadableAdapter{

    public vertexOne: string;
    public vertexTwo: string;

    public addVertex() {
        super.addVertex();
        const vertex = new Vertex((this.props.graph.vertices.length).toString());
        this.props.graph.addVertex(vertex);
        this.graphVisualizer.geometric.vertices.push(new GeometricVertex(vertex));
        const elem = this.graphVisualizer.geometric.vertices[this.props.graph.vertices.length-1];
        this.addVertexToSVG(elem);
    }

    public addEdge() {
        super.addEdge();
        if (this.vertexOne && this.vertexTwo){
            const edge = new Edge(this.props.graph.vertices[Number(this.vertexOne)], this.props.graph.vertices[Number(this.vertexTwo)]);
            this.props.graph.addEdge(edge);
            this.vertexOne = null;
            this.vertexTwo = null;
            this.graphVisualizer.geometric.edges.push(new GeometricEdge(edge));
            const elem = this.graphVisualizer.geometric.edges[this.props.graph.edges.length-1];
            this.addEdgeToSVG(elem);
        }
    }

    public removeVertex() {
        super.removeVertex();
        const elem = this.graphVisualizer.geometric.vertices[this.props.graph.vertices.length-1];
        if (this.vertexOne){
            this.props.graph.removeVertex(this.props.graph.vertices[Number(this.vertexOne)]);
            this.vertexOne = null;
        }
        this.removeVertexFromSVG(elem);
        this.graphVisualizer.geometric.vertices.pop();
    }

    public removeEdge() {
        super.removeEdge();
        let elem: GeometricEdge<Edge>;
        for (let i=0;i<this.props.graph.edges.length;i++) {
            if (this.vertexOne && this.vertexTwo) {
                if(this.props.graph.edges[i].vertexOne.name==this.vertexOne && this.props.graph.edges[i].vertexTwo.name==this.vertexTwo
                || this.props.graph.edges[i].vertexOne.name==this.vertexTwo && this.props.graph.edges[i].vertexTwo.name==this.vertexOne){
                    elem = this.graphVisualizer.geometric.edges[i];
                    this.props.graph.removeEdge(this.props.graph.edges[i]);
                    this.graphVisualizer.geometric.edges.splice(i,1);
                }
            }
        }
        this.vertexOne = null;
        this.vertexTwo = null;
        this.removeEdgeFromSVG(elem);
    }

    public clickVertex(elem: SVGCircleElement) {
        super.clickVertex(elem);
        if (this.vertexOne == null){
            this.vertexOne = elem.getAttribute('label');
        }
        else {
            this.vertexTwo = elem.getAttribute('label');
        }
        let elemColour = select<SVGCircleElement, {}>(elem).style("fill");
        if (elemColour === 'rgb(255, 0, 0)'){
            select<SVGCircleElement, {}>(elem)
                .style('fill', '#eee');
        }
        else {
            select<SVGCircleElement, {}>(elem)
                .style('fill', '#ff0000');
        }
    }

    public clickEdge(elem: SVGLineElement) {
        super.clickEdge(elem);
        this.vertexOne=elem.getAttribute('out');
        this.vertexTwo=elem.getAttribute('in');
        let elemColour = select<SVGLineElement, {}>(elem).style("fill");
        if (elemColour === 'rgb(255, 0, 0)'){
            select<SVGLineElement, {}>(elem)
                .style('fill', '#000');
        }
        else {
            select<SVGLineElement, {}>(elem)
                .style('fill', '#ff0000');
        }
    }



}