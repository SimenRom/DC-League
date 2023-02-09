import { useEffect } from 'react';
import './App.css';
import { FirebaseContextProvider, useFirebaseContext } from './Components/FirebaseContextProvider';
import Header from './Components/Header';
import Scoreboard from './Components/Scoreboard';
import GameList from './Components/GameList';
import Content from './Components/Content';

function App() {

  return (
    <FirebaseContextProvider>
      <div className="App">
       <Header/>
       <Content/>
      </div>
    </FirebaseContextProvider>
  );
}

export default App;
