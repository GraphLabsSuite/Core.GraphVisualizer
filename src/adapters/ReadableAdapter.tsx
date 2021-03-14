import * as React from 'react';
import {select, style} from 'd3-selection';
import * as d3 from 'd3';
import {Vertex, Edge, IEdge, IGraph, IVertex} from 'graphlabs.core.graphs';
import {CircleGraphVisualizer, GeometricEdge, GeometricVertex} from '..';
import {Component} from 'react';
import {svg} from "d3";

export interface RAProps {
    className?: string;
    graph: IGraph<IVertex, IEdge>;
    namedEdges?: boolean;
    vertexNaming?: boolean;
    withoutDragging?: boolean;
    edgeNaming?: boolean;
    incidentEdges?: boolean;
    weightedEdges?: boolean;
    isDirected?:boolean;
}

export interface State {
    events: Event[];
}

export class ReadableAdapter extends Component<RAProps, State> {

    public ref!: SVGSVGElement;
    public graphVisualizer!: CircleGraphVisualizer;
    public vertexOne: IVertex;
    public vertexTwo: IVertex;

    public addVertex() {

    }

    public addEdge() {

    }

    public removeVertex() {

    }

    public removeEdge() {

    }

    renderSvg() {
        console.log(this.graphVisualizer);
        this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.edges) {
            this.addEdgeToSVG(elem);
        }
        for (const elem of this.graphVisualizer.geometric.vertices) {
            this.addVertexToSVG(elem);
        }
    }

    addEdgeToSVG(elem: GeometricEdge<Edge>) {
        console.log(this.graphVisualizer);
        let radius = this.graphVisualizer.geometric.vertices[0].radius;
        const data = [{x: elem.outPoint.X, y: elem.outPoint.Y}, {x: elem.inPoint.X, y: elem.inPoint.Y}];
        select<SVGSVGElement, IEdge[]>(this.ref)
            .append('line')
            .datum([this.vertexOne, this.vertexTwo])
            .attr('id', `edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
            .attr('out', elem.edge.vertexOne.name)
            .attr('in', elem.edge.vertexTwo.name)
            .attr('graph-id', this.graphVisualizer.geometric.graphId)
            .attr('label', elem.label)
            .attr('x1', data[0].x)
            .attr('x2', data[1].x)
            .attr('y1', data[0].y)
            .attr('y2', data[1].y)
            .attr('marker-end', `url(#arrow_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name})`)
            .style('stroke', 'black')
            .style('stroke-width', 5)
            .style('fill', 'none')
            .on('click', clickEdge);


        if (this.props.namedEdges == true) {
            select(this.ref)
                .append('text')
                .attr('id', `label2_${elem.label}`)
                .attr('x', (data[0].x + data[1].x) / 2)
                .attr('y', ((data[0].y + data[1].y) / 2) + 15)
                .text(elem.label)
                .style('fill', '#000')
                .style('font-size', '16px')
                .style('font-family', 'sans-serif')
                .style('text-anchor', 'middle');
        }
        else if (this.props.weightedEdges == true){
            select(this.ref)
                .append('text')
                .attr('id', `label2_${elem.label}`)
                .attr('x', (data[0].x + data[1].x) / 2)
                .attr('y', ((data[0].y + data[1].y) / 2) + 15)
                .text(elem.weightLabel)
                .style('fill', '#000')
                .style('font-size', '16px')
                .style('font-family', 'sans-serif')
                .style('text-anchor', 'middle');
        }

        if (this.props.isDirected == true){
            select<SVGSVGElement, IEdge[]>(this.ref)
                .append('defs')
                .append("marker")
                .attr('id', `arrow_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", radius / 2 + 10)
                .attr("refY", 0)
                .attr("markerWidth", 4)
                .attr("markerHeight", 4)
                .attr("orient", "auto")
                .append('path')
                .attr("d", "M0,-5L10,0L0,5")
                .style('stroke', 'black')
                .style('stroke-width', 1)
                .style('fill', 'none')
        }


        function clickEdge(this: SVGLineElement, dataArr: IVertex[]) {
            dataArr[0].rename(this.getAttribute("out"));
            dataArr[1].rename(this.getAttribute("in"));
            sessionStorage.setItem("out", this.getAttribute("out"));
            sessionStorage.setItem("in", this.getAttribute("in"));
            let elemColour = select<SVGLineElement, {}>(this).style("stroke");
            if (elemColour === 'black') {
                select<SVGLineElement, {}>(this)
                    .style('stroke', 'green');
            } else {
                select<SVGLineElement, {}>(this)
                    .style('stroke', 'black');
            }
        }
    }

    addVertexToSVG(elem: GeometricVertex<Vertex>) {
        console.log(this.graphVisualizer);
        let createVertex =  select<SVGSVGElement, IVertex[]>(this.ref)
            .append('circle')
            .datum([this.vertexOne, this.vertexTwo])
            .attr('id', `vertex_${elem.label}`)
            .attr('graph-id', this.graphVisualizer.geometric.graphId)
            .attr('cx', elem.center.X)
            .attr('cy', elem.center.Y)
            .attr('label', elem.label)
            .attr('r', elem.radius)
            .attr('wave', elem.wave)
            .style('fill', '#eee')
            .style('stroke', '#000')
            .style('stroke-width', 5)
        if (this.props.incidentEdges == true){
            createVertex
                .on('click', clickIncidentEdge);
        } else {
            createVertex
                .on('click', clickVertex);
        }
        if (this.props.withoutDragging !== true){
            createVertex
                .classed('dragging', true)
                .call(d3.drag<SVGCircleElement, IVertex[]>().on('start', startDrag));
        } 
        
        select(this.ref)
            .append('text')
            .attr('id', `label_${elem.label}`)
            .attr('x', elem.center.X)
            .attr('y', elem.center.Y + elem.radius / 4)
            .attr('font-size', elem.radius)
            .text(elem.label)
            .style('fill', '#000')
            .style('font-family', 'sans-serif')
            .style('text-anchor', 'middle')
            .style('padding-top', '50%')
            .style('padding-left', '25%')
            .style('padding-right', '25%')
            .style('user-select', 'none')
            .style('pointer-events', 'none');
        const referrer = this.ref;
        const isNamedEdges = this.props.namedEdges;
        const isWeightedEdges = this.props.weightedEdges;
        const myGraph = this.graphVisualizer.geometric.graph;

        function startDrag(this: SVGCircleElement) {
            const circle = d3.select(this).classed('dragging', true);
            d3.event.on('drag', dragged).on('end', ended);
            const radius = parseFloat(circle.attr('r'));

            function dragged(d: any) {
                if (d3.event.x < referrer.getBoundingClientRect().width - radius
                    && d3.event.x > radius
                    && d3.event.y < referrer.getBoundingClientRect().height - radius
                    && d3.event.y > radius) {
                    circle.raise().attr('cx', d3.event.x).attr('cy', d3.event.y);
                    const name = circle.attr('id');
                    const _id = name.substring(7);
                    const graphId = circle.attr('graph-id');
                    console.log('graphid'+graphId);
                    select(`#label_${_id}`)
                        .raise()
                        .attr('x', d3.event.x)
                        .attr('y', d3.event.y + +circle.attr('r') / 4);
                    d3.selectAll('line').each(function (l: any, li: any) {
                        if (`vertex_${d3.select(this).attr('out')}` === name && d3.select(this).attr('graph-id') === graphId) {
                            console.log('graphid2'+d3.select(this).attr('graph-id'));
                            select(this)
                                .attr('x1', d3.event.x)
                                .attr('y1', d3.event.y);
                            if (isNamedEdges == true || isWeightedEdges == true) {
                                select(`#label2_${d3.select(this).attr('label')}`)
                                    .attr('x', (d3.event.x + Number(d3.select(this).attr('x2'))) / 2)
                                    .attr('y', ((d3.event.y + Number(d3.select(this).attr('y2'))) / 2) + 15);
                            }
                        }
                        if (`vertex_${d3.select(this).attr('in')}` === name && d3.select(this).attr('graph-id') === graphId) {
                            select(this)
                                .attr('x2', d3.event.x)
                                .attr('y2', d3.event.y);
                            if (isNamedEdges == true || isWeightedEdges == true) {
                                select(`#label2_${d3.select(this).attr('label')}`)
                                    .attr('x', (d3.event.x + Number(d3.select(this).attr('x1'))) / 2)
                                    .attr('y', ((d3.event.y + Number(d3.select(this).attr('y1'))) / 2) + 15);
                            }
                        }
                    });
                }
                //     console.log("ATTENTION!!!");
                // }
            }

            function ended() {
                circle.classed('dragging', false);
            }
        }
     
                function clickIncidentEdge(this: SVGCircleElement, dataArr: IVertex[]) {
            let arr_one: IEdge[] = [];
            let arr_two: IEdge[] = [];
            let waveAttr = select<SVGCircleElement,{}>(this).attr('wave');
            let vertexColour = select<SVGCircleElement, {}>(this).style("fill");
            if (vertexColour === 'rgb(238, 238, 238)') {
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#ff0000');
                //select<SVGTextElement,{}>(`#label_${this.getAttribute('label')}`)
                  // .text(this.getAttribute('label')+'(' + this.getAttribute('wave') + ')');
                if (dataArr[0].name == '') {
                    dataArr[0].rename(this.getAttribute('label'));
                    arr_one = dataArr[0].arrOfIncidentEdges(myGraph);
                    d3.selectAll<SVGLineElement, IEdge[]>('line').each(function (l: any, li: any) {
                        for (let i = 0; i < arr_one.length; i++) {
                            if (d3.select(this).attr('in') == arr_one[i].vertexOne.name &&
                                d3.select(this).attr('out') == arr_one[i].vertexTwo.name ||
                                d3.select(this).attr('out') == arr_one[i].vertexOne.name
                                && d3.select(this).attr('in') == arr_one[i].vertexTwo.name) {
                                select<SVGLineElement, {}>(this).style("stroke", 'green');
                            }
                        }
                    });

                } else if (dataArr[1].name == '') {
                    dataArr[1].rename(this.getAttribute('label'));
                    arr_two = dataArr[1].arrOfIncidentEdges(myGraph);
                    d3.selectAll<SVGLineElement, IEdge[]>('line').each(function (l: any, li: any) {
                        for (let i = 0; i < arr_two.length; i++) {
                            if (d3.select(this).attr('in') == arr_two[i].vertexOne.name &&
                                d3.select(this).attr('out') == arr_two[i].vertexTwo.name ||
                                d3.select(this).attr('out') == arr_two[i].vertexOne.name
                                && d3.select(this).attr('in') == arr_two[i].vertexTwo.name) {
                                select<SVGLineElement, {}>(this).style("stroke", 'green');
                            }
                        }
                    });
                } else if (dataArr[0].name !== '' && dataArr[1].name !== '') {
                    dataArr[1].rename('');
                    dataArr[0].rename(this.getAttribute('label'));
                    arr_one = dataArr[0].arrOfIncidentEdges(myGraph);
                    d3.selectAll<SVGLineElement, IEdge[]>('line').each(function (l: any, li: any) {
                        for (let i = 0; i < arr_one.length; i++) {
                            if (d3.select(this).attr('in') == arr_one[i].vertexOne.name &&
                                d3.select(this).attr('out') == arr_one[i].vertexTwo.name ||
                                d3.select(this).attr('out') == arr_one[i].vertexOne.name
                                && d3.select(this).attr('in') == arr_one[i].vertexTwo.name) {
                                select<SVGLineElement, {}>(this).style("stroke", 'green');
                            }
                        }
                    });
                }
            }
            if (vertexColour === 'rgb(255, 0, 0)'){
                let arr: IVertex[] = [];
                let data: IVertex;
                for (let l = 0; l < myGraph.vertices.length; l++){
                    if(this.getAttribute('label') === myGraph.vertices[l].name){
                        data = myGraph.vertices[l];
                    }
                }
                arr = data.arrOfAdjacentVertices(myGraph);
                for (let k = 0; k < arr.length; k++){
                    if (+this.getAttribute('wave') === +arr[k].wave + 1){
                        select<SVGCircleElement, {}>(this)
                            .style('fill', 'blue');
                        select<SVGLineElement,{}>(`#edge_${arr[k].name}_${this.getAttribute('label')}`)
                            .style( 'stroke', 'red');
                        select<SVGLineElement,{}>(`#edge_${this.getAttribute('label')}_${arr[k].name}`)
                            .style( 'stroke', 'red');
                    }
                    else if (this.getAttribute('wave') === '0') {
                        select<SVGCircleElement, {}>(this) .style('fill', 'blue');
                    } //окраска стартовой верширы!
                }
            }

        }

        function clickVertex(this: SVGCircleElement, dataArr: IVertex[]) {
            let elemColour = select<SVGCircleElement, {}>(this).style("fill");
            if (elemColour === 'rgb(255, 0, 0)') {
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#eee');
                if (this.getAttribute('label') == dataArr[0].name) {
                    dataArr[0].rename('');
                } else if (this.getAttribute('label') == dataArr[1].name) {
                    dataArr[1].rename('');
                }
            } else {
                console.log(dataArr[1]);
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#ff0000');
                if (dataArr[0].name == '') {
                    dataArr[0].rename(this.getAttribute('label'));
                } else if (dataArr[1].name == '') {
                    dataArr[1].rename(this.getAttribute('label'));
                } else if (dataArr[0].name !== '' && dataArr[1].name !== '') {
                    dataArr[1].rename('');
                    dataArr[0].rename(this.getAttribute('label'));
                }
            }
        }
    }

    removeVertexFromSVG(elem: GeometricVertex<Vertex>) {

        console.log(this.graphVisualizer);
        select(`#vertex_${elem.label}`)
            .remove();
        select(`#label_${elem.label}`)
            .remove();
    }

    removeEdgeFromSVG(elem: GeometricEdge<Edge>) {
        console.log(this.graphVisualizer);
        select(`#edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
            .remove();
        select(`#label2_${elem.label}`)
            .remove();
    }

    updateSvg() {
        console.log(this.vertexOne);
        console.log(this.vertexTwo);
        this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.vertices) {
            select(`#vertex_${elem.label}`)
                .attr('cx', elem.center.X)
                .attr('cy', elem.center.Y)
                .attr('r', elem.radius)
                .style('fill', '#eee');
            select(`#label_${elem.label}`)
                .attr('x', elem.center.X)
                .attr('y', elem.center.Y + elem.radius / 4)
                .attr('font-size', elem.radius);
        }
        for (const elem of this.graphVisualizer.geometric.edges) {
            select(`#edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                .attr('x1', elem.outPoint.X)
                .attr('x2', elem.inPoint.X)
                .attr('y1', elem.outPoint.Y)
                .attr('y2', elem.inPoint.Y);
            if (this.props.namedEdges == true || this.props.weightedEdges == true) {
                select(`#label2_${elem.label}`)
                    .attr('x', (elem.outPoint.X + elem.inPoint.X) / 2)
                    .attr('y', ((elem.outPoint.Y + elem.inPoint.Y) / 2) + 15);
            }
        }
    }



    componentDidMount() {
        this.graphVisualizer = new CircleGraphVisualizer(this.props.graph);
        this.renderSvg();
        window.onresize = this.updateSvg.bind(this);
    }

    constructor(props: RAProps) {
        super(props);
        this.state = {
            events: []
        };
        this.updateGraph = this.updateGraph.bind(this);
        this.vertexOne = new Vertex('');
        this.vertexTwo = new Vertex('');
    }

    updateGraph() {
        // tslint:disable-next-line no-console
        console.log('Here I am!');
    }

    render() {
        return (
            <svg
                style={{width: '100%', height: '100%'}}
                ref={(ref: SVGSVGElement) => this.ref = ref}
            />);
    }
}
