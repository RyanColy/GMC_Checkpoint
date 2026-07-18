import { useState } from "react";
import { X } from "@phosphor-icons/react";

const ImageViewer = ({ src, alt }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img src={src} alt={alt || "Image"} className="image-viewer__thumb" onClick={() => setOpen(true)} loading="lazy" />

      {open && (
        <div className="image-viewer__overlay" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <button className="image-viewer__close" onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} weight="bold" />
          </button>
          <img src={src} alt={alt || "Image"} className="image-viewer__full" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default ImageViewer;
