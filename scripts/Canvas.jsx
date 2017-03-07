import React, {Component} from 'react';
import {render} from 'react-dom';

import go from 'gojs';
import cookie from 'react-cookie';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: props.schema,
      links: props.links,
      layout: props.layout,
      showAttributes: props.showAttributes
    };
    this.diagram = null;
    this.renderDiagram.bind(this);
    this.destroyDiagram.bind(this);
    this.getTableDataArray.bind(this);
    this.getLinkDataArray.bind(this);
    this.getImageFromCanvas.bind(this);
    this.handleLayoutChange.bind(this);
  }


  componentDidMount() {
    this.renderDiagram();
    localStorage.setItem('currentLayout', JSON.stringify({}));
  }

  componentWillReceiveProps(nextProps){
    /*
    Validate the nextProps. If the props require a rerender, set the state and implicitly do so.
    If the nextProps are requesting an image, get the image from the canvas.
     */
    if(nextProps.schema !== this.state.schema || nextProps.links !== this.state.links || nextProps.layout !== this.state.layout || nextProps.showAttributes !== this.state.showAttributes){
      this.setState({
        schema: nextProps.schema,
        links: nextProps.links,
        layout: nextProps.layout,
        showAttributes: nextProps.showAttributes
      });
    }

    if(nextProps.imageRequested){
      this.getImageFromCanvas()
    }
  }

  componentDidUpdate(){
    /*
    Each time the component is updated, the goJS diagram must be destroyed and rebuilt to update.
     */
    this.destroyDiagram();
    this.renderDiagram();
  }

  renderDiagram() {
    /*
    Render the diagram according to the state settings. Most of this code is cloned from
      http://gojs.net/latest/samples/entityRelationship.html
     */
    const $ = go.GraphObject.make;
    const layoutMap = {
      grid: go.GridLayout,
      forceDirected: go.ForceDirectedLayout,
      circular: go.CircularLayout,
      layeredDigraph: go.LayeredDigraphLayout
      };

    this.diagram = $(go.Diagram, "canvas", {
      initialContentAlignment: go.Spot.Center,
      allowDelete: false,
      allowCopy: false,
      'undoManager.isEnabled': true
    });

    if (this.state.layout.isDefault){
      this.diagram.layout = $(layoutMap[this.state.layout.layoutKey]);
    }

    const lightgrad = $(go.Brush, "Linear", {1: "#E6E6FA", 0: "#FFFAF0"});

    const template =
      $(go.Panel, "Horizontal",
        $(go.Shape,
          {desiredSize: new go.Size(10, 10)},
          new go.Binding("figure", "figure"),
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          {
            stroke: "#333333",
            font: "bold 14px sans-serif"
          },
          new go.Binding("text", "name"))
      );


    this.diagram.nodeTemplate = $(go.Node, "Auto",  // the whole node panel
      {
        selectionAdorned: true,
        resizable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        isShadowed: true,
        shadowColor: "#C5C1AA"
      },
      new go.Binding("location", "location").makeTwoWay(),
      // define the node's outer shape, which will surround the Table
      $(go.Shape, "Rectangle",
        {fill: lightgrad, stroke: "#756875", strokeWidth: 3}),
      $(go.Panel, "Table",
        {margin: 8, stretch: go.GraphObject.Fill},
        $(go.RowColumnDefinition, {row: 0, sizing: go.RowColumnDefinition.None}),
        // the table header
        $(go.TextBlock,
          {
            row: 0, alignment: go.Spot.Center,
            margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
            font: "bold 16px sans-serif"
          },
          new go.Binding("text", "key")),
        // the collapse/expand button
        $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
          {row: 0, alignment: go.Spot.TopRight}),
        // the list of Panels, each showing an attribute
        $(go.Panel, "Vertical",
          {
            visible: this.state.showAttributes,
            name: "LIST",
            row: 1,
            padding: 3,
            alignment: go.Spot.TopLeft,
            defaultAlignment: go.Spot.Left,
            stretch: go.GraphObject.Horizontal,
            itemTemplate: template
          },
          new go.Binding("itemArray", "items"))
      )  // end Table Panel
    );  // end Node


    this.diagram.linkTemplate = $(go.Link, "Link", // the whole link panel
      {
        selectionAdorned: true,
        layerName: "Foreground",
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver
      },
      $(go.Shape,  // the link shape
        {stroke: "#303B45", strokeWidth: 2.5}),
      $(go.TextBlock,  // the "from" label
        {
          textAlign: "center",
          font: "bold 14px sans-serif",
          stroke: "#1967B3",
          segmentIndex: 0,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright
        },
        new go.Binding("text", "text")),
      $(go.TextBlock,  // the "to" label
        {
          textAlign: "center",
          font: "bold 14px sans-serif",
          stroke: "#1967B3",
          segmentIndex: -1,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright
        },
        new go.Binding("text", "toText"))
    );

    let data = this.getTableDataArray();
    let links = this.getLinkDataArray();
    if(this.state.layout.isDefault || !this.diagram.model){
      this.diagram.model = new go.GraphLinksModel(data, links);
    } else {
      try{
        this.diagram.model = go.Model.fromJson(this.state.layout.model);
      }
      catch (e){
        this.diagram.model = new go.GraphLinksModel(data, links);
      }

    }

    this.diagram.addDiagramListener("SelectionMoved", (e) => {
      this.handleLayoutChange();
    })
  }

  destroyDiagram() {
    this.diagram.div = null;
  }

  getTableDataArray() {
    /*
    Manipulate the state's schema in order to create an array of tables as goJS nodes. Return an array of nodes.
     */
    let data = [];
    const schema = this.state.schema;
    Object.keys(schema).forEach((key) => {
      let node = {};
      node.key = key;
      node.items = [];

      // Format the table columns
      for (let i = 0; i < schema[key].length; i++){
        let column = {};
        column.name = schema[key][i].name;
        column.iskey = schema[key][i].key !== "";
        column.figure = schema[key][i].key === "" ? "LineH" : schema[key][i].key === "PRI" ? "Diamond" : "TriangleUp";
        node.items.push(column);
      }

      data.push(node);
    });

    return data;
  }

  getLinkDataArray() {
    /*
    Manipulate the state's links in order to create an array of relationships as goJS links. Return an array of links.
     */
    let data = [];
    const links = this.state.links;
    Object.keys(links).forEach((key)=>{
      if (!this.state.schema[key]) return;

      // Format the links
      for(let i = 0; i < links[key].length; i++){
        let table = links[key];
        let link = {};
        link.from = table[i].table_name;
        link.to = table[i].referenced_table_name;
        link.text = "0..N";
        link.toText = "1";
        data.push(link)
      }
    });
    return data;
  }

  getImageFromCanvas(){
    /*
    Create an image element from the goJS canvas and change its source to be downloadable.
     Once changed, the new url is opened in a separate window.
     */
    let img = this.diagram.makeImage({scale: 1});
    let url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    window.open(url);
  }

  handleLayoutChange(){
    let currentLayout = this.diagram.model.toJson();
    localStorage.setItem('currentLayout', JSON.stringify(currentLayout));
  }

  render() {
    return (
      <div id="canvas" className="goJS-canvas"></div>
    )
  }
}
