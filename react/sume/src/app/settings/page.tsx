"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Stack,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LanguageIcon from "@mui/icons-material/Language";
import RestoreIcon from "@mui/icons-material/Restore";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(50);
  const [language, setLanguage] = useState("en");

  const handleReset = () => {
    setDarkMode(true);
    setNotifications(true);
    setVolume(50);
    setLanguage("en");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <DarkModeIcon />
                <span>Dark Mode</span>
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={notifications}
                onChange={() => setNotifications((prev) => !prev)}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <NotificationsActiveIcon />
                <span>Enable Notifications</span>
              </Box>
            }
          />
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LanguageIcon />
              <InputLabel id="language-label">Language</InputLabel>
            </Box>
            <FormControl fullWidth>
              <Select
                labelId="language-label"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                size="small"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
                <MenuItem value="ms">Malay</MenuItem>
                <MenuItem value="ta">Tamil</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography>Volume</Typography>
            </Box>
            <Slider
              value={volume}
              onChange={(_, val) => setVolume(val as number)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{ width: "90%" }}
            />
          </Box>
          <Divider />
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RestoreIcon />}
            onClick={handleReset}
            fullWidth
          >
            Reset to Defaults
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}