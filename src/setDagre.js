import dagre from 'dagre'

function setDagre(data, option) {
  let g = new dagre.graphlib.Graph()
  g.setGraph({})
  g.setDefaultEdgeLabel(function () {
    return {}
  })
  data.nodes.forEach((v) => {
    g.setNode(v.id, { label: v.label, width: option.nodes.width, height: option.nodes.height, ...v })
    //g.setNode(v.id, { label: v.lebal, width: option.nodes.width, height: option.nodes.height, ...v })
  })
  data.edges.forEach((v) => g.setEdge(v.source, v.target))
  //data.edges.forEach((v) => g.setEdge(v.from, v.to))

  dagre.layout(g)
  //x,y,width,height
  let nodeInfo = {}
  let edgeInfo = {}
  g.nodes().forEach((v) => {    
    let nodeData = g.node(v)
    nodeInfo[v] = {
      ...nodeData,
      x: g.node(v).x - g.node(v).width / 2,
      y: g.node(v).y - g.node(v).height / 2,
      width: g.node(v).width,
      height: g.node(v).height,
      label: g.node(v).label,
    }
  })

  g.edges().forEach((v,i) => {    
    edgeInfo[`from__${v.v}__to__${v.w}`] = {
      source: v.v,
      target: v.w,
      points: [
        [g.node(v.v).x, g.node(v.v).y],
        [g.node(v.w).x, g.node(v.w).y],
      ],
    }
    if(data.edges[i].label){
      edgeInfo[`from__${v.v}__to__${v.w}`].label = data.edges[i].label
    }
  })

  return {
    g,
    nodeInfo,
    edgeInfo,
  }
}

export default setDagre
