// import {renderComponent} from '../react-dom/diff'
import { enqueueSetState } from './state_queue'
class Component {
    constructor(props) {
        this.isReactComponent = true
        this.state = {}
        this.props = props
    }
     
    setState(stateChange) {
        // Object.assign( this.state, stateChange )
        // renderComponent( this )
        enqueueSetState(stateChange, this )
    }
}

export default Component