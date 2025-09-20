import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
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
  Input,
  Textarea,
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
  const [isEditing, setIsEditing] = useState(false); // <-- toggle edit mode
  const [formData, setFormData] = useState({});

  // Fetch single event
  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}`);
      const data = await res.json();
      setEvent(data);
      setFormData(data); // <-- prefill form when editing
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  // Handle delete event
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update event (PUT request)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update event");

      const updatedEvent = await res.json();
      setEvent(updatedEvent);
      setIsEditing(false);

      toast({
        title: "Event updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update event",
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
    <Box p={6} maxW="600px" mx="auto">
      <Button
        leftIcon={<ArrowBackIcon />}
        mb={4}
        size={{ base: "md", md: "sm" }}
        width={{ base: "100%", md: "auto" }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Box
        p={6}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
        boxShadow="sm"
        maxW={["100%", "600px"]}
        mx="auto"
      >
        {isEditing ? (
          // -----------------------------
          // EDIT MODE
          // -----------------------------
          <Box as="form" onSubmit={handleUpdate}>
            <Input
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="Title"
              mb={3}
            />
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Description"
              mb={3}
            />
            <Input
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              placeholder="Image URL"
              mb={3}
            />
            <Input
              type="datetime-local"
              name="startTime"
              value={formData.startTime || ""}
              onChange={handleChange}
              mb={3}
            />
            <Input
              type="datetime-local"
              name="endTime"
              value={formData.endTime || ""}
              onChange={handleChange}
              mb={3}
            />
            <Flex gap={2}>
              <Button type="submit" colorScheme="green" size="sm">
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                colorScheme="gray"
                size="sm"
              >
                Cancel
              </Button>
            </Flex>
          </Box>
        ) : (
          // -----------------------------
          // VIEW MODE
          // -----------------------------
          <>
            <Image
              src={event.image}
              alt={event.title}
              borderRadius="md"
              mb={4}
              width="100%"
              maxHeight="200px"
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
              {event.categoryIds?.map((catId) => (
                <Badge key={catId} colorScheme="blue">
                  {categories[catId] || "Unknown"}
                </Badge>
              ))}
            </Stack>

            {organizer && (
              <Flex align="center" mb={4} gap={2}>
                <Avatar src={organizer.image} name={organizer.name} />
                <Text>{organizer.name}</Text>
              </Flex>
            )}

            <Flex gap={2}>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button size="xs" colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};
