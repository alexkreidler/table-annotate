import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";

const TableAnnotate = dynamic(
  () => {
    return import("../components/TableAnnotate");
  },
  { ssr: false }
);

export default function Home() {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const input = useRef(null)
  return (
    <Stack m={6}>
      <Head>
        <title>Semantic Table Annotation Tool</title>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <Heading size="md">Table Annotation Tool</Heading>
      <Stack direction="row" alignItems="center">
        <Heading size="sm" w="10rem">CSV Source URL:</Heading>
        <Input placeholder="https://example.com" ref={input}></Input>
        <Button onClick={() => {setUrl(input.current!.value)}}>Submit</Button>
      </Stack>
      <TableAnnotate url={url}></TableAnnotate>
    </Stack>
  );
}
