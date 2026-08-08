/**
 * Compress and resize image to base64 string
 * @param file - Image file to compress
 * @param maxWidth - Maximum width (default: 800px)
 * @param maxHeight - Maximum height (default: 800px)
 * @param quality - Image quality 0-1 (default: 0.8)
 * @returns Promise with compressed base64 string
 */
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Check final size
        const sizeInBytes = Math.round((compressedBase64.length * 3) / 4);
        const sizeInKB = Math.round(sizeInBytes / 1024);
        
        console.log(`Image compressed: ${Math.round(file.size / 1024)}KB → ${sizeInKB}KB`);
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Error message or null if valid
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): string | null {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return 'Please select an image file';
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Image size must be less than ${maxSizeMB}MB. Your image is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
  }
  
  return null;
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
