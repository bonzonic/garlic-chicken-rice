const express = require('express');
const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');
const router = express.Router();

// Configure your OSS client
const client = new OSS({
  region: process.env.ALI_OSS_REGION,
  accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET,
  bucket: process.env.ALI_OSS_BUCKET,
});


const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 'uploads/' is the folder to store files

router.post('/test', async (req, res) => {
  try {
    
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/upload/:username', upload.single('file'), async (req, res) => {
    const username = req.params.username;
   try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to OSS
    const ossPath = `${username}/${req.file.originalname}`;
    const result = await client.put(ossPath, req.file.path);

    // Optionally delete the local file after upload
    fs.unlinkSync(req.file.path);

    res.json({
      message: "File uploaded to OSS!",
      url: result.url,
      file: req.file,
      body: req.body
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;