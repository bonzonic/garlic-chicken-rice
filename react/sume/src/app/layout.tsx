"use client";

import "./globals.css";
import {
  Button,
  Drawer,
  Link,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AssessmentIcon from "@mui/icons-material/Assessment";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const list = () => (
    <Box role="presentation" sx={{ width: "250px" }}>
      <List>
        <ListItem key={"AI Analyzer"} disablePadding>
          <ListItemButton onClick={() => router.push("/analzyer")}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary={"AI Analyzer"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Job Matching"} disablePadding>
          <ListItemButton onClick={() => router.push("/jobmatching")}>
            <ListItemIcon>
              <JoinInnerIcon />
            </ListItemIcon>
            <ListItemText primary={"Job Matching"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <html lang="en">
      <body>
        <Button onClick={() => setIsOpen(true)}>
          <MenuIcon />
        </Button>
        <Drawer anchor={"left"} open={isOpen} onClose={() => setIsOpen(false)}>
          {list()}
        </Drawer>
        {children}
      </body>
    </html>
  );
}
