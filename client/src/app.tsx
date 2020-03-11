import { h, Component } from 'preact';

interface AppProps {}
interface AppState {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div></div>;
  }
}

export default App;
