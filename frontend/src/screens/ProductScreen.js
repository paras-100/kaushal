import {
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Select,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { listProductDetails, deleteProduct } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const [qty, setQty] = useState(1);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const { success: deleteSuccess } = useSelector(
    (state) => state.productDelete
  );

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      navigate("/home");
    }
  }, [deleteSuccess]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const deleteProductHandler = () => {
    dispatch(deleteProduct(id));
  };

  return (
    <>
      <Flex mb="5">
        <Button colorScheme="gray" as={RouterLink} to="/">
          Go Back
        </Button>
      </Flex>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <Grid templateColumns="5fr 4fr 3fr" gap="10">
          {/* Column 1 */}
          <Image src={product.image} alt={product.name} borderRadius="md" />

          {/* Column 2 */}
          <Flex direction="column">
            <Heading as="h6" fontSize="base" color="gray.500">
              {product.brand}
            </Heading>

            <Heading as="h2" fontSize="4xl" mb="2">
              {product.name}
            </Heading>

            <Heading
              as="h5"
              my="5"
              fontWeight="bold"
              fontSize="4xl"
              color="teal.600"
            >
              ₹{product.price}
            </Heading>

            <Text>{product.description}</Text>
          </Flex>

          {/* Column 3 */}
          <Flex direction="column">
            <Flex justifyContent="space-between" py="2">
              <Text>Price: </Text>
              <Text fontWeight="bold">₹{product.price}</Text>
            </Flex>

            <Flex justifyContent="space-between" py="2">
              <Text>Status: </Text>
              <Text fontWeight="bold">{product.countInStock}</Text>
            </Flex>

            <Flex justifyContent="space-between" py="2">
              <Text>Qty: </Text>
              <Select
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                width="30%"
              >
                {[...Array(product.countInStock).keys()].map((i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </Select>
            </Flex>

            <Button
              onClick={addToCartHandler}
              colorScheme="teal"
              my="2"
              textTransform="uppercase"
              letterSpacing="wide"
              isDisabled={product.countInStock === 0}
            >
              Add to cart
            </Button>

            <Button
              onClick={() => navigate(`/product/edit`)}
              colorScheme="yellow"
              my="2"
              textTransform="uppercase"
              letterSpacing="wide"
              isDisabled={product.countInStock === 0}
            >
              Edit product
            </Button>

            <Button
              colorScheme="red"
              my="2"
              textTransform="uppercase"
              letterSpacing="wide"
              onClick={deleteProductHandler}
            >
              Delete product
            </Button>
          </Flex>
        </Grid>
      )}
    </>
  );
};

export default ProductScreen;
