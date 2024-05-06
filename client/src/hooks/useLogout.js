import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();

	const logout = async () => {
		const token = localStorage.getItem("token");

		try {
			const res = await fetch("http://localhost:1000/auth/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				credentials: "include",
			});
			const data = await res.json();

			console.log(data)

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}


			localStorage.removeItem("userInfo");
			setUser(null);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};

	return logout;
};

export default useLogout;