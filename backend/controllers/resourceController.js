const Resource = require('../models/Resource');
const path = require('path');
const fs = require('fs');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add a new resource (with optional file upload)
// @route   POST /api/resources
// @access  Private (Admin / Seed)
exports.createResource = async (req, res) => {
  try {
    const { title, description, category, link } = req.body;

    // If no file is uploaded, require link
    if (!req.file && !link) {
      return res.status(400).json({
        success: false,
        message: 'Either upload a file or provide a link',
      });
    }

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required',
      });
    }

    const resourceData = {
      title,
      description,
      category,
      link: link || '', // Use empty string if no link provided
    };

    // If file is uploaded, add file information
    if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;

      // Determine subfolder based on category
      let subfolder = '';
      if (category === 'video') subfolder = 'videos/';
      else if (category === 'audio') subfolder = 'audio/';
      else if (category === 'pdf') subfolder = 'pdfs/';

      resourceData.fileUrl = `/uploads/${subfolder}${req.file.filename}`;
      resourceData.fileName = req.file.originalname;
      resourceData.fileSize = req.file.size;
      resourceData.isUploaded = true;

      // If file uploaded, use fileUrl as link
      resourceData.link = resourceData.fileUrl;
    }

    const resource = await Resource.create(resourceData);

    res.status(201).json({
      success: true,
      resource,
    });
  } catch (error) {
    // If error occurs and file was uploaded, delete the file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload resource file
// @route   POST /api/resources/upload
// @access  Private (Admin)
exports.uploadResource = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    if (!title || !description || !category) {
      // Delete uploaded file if validation fails
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required',
      });
    }

    // Determine subfolder based on category
    let subfolder = '';
    if (category === 'video') subfolder = 'videos/';
    else if (category === 'audio') subfolder = 'audio/';
    else if (category === 'pdf') subfolder = 'pdfs/';

    const fileUrl = `/uploads/${subfolder}${req.file.filename}`;

    const resource = await Resource.create({
      title,
      description,
      category,
      link: fileUrl, // For uploaded files, link points to fileUrl
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      isUploaded: true,
    });

    res.status(201).json({
      success: true,
      resource,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // If resource has an uploaded file, delete it
    if (resource.isUploaded && resource.fileUrl) {
      const filePath = path.join(__dirname, '..', resource.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
