import express from 'express';
import Education from '../models/Education.js';

const router = express.Router();

// Get all education content
router.get('/', async (req, res) => {
  try {
    const { language = 'en', disasterType } = req.query;
    
    let filter = { language };
    if (disasterType) {
      filter.disasterType = disasterType;
    }

    const education = await Education.find(filter);
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get education content by disaster type
router.get('/:disasterType', async (req, res) => {
  try {
    const { disasterType } = req.params;
    const { language = 'en' } = req.query;

    const education = await Education.findOne({ 
      disasterType, 
      language 
    });

    if (!education) {
      return res.status(404).json({ message: 'Education content not found' });
    }

    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create education content
router.post('/', async (req, res) => {
  try {
    const education = new Education(req.body);
    await education.save();
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update education content
router.put('/:id', async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({ message: 'Education content not found' });
    }

    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete education content
router.delete('/:id', async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    
    if (!education) {
      return res.status(404).json({ message: 'Education content not found' });
    }

    res.json({ message: 'Education content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
