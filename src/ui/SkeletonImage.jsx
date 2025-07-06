// src/ui/SkeletonImage.jsx
import { useState } from "react";

export default function SkeletonImage({
  src,
  alt,
  className = "",
  skeletonClass = "bg-gray-300",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {!loaded && (
        <div className={`absolute inset-0 ${skeletonClass} animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}
