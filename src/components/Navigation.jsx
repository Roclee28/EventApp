import { Flex, Link as ChakraLink, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <Flex
      as="nav"
      bg="blue.600"
      color="white"
      p={4}
      justify="space-between"
      align="center"
    >
      {/* Logo / Home link */}
      <ChakraLink
        as={Link}
        to="/"
        fontWeight="bold"
        fontSize="xl"
        _hover={{ textDecoration: "none", color: "yellow.300" }}
      >
        Event App
      </ChakraLink>

      {/* Optional: Add Event button */}
      <Button
        as={Link}
        to="/add"
        colorScheme="yellow"
        variant="solid"
        size="sm"
      >
        Add Event
      </Button>
    </Flex>
  );
};