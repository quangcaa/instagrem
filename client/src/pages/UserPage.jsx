import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`http://localhost:1000/user/${username}`, {
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [username, showToast]);
  if (!user) return null;
  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={120}
        replies={5}
        postImg="/post1.png"
        postTitle="Hello"
      />
      <UserPost
        likes={145}
        replies={10}
        postImg="/post2.png"
        postTitle="dnadaewfe"
      />
      <UserPost
        likes={334}
        replies={53}
        postImg="/post3.png"
        postTitle="hellofuckingshit"
      />
      <UserPost likes={666} replies={35} postTitle="Hello World" />
    </>
  );
};

export default UserPage;
