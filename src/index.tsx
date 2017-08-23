import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Header from './components/Header';
import CreateSession from './components/CreateSession';
import Questionare from './components/Questionnaire';
import Terms from './components/Terms';

export interface State {
    isVisible: boolean
}

class App extends React.Component<null, State> {
    constructor() {
        super();
        this.state = {
            isVisible: false
        }
        this.showApp = this.showApp.bind(this);
        this.hideApp = this.hideApp.bind(this);
    }

    showApp() {
        this.setState({isVisible: true});
    }

    hideApp() {
        this.setState({isVisible: false});
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return(
            <div id='app-container'>
                <Header />
                <main className={this.state.isVisible ? null : 'hidden'}>
                    <Switch>
                        <Route exact path='/' render={(props: any) => (
                            <CreateSession showApp={this.showApp} hideApp={this.hideApp} {...props} />
                        )}/>
                        <Route exact path='/terms' render={(props: any) => (
                            <Terms />
                        )}/>
                        <Route path='/:id' render={(props: any) => (
                            <Questionare showApp={this.showApp} hideApp={this.hideApp} {...props} />
                        )}/>
                    </Switch>
                </main>
                <div id='loader' className={this.state.isVisible ? 'hidden' : null}>loading...</div>
            </div>
        );
    }
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('app')
);