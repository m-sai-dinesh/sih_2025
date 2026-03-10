import express from 'express';
import Hazard from '../models/Hazard.js';

const router = express.Router();

// Get all hazards
router.get('/', async (req, res) => {
  try {
    const hazards = await Hazard.find();
    res.json(hazards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hazards by state
router.get('/:state', async (req, res) => {
  try {
    const { state } = req.params;
    
    const hazard = await Hazard.findOne({ state });
    
    if (!hazard) {
      return res.status(404).json({ message: 'State not found' });
    }

    res.json(hazard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hazard data
router.post('/', async (req, res) => {
  try {
    const hazard = new Hazard(req.body);
    await hazard.save();
    res.status(201).json(hazard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update hazard data
router.put('/:id', async (req, res) => {
  try {
    const hazard = await Hazard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hazard) {
      return res.status(404).json({ message: 'Hazard data not found' });
    }

    res.json(hazard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete hazard data
router.delete('/:id', async (req, res) => {
  try {
    const hazard = await Hazard.findByIdAndDelete(req.params.id);
    
    if (!hazard) {
      return res.status(404).json({ message: 'Hazard data not found' });
    }

    res.json({ message: 'Hazard data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
