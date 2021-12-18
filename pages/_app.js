import "../styles/globals.css";
import { AnimateSharedLayout } from "framer-motion";
import { ChakraProvider } from "@chakra-ui/react";
import { Neo4jProvider, createDriver } from "use-neo4j";

function MyApp({ Component, pageProps }) {
  // return (
  //   <Neo4jProvider
  //     scheme="neo4j+s"
  //     host="4e736fc0.databases.neo4j.io"
  //     port="7687"
  //     username="neo4j"
  //     password="1CIP0aHK08pnjJQWVU-s70uS14QF7j_hGkQV0mXY8hs"
  //     database="neo4j"
  //   >
  //     <ChakraProvider>
  //       <Component {...pageProps} />
  //     </ChakraProvider>
  //   </Neo4jProvider>
  // );
  const driver = createDriver(
    "neo4j+s",
    "4e736fc0.databases.neo4j.io",
    7687,
    "neo4j",
    "1CIP0aHK08pnjJQWVU-s70uS14QF7j_hGkQV0mXY8hs"
  );

  return (
    <Neo4jProvider driver={driver}>
      <AnimateSharedLayout>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </AnimateSharedLayout>
    </Neo4jProvider>
  );
}

export default MyApp;
