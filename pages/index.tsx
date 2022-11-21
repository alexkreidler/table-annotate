import { Box, Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
// import { TableAnnotate } from './TableAnnotate'

const TableAnnotate = dynamic(
  () => {
    return import("./TableAnnotate");
  },
  { ssr: false }
);

export default function Home() {
  return (
    <Box m={6}>
      <Heading size="md">Table Annotation Tool</Heading>
      <TableAnnotate></TableAnnotate>
    </Box>
  );
}
