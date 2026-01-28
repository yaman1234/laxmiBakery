import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import DataTable from '../../components/admin/DataTable';
import ProductFormModal from '../../components/admin/ProductFormModal';
import { productService } from '../../services/productService';
import { Product } from '../../types/product';

const columns = [
  { id: 'product_id', label: 'Product ID', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'category', label: 'Category', minWidth: 130 },
  { id: 'theme', label: 'Theme', minWidth: 130 },
  {
    id: 'price',
    label: 'Price',
    minWidth: 100,
    align: 'right' as const,
    format: (value: number) => `₹${value.toFixed(2)}`,
  },
  {
    id: 'discount',
    label: 'Discount',
    minWidth: 100,
    align: 'right' as const,
    format: (value: number) => `${value}%`,
  },
  {
    id: 'available',
    label: 'Status',
    minWidth: 100,
    format: (value: boolean) => (value ? 'Available' : 'Not Available'),
  },
];

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(page + 1, rowsPerPage);
      setProducts(response.items);
      setTotalCount(response.pagination.total_items);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!product._id) {
      setSnackbar({
        open: true,
        message: 'Product ID is missing. Cannot delete.',
        severity: 'error',
      });
      return;
    }
    try {
      await productService.deleteProduct(product._id);
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success',
      });
      fetchProducts(); // Refresh the list
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete product',
        severity: 'error',
      });
    }
  };

  const handleModalSubmit = async (productData: Omit<Product, '_id'>) => {
    try {
      if (modalMode === 'add') {
        await productService.createProduct(productData);
        setSnackbar({
          open: true,
          message: 'Product added successfully',
          severity: 'success',
        });
      } else {
        if (selectedProduct) {
          await productService.updateProduct(selectedProduct._id, productData);
          setSnackbar({
            open: true,
            message: 'Product updated successfully',
            severity: 'success',
          });
        }
      }
      fetchProducts(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save product');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <DataTable
        title="Products"
        columns={columns}
        data={products}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalCount={totalCount}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <ProductFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedProduct}
        mode={modalMode}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProducts; 