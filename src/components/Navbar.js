import React from "react";
import { Flex, Button, Text, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import { useEthereum } from "../contexts/EthereumContext";

const Navbar = () => {
  const { account, connect } = useEthereum();
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Text fontSize="lg" fontWeight="bold">
          My App
        </Text>
      </Flex>

      <Flex align="center" justifyContent="space-between" width="auto">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="ghost" _hover={{ bg: "teal.600" }}>
            Home
          </Button>
        </Link>
        <Link to="/editor" style={{ textDecoration: "none" }}>
          <Button variant="ghost" _hover={{ bg: "teal.600" }}>
            Editor
          </Button>
        </Link>
      </Flex>

      <Flex align="center">
        <Link href="https://github.com/KiwiChen2022" isExternal mx="2">
          <IconButton aria-label="GitHub" icon={<FiGithub />} />
        </Link>
        <Link href="https://discord.gg/8wZA5p5n" isExternal mx="2">
          <IconButton aria-label="Discord" icon={<FaDiscord />} />
        </Link>
        <Link href="https://twitter.com/kiwichen2022" isExternal mx="2">
          <IconButton aria-label="Twitter" icon={<FiTwitter />} />
        </Link>
        {account ? (
          <Button mx="2">
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
          </Button>
        ) : (
          <Button mx="2" onClick={connect}>
            Connect
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
