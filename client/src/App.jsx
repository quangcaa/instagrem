import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import SearchPage from "./pages/SearchPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ChangePassWordPage from "./pages/ChangePassWordPage";

function App() {
  const user = useRecoilValue(userAtom);

  return (
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
        <Route
          path="/:username"
          element={<UserPage />}
        />
        <Route
          path="/:username/post/:post_id"
          element={user ? <PostPage /> : <Navigate to="/auth" />}
        />
        <Route
          path='/update'
          element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />}
        />
        <Route
          path='/update/changepassword'
          element={user ? <ChangePassWordPage /> : <Navigate to='/auth' />}
        />
        <Route
          path="/search"
          element={user ? <SearchPage /> : <Navigate to="/auth" />}
        />
      </Routes>

    </Container>
  );
}

export default App;
