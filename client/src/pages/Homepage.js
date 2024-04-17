import React from "react";
import "./Homepage.css";
import Sidenav from "../components/navigation/Sidenav";
import Timeline from "../components/timeline/Timeline";

function Homepage() {
  return (
    <div className="homepage">
      <div className="homepage__navWraper">
        <Sidenav />
      </div>
      <div className="line"></div>
      <div className="homepage__timeline">
        <Timeline />
      </div>
    </div>
  );
}

export default Homepage;
