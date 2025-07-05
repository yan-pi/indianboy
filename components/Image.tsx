import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, caption, className = '', ...props }) => {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`rounded-xl mx-auto ${className}`}
        {...props}
      />
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>
      )}
    </figure>
  );
};

export default Image;

