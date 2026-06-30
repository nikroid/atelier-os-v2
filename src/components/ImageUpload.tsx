import { useCallback, useState } from 'react';
import { fileToDataUrl } from '../utils/helpers';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUpload({ images, onChange, max = 5 }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
      const remaining = max - images.length;
      const toAdd = list.slice(0, remaining);
      const dataUrls = await Promise.all(toAdd.map(fileToDataUrl));
      onChange([...images, ...dataUrls]);
    },
    [images, max, onChange],
  );

  return (
    <div className="image-upload">
      <div
        className={`dropzone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <p>Glisser-déposer des images ici</p>
        <label className="btn btn-secondary btn-sm">
          Parcourir
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>
      {images.length > 0 && (
        <div className="image-grid">
          {images.map((src, i) => (
            <div key={i} className="image-thumb">
              <img src={src} alt="" />
              <button
                type="button"
                className="btn-icon remove"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                aria-label="Supprimer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
