import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Image,
  Text,
  Stack,
  Badge,
  Spinner,
  Button,
  Flex,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { DataContext } from "../components/DataContext";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    categories,
    users,
    loading: contextLoading,
  } = useContext(DataContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}`);
      const data = await res.json();
      setEvent(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      toast({
        title: "Event deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete event",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading || contextLoading) return <Spinner size="xl" />;

  if (!event) return <Text>Event not found</Text>;

  const organizer = users[event.createdBy];

  return (
    <Box p={6}>
      <Image
        src={event.image}
        alt={event.title}
        borderRadius="md"
        mb={4}
        width="50%"
        maxHeight="400px"
        objectFit="cover"
        objectPosition={event.title === "Tennis" ? "top" : "center"}
      />

      <Heading mb={2}>{event.title}</Heading>
      <Text fontSize="md" color="gray.600" mb={2}>
        {event.description}
      </Text>

      <Text fontSize="sm" color="gray.500">
        Start: {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text fontSize="sm" color="gray.500" mb={2}>
        End: {new Date(event.endTime).toLocaleString()}
      </Text>

      <Stack direction="row" mt={2} spacing={2} mb={4}>
        {event.categoryIds.map((catId) => (
          <Badge key={catId} colorScheme="blue">
            {categories[catId]}
          </Badge>
        ))}
      </Stack>

      {organizer && (
        <Flex align="center" mb={4} gap={2}>
          <Avatar src={organizer.image} name={organizer.name} />
          <Text>{organizer.name}</Text>
        </Flex>
      )}

      <Box display="flex" justifyContent="flex-start">
        <Button size="xs" colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};
