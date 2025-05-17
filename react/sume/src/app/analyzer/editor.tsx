import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Important: Set the pdf.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ScrollablePDFViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [visiblePages, setVisiblePages] = useState(new Set([1]));
  
  // Refs for tracking page visibility
  const pageRefs = useRef({});
  const observerRef = useRef(null);
  const viewerRef = useRef(null);
  
  // Document loaded successfully
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrentPage(1);
    setVisiblePages(new Set([1]));
    setErrorMessage('');
    setIsLoading(false);
  }

  // Document failed to load
  function onDocumentLoadError(error) {
    setErrorMessage('Failed to load PDF: ' + error.message);
    setIsLoading(false);
  }

  // Handle file upload
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setIsLoading(true);
      setErrorMessage('');
    } else {
      setFile(null);
      setErrorMessage('Please select a valid PDF file.');
    }
  }

  // Jump to specific page
  function jumpToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      // Get the page element and scroll to it
      const pageElement = pageRefs.current[pageNumber];
      if (pageElement && viewerRef.current) {
        pageElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Zoom functions
  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  function resetZoom() {
    setScale(1.0);
  }

  // Set up Intersection Observer to track visible pages
  useEffect(() => {
    if (!numPages) return;

    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visiblePagesSet = new Set(visiblePages);
        
        entries.forEach(entry => {
          // Get page number from data attribute
          const pageNumber = parseInt(entry.target.dataset.pageNumber, 10);
          
          if (entry.isIntersecting) {
            visiblePagesSet.add(pageNumber);
            // If this is the most visible page, update current page
            if (entry.intersectionRatio > 0.5) {
              setCurrentPage(pageNumber);
            }
          } else {
            visiblePagesSet.delete(pageNumber);
          }
        });
        
        setVisiblePages(visiblePagesSet);
      },
      {
        root: null, // use viewport
        rootMargin: '0px',
        threshold: [0.1, 0.5, 0.9] // trigger at different visibility levels
      }
    );

    // Observe all page elements
    Object.entries(pageRefs.current).forEach(([pageNumber, element]) => {
      if (element) {
        observerRef.current.observe(element);
      }
    });

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [numPages, pageRefs.current]);

  // Prepare pages to render
  const renderPages = () => {
    if (!numPages) return null;
    
    return Array.from(
      new Array(numPages),
      (el, index) => (
        <div 
          key={`page-${index + 1}`}
          ref={ref => pageRefs.current[index + 1] = ref}
          data-page-number={index + 1}
          className="pdf-page-container"
        >
          <div className="page-number-indicator">
            Page {index + 1} of {numPages}
          </div>
          <Page
            pageNumber={index + 1}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={<div className="loading-page">Loading page {index + 1}...</div>}
            error={<div className="error-page">Error loading page {index + 1}</div>}
            className="pdf-page"
          />
        </div>
      )
    );
  };

  // Page jump input handling
  const [jumpInput, setJumpInput] = useState('');
  
  const handleJumpInputChange = (e) => {
    setJumpInput(e.target.value);
  };
  
  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= numPages) {
      jumpToPage(pageNum);
    }
    setJumpInput('');
  };

  return (
    <div className="scrollable-pdf-viewer">
      <div className="controls">
        <div className="file-controls">
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="application/pdf" 
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="upload-button">
            Choose PDF
          </label>
        </div>
        
        {file && (
          <>
            <div className="page-info">
              <span>Page {currentPage} of {numPages || '--'}</span>
              <form onSubmit={handleJumpSubmit} className="jump-to-page">
                <input
                  type="number"
                  min="1"
                  max={numPages || 1}
                  value={jumpInput}
                  onChange={handleJumpInputChange}
                  placeholder="Go to page"
                />
                <button type="submit">Go</button>
              </form>
            </div>
            
            <div className="zoom-controls">
              <button onClick={zoomOut}>-</button>
              <span>{Math.round(scale * 100)}%</span>
              <button onClick={zoomIn}>+</button>
              <button onClick={resetZoom}>Reset</button>
            </div>
          </>
        )}
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>}
      
      <div className="document-container" ref={viewerRef}>
        {file && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="loading">Loading PDF...</div>}
            className="pdf-document"
          >
            {renderPages()}
          </Document>
        )}
        
        {!file && !errorMessage && (
          <div className="placeholder">
            <p>No PDF document loaded. Please select a file to view.</p>
          </div>
        )}
        
        {isLoading && <div className="loading">Loading PDF document...</div>}
      </div>

      {file && numPages > 5 && (
        <div className="quick-navigation">
          <button onClick={() => jumpToPage(1)}>First</button>
          <button onClick={() => jumpToPage(Math.max(1, currentPage - 5))}>-5</button>
          <button onClick={() => jumpToPage(Math.max(1, currentPage - 1))}>Prev</button>
          <button onClick={() => jumpToPage(Math.min(numPages, currentPage + 1))}>Next</button>
          <button onClick={() => jumpToPage(Math.min(numPages, currentPage + 5))}>+5</button>
          <button onClick={() => jumpToPage(numPages)}>Last</button>
        </div>
      )}

      <style jsx>{`
        .scrollable-pdf-viewer {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
        }
        
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 5px;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .file-controls, .page-info, .zoom-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .file-controls input[type="file"] {
          display: none;
        }
        
        .upload-button {
          background-color: #4285f4;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .upload-button:hover {
          background-color: #3367d6;
        }
        
        .jump-to-page {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .jump-to-page input {
          width: 60px;
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        button {
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 14px;
        }
        
        button:hover:not(:disabled) {
          background-color: #e3e3e3;
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .error {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .document-container {
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 20px;
          height: 70vh;
          display: flex;
          justify-content: center;
          background-color: #f9f9f9;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
        
        .placeholder {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #757575;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #757575;
        }
        
        .loading-page {
          height: 500px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #757575;
          border: 1px dashed #ccc;
          margin: 10px 0;
        }
        
        .pdf-page-container {
          margin-bottom: 20px;
          position: relative;
        }
        
        .page-number-indicator {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 5;
        }
        
        .quick-navigation {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 5px;
          position: sticky;
          bottom: 20px;
          z-index: 10;
        }
        
        /* Style the react-pdf component */
        :global(.pdf-document) {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        
        :global(.pdf-page) {
          box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
          margin: 0 auto;
        }
        
        :global(.react-pdf__Page canvas) {
          max-width: 100%;
          height: auto !important;
        }
      `}</style>
    </div>
  );
};

export default ScrollablePDFViewer;