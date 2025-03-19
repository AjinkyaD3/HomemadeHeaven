import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { CheckCircle } from 'lucide-react';

const CustomOrderPage: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: '',
    description: '',
    budget: '',
    timeline: '',
    attachments: null as File[] | null,
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, attachments: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setIsSubmitted(true);
      toast({
        title: "Custom order submitted",
        description: "We'll get back to you soon!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error submitting order",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Icon as={CheckCircle} w={16} h={16} color="green.500" />
          <Heading size="lg">Thank You!</Heading>
          <Text align="center">
            Your custom order request has been submitted successfully. We'll review your requirements and get back to you soon.
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Another Request
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading>Custom Order Request</Heading>
        <Text>
          Fill out the form below to request a custom order. We'll review your requirements and get back to you with a quote.
        </Text>

        <Box as="form" onSubmit={handleSubmit} width="100%">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Order Type</FormLabel>
              <Select
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
                placeholder="Select order type"
              >
                <option value="custom-frame">Custom Frame</option>
                <option value="personalized-gift">Personalized Gift</option>
                <option value="home-decor">Home Decor</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your custom order requirements"
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Budget Range</FormLabel>
              <Select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Select budget range"
              >
                <option value="under-50">Under ₹50</option>
                <option value="50-100">₹50 - ₹100</option>
                <option value="100-200">₹100 - ₹200</option>
                <option value="200-500">₹200 - ₹500</option>
                <option value="over-500">Over ₹500</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Timeline</FormLabel>
              <Select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="When do you need it?"
              >
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="3-4-weeks">3-4 weeks</option>
                <option value="1-2-months">1-2 months</option>
                <option value="flexible">Flexible</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Attachments</FormLabel>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
                p={1}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Upload reference images (optional)
              </Text>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="100%"
              mt={6}
              isLoading={isLoading}
            >
              Submit Custom Order Request
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CustomOrderPage;