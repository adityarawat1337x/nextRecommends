import { React } from "react";
import { useReadCypher } from "use-neo4j";
import { Flex, Button, Heading } from "@chakra-ui/react";
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

const RMovies = () => {
  const query =
    " match (u:Users)-[r:RATED]->(m:Movies)<-[r2:RATED]-(u2:Users) where u.user_id=$id and r.Rating='5' and r2.Rating='5'  with u2, r, u, m, r2 match (m2:Movies)<-[r3:RATED]-(u2) where  not EXISTS((u)-[:RATED]->(m2)) return distinct m2,r3 order by r3.Rating desc limit 200";

  const router = useRouter();
  const uid = router.query.id2;

  console.log("ReRENDERED: ", query, uid);

  const { loading, error, records, first } = useReadCypher(query, {
    id: uid,
  });

  let movieData = [];

  if (loading)
    return (
      <Button
        isLoading
        loadingText="Generating Recommendations"
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
    console.log(records);
    records.map((row) => {
      movieData.push({
        id: row.get("m2").properties.movie_id,
        name: row.get("m2").properties.movie_title,
        date: row.get("m2").properties.release_date,
        url: row.get("m2").properties.IMDb_URL,
        rating: row.get("r3").properties.Rating,
      });
    });
  }

  if (movieData)
    return (
      <motion.div>
        <Flex
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          w="100vw"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          p={100}
        >
          <Heading>Recommended Movies</Heading>
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
              {movieData.map((dt, index) => (
                <Tr key={index}>
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
};

export default RMovies;
