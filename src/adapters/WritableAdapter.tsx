import * as React from 'react';
import {RAProps, ReadableAdapter} from "./ReadableAdapter";
import {select} from "d3-selection";
import * as d3 from 'd3';
import {Vertex, Edge} from "graphlabs.core.graphs";

export class WritableAdapter extends ReadableAdapter{

    public vertexOne: string;
    public vertexTwo: string;

    protected addVertex() {
        super.addVertex();
        this.props.graph.addVertex(new Vertex((this.props.graph.vertices.length+1).toString()));
        const elem = this.graphVisualizer.geometric.vertices[this.props.graph.vertices.length-1];
        this.addVertexToSVG(elem);
    }

    protected addEdge() {
        super.addEdge();
        if (this.vertexOne && this.vertexTwo){
            this.props.graph.addEdge(new Edge(this.props.graph.vertices[Number(this.vertexOne)], this.props.graph.vertices[Number(this.vertexTwo)]));
            this.vertexOne = null;
            this.vertexTwo = null;
        }
        const elem = this.graphVisualizer.geometric.edges[this.props.graph.edges.length-1];
        this.addEdgeToSVG(elem);
    }

    protected removeVertex() {
        super.removeVertex();
        if (this.vertexOne){
            this.props.graph.removeVertex(this.props.graph.vertices[Number(this.vertexOne)]);
            this.vertexOne = null;
        }
        //this.removeVertexFromSVG(elem);
    }

    protected removeEdge() {
        super.removeEdge();
        for (let i=0;i<this.props.graph.edges.length;i++) {
            if (this.vertexOne && this.vertexTwo) {
                if(this.props.graph.edges[i].vertexOne.name==this.vertexOne && this.props.graph.edges[i].vertexTwo.name==this.vertexTwo
                || this.props.graph.edges[i].vertexOne.name==this.vertexTwo && this.props.graph.edges[i].vertexTwo.name==this.vertexOne){
                    this.props.graph.removeEdge(this.props.graph.edges[i]);
                }
            }
        }
        this.vertexOne = null;
        this.vertexTwo = null;
        //this.props.graph.removeEdgeFromSVG(elem);
    }

    protected clickVertex(elem: SVGCircleElement) {
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

    protected clickEdge(elem: SVGLineElement) {
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