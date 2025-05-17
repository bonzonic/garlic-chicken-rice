"use client";

import { useState } from "react";
import { Box, Avatar, TextField, Typography, Paper, Button, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: "yunfeng",
    name: "Yunfeng Lim",
    email: "yunfeng@example.com",
    location: "Kuala Lumpur, Malaysia",
    avatar: "/avatar.png", // Place your avatar image in the public folder or use a URL
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor="background.default"
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, maxWidth: 400 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar
            src={profile.avatar}
            sx={{ width: 100, height: 100 }}
          />
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode((prev) => !prev)}
            sx={{ mb: 2 }}
          >
            {editMode ? "Save" : "Edit Profile"}
          </Button>
          <Box width="100%">
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <AccountCircleIcon color="action" />
              {editMode ? (
                <TextField
                  name="username"
                  label="Username"
                  value={profile.username}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography variant="h6">{profile.username}</Typography>
              )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <PersonIcon color="action" />
              {editMode ? (
                <TextField
                  name="name"
                  label="Name"
                  value={profile.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography variant="h6">{profile.name}</Typography>
              )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <EmailIcon color="action" />
              {editMode ? (
                <TextField
                  name="email"
                  label="Email"
                  value={profile.email}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>{profile.email}</Typography>
              )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon color="action" />
              {editMode ? (
                <TextField
                  name="location"
                  label="Location"
                  value={profile.location}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>{profile.location}</Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}