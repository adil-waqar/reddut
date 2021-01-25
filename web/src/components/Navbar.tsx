import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServerSideRendered } from '../utils/isServerSideRendered';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data }] = useMeQuery({
    pause: isServerSideRendered()
  });
  const [{ fetching }, logout] = useLogoutMutation();
  let jsx = null;
  if (data?.me) {
    jsx = (
      <>
        <Text fontWeight="500" mr="10px">
          Hello, {data.me.username}
        </Text>
        <Menu>
          <MenuButton
            isLoading={fetching}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="xs"
          >
            🏠
          </MenuButton>
          <MenuList minW="100px">
            <MenuItem
              onClick={async () => {
                await logout();
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  } else {
    jsx = (
      <>
        <NextLink href="/login">
          <Link mr="20px" fontWeight="500">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link fontWeight="500">Sign Up</Link>
        </NextLink>
      </>
    );
  }
  return (
    <Box p="10px" bg="teal.400">
      <Flex w="75%" mx="auto" align="center">
        <Heading color="black" size="lg">
          reddut
        </Heading>
        <Spacer />
        {jsx}
      </Flex>
    </Box>
  );
};
