import React from '../lib/react'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            times: 0,
        }
    }

    componentWillMount() {
        console.log("componentWillMount")
    }

    componentWillUpdate() {
        console.log("componentWillUpdate")
    }

    componentDidMount() {
        for (let i = 0; i < 100; i++) {
            this.setState(prevState => {
                console.log("App", prevState.times)
                return {
                    times: prevState.times + 1
                }
            })
        }
    }

    onClick() {
        const {times} = this.state
        this.setState({
            times: times + 1
        })
    }

    render() {
        return (
            <div id="id-button-login">
                Like {this.props.times} {this.state.times}
                <Demo type={this.state.times} handleClick={() => this.onClick()}/>
            </div>
        )
    }
}


class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 1
        }
    }

    componentWillMount(){
        console.log(" Demo componentWillMount") 
    }

    componentDidMount() {
        for ( let i = 0; i < 100; i++) {
            this.setState( {type: this.state.type + 1 })
        }
    }    

    onClick() {
        this.props.handleClick && this.props.handleClick()
    }

    componentWillReceiveProps(props) {
        this.setState({
            type: props.type
        })
    }

    render() {
        return(
            <div>
            <h1>count</h1>
            <h1>{this.state.type}</h1>
            <button onClick={() => this.onClick()}>add</button>
            {this.state.type === 2 && <h2>test</h2>}
        </div>
        )
    }
}

export default App