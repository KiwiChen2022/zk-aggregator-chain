import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  useColorMode,
} from "@chakra-ui/react";

const HomePage = () => {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h1" size="xl" mb={4} color="ethereum.900">
          ZK GRANT EXAMPLE
        </Heading>
        <Text
          fontSize="lg"
          color={colorMode === "dark" ? "ethereum.200" : "ethereum.600"}
        >
          ZK GRANT EXAMPLE TEXT
        </Text>
        <Text
          fontSize="lg"
          color={colorMode === "dark" ? "ethereum.200" : "ethereum.600"}
          mt={4}
        >
          ZK GRANT EXAMPLE TEXT 2
        </Text>
        <Button colorScheme="ethereum" mt={10}>
          START EXPLORING
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
