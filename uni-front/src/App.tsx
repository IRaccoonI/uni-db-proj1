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
import CreatePost from 'components/CreatePost';
import ListPosts from 'components/Post/List';

function App(): ReactElement {
  const loggedIn = useSelector((state: RootState) => state.auth.user != null);

  return (
    <Router>
      {/* <div className="App"> */}
      {loggedIn ? <Header></Header> : null}
      <Switch>
        <Route path="/login" component={Login} />

        <PrivateRoute
          exact
          path="/manage-posts"
          component={() => ListPosts({ as: 'manage' })}
        />
        <PrivateRoute exact path="/create-post" component={CreatePost} />
        <PrivateRoute exact path="/" component={NotFound} />
        <Route>{loggedIn ? <NotFound /> : <Redirect to="/login" />}</Route>
      </Switch>
      {/* </div> */}
    </Router>
  );
}

export default App;
