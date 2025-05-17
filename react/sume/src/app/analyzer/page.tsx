"use client";

import React, { useRef, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import UploadForm from "./upload_form";
// import ScrollablePDFViewer from "./editor";


const minDrawerWidth = 180;
const maxDrawerWidth = 500;
const initialDrawerWidth = 240;

const Analyzer: React.FC = () => {
  const [drawerWidth, setDrawerWidth] = useState(initialDrawerWidth);
  const isResizing = useRef(false);

  // Mouse event handlers for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = "ew-resize";
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      // Calculate new width from the right edge
      const newWidth = Math.min(
        Math.max(window.innerWidth - e.clientX, minDrawerWidth),
        maxDrawerWidth
      );
      setDrawerWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header with upload button */}
        <UploadForm />
        {/* <ScrollablePDFViewer/> */}
      </Box>





      {/* Sidebar on the right, resizable */}
      <Drawer
        anchor="right"
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "relative",
            transition: "width 0.2s",
          },
        }}
        PaperProps={{
          style: {
            overflow: "visible",
          },
        }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            cursor: "ew-resize",
            zIndex: 2,
            background: "rgba(0,0,0,0.07)",
            borderRight: "1px solid #e0e0e0",
          }}
        />
        <Box sx={{ overflow: "auto", height: "100%" }}>
          <List>
            <ListItem button>
              <ListItemText primary="Menu Item 1" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Menu Item 2" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Analyzer;