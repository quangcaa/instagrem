import { Input, Button, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

const SearchButton = ({ updateSearchResults }) => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = async () => {
        if (!searchText) return; // Prevent empty search requests

        try {
            const response = await fetch(`http://localhost:1000/search/${searchText}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            console.log(data.searchList);
            if (!response.ok) {
                throw new Error(data.message || "Search failed"); // Handle non-200 responses
            }

            updateSearchResults(data.searchList || []); // Update parent component's state
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") { // Trigger search on Enter or Spacebar
            handleSearch();
        }
    };

    return (
        <InputGroup style={{ marginBottom: "1rem" }}>
            <Input
                type="text"
                placeholder="Search users"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown} // Add keydown event handler
            />
            <InputRightElement>
                <Button onClick={handleSearch} type="submit" aria-label="Search" variant='outline' colorScheme="blue">
                    <SearchIcon />
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};

export default SearchButton;
