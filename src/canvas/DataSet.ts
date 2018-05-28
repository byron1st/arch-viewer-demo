import { IGraphDataSet, Graph, State } from 'godeptypes'
import { NodeType } from './enums'

class DataSet {
  private dataSet: IGraphDataSet = { nodeSet: {}, edgeSet: {} }

  public init(graph: Graph.IListGraph) {
    const sideBarState: State.ISideBarData = {
      cps: {
        visibleList: [],
        invisibleList: []
      },
      comp: {
        visibleList: [],
        invisibleList: []
      }
    }

    graph.nodes.forEach(node => {
      this.dataSet.nodeSet[node.id] = node
      dispatchIDToList(sideBarState, node.type, node.id)
    })

    graph.edges.forEach(edge => (this.dataSet.edgeSet[edge.id] = edge))

    sideBarState.cps.visibleList.sort(this.sortByLabel.bind(this))
    sideBarState.comp.visibleList.sort(this.sortByLabel.bind(this))

    return sideBarState
  }

  public getNode(id: string) {
    return this.dataSet.nodeSet[id]
  }

  public getEdge(id: string) {
    return this.dataSet.edgeSet[id]
  }

  public selectNode(id: string) {
    return {
      nodeList: [id],
      edgeList: Object.values(this.dataSet.edgeSet)
        .filter(edge => edge.from === id || edge.to === id)
        .map(edge => edge.id)
    }
  }

  public getVisibleElements(nodeIDList: string[]) {
    const nodeList: Graph.INode[] = nodeIDList.map(nodeID =>
      this.getNode(nodeID)
    )

    const edgeList: Graph.IEdge[] = Object.values(this.dataSet.edgeSet).filter(
      edge => nodeIDList.includes(edge.from) && nodeIDList.includes(edge.to)
    )

    return { nodeList, edgeList }
  }

  private sortByLabel(prev: string, next: string) {
    if (this.dataSet.nodeSet[prev].label <= this.dataSet.nodeSet[next].label) {
      return -1
    } else {
      return 1
    }
  }
}

function dispatchIDToList(
  sideBarStateData: State.ISideBarData,
  type: Graph.NodeType,
  id: string
) {
  switch (type) {
    case NodeType.CPS:
      sideBarStateData.cps.visibleList.push(id)
      break
    case NodeType.COMP:
      sideBarStateData.comp.visibleList.push(id)
      break
  }
}

export default new DataSet()
