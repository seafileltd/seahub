import { Component } from 'react';
class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('will mount');
    }

    componentDidMount() {
        console.log('did mount');
    }

    componentWillUpdate() {
        console.log('will update');
    }
    
    render() {
        return (
          <div className="app">
            <p>Hello ReactJS</p>
          </div>
        );
    }
}

export default App;

