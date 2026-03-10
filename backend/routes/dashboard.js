import express from 'express';
import Dashboard from '../models/Dashboard.js';

const router = express.Router();

// Get dashboard data
router.get('/', async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();
    
    if (!dashboard) {
      // Create default dashboard if none exists
      dashboard = new Dashboard({
        preparednessScore: 0,
        studentsTrained: 0,
        drillsCompleted: 0,
        participationByGrade: [],
        preparednessByDisaster: []
      });
      await dashboard.save();
    }

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update dashboard data
router.put('/', async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();
    
    if (!dashboard) {
      dashboard = new Dashboard(req.body);
    } else {
      Object.assign(dashboard, req.body);
    }
    
    await dashboard.save();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset dashboard data
router.post('/reset', async (req, res) => {
  try {
    await Dashboard.deleteMany({});
    
    const dashboard = new Dashboard({
      preparednessScore: 0,
      studentsTrained: 0,
      drillsCompleted: 0,
      participationByGrade: [],
      preparednessByDisaster: []
    });
    
    await dashboard.save();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
