import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Product } from '../../types';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
    Image,
    IconButton,
    VStack,
    HStack,
    Textarea,
    TableContainer
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    description: HTMLTextAreaElement;
    price: HTMLInputElement;
    category: HTMLSelectElement;
    stock: HTMLInputElement;
    image: HTMLInputElement;
}

interface ProductFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

const ProductManagementPage: React.FC = () => {

    const backendURl = "http://localhost:5000"
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<'frame' | 'gift'>('frame');
    const [stock, setStock] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const toast = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            toast({
                title: 'Error fetching products',
                description: error instanceof Error ? error.message : 'Unknown error',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('frame');
        setStock('');
        setImageFile(null);
        setImagePreview('');
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent<ProductFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('stock', stock);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editingProduct) {
                await api.updateProduct(editingProduct._id, formData);
                toast({
                    title: 'Product updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await api.createProduct(formData);
                toast({
                    title: 'Product added',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            toast({
                title: 'Error adding product',
                description: error instanceof Error ? error.message : 'Unknown error',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCategory(product.category);
        setStock(product.stock.toString());
        setImagePreview(backendURl + product.image);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteProduct(id);
            toast({
                title: 'Product deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchProducts();
        } catch (error) {
            toast({
                title: 'Error deleting product',
                description: error instanceof Error ? error.message : 'Unknown error',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Stack spacing={8}>
                <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    placeholder="Product name"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    value={description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                    placeholder="Product description"
                                />
                            </FormControl>

                            <HStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Price</FormLabel>
                                    <NumberInput min={0}>
                                        <NumberInputField
                                            value={price}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                                            placeholder="Price"
                                        />
                                    </NumberInput>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        value={category}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as 'frame' | 'gift')}
                                        placeholder="Select category"
                                    >
                                        <option value="frame">Frame</option>
                                        <option value="gift">Gift</option>
                                    </Select>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Stock</FormLabel>
                                    <NumberInput min={0}>
                                        <NumberInputField
                                            value={stock}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStock(e.target.value)}
                                            placeholder="Stock"
                                        />
                                    </NumberInput>
                                </FormControl>
                            </HStack>

                            <FormControl isRequired={!editingProduct}>
                                <FormLabel>Image</FormLabel>
                                <VStack spacing={4} align="flex-start">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            boxSize="200px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                    )}
                                </VStack>
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                width="full"
                            >
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </Button>

                            {editingProduct && (
                                <Button
                                    onClick={resetForm}
                                    width="full"
                                >
                                    Cancel Edit
                                </Button>
                            )}
                        </Stack>
                    </form>
                </Box>

                <Box overflowX="auto">
                    <TableContainer>
                        <Table variant="simple" bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Image</Th>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Price</Th>
                                    <Th>Category</Th>
                                    <Th>Stock</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {products.map((product) => (
                                    <Tr key={product._id}>
                                        <Td>
                                            <Image
                                                src={backendURl + product.image}
                                                alt={product.name}
                                                boxSize="100px"
                                                objectFit="cover"
                                                borderRadius="md"
                                            />
                                        </Td>
                                        <Td>{product.name}</Td>
                                        <Td>
                                            <Text isTruncated maxW="300px">{product.description}</Text>
                                        </Td>
                                        <Td>₹{product.price}</Td>
                                        <Td>{product.category}</Td>
                                        <Td>{product.stock}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <IconButton
                                                    aria-label="Edit product"
                                                    icon={<EditIcon />}
                                                    onClick={() => handleEdit(product)}
                                                    colorScheme="blue"
                                                    size="sm"
                                                />
                                                <IconButton
                                                    aria-label="Delete product"
                                                    icon={<DeleteIcon />}
                                                    onClick={() => handleDelete(product._id)}
                                                    colorScheme="red"
                                                    size="sm"
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Stack>
        </Container>
    );
};

export default ProductManagementPage;