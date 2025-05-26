import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import '../styles/products.css';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  imageUrl: string;
  seller: {
    name: string;
    university: string;
    rating: number;
  };
  stock: number;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Calculus Textbook - 10th Edition',
    description: 'Like new condition, barely used. All pages intact. Perfect for Calculus I and II courses.',
    price: 45.99,
    condition: 'Like New',
    category: 'Textbooks',
    imageUrl: 'https://via.placeholder.com/200x300',
    seller: {
      name: 'John Doe',
      university: 'State University',
      rating: 4.5,
    },
    stock: 1,
  },
  {
    id: '2',
    title: 'TI-84 Plus Graphing Calculator',
    description: 'Essential calculator for math and science courses. Includes new batteries and manual.',
    price: 75.00,
    condition: 'Good',
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/200x300',
    seller: {
      name: 'Sarah Smith',
      university: 'Tech Institute',
      rating: 4.8,
    },
    stock: 2,
  },
  {
    id: '3',
    title: 'Chemistry Lab Kit',
    description: 'Complete lab kit for General Chemistry. Includes glassware, safety equipment, and storage case.',
    price: 120.00,
    condition: 'New',
    category: 'Lab Equipment',
    imageUrl: 'https://via.placeholder.com/200x300',
    seller: {
      name: 'Mike Johnson',
      university: 'Science Academy',
      rating: 4.2,
    },
    stock: 3,
  },
  {
    id: '4',
    title: 'Physics Study Notes Bundle',
    description: 'Comprehensive study notes for Physics I & II. Includes practice problems and solutions.',
    price: 25.00,
    condition: 'Good',
    category: 'Notes',
    imageUrl: 'https://via.placeholder.com/200x300',
    seller: {
      name: 'Emily Brown',
      university: 'State University',
      rating: 4.7,
    },
    stock: 5,
  },
  {
    id: '5',
    title: 'MacBook Pro 2021',
    description: 'M1 Pro chip, 16GB RAM, 512GB SSD. Perfect for computer science students.',
    price: 1299.99,
    condition: 'Like New',
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/200x300',
    seller: {
      name: 'Alex Chen',
      university: 'Tech Institute',
      rating: 4.9,
    },
    stock: 1,
  },
  {
    id: '6',
    title: 'Biology Lab Coat',
    description: 'White lab coat, size M. Required for biology and chemistry labs.',
    price: 29.99,
    condition: 'New',
    category: 'Lab Equipment',
    imageUrl: 'https://via.placeholder.com/200x300',
    seller: {
      name: 'Lisa Wang',
      university: 'Medical University',
      rating: 4.6,
    },
    stock: 4,
  },
];

const categories = [
  'All',
  'Textbooks',
  'Electronics',
  'Notes',
  'Lab Equipment',
  'Study Materials',
  'Other',
];

const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];

const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Best Rated' },
  { value: 'newest', label: 'Newest First' },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const toggleFavorite = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      seller: {
        name: product.seller.name,
        university: product.seller.university,
      },
    });
  };

  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesCondition =
        selectedCondition === 'All' || product.condition === selectedCondition;
      return matchesSearch && matchesCategory && matchesCondition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.seller.rating - a.seller.rating;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="products-container">
      <Typography variant="h4" gutterBottom>
        Browse Products
      </Typography>

      <div className="search-bar">
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl className="category-filter">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value as string)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="category-filter">
          <InputLabel>Condition</InputLabel>
          <Select
            value={selectedCondition}
            label="Condition"
            onChange={(e) => setSelectedCondition(e.target.value as string)}
          >
            {conditions.map((condition) => (
              <MenuItem key={condition} value={condition}>
                {condition}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="category-filter">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as string)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <Typography variant="h6" color="textSecondary">
            No products found matching your criteria
          </Typography>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${product.price.toFixed(2)}
                </Typography>
                <div className="product-meta">
                  <span className={`product-condition condition-${product.condition.toLowerCase().replace(' ', '-')}`}>
                    {product.condition}
                  </span>
                  <span className="product-owner">
                    {product.seller.university}
                  </span>
                </div>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => toggleFavorite(product.id, e)}
                  >
                    {favorites.includes(product.id) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <CartIcon />
                  </IconButton>
                </Box>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="pagination">
          <button className="pagination-button" disabled>
            Previous
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button" disabled>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products; 