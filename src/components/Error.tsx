import { Button, Flex, Heading } from '@chakra-ui/react';

export function Error(): JSX.Element {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100vh"
      flexDir="column"
    >
      <Heading>Oops! Occurred an unexpected error =(</Heading>
      <Button py={6} onClick={() => window.location.reload()} mt={4}>
        Click here to try again!
      </Button>
    </Flex>
  );
}
