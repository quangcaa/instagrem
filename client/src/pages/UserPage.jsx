import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const showToast = useShowToast();

  // console.log(user);

  useEffect(() => {

    const getPosts = async () => {
      try {
        const res = await fetch(`http://localhost:1000/post/u/${username}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data.posts);

      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false)
      }
    }

    getPosts();
  }, [username, showToast], setPosts);




  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  return (
    <>
      <UserHeader user={user} />


      {!fetchingPosts && posts.length === 0 && (
        <Flex justifyContent="center" mt={3}>
          <h1>User has not posts.</h1>
        </Flex>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12} >
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} user_id={post.user_id} />
      ))}
    </>
  );
};

export default UserPage;
