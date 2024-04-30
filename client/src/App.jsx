import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import CreatePost from "./components/CreatePost";
import LogoutButton from "./components/LogoutButton";
import NotificationButton from "./components/NotificationButton"
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import ChatPage from "./pages/ChatPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ChangePassWordPage from "./pages/ChangePassWordPage";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW="620px">
        <Header />
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
          <Route
            path="/update/changepassword"
            element={user ? <ChangePassWordPage /> : <Navigate to="/auth" />}
          />
          <Route path="/:username" element={user ?
            (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          } />
          <Route path="/:username/post/:post_id" element={<PostPage />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
        </Routes>
      </Container>
      {user && <NotificationButton />}
    </Box>
  );
}

export default App;
