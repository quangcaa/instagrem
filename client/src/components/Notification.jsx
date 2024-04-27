import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, IconButton } from "@chakra-ui/react";

const Notification = ({ isOpen, onClose, notificationData }) => {
    // ... notification content and styling
    return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="top">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>Notification</DrawerHeader>
                <DrawerBody>
                    {/* Notification content here */}
                </DrawerBody>
                <IconButton placement="right" icon={<CloseIcon />} onClick={onClose} />
            </DrawerContent>
        </Drawer>
    );
};

export default Notification;