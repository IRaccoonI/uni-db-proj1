import { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';

import PrivateRoute from 'components/PrivateRouter';

import Login from 'components/Login';
import Header from 'components/Header';
import NotFound from 'components/NotFound';

function App(): ReactElement {
  const loggedIn = useSelector((state: RootState) => state.auth.user != null);

  return (
    <Router>
      {/* <div className="App"> */}
      {loggedIn ? <Header></Header> : null}
      <Switch>
        <Route path="/login" component={Login} />

        <PrivateRoute exact path="/" component={NotFound} />
        <Route>{loggedIn ? <NotFound /> : <Redirect to="/login" />}</Route>
      </Switch>
      {/* </div> */}
    </Router>
  );
}

export default App;
