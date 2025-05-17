"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./globals.css";
import { Button, Drawer, ListItemButton, ListItemIcon } from "@mui/material";
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
import Image from "next/image";

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
          <ListItemButton
            onClick={() => {
              router.push("/analyzer");
              setIsOpen(false);
            }}
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary={"AI Analyzer"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Job Matching"} disablePadding>
          <ListItemButton
            onClick={() => {
              router.push("/jobmatching");
              setIsOpen(false);
            }}
          >
            <ListItemIcon>
              <JoinInnerIcon />
            </ListItemIcon>
            <ListItemText primary={"Job Matching"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <body className="flex flex-col  h-screen">
          <div className="flex flex-row items-center bg-gray-900 text-white p-4">
            <Button onClick={() => setIsOpen(true)}>
              <MenuIcon />
            </Button>
            <Drawer
              anchor={"left"}
              open={isOpen}
              onClose={() => setIsOpen(false)}
            >
              {list()}
            </Drawer>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <Image
                alt="logo"
                src="/logo_alibaba.png"
                width="20"
                height="20"
                style={{ height: "20px", width: "20px" }}
              />
              <h2 className="text-xl">Sume</h2>
            </div>
          </div>
          <div className="p-4 w-screen h-full">{children}</div>
        </body>
      </ThemeProvider>
    </html>
  );
}
