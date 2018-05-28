import { getType } from 'typesafe-actions'
import * as _ from 'lodash'
import { State } from 'godeptypes'
import { DataAction, dataActions } from '../Actions'
import DataSet from '../DataSet'
import VisNetwork from '../VisNetwork'

const INITIAL_STATE: State.ISideBarState = {
  data: {
    cps: { visibleList: [], invisibleList: [] },
    comp: { visibleList: [], invisibleList: [] }
  }
}

export default (state = INITIAL_STATE, action: DataAction) => {
  switch (action.type) {
    case getType(dataActions.initSideBarData):
      VisNetwork.refresh(getVisibleList(action.payload))

      return {
        ...INITIAL_STATE,
        data: action.payload
      }
    case getType(dataActions.showNode):
      VisNetwork.show(action.payload.id)

      return {
        data: {
          ...state.data,
          [action.payload.type]: show(
            state.data[action.payload.type],
            action.payload.id
          )
        }
      }
    case getType(dataActions.hideNode):
      VisNetwork.hide(action.payload.id)

      return {
        data: {
          ...state.data,
          [action.payload.type]: hide(
            state.data[action.payload.type],
            action.payload.id
          )
        }
      }
    default:
      return state
  }
}

function hide(dataSet: State.ISideBarDataSet, id: string) {
  return {
    visibleList: _.without(dataSet.visibleList, id),
    invisibleList: _.union(dataSet.invisibleList, [id]).sort(sortByLabel)
  }
}

function show(dataSet: State.ISideBarDataSet, id: string | string[]) {
  return Array.isArray(id)
    ? {
        visibleList: _.union(dataSet.visibleList, id).sort(sortByLabel),
        invisibleList: _.difference(dataSet.invisibleList, id)
      }
    : {
        visibleList: _.union(dataSet.visibleList, [id]).sort(sortByLabel),
        invisibleList: _.without(dataSet.invisibleList, id)
      }
}

function getVisibleList(dataSet: State.ISideBarData) {
  return _.concat(
    dataSet.cps.visibleList,
    dataSet.comp.visibleList
  )
}

function sortByLabel(prev: string, next: string) {
  if (
    DataSet.getNode(prev).label <= DataSet.getNode(next).label
  ) {
    return -1
  } else {
    return 1
  }
}
