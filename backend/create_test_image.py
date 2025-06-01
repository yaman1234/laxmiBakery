from PIL import Image

# Create a new image with a white background
image = Image.new('RGB', (100, 100), 'white')

# Save the image
image.save('test_image.jpg', 'JPEG')
print("Test image created successfully!") 