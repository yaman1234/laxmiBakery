import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
} from '@mui/material';
import DataTable from '../../components/admin/DataTable';
import categoryService, { Category } from '../../services/categoryService';
import ImageUpload from '../../components/admin/ImageUpload';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'slug', label: 'Slug', minWidth: 130 },
];

const CategoryForm: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, '_id'>) => Promise<void>;
  initialData?: Category;
  mode: 'add' | 'edit';
}> = ({ open, onClose, onSubmit, initialData, mode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Category, '_id'>>({
    name: '',
    description: '',
    slug: '',
    images: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        slug: initialData.slug,
        images: initialData.images || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        slug: '',
        images: [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'images'
        ? value.split(',').map((url: string) => url.trim()).filter(Boolean)
        : value,
      ...(name === 'name' && !initialData ? {
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      } : {}),
    }));
  };

  const handleImageChange = (urls: (string | File)[]) => {
    // Separate files and base64 strings
    setImageFiles(urls.filter((img): img is File => typeof img !== 'string'));
    setFormData(prev => ({
      ...prev,
      images: urls.filter((img): img is string => typeof img === 'string'),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // Only send the image file in the 'image' field, not in 'images'
      const { images, ...submitData } = formData;
      await onSubmit({ ...submitData, image: imageFiles[0] } as any);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Category' : 'Edit Category'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Category Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="slug"
                label="Slug"
                value={formData.slug}
                onChange={handleChange}
                fullWidth
                required
                helperText="URL-friendly version of the name"
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Category Images
                </Typography>
                <ImageUpload
                  value={[...formData.images, ...imageFiles]}
                  onChange={handleImageChange}
                  maxImages={1}
                  useFileObject={true}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : mode === 'add' ? (
              'Add Category'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<{ items: Category[]; total: number }>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    undefined
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage]);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    try {
      await categoryService.deleteCategory(category._id);
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success',
      });
      fetchCategories();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete category',
        severity: 'error',
      });
    }
  };

  const handleModalSubmit = async (categoryData: Omit<Category, '_id'>) => {
    try {
      if (modalMode === 'add') {
        await categoryService.createCategory(categoryData);
        setSnackbar({
          open: true,
          message: 'Category added successfully',
          severity: 'success',
        });
      } else {
        if (selectedCategory) {
          await categoryService.updateCategory(selectedCategory._id, categoryData);
          setSnackbar({
            open: true,
            message: 'Category updated successfully',
            severity: 'success',
          });
        }
      }
      fetchCategories();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save category');
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
        title="Categories"
        columns={columns}
        data={categories.items}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalCount={categories.total}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <CategoryForm
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedCategory}
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

export default AdminCategories; 