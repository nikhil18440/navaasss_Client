import logo from './logo.svg';
import './App.css';
import Navbar from './componants/Navbar/Navbar';
import PeopleList from './componants/peoples/Peoples';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <PeopleList/>
    </div>
  );
}

export default App;
