import React from "react";
import { Flex, Button, Text, IconButton, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import { useEthereum } from "../contexts/EthereumContext";

const Navbar = () => {
  const { account, connect } = useEthereum();
  const { colorMode } = useColorMode();
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg={colorMode === "dark" ? "ethereum.800" : "ethereum.50"}
      color={colorMode === "dark" ? "ethereum.50" : "ethereum.800"}
      borderBottom="2px solid"
      borderColor="gray.200"
    >
      <Flex align="center" mr={5}>
        <Text fontSize="lg" fontWeight="bold">
          ZKP Aggregator Chain
        </Text>
      </Flex>

      <Flex align="center" justifyContent="space-between" width="auto">
        <Link to="/" style={{ textDecoration: "none", marginRight: "16px" }}>
          <Button variant="solid" _hover={{ bg: "ethereum.700" }}>
            Introduction
          </Button>
        </Link>
        <Link
          to="/editor"
          style={{ textDecoration: "none", marginLeft: "16px" }}
        >
          <Button variant="solid" _hover={{ bg: "ethereum.700" }}>
            Playground
          </Button>
        </Link>
        <Link
          to="/merkle-proof"
          style={{ textDecoration: "none", marginLeft: "16px" }}
        >
          <Button variant="solid" _hover={{ bg: "ethereum.700" }}>
            L1 ZK VERIFICATION
          </Button>
        </Link>
      </Flex>

      <Flex align="center">
        <a
          href="https://github.com/KiwiChen2022"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 8px" }}
        >
          <IconButton aria-label="GitHub" icon={<FiGithub />} variant="solid" />
        </a>
        <a
          href="https://discord.gg/8wZA5p5n"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 8px" }}
        >
          <IconButton
            aria-label="Discord"
            icon={<FaDiscord />}
            variant="solid"
          />
        </a>
        <a
          href="https://twitter.com/kiwichen2022"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 8px" }}
        >
          <IconButton
            aria-label="Twitter"
            icon={<FiTwitter />}
            variant="solid"
          />
        </a>
        {account ? (
          <Button mx="2" variant="solid">
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
          </Button>
        ) : (
          <Button mx="2" onClick={connect} variant="solid">
            Connect
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
