import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import LogoutButton from "./components/LogoutButton";
import CreatePost from "./components/CreatePost";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import ChatPage from "./pages/ChatPage";

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);
  return (

    <Box position={"relative"} w={"full"}>

    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:post_id" element={<PostPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
        {/*  */}
      </Routes>

      {user && <LogoutButton />}
      {user && <CreatePost />}
    </Container>
    </Box>
  );
}

export default App;
