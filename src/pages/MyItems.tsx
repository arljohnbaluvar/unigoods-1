import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useTradeContext } from '../context/TradeContext';

interface NewItemForm {
  title: string;
  description: string;
  condition: string;
  imageUrl: string;
  price: number;
  category: string;
}

const initialFormState: NewItemForm = {
  title: '',
  description: '',
  condition: '',
  imageUrl: '',
  price: 0,
  category: '',
};

const conditions = ['New', 'Like New', 'Good', 'Fair'];
const categories = ['Electronics', 'Books', 'Clothing', 'Accessories', 'Other'];

const MyItems: React.FC = () => {
  const { userItems, addUserItem, removeUserItem } = useTradeContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<NewItemForm>(initialFormState);
  const [error, setError] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      category: event.target.value,
    }));
  };

  const handleConditionChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      condition: event.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.condition) {
      setError('Condition is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    addUserItem({
      ...formData,
      owner: {
        id: 'user1', // Replace with actual user ID
        name: 'John Doe', // Replace with actual user name
        university: 'State University', // Replace with actual university
        rating: 4.5, // Default rating for new items
      },
    });

    setFormData(initialFormState);
    setIsDialogOpen(false);
    setError('');
  };

  const handleDelete = (itemId: string) => {
    removeUserItem(itemId);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4">My Items for Trade</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add New Item
          </Button>
        </Box>

        <Grid container spacing={3}>
          {userItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Chip label={item.condition} size="small" />
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Item Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setError('');
            setFormData(initialFormState);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Item for Trade</DialogTitle>
          <DialogContent>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <Typography>₱</Typography>,
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Condition</InputLabel>
              <Select
                value={formData.condition}
                onChange={handleConditionChange}
                label="Condition"
              >
                {conditions.map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              helperText="Enter the URL of your item's image"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                setError('');
                setFormData(initialFormState);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              Add Item
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MyItems; 