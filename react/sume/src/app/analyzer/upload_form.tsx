import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // <-- Add this import

const UploadForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const basePath = "http://localhost:8080"
  const username = "yunfeng"
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setUploading(true)

      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      

      fetch(`http://localhost:8080/api/analyzer/upload/${username}`, {
        method: "POST",
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Upload failed");
        } else {
          setUploading(false)
          setUploaded(true);
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        // Now you have the result (e.g., extracted text)
        localStorage.setItem("resume-text", data.pdfData); // or whatever field you want
      })



      // Here you can handle the upload logic (e.g., send to server)
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {uploading && (
        <Chip
          label={fileName ? `${fileName}...` : "Uploaded"}
          color="success"
          size="small"
        />
      )}
      {uploaded && (
        <Chip
          icon={<CheckCircleIcon color="success" />}
          label={fileName ? `${fileName}` : "Uploaded"}
          color="success"
          size="small"
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        sx={{ textTransform: "none" }}
        startIcon={<CloudUploadIcon />}
      >
        Upload
      </Button>
    </Box>
  );
};

export default UploadForm