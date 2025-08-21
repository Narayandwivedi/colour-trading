const path = require("path");
const fs = require("fs").promises;

async function handleChatFileUpload(req, res) {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Additional file size check (in case multer limit is bypassed)
    if (req.file.size > 5 * 1024 * 1024) {
      // Delete the uploaded file if it exceeds size limit
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.warn("Could not delete oversized file:", unlinkError.message);
      }
      return res.status(400).json({ 
        success: false, 
        message: 'File size must be less than 5MB' 
      });
    }

    // Get the original uploaded file path
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const fileExtension = path.extname(filename);

    // Check if it's an image file
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const isImage = imageExtensions.includes(fileExtension.toLowerCase());

    // Validate file type (optional - allow common file types)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.txt'];
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      // Delete the uploaded file if it's not an allowed type
      try {
        await fs.unlink(originalPath);
      } catch (unlinkError) {
        console.warn("Could not delete invalid file:", unlinkError.message);
      }
      return res.status(400).json({ 
        success: false, 
        message: 'File type not allowed. Please upload images, PDFs, or documents.' 
      });
    }

    // No compression for chat files since they're deleted in 24 hours
    // Just return the original file for best quality
    res.json({
      success: true,
      file_url: `/images/chat/${filename}`,
      file_type: isImage ? 'image' : 'file',
      file_size: req.file.size
    });
  } catch (err) {
    console.error("Error processing chat file:", err);
    
    // Handle multer file size error specifically
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size must be less than 5MB' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'File upload failed. Please try again.' 
    });
  }
}

module.exports = { handleChatFileUpload };