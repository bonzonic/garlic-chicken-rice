"use client";

import { useEffect, useRef } from "react";

interface PdfViewerProps {
  url: string; // OSS PDF URL
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Optionally, you can add logic to handle loading/error states here
  }, [url]);

  return (
    <div style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}>
      <iframe
        ref={iframeRef}
        src={url}
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default PdfViewer;