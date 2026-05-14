'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, GIF, and WEBP are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Max file size is 5MB');
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `resource-images/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('resource-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resource-images')
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="image-upload-wrapper">
      <label className={`upload-btn ${isUploading ? 'loading' : ''}`}>
        {isUploading ? (
          <Loader2 className="spin" size={16} />
        ) : (
          <Upload size={16} />
        )}
        <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={isUploading}
          style={{ display: 'none' }} 
        />
      </label>

      <style jsx>{`
        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(137, 233, 0, 0.1);
          border: 1px solid rgba(137, 233, 0, 0.3);
          color: var(--kiwi);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .upload-btn:hover:not(.loading) {
          background: rgba(137, 233, 0, 0.2);
          border-color: var(--kiwi);
        }
        .upload-btn.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
