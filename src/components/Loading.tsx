import { Box, Flex, Heading, Progress } from '@chakra-ui/react';

export function Loading(): JSX.Element {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100vh"
      flexDir="column"
    >
      <Box>
        <Heading>Loading... You&apos;ll be redirected in a few seconds</Heading>
        <Progress
          mt={4}
          size="xs"
          isIndeterminate
          bgColor="transparent"
          colorScheme="orange"
        />
      </Box>
    </Flex>
  );
}
