import React, { useState } from "react";
import Post from "../posts/Post";
import Suggestions from "./Suggestions";
import "./Timeline.css";
import { api } from "../../helps/axios";

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await api.get("/feed");
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getPosts();
  }, []);

  return (
    <div className="timeline">
      <div className="timeline__left">
        <div className="timeline__posts">
          {posts.map((post) => (
            <Post
              user={post.user}
              postImage={post.postImage}
              likes={post.likes}
              timestamp={post.timestamp}
            />
          ))}
        </div>
      </div>
      <div className="timeline__right">
        <Suggestions />
      </div>
    </div>
  );
};

export default Timeline;
