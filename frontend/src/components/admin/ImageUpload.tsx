import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from '../../config/index';

interface ImageUploadProps {
  value: (string | File)[];
  onChange: (urls: (string | File)[]) => void;
  maxImages?: number;
  useFileObject?: boolean; // If true, store File object instead of base64 (for categories)
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxImages = 1,
  useFileObject = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Generate previews for File objects
    if (useFileObject) {
      const files = value.filter(v => v instanceof File) as File[];
      Promise.all(files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })).then(setPreviews);
    }
  }, [value, useFileObject]);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_IMAGE_SIZE) {
      setError(`File size should be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
      return false;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(`File type should be one of: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploading(true);
      setError(null);
      const uploaded: (string | File)[] = [];
      for (let i = 0; i < Math.min(files.length, maxImages); i++) {
        const file = files[i];
        if (!validateFile(file)) {
          return;
        }
        if (useFileObject) {
          uploaded.push(file);
        } else {
          // Convert file to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          uploaded.push(base64);
        }
      }
      if (maxImages === 1) {
        onChange(uploaded);
      } else {
        onChange([...value, ...uploaded].slice(0, maxImages));
      }
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  // For preview, use base64 for base64, or generate preview for File
  const displayImages = useFileObject ? previews : (value as string[]);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {displayImages.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {displayImages.map((url, index) => (
            <Paper
              key={index}
              sx={{
                position: 'relative',
                width: maxImages === 1 ? '100%' : 200,
                height: 200,
                overflow: 'hidden',
              }}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
                onClick={() => handleRemoveImage(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
      <Button
        component="label"
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
        disabled={uploading}
        sx={{ width: '100%', height: 100 }}
      >
        <input
          type="file"
          hidden
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          multiple={maxImages > 1}
          onChange={handleFileSelect}
        />
        <Box textAlign="center">
          <Typography variant="body1">
            {uploading ? 'Processing...' : 'Upload Image'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {maxImages > 1
              ? `You can upload up to ${maxImages} images`
              : 'Upload a single image'}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
};

export default ImageUpload; 