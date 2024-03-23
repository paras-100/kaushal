import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useState } from "react";
import { HiOutlineMenuAlt3, HiShoppingBag, HiUser } from "react-icons/hi";
import { IoChevronDown } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Flex
      as="header"
      justify="space-between"
      wrap="wrap"
      py="6"
      px="6"
      bgColor="gray.800"
      w="100%"
      top="0"
      pos="fixed"
      zIndex="2"
    >
      <Heading
        as="h1"
        color="whiteAlpha.800"
        size="md"
        letterSpacing="md"
        fontWeight="bold"
      >
        <Link
          as={RouterLink}
          to="/"
          _hover={{ color: "gray.500", textDecor: "none" }}
        >
          RST Store
        </Link>
      </Heading>

      <Box
        display={{ base: "block", md: "none", sm: "block" }}
        onClick={() => setShow(!show)}
      >
        <Icon as={HiOutlineMenuAlt3} color="white" w="6" h="6" />
      </Box>

      <Box
        display={{ base: show ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
      >
        <Link
          as={RouterLink}
          to="/cart"
          fontSize="sm"
          letterSpacing="wide"
          color="whiteAlpha.600"
          fontWeight="bold"
          textTransform="uppercase"
          mr="5"
          display="flex"
          alignItems="center"
          mt={{ base: 4, md: 0 }}
          _hover={{ color: "whiteAlpha.800" }}
        >
          <Icon as={HiShoppingBag} mr="1" w="4" h="4" />
          Cart
        </Link>

        {userInfo ? (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<IoChevronDown />}
              _hover={{ textDecor: "none", opacity: "0.7" }}
            >
              {userInfo.name}
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/profile">
                Profile
              </MenuItem>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Link
            as={RouterLink}
            to="/login"
            fontSize="sm"
            letterSpacing="wide"
            color="whiteAlpha.600"
            fontWeight="bold"
            textTransform="uppercase"
            mr="5"
            display="flex"
            alignItems="center"
            mt={{ base: 4, md: 0 }}
            _hover={{ color: "whiteAlpha.800" }}
          >
            <Icon as={HiUser} mr="1" w="4" h="4" />
            Login
          </Link>
        )}

        {/* Admin Menu */}
        {userInfo && userInfo.isAdmin && (
          <Menu>
            <MenuButton
              ml="3"
              fontSize="sm"
              fontWeight="semibold"
              as={Button}
              textTransform="uppercase"
              _hover={{ textDecor: "none", opacity: "0.7" }}
            >
              Manage <Icon as={IoChevronDown} />
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/admin/userlist">
                All Users
              </MenuItem>
              <MenuItem as={RouterLink} to="/register">
                Register Pharmsist
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
    </Flex>
  );
};

export default Header;
