export const baseUrl = "http://localhost:1000";

export const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const getTokenfromLocalStorage = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null;

export const config = {
  headers: {
    Authorization: `Bearer ${
      getTokenfromLocalStorage !== null ? getTokenfromLocalStorage : ""
    }`,
    "Content-Type": "application/json",
  },
};
