import { Alert, AlertIcon, AlertTitle, Box, CloseButton, VStack } from '@chakra-ui/react';

interface Notification {
  id: string;
  message: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const Notifications = ({ notifications, onClose }: NotificationsProps) => {
  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification) => (
        <Alert key={notification.id} status="info" variant="solid" width="auto">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
          </Box>
          <CloseButton onClick={() => onClose(notification.id)} />
        </Alert>
      ))}
    </VStack>
  );
};
