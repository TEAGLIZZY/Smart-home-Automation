import React from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
// import "./index.css";  // stylesheet
// functionality pages
import Home from "./pages";
import Alarms from "./pages/alarms";
import Heating from "./pages/heating";
import Lights from "./pages/lights";
import Water from "./pages/water";
// other pages
// import Accounts from "./pages/accounts";
// import Profile from "./pages/profile";
// import Settings from "./pages/settings";

function App() {
  return (
      <Router>
          <Navbar />
          <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/alarms" element={<Alarms />} />
              <Route path="/heating" element={<Heating />} />
              <Route path="/lights" element={<Lights />} />
              <Route path="/water" element={<Water />} />
          </Routes>
      </Router>
  );
}

export default App;