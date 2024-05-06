import { useState } from "react";
import SearchButton from "../components/SearchButton"; // Import SearchButton component
import { Link, Box, Flex, Image, Text, Spacer, Button } from "@chakra-ui/react";

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <div>
            <SearchButton updateSearchResults={setSearchResults} /> {/* Pass update function */}
            {searchResults.length > 0 && (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {searchResults.map((user) => (
                        <li key={user.user_id} style={{ marginBottom: "1rem" }}>
                            <Flex>
                                <Box>
                                    <Link href={`/${user.username}`}>
                                        <Image
                                            boxSize="50px"
                                            borderRadius="full"
                                            src={user.profile_image_url || "default_profile_pic.jpg"} // Handle missing profile image
                                            alt={`${user.username}'s profile picture`}
                                        />
                                    </Link>
                                </Box>
                                <Box ml={2}>
                                    <Link href={`/${user.username}`}>
                                        <Text fontWeight="bold">{user.username}</Text>
                                    </Link>
                                    {user.full_name && <Text>{user.full_name}</Text>} {/* Assuming you have full_name in search results */}
                                </Box>
                                {/* <Spacer />
                                <Button size="sm" variant="outline" colorScheme="black">Follow</Button> */}
                            </Flex>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchPage;
