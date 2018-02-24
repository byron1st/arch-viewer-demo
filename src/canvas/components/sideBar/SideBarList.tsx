import * as React from 'react'
import { connect } from 'react-redux'
import { Node, Edge, ElementSetType, ElementSet } from '../../../GlobalTypes'
import { graphActions } from '../../Actions'
import { RootState } from '../../Reducers'

type SideBarListProps = {
  header: string
  nodeSet: ElementSetType<Node>
  selectedNodeSet: ElementSetType<Node>
}

type SideBarListItemProps = {
  node: Node
  selectedNodeSet: ElementSetType<Node>
  elementSet: ElementSet
  selectElement: (selectionSet: ElementSet) => any
}

class SideBarListItem extends React.Component<SideBarListItemProps> {
  selectItem () {
    let selectionSet: ElementSet = { nodeSet: {}, edgeSet: {} }
    selectionSet.nodeSet[this.props.node.id] = this.props.node

    let initialEdgeSet: ElementSetType<Edge> = {}
    selectionSet.edgeSet = Object.values(this.props.elementSet.edgeSet)
    .filter(edge => edge.from === this.props.node.id || edge.to === this.props.node.id)
    .reduce((accumulator, currentEdge) => {
      accumulator[currentEdge.id] = currentEdge
      return accumulator
    }, initialEdgeSet)

    this.props.selectElement(selectionSet)
  }

  render () {
    let isActive = ''
    if (this.props.selectedNodeSet[this.props.node.id] !== undefined) {
      isActive = 'active'
    }
    return (
      <button type='button' className={`list-group-item list-group-item-action ${isActive}`} onClick={this.selectItem.bind(this)}>{this.props.node.label}</button>
    )
  }
}

function mapStateToProps (state: RootState) {
  return {
    elementSet: state.graphState.elementSet
  }
}

function mapDispatchToProps (dispatch: any) {
  return {
    selectElement: (selectionSet: ElementSet) => {
      dispatch(graphActions.selectElement(selectionSet))
    }
  }
}

const SideBarListItemContainer = connect(mapStateToProps, mapDispatchToProps)(SideBarListItem)

export default class SideBarList extends React.Component<SideBarListProps> {
  render () {
    return (
      <div>
        <h3 className='text-light'>{this.props.header}</h3>
        <div className='list-group'>
          {
            Object.values(this.props.nodeSet).map(node => <SideBarListItemContainer node={node} selectedNodeSet={this.props.selectedNodeSet} />)
          }
        </div>
      </div>
    )
  }
}