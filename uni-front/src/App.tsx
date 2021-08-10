import { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';

import Login from 'components/Login/Login';
import Test from 'components/Login/Test';

function App(): ReactElement {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="App">
      {!user ? <Login></Login> : <Test></Test>}
      <Login></Login>
    </div>
  );
}

export default App;
