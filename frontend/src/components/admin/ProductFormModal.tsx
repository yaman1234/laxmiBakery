import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { Product } from '../../types/product';
import categoryService, { Category } from '../../services/categoryService';
import ImageUpload from './ImageUpload';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, '_id'>) => Promise<void>;
  initialData?: Product;
  mode: 'add' | 'edit';
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Omit<Product, '_id'>>({
    name: '',
    description: '',
    price: '' as unknown as number,
    category: '',
    images: [],
    available: true,
    discount: 0,
    tags: [],
    theme: '',
    flavour: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        const response = await categoryService.getCategories();
        if (response && response.items.length > 0) {
          setCategories(response.items);
        } else {
          setCategoryError('No categories available. Please create a category first.');
        }
      } catch (err: any) {
        console.error('Failed to fetch categories:', err);
        setCategoryError('Failed to load categories. Please try again.');
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        category: initialData.category,
        images: initialData.images,
        available: initialData.available,
        discount: initialData.discount,
        tags: initialData.tags,
        theme: initialData.theme,
        flavour: initialData.flavour,
      });
    } else {
      // Reset form when opening in add mode
      setFormData({
        name: '',
        description: '',
        price: '' as unknown as number,
        category: '',
        images: [],
        available: true,
        discount: 0,
        tags: [],
        theme: '',
        flavour: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'price' ? (value === '' ? '' : Number(value)) :
              type === 'number' ? Number(value) : 
              value,
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      tags: value === '' ? [] : value.split(',').map(tag => tag.trim()),
    }));
  };

  const handleImageChange = (urls: (string | File)[]) => {
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
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Product' : 'Edit Product'}
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
              {categoryError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {categoryError}
                </Alert>
              )}
            </Grid>
            {mode === 'edit' && initialData?.product_id !== undefined && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product ID"
                  value={initialData.product_id}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product ID"
                value={formData.product_id || 'Auto-generated'}
                fullWidth
                InputProps={{ readOnly: true }}
                helperText={mode === 'add' ? 'Product ID will be assigned automatically' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!categoryError}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  label="Category"
                  disabled={loadingCategories}
                >
                  {loadingCategories ? (
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <span>Loading categories...</span>
                      </Box>
                    </MenuItem>
                  ) : categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category._id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {categoryError || 'No categories available'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: 'NRs.',
                  inputProps: { 
                    min: 0,
                    step: "0.01"
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="discount"
                label="Discount (%)"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, max: 100 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="theme"
                label="Theme"
                value={formData.theme}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="flavour"
                label="Flavour"
                value={formData.flavour}
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
                name="tags"
                label="Tags"
                value={formData.tags.join(',')}
                onChange={handleTagsChange}
                fullWidth
                helperText="Type comma (,) to separate tags"
                placeholder="Enter tags and press comma to separate"
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Product Image
                </Typography>
                <ImageUpload
                  value={formData.images as (string | File)[]}
                  onChange={handleImageChange}
                  maxImages={1}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.available}
                    onChange={handleChange}
                    name="available"
                  />
                }
                label="Available"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || loadingCategories}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : mode === 'add' ? (
              'Add Product'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductFormModal; 