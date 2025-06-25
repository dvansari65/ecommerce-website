import { Box, Flex, IconButton, VStack, Text } from "@chakra-ui/react";
import { Home } from "lucide-react";
import { FiHome, FiUser, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      top="0"
      w="60"
      h="100vh"
      bg="gray.800"
      color="white"
      p="5"
      shadow="lg"
    >
      <VStack spacing="6" align="flex-start">
        <Text fontSize="2xl" fontWeight="bold">Dashboard</Text>
        <Flex direction="column" gap={4}>
          <IconButton
            icon={<FiHome />}
            aria-label="Home"
            variant="ghost"
            colorScheme="whiteAlpha"
            _placeholder="home"
          />
          <IconButton
            icon={<FiUser />}
            aria-label="Profile"
            variant="ghost"
            colorScheme="whiteAlpha"
          />
          <IconButton
            icon={<FiSettings />}
            aria-label="Settings"
            variant="ghost"
            colorScheme="whiteAlpha"
          />
        </Flex>
      </VStack>
    </Box>
  );
};

export default Sidebar;
