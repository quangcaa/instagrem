import { useState } from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    useDisclosure,
    IconButton,
    Button,
    Box,
    Flex,
    Text,
    Link
} from "@chakra-ui/react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import useShowToast from '../hooks/useShowToast';

const Notification = ({ activity }) => {
    // Handle notification type and content
    const notificationContent = (type) => {
        const today = new Date();
        const createdAtDate = new Date(activity.createdAt);
        const differenceInMs = today.getTime() - createdAtDate.getTime();

        // Calculate time units as before:
        const seconds = Math.floor(differenceInMs / 1000) % 60;
        const minutes = Math.floor(differenceInMs / (1000 * 60)) % 60;
        const hours = Math.floor(differenceInMs / (1000 * 60 * 60)) % 24;
        const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

        // Handle larger time units:
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30.4375); // Approximate months (adjust if needed)
        const years = days > 365 ? Math.floor(days / 365) : 0;

        let timeString = "";

        // Find the largest unit with a non-zero value
        let largestUnit = null;
        let largestValue = 0;

        if (years > 0) {
            largestUnit = "year";
            largestValue = years;
        } else if (months > 0) {
            largestUnit = "month";
            largestValue = months;
        } else if (days > 0) {
            largestUnit = "day";
            largestValue = days;
        } else if (hours > 0) {
            largestUnit = "hour";
            largestValue = hours;
        } else if (minutes > 0) {
            largestUnit = "minute";
            largestValue = minutes;
        } else if (seconds > 0) {
            largestUnit = "second";
            largestValue = seconds;
        }

        // Build the time string (if a largest unit was found)
        if (largestUnit) {
            timeString = `${largestValue} ${largestUnit}${largestValue > 1 ? 's' : ''} ago`;
        } else {
            timeString = "just now";
        }

        // console.log(timeString);
        switch (type) {
            case "follows":
                return (
                    <Box // Use Box for container with styling options
                        display="flex"
                        marginBottom="10px"
                        alignItems="center" // Align content vertically
                    >
                        <Link // Use Link for anchor tag with styling options
                            href={`/${activity.username}`}
                            isExternal // Indicate external link for accessibility
                        >
                            <Box // Use Box for image container with styling options
                                width="50px" // Set consistent image width
                                height="50px"
                                borderRadius="full" // Create rounded profile image
                                overflow="hidden" // Prevent image overflow
                            >
                                <img
                                    src={activity.profile_image_url}
                                    alt={`${activity.username}'s profile picture`}
                                />
                            </Box>
                        </Link>
                        <Text // Use Text for styled text content
                            display="inline-block"
                            marginLeft="10px"
                        >
                            <Link // Use Link for username with styling options
                                href={`/${activity.username}`}
                                fontWeight="bold" // Bold username
                            >
                                {activity.username}
                            </Link>
                            {' '}  {/* Add a space after username */}
                            started following you.
                            <Text // Use Text for timestamp with styling options
                                fontSize="0.8em"
                                color="gray"
                            >
                                {timeString}
                            </Text>
                        </Text>
                    </Box>
                );
            case "likes":
                return (
                    <Box // Use Box for container with styling options
                        display="flex"
                        marginBottom="10px"
                        alignItems="center" // Align content vertically
                    >
                        <Link // Use Link for anchor tags (username and post title)
                            href={`/${activity.username}`}
                            isExternal // Indicate external link for accessibility
                        >
                            <Box // Use Box for image container with styling options
                                width="50px" // Set consistent image width
                                height="50px"
                                borderRadius="full" // Create rounded profile image
                                overflow="hidden" // Prevent image overflow
                            >
                                <img
                                    src={activity.profile_image_url}
                                    alt={`${activity.username}'s profile picture`}
                                />
                            </Box>
                        </Link>
                        <Text // Use Text for styled text content
                            display="inline-block"
                            marginLeft="10px"
                        >
                            <Link // Use Link for username with styling options
                                href={`/${activity.username}`}
                                fontWeight="bold" // Bold username
                            >
                                {activity.username}
                            </Link>
                            {' '}  {/* Add a space after username */}
                            liked your post:
                            <Link // Use Link for post title with styling options
                                href={`/${activity.username}/post/${activity.post_id}`}
                            >
                                "{activity.activity_message}"
                            </Link>
                            <Text // Use Text for timestamp with styling options
                                fontSize="0.8em"
                                color="gray"
                            >
                                {timeString}
                            </Text>
                        </Text>
                    </Box>
                );
            case "replies":
                return (
                    <Box // Use Box for container with styling options
                        display="flex"
                        marginBottom="10px"
                        alignItems="center" // Align content vertically
                    >
                        <Link // Use Link for anchor tags (username and post title)
                            href={`/${activity.username}`}
                            isExternal // Indicate external link for accessibility
                        >
                            <Box // Use Box for image container with styling options
                                width="50px" // Set consistent image width
                                height="50px"
                                borderRadius="full" // Create rounded profile image
                                overflow="hidden" // Prevent image overflow
                            >
                                <img
                                    src={activity.profile_image_url}
                                    alt={`${activity.username}'s profile picture`}
                                />
                            </Box>
                        </Link>
                        <Text // Use Text for styled text content
                            display="inline-block"
                            marginLeft="10px"
                        >
                            <Link // Use Link for username with styling options
                                href={`/${activity.username}`}
                                fontWeight="bold" // Bold username
                            >
                                {activity.username}
                            </Link>
                            {' '}  {/* Add a space after username */}
                            commented on your post:
                            <Link // Use Link for post title with styling options
                                href={`/${activity.username}/post/${activity.post_id}`}
                            >
                                "{activity.activity_message}"
                            </Link>
                            <Text // Use Text for timestamp with styling options
                                fontSize="0.8em"
                                color="gray"
                            >
                                {timeString}
                            </Text>
                        </Text>
                    </Box>
                );
            case "mentions":
                return (
                    <Box // Use Box for container with styling options
                        display="flex"
                        marginBottom="10px"
                        alignItems="center" // Align content vertically
                    >
                        <Link // Use Link for anchor tag with styling options
                            href={`/${activity.username}`}
                            isExternal // Indicate external link for accessibility
                        >
                            <Box // Use Box for image container with styling options
                                width="50px" // Set consistent image width
                                height="50px"
                                borderRadius="full" // Create rounded profile image
                                overflow="hidden" // Prevent image overflow
                            >
                                <img
                                    src={activity.profile_image_url}
                                    alt={`${activity.username}'s profile picture`}
                                />
                            </Box>
                        </Link>
                        <Text // Use Text for styled text content
                            display="inline-block"
                            marginLeft="10px"
                        >
                            <Link // Use Link for username with styling options
                                href={`/${activity.username}`}
                                fontWeight="bold" // Bold username
                            >
                                {activity.username}
                            </Link>
                            {'\u00A0'}
                            mentioned you on their post:
                            <Link // Use Link for post link with styling options
                                href={`/${activity.username}/post/${activity.post_id}`}
                            >
                                " {activity.activity_message} ".
                            </Link>
                            <Text // Use Text for timestamp with styling options
                                fontSize="0.8em"
                                color="gray"
                            >
                                {timeString}
                            </Text>
                        </Text>
                    </Box>
                );
            case "reposts":
                return (
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <a href={`/${activity.username}`}>
                            <img
                                src={activity.profile_image_url}
                                alt={`${activity.username}'s profile picture`}
                            />
                        </a>
                        <p style={{ display: 'inline-block', marginLeft: '10px' }}> {/* Inline style for text positioning */}
                            <a href={`/${activity.username}`}>
                                <span style={{ fontWeight: 'bold' }}>{activity.username} </span>
                            </a>
                            reposted your post:
                            <a href={`/${activity.username}/post/${activity.post_id}`}> "{activity.activity_message}". </a>
                            <span style={{ fontSize: '0.8em', color: 'gray' }}>
                                {timeString}
                            </span>
                        </p>
                    </div>
                );
            default:
            // return <p>"{activity.activity_message}"</p>;
        }
    };

    return (
        <div className="notification">
            {notificationContent(activity.activity_type)}
        </div>
    );
};

const NotificationButton = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activities, setActivities] = useState([]);
    const showToast = useShowToast();

    const handleOpenNotification = async () => {
        try {
            const res = await fetch(`http://localhost:1000/activity`, {
                method: "GET",
                credentials: "include",
            });

            // Check for successful response status (usually 200-299)
            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }

            const data = await res.json();

            // console.log(data.activities); // Access the activities object here
            setActivities(data.activities); // Update state with fetched notifications

        } catch (error) {
            console.error("Error fetching notifications:", error);
            showToast("Error", "Error retrieving notifications", "error");
        }
        onOpen(); // Open the drawer
    };


    const handleMarkAllRead = async () => {
        try {
            const res = await fetch(`http://localhost:1000/activity`, {
                method: "PUT",
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`Error marking all notifications as read: ${res.status}`);
            }

            showToast("Success", "Mark all activities as read successfully", "success");
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            showToast("Error", "Error marking all notifications as read", "error");
        }
    }

    return (
        <>
            <IconButton
                // position={"fixed"}
                // top={"30px"}
                // right={"75px"}
                size={"sm"}
                icon={isOpen ? <GoHeartFill size={30} /> : <GoHeart size={30} />}
                variant="ghost"
                onClick={isOpen ? onClose : handleOpenNotification}
            />

            <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="sm">
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Notifications</DrawerHeader>
                    <DrawerBody>

                        {activities.length > 0 ? (
                            <>
                                {/* Render notification content here */}
                                {activities.map((activity) => (
                                    <Notification key={`${activity.username}-${activity.activity_type}-${activity.createdAt}`}
                                        activity={activity} />

                                ))}
                            </>
                        ) : (
                            <p>No notifications yet.</p>
                        )}

                        <Button mt={4} variant="outline" onClick={handleMarkAllRead} colorScheme='black'>
                            Mark Notifications as Read
                        </Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default NotificationButton;
