// SEO-Optimierungen für die Landingpage-Bilder
import React from 'react';

interface ImageWithSEOProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const ImageWithSEO: React.FC<ImageWithSEOProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy'
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
    />
  );
};

export default ImageWithSEO;
