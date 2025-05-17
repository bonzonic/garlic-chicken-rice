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

router.post('/', async (req, res) => {
  try {
    // 1. Convert req.body to JSON file
    const jsonContent = JSON.stringify(req.body, null, 2);
    const fileName = `data-${Date.now()}.json`;
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, jsonContent);

    // 2. Upload to Alibaba OSS
    // const result = await client.put(`uploads/${fileName}`, filePath);

    // 3. Remove local file after upload
    fs.unlinkSync(filePath);

    res.json({ message: "Uploaded to OSS", url: result.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;