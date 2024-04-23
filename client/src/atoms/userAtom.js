import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
  default: JSON.oarse(localStorage.getItem("userInfo")),
});

export default userAtom;
