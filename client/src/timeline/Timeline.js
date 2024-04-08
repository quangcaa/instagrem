import React from "react";
import "./Timeline.css";
import Post from "./posts/Post";
import Sugesstions from "./Sugesstions";


function Timeline() {
  return (
    <div className="timeline">
      <div className="timeline__left">
        <div className="timeline__posts">
          <Post />
          <Post />
          <Post />
        </div>
      </div>
      <div className="timeline__right">
        <Sugesstions />
      </div>
    </div>
  );
}

export default Timeline;
