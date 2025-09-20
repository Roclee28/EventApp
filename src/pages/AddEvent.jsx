import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Stack,
  Checkbox,
} from "@chakra-ui/react";

export const AddEvent = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch categories & users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, userRes] = await Promise.all([
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/users"),
        ]);

        setCategories(await catRes.json());
        setUsers(await userRes.json());
      } catch (err) {
        console.error("Error fetching categories/users:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !selectedUser) {
      toast({
        title: "Please fill in all required fields",
        status: "warning",
      });
      return;
    }

    const newEvent = {
      title,
      description,
      image,
      startTime,
      endTime,
      categoryIds: selectedCategories,
      createdBy: Number(selectedUser),
    };

    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) throw new Error("Failed to add event");

      toast({ title: "Event added successfully!", status: "success" });
      navigate("/"); // redirect to events page
    } catch (err) {
      console.error(err);
      toast({ title: "Error adding event", status: "error" });
    }
  };

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
        <Heading mb={4}>Add New Event</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={2} isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl mb={2} isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl mb={2}>
            <FormLabel>Image URL</FormLabel>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </FormControl>

          <FormControl mb={2} isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => {
                const newStart = e.target.value;
                setStartTime(newStart);
                // if endTime empty or before startTime, set endTime = startTime
                if (!endTime || new Date(endTime) < new Date(newStart)) {
                  setEndTime(newStart);
                }
              }}
              maxW={["100%", "300px"]} // mobile: 100%, desktop: 300px
            />
          </FormControl>

          <FormControl mb={2} isRequired>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              min={startTime}
              onChange={(e) => setEndTime(e.target.value)}
              maxW={["100%", "300px"]} // mobile: 100%, desktop: 300px
            />
          </FormControl>

          <FormControl mb={2}>
            <FormLabel>Categories</FormLabel>
            <Stack spacing={2} direction="column">
              {categories.map((cat) => (
                <Checkbox
                  key={cat.id}
                  value={cat.id}
                  isChecked={selectedCategories.includes(cat.id)}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, id]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((cid) => cid !== id)
                      );
                    }
                  }}
                >
                  {cat.name}
                </Checkbox>
              ))}
            </Stack>
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Organizer</FormLabel>
            <Select
              placeholder="Select organizer"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              maxW={["100%", "300px"]} // mobile: 100%, desktop: 300px
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button colorScheme="blue" type="submit">
            Add Event
          </Button>
        </form>
      </Box>
    </Box>
  );
};
