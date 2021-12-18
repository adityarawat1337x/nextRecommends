import { React, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { Flex, Button, Heading, Link } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Movies = () => {
  const [query, setState] = useState(
    "match (u:Users)-[r:RATED]->(m:Movies) where u.user_id=$id return u,m,r limit 200"
  );

  const router = useRouter();
  const uid = router.query.id;

  const { loading, error, records, first } = useReadCypher(query, {
    id: uid,
  });

  let movieData = [];

  if (loading)
    return (
      <Button
        isLoading
        loadingText="Loading movies "
        colorScheme="teal"
        variant="outline"
        spinnerPlacement="end"
        border="0"
        w="100vw"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      ></Button>
    );

  if (records) {
    records.map((row) => {
      movieData.push({
        id: row.get("m").properties.movie_id,
        name: row.get("m").properties.movie_title,
        date: row.get("m").properties.release_date,
        rating: row.get("r").properties.Rating,
        url: row.get("m").properties.IMDb_URL,
      });
    });
  }

  if (records && movieData.length && uid)
    return (
      <motion.div>
        <Flex
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          w="100vw"
          alignItems="center"
          flexDirection="column"
          p={100}
        >
          <Heading textTransform="capitalize">
            Type: {first.get("u").properties.occupation}
          </Heading>
          <Heading>Age: {first.get("u").properties.Age}</Heading>
          <Heading>Gender: {first.get("u").properties.Gender}</Heading>

          <Button
            textDecoration="none"
            colorScheme="telegram"
            variant="solid"
            alignItems="center"
            justifyContent="center"
            fontSize="1xl"
            m={30}
            color="black"
          >
            <Link href={`/results/${uid}`} textDecoration="none">
              Generate Recommendations
            </Link>
          </Button>
          <Table variant="simple" m={100}>
            <TableCaption>Dataset of movies</TableCaption>
            <Thead>
              <Tr>
                <Th>Movie Id</Th>
                <Th>Movie Name</Th>
                <Th>Release Date</Th>
                <Th>Rating</Th>
                <Th>Url</Th>
              </Tr>
            </Thead>
            <Tbody>
              {movieData.map((dt) => (
                <Tr key={dt.id}>
                  <Td>{dt.id}</Td>
                  <Td>{dt.name}</Td>
                  <Td>{dt.date}</Td>
                  <Td>{dt.rating}</Td>
                  <Td>
                    <a href={dt.url}>🔗</a>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      </motion.div>
    );
  else
    return (
      <Button
        isLoading
        loadingText="Loading"
        colorScheme="teal"
        variant="outline"
        spinnerPlacement="end"
        border="0"
        w="100vw"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      ></Button>
    );
};

export default Movies;

// export async function getServerSideProps = (context) => {
//   console.log(context.query)
//   return {
//       props: {
//          id: context.query.id
//       }
//   }
// }
