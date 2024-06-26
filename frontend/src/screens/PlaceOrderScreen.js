import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

import { createOrder } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems.reduce(
    (acc, currVal) => acc + currVal.price * currVal.qty,
    0
  );
  cart.shippingPrice = cart.itemsPrice < 5000 ? 5000 : 0;
  cart.taxPrice = (28 * cart.itemsPrice) / 100;
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success } = orderCreate;

  const placeOrderHandler = () => {
    const pdf = new jsPDF();
    pdf.text("Invoice", 20, 20);

    let ypost;

    cart.cartItems.map((item, index) => {
      const yPos = 30 + index * 30;
      ypost = yPos;
      pdf.text(
        `Item: ${item.name}, 
        Quantity: ${item.qty}, 
        Price: ${item.price},
        Total:${+item.qty * item.price}`,
        20,
        yPos
      );
    });

    pdf.text(
      `Total Item price:${cart.itemsPrice},
    Tax:${cart.taxPrice},
    Price with tax:${cart.totalPrice}`,
      20,
      ypost + 50
    );
    pdf.save("a4.pdf");
  };

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
    }
  }, [success, navigate, order]);

  return (
    <Flex w="full" direction="column" py="5">
      <CheckoutSteps step1 step2 step3 step4 />

      <Grid templateColumns="3fr 2fr" gap="20">
        {/* Column 1 */}
        <Flex direction="column">
          {/* Order Items */}
          <Box borderBottom="1px" py="6" borderColor="gray.300">
            <Heading as="h2" mb="3" fontSize="2xl" fontWeight="semibold">
              Order Items
            </Heading>
            <Box>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <Box py="2">
                  {cart.cartItems.map((item, idx) => (
                    <Flex
                      key={idx}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Flex py="2" alignItems="center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          w="12"
                          h="12"
                          objectFit="cover"
                          mr="6"
                        />
                        <Link
                          fontWeight="bold"
                          fontSize="xl"
                          as={RouterLink}
                          to={`/products/${item.product}`}
                        >
                          {item.name}
                        </Link>
                      </Flex>

                      <Text fontSize="lg" fontWeight="semibold">
                        {item.qty} x ₹{item.price} = ₹{+item.qty * item.price}
                      </Text>
                    </Flex>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Flex>

        {/* Column 2 */}
        <Flex
          direction="column"
          bgColor="white"
          justifyContent="space-between"
          py="8"
          px="8"
          shadow="md"
          rounded="lg"
          borderColor="gray.300"
        >
          <Box>
            <Heading mb="6" as="h2" fontSize="3xl" fontWeight="bold">
              Order Summary
            </Heading>

            {/* Items Price */}
            <Flex
              borderBottom="1px"
              py="2"
              borderColor="gray.200"
              alignitems="center"
              justifyContent="space-between"
            >
              <Text fontSize="xl">Items</Text>
              <Text fontWeight="bold" fontSize="xl">
                ₹{cart.itemsPrice}
              </Text>
            </Flex>

            {/* Tax Price */}
            <Flex
              borderBottom="1px"
              py="2"
              borderColor="gray.200"
              alignitems="center"
              justifyContent="space-between"
            >
              <Text fontSize="xl">Tax</Text>
              <Text fontWeight="bold" fontSize="xl">
                ₹{cart.taxPrice}
              </Text>
            </Flex>

            {/* Total Price */}
            <Flex
              borderBottom="1px"
              py="2"
              borderColor="gray.200"
              alignitems="center"
              justifyContent="space-between"
            >
              <Text fontSize="xl">Total</Text>
              <Text fontWeight="bold" fontSize="xl">
                ₹{cart.totalPrice}
              </Text>
            </Flex>
          </Box>
          <Button
            size="lg"
            textTransform="uppercase"
            colorScheme="yellow"
            type="button"
            w="full"
            onClick={placeOrderHandler}
            disabled={cart.cartItems === 0}
          >
            Get Bill
          </Button>
        </Flex>
      </Grid>
    </Flex>
  );
};

export default PlaceOrderScreen;
