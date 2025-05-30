import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  FormHelperText,
  IconButton,
} from '@mui/material';
import { CloudUpload as UploadIcon, Close as CloseIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const categories = [
  'Textbooks',
  'Electronics',
  'Notes',
  'Lab Equipment',
  'Study Materials',
  'Other',
];

interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  condition?: string;
  image?: string;
}

const SellProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { user } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }

    if (!formData.imageUrl && !imagePreview) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Only JPEG, PNG, and WebP images are allowed',
      }));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({
        ...prev,
        image: 'Image size should not exceed 5MB',
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      setErrors(prev => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create new product
      const newProduct = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        imageUrl: formData.imageUrl || imagePreview || '/images/placeholder.jpg',
        seller: {
          id: user?.id || 'unknown',
          name: user?.name || 'Unknown Seller',
          university: user?.university || 'Unknown University',
          rating: 5.0,
        },
        stock: 1,
      };

      await addProduct(newProduct);
      enqueueSnackbar('Product listed successfully!', { variant: 'success' });
      navigate('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      enqueueSnackbar('Failed to list product. Please try again.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          List Your Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Title"
                name="title"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors(prev => ({ ...prev, title: undefined }));
                }}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                required
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors(prev => ({ ...prev, description: undefined }));
                }}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  setErrors(prev => ({ ...prev, price: undefined }));
                }}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₱</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    setErrors(prev => ({ ...prev, category: undefined }));
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.condition}>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={formData.condition}
                  label="Condition"
                  onChange={(e) => {
                    setFormData({ ...formData, condition: e.target.value });
                    setErrors(prev => ({ ...prev, condition: undefined }));
                  }}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Like New">Like New</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                </Select>
                {errors.condition && <FormHelperText>{errors.condition}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {imagePreview ? (
                <Box sx={{ position: 'relative', width: 'fit-content' }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  />
                  <IconButton
                    onClick={removeImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{
                      height: 56,
                      borderColor: errors.image ? 'error.main' : undefined,
                      color: errors.image ? 'error.main' : undefined,
                      '&:hover': {
                        borderColor: errors.image ? 'error.dark' : undefined,
                      },
                    }}
                  >
                    Upload Product Image
                    <input
                      type="file"
                      hidden
                      accept={ALLOWED_FILE_TYPES.join(',')}
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                  </Button>
                  {errors.image && (
                    <FormHelperText error sx={{ ml: 1.75 }}>
                      {errors.image}
                    </FormHelperText>
                  )}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting}
                sx={{ height: 56 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'List Product'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SellProduct; 