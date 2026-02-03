import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { menuService, MenuEntry, MenuCreate } from '../../services/menuService';

const validationSchema = Yup.object({
    cake_type: Yup.string().required('Cake type is required'),
    base_price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
    description: Yup.string().max(500, 'Description too long'),
    category: Yup.string(),
    min_weight: Yup.number().min(0.5, 'Minimum weight is 0.5kg'),
});

const MenuManagement: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuEntry | null>(null);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const data = await menuService.getMenu();
            setMenuItems(data);
        } catch (err) {
            setError('Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const formik = useFormik({
        initialValues: {
            cake_type: '',
            base_price: 0,
            description: '',
            category: 'General',
            is_active: true,
            min_weight: 0.5,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log('Submitting menu item:', values);
            try {
                if (editingItem) {
                    console.log('Updating existing item:', editingItem._id);
                    await menuService.updateMenuItem(editingItem._id, values);
                } else {
                    console.log('Creating new menu item');
                    await menuService.createMenuItem(values as MenuCreate);
                }
                handleClose();
                fetchMenu();
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Failed to save menu item');
            }
        },
    });

    const handleOpen = (item?: MenuEntry) => {
        if (item) {
            setEditingItem(item);
            formik.setValues({
                cake_type: item.cake_type,
                base_price: item.base_price,
                description: item.description || '',
                category: item.category || 'General',
                is_active: item.is_active,
                min_weight: item.min_weight,
            });
        } else {
            setEditingItem(null);
            formik.resetForm();
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingItem(null);
        formik.resetForm();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                await menuService.deleteMenuItem(id);
                fetchMenu();
            } catch (err) {
                setError('Failed to delete menu item');
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Menu Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Menu Item
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Cake Type</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Base Price (Rs.)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Min. Weight</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item._id} hover>
                                <TableCell>{item.cake_type}</TableCell>
                                <TableCell>{item.base_price}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.min_weight} kg</TableCell>
                                <TableCell>
                                    <Typography color={item.is_active ? 'success.main' : 'error.main'} variant="body2" sx={{ fontWeight: 600 }}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(item)} size="small" color="primary">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item._id)} size="small" color="error">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {menuItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No menu items found. Add your first cake type!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="cake_type"
                                    label="Cake Type"
                                    value={formik.values.cake_type}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cake_type && Boolean(formik.errors.cake_type)}
                                    helperText={formik.touched.cake_type && formik.errors.cake_type}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="base_price"
                                    label="Base Price (Rs. per kg)"
                                    type="number"
                                    value={formik.values.base_price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.base_price && Boolean(formik.errors.base_price)}
                                    helperText={formik.touched.base_price && formik.errors.base_price}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="min_weight"
                                    label="Min. Weight (kg)"
                                    type="number"
                                    inputProps={{ step: 0.5 }}
                                    value={formik.values.min_weight}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="category"
                                    label="Category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="is_active"
                                            checked={formik.values.is_active}
                                            onChange={formik.handleChange}
                                        />
                                    }
                                    label="Is Active"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Save Item</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default MenuManagement;
