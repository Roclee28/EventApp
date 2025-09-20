// pages/EventsPage.jsx
import { useEffect, useState, useContext } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  Spinner,
  SimpleGrid,
  Badge,
  Stack,
  Input,
  Select,
  Flex,
  Button,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { DataContext } from "../components/DataContext";

export const EventsPage = () => {
  const { categories, loading: contextLoading } = useContext(DataContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const location = useLocation();

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/events");
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [location.key]);

  // Filter and search events
  useEffect(() => {
    let filtered = [...events];

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(lower) ||
          event.description.toLowerCase().includes(lower)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.categoryIds.includes(Number(selectedCategory))
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedCategory]);

  if (loading || contextLoading) return <Spinner size="xl" />;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading mb={4}>All Events</Heading>

      {/* Search and Filter Controls */}
      <Flex mb={4} gap={4} flexWrap="wrap" align="center">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxW="300px"
        />

        <Select
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          maxW="200px"
        >
          {Object.entries(categories).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>

        <Button
          onClick={handleClearFilters}
          colorScheme="gray"
          variant="outline"
          size="sm"
        >
          Clear Filters
        </Button>
      </Flex>

      {filteredEvents.length === 0 ? (
        <Text>No events found.</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              minH="200px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              _hover={{
                shadow: "md",
                transform: "scale(1.02)",
                transition: "0.2s",
              }}
            >
              {/* Link only wraps image and title */}
              <Link to={`/event/${event.id}`}>
                <Image
                  src={event.image}
                  alt={event.title}
                  borderRadius="md"
                  mb={2}
                  cursor="pointer"
                  height="200px"
                  width="100%"
                  objectFit="cover"
                  objectPosition={event.title === "Tennis" ? "top" : "center"}
                />
                <Heading size="md" mt={2} mb={1} cursor="pointer">
                  {event.title}
                </Heading>
              </Link>

              <Box flex="1">
                <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
                  {event.description}
                </Text>

                <Text fontSize="sm" color="gray.500">
                  Start: {new Date(event.startTime).toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  End: {new Date(event.endTime).toLocaleString()}
                </Text>

                <Stack direction="row" mt={2} spacing={2}>
                  {event.categoryIds?.map((catId) => (
                    <Badge key={catId} colorScheme="blue">
                      {categories[catId] || "Unknown"}
                    </Badge>
                  ))}
                </Stack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
