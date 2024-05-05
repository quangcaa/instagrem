import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { Link as RouterLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import NotificationButton from "./NotificationButton";
import CreatePost from "./CreatePost";
import LogoutButton from "./LogoutButton";
import { BsFillChatQuoteFill } from "react-icons/bs";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<Flex justifyContent={"space-between"} mt={6} mb={12} alignItems="center" gap={2}>
			{/* {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)} */}

			{user && (
				<Link as={RouterLink} to="/">
					<GoHome size={30} />
				</Link>
			)}

			{user && (
				<Link as={RouterLink} to="/search">
					<IoSearchOutline size={30} />
				</Link>
			)}

			{/* <Image
				cursor={"pointer"}
				alt='logo'
				w={6}
				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
				onClick={toggleColorMode}
			/> */}

			{user && (
				<CreatePost />
			)}

			{user && (
				<NotificationButton />
			)}

			{user && (
				<Link as={RouterLink} to={`/chat`}>
					<BsFillChatQuoteFill size={30} />
				</Link>
			)}

			{user && (
				<Link as={RouterLink} to={`/${user.username}`}>
					<BsPerson size={30} />
				</Link>
			)}

			{user && (
				<LogoutButton />
			)}

		</Flex>
	);
};

export default Header;