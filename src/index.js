import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Comments from "./components/Topics";
import "./style.css";

const BasicExample = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/comments/:id" component={Comments} />
    </div>
  </Router>
);

render(<BasicExample />, document.getElementById("root"));
