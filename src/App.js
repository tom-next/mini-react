import React from '../lib/react'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            times: 0
        }
    }

    componentWillMount() {
        console.log("componentWillMount")
    }

    componentWillUpdate() {
        console.log("componentWillUpdate")
    }

    componentDidMount() {
        console.log("componentDidMount")
    }

    render() {
        return (
            <div id="id-button-login"
                    onClick={() => { 
                        const {times} = this.state
                        this.setState({
                            times: times + 1
                        })
                        console.log('flag') 
                        }}>
                Like {this.props.times} {this.state.times}
                <Demo type={this.state.times}/>
            </div>
        )
    }
}


class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 0
        }
    }

    componentWillMount(){
        console.log(" Demo componentWillMount")
    }

    render() {
        return(
            <div>
                {this.state.type}
            </div>
        )
    }
}

export default App