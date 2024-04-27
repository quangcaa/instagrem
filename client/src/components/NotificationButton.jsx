import { useState } from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    useDisclosure,
    IconButton,
    Button
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
                    <>
                        <a href={`/${activity.username}`}>
                            <img
                                src={activity.profile_image_url}
                                alt={`${activity.username}'s profile picture`}
                                className="profile-image"
                                style={{ width: '44px', height: '44px' }} // Inline styles
                            />
                        </a>
                        <p>
                            <a href={`/${activity.username}`}>
                                <span className="username bold">{activity.username}</span> started following you.
                            </a>
                            <span className="time-string"
                                style={{ fontSize: '0.8em', color: 'gray' }}>
                                {timeString}
                            </span>
                        </p>
                    </>
                );
            case "likes":
                return (
                    <>
                        <a href={`/${activity.username}`}>
                            <img
                                src={activity.profile_image_url}
                                alt={`${activity.username}'s profile picture`}
                                className="profile-image"
                                style={{ width: '44px', height: '44px' }} // Inline styles

                            />
                        </a>

                        <>
                            <a href={`/${activity.username}`}>
                                <span className="username bold">{activity.username}</span> liked on your post:
                                <p>"{activity.activity_message}".</p>
                            </a>
                            <span className="time-string"
                                style={{ fontSize: '0.8em', color: 'gray' }}
                            >{timeString}</span>
                        </>
                    </>
                );
            case "replies":
                return (
                    <>
                        <a href={`/${activity.username}`}>
                            <img
                                src={activity.profile_image_url}
                                alt={`${activity.username}'s profile picture`}
                                className="profile-image"
                                style={{ width: '44px', height: '44px' }} // Inline styles

                            />
                        </a>

                        <>
                            <a href={`/${activity.username}`}>
                                <span className="username bold">{activity.username}</span> commented on your post:
                                <p>"{activity.activity_message}".</p>
                            </a>
                            <span className="time-string"
                                style={{ fontSize: '0.8em', color: 'gray' }}
                            >{timeString}</span>
                        </>
                    </>
                );
            case "mentions":
                return (
                    <>
                        <a href={`/${activity.username}`}>
                            <img
                                src={activity.profile_image_url}
                                alt={`${activity.username}'s profile picture`}
                                className="profile-image"
                                style={{ width: '44px', height: '44px' }} // Inline styles

                            />
                        </a>

                        <>
                            <a href={`/${activity.username}`}>
                                <span className="username bold">{activity.username}</span> mentioned you on their post:
                                <p>"{activity.activity_message}".</p>
                            </a>
                            <span className="time-string"
                                style={{ fontSize: '0.8em', color: 'gray' }}
                            >{timeString}</span>
                        </>
                    </>
                );
            case "reposts":
                return (
                    <>
                        <a href={`/${activity.username}`}>
                            <img
                                src={activity.profile_image_url}
                                alt={`${activity.username}'s profile picture`}
                                className="profile-image"
                                style={{ width: '44px', height: '44px' }} // Inline styles

                            />
                        </a>

                        <>
                            <a href={`/${activity.username}`}>
                                <span className="username bold">{activity.username}</span> reposted your post:
                                <p>"{activity.activity_message}".</p>
                            </a>
                            <span className="time-string"
                                style={{ fontSize: '0.8em', color: 'gray' }}
                            >{timeString}</span>
                        </>

                    </>
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
                position={"fixed"}
                top={"30px"}
                right={"75px"}
                size={"sm"}
                icon={isOpen ? <GoHeartFill size={25} /> : <GoHeart size={25} />}
                variant="ghost"
                onClick={isOpen ? onClose : handleOpenNotification}
            />

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
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

                        <Button mt={4} variant="outline" onClick={handleMarkAllRead}>
                            Mark Notifications as Read
                        </Button>

                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <IconButton

            />
        </>
    );
};

export default NotificationButton;
