import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import authScreenAtom from "../atoms/authAtom";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:1000/auth/logout", {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });
      const data = await res.json();
      //   console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("userInfo");
      setUser(null);
    } catch (error) {
      console.log(error);
    }

    setAuthScreen("login");
  };
  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      <FiLogOut size={20} />
    </Button>
  );
};

export default LogoutButton;
