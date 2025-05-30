import { Product } from '../context/ProductContext';

const PRODUCTS_STORAGE_KEY = 'unigoods_products';

// Initial mock products
const initialProducts: Product[] = [
  {
    id: '1',
    title: 'Poco F4',
    description: 'Can handle all your needs interms of gaming and multitasking',
    price: 12000,
    condition: 'Like New',
    category: 'Electronics',
    imageUrl: '/images/poco-f4.jpg.jpg',
    seller: {
      id: '1',
      name: 'Ricky Contiga',
      university: 'STI College Tagum',
      rating: 4.5,
    },
    stock: 1,
  },
  {
    id: '2',
    title: 'TI-84 Plus Graphing Calculator',
    description: 'Essential calculator for math and science courses. Includes new batteries and manual.',
    price: 3999.00,
    condition: 'Good',
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/71eDdUXFDGL._AC_UF894,1000_QL80_.jpg',
    seller: {
      id: '2',
      name: 'Sarah Smith',
      university: 'STI College Tagum',
      rating: 4.8,
    },
    stock: 2,
  },
  {
    id: '3',
    title: 'Chemistry Lab Kit',
    description: 'Complete lab kit for General Chemistry. Includes glassware, safety equipment, and storage case.',
    price: 5999.00,
    condition: 'New',
    category: 'Lab Equipment',
    imageUrl: 'https://m.media-amazon.com/images/I/81tc3KiGIFL._AC_UF1000,1000_QL80_.jpg',
    seller: {
      id: '3',
      name: 'Mike Johnson',
      university: 'STI College Tagum',
      rating: 4.2,
    },
    stock: 3,
  },
  {
    id: '5',
    title: 'MacBook Pro 2021',
    description: 'Experience unparalleled performance with the M1 Pro chip MacBook Pro 2021. Featuring 16GB RAM and 512GB SSD storage, this powerhouse is perfect for computer science students and developers. The device is in excellent condition with minimal signs of use.',
    price: 50000.00,
    condition: 'Like New',
    category: 'Electronics',
    imageUrl: '/images/macbook.jpg',
    seller: {
      id: '5',
      name: 'Xian Dela Cruz',
      university: 'STI College Tagum',
      rating: 4.9,
    },
    stock: 1,
  }
];

export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (!storedProducts) {
        // Initialize with mock products if no products exist
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
        return initialProducts;
      }
      return JSON.parse(storedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      return initialProducts; // Return mock products as fallback
    }
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const products = await ProductService.getProducts();
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      const updatedProducts = [...products, newProduct];
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const products = await ProductService.getProducts();
      const updatedProducts = products.map(product =>
        product.id === id ? { ...product, ...updates } : product
      );
      
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      const updatedProduct = updatedProducts.find(p => p.id === id);
      
      if (!updatedProduct) {
        throw new Error('Product not found');
      }
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      const products = await ProductService.getProducts();
      const updatedProducts = products.filter(product => product.id !== id);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  },
}; 