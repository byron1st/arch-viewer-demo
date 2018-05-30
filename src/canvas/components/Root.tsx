import { ipcRenderer, remote } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { IAltCmdArg, State } from 'godeptypes'
import * as IPCType from '../../IPCTypes'
import { dataActions } from '../Actions'
import DataSet from '../DataSet'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'
import SideBar from './sideBar/SideBar'
import VisNetwork from '../VisNetwork'

interface IRootProps {
  initSideBarData: (initSideBarState: State.ISideBarData) => any
  substitute: (arg: IAltCmdArg) => any
}

class Root extends React.Component<IRootProps> {
  constructor(props: IRootProps) {
    super(props)

    ipcRenderer.on(
      IPCType.ErrorOccurredChannel,
      (event: any, errorID: string) => {
        VisNetwork.setErrorNode(errorID)
      }
    )

    ipcRenderer.on(
      IPCType.GraphSubstitutionChannel,
      (event: any, arg: IAltCmdArg) => {
        DataSet.substitute(arg.target, arg.alternatives)
        this.props.substitute(arg)
      }
    )
  }

  public componentDidMount() {
    // @ts-ignore
    const initGraph = remote.getCurrentWindow().initGraph
    if (initGraph) {
      this.props.initSideBarData(DataSet.init(initGraph))
    }
  }

  public render() {
    return (
      <div style={{ width: 'inherit', height: 'inherit' }}>
        <SideBar />
        <InfoPanel />
        <Canvas />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    initSideBarData: (initSideBarState: State.ISideBarData) => {
      dispatch(dataActions.initSideBarData(initSideBarState))
    },
    substitute: (arg: IAltCmdArg) => {
      dispatch(dataActions.substitute(arg))
    }
  }
}

export default connect(null, mapDispatchToProps)(Root)
