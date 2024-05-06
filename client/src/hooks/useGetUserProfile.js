import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const showToast = useShowToast();

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(`http://localhost:1000/user/${username}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }

                setUser(data.user);

            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false)
            }
        };

        getUser();
    }, [username, showToast]);

    return { loading, user };
};

export default useGetUserProfile;