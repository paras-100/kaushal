import { Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" justifyContent="center" py="5">
      <Text>
        Copyright {new Date().getUTCFullYear()} RST Store. All Rights Reserved.
      </Text>
    </Flex>
  );
};

export default Footer;
