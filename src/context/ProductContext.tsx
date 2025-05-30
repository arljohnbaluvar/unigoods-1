import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProductService } from '../services/ProductService';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  imageUrl: string;
  seller: {
    id: string;
    name: string;
    university: string;
    rating: number;
  };
  stock: number;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial mock products
const initialProducts: Product[] = [
  {
    id: '1',
    title: 'Poco F4',
    description: 'Can handle all your needs interms of gaming and multitasking',
    price: 12000,
    condition: 'Like New',
    category: 'Electronics',
    imageUrl: '/images/poco-f4.jpg',
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

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const loadedProducts = await ProductService.getProducts();
        setProducts(loadedProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const addProduct = useCallback(async (newProduct: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      const addedProduct = await ProductService.addProduct(newProduct);
      setProducts(currentProducts => [...currentProducts, addedProduct]);
      setError(null);
    } catch (err) {
      setError('Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await ProductService.deleteProduct(id);
      setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to remove product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updatedFields: Partial<Product>) => {
    try {
      setLoading(true);
      const updatedProduct = await ProductService.updateProduct(id, updatedFields);
      setProducts(currentProducts =>
        currentProducts.map(product =>
          product.id === id ? updatedProduct : product
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}; 