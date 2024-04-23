import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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
