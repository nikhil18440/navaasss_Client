import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componants/Navbar/Navbar";
import PeopleList from "./componants/peoples/Peoples";
// import Home from "./componants/Home/Home";
// import About from "./componants/About/About";
import "./App.css";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        {/* Define all routes here */}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/people" element={<PeopleList />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
