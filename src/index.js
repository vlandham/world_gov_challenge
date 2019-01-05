import React from 'react';
import ReactDOM from 'react-dom';
import './custom.scss';
import './index.scss';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-17355070-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
