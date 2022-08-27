import type { NextPage } from 'next'
import { Box, Button, Center, Wrap, WrapItem } from "@chakra-ui/react"
import { useRouter } from 'next/router';

const Home: NextPage = () => {

  const router = useRouter();

  return (
    <Center>
      <Wrap>
        <WrapItem>
          <Box>
            <Button onClick={() => router.push("/create")}>Create link</Button>
          </Box>
        </WrapItem>
        <WrapItem>
          <Box>
            <Button onClick={() => router.push("/redeem")}>Redeem tokens</Button>
          </Box>
        </WrapItem>
      </Wrap>
    </Center>
  )
}

export default Home
