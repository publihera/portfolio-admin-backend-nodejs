const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, getRow, getAllRows } = require('../database/database');

const router = express.Router();

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await getAllRows(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );

    // Parse technologies JSON string back to array
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      featured: Boolean(project.featured)
    }));

    res.json(formattedProjects);

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await getRow(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Parse technologies JSON string back to array
    const formattedProject = {
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      featured: Boolean(project.featured)
    };

    res.json(formattedProject);

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project
router.post('/projects', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      project_url,
      github_url,
      technologies,
      featured
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Convert technologies array to JSON string
    const technologiesJson = Array.isArray(technologies) 
      ? JSON.stringify(technologies) 
      : JSON.stringify([]);

    const result = await runQuery(
      `INSERT INTO projects 
       (title, description, image_url, project_url, github_url, technologies, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        image_url || null,
        project_url || null,
        github_url || null,
        technologiesJson,
        featured ? 1 : 0
      ]
    );

    // Get the created project
    const newProject = await getRow(
      'SELECT * FROM projects WHERE id = ?',
      [result.id]
    );

    // Format response
    const formattedProject = {
      ...newProject,
      technologies: newProject.technologies ? JSON.parse(newProject.technologies) : [],
      featured: Boolean(newProject.featured)
    };

    res.status(201).json({
      message: 'Project created successfully',
      project: formattedProject
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image_url,
      project_url,
      github_url,
      technologies,
      featured
    } = req.body;

    // Check if project exists
    const existingProject = await getRow(
      'SELECT id FROM projects WHERE id = ?',
      [id]
    );

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Convert technologies array to JSON string
    const technologiesJson = Array.isArray(technologies) 
      ? JSON.stringify(technologies) 
      : JSON.stringify([]);

    await runQuery(
      `UPDATE projects SET 
       title = ?, description = ?, image_url = ?, project_url = ?, 
       github_url = ?, technologies = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        description || null,
        image_url || null,
        project_url || null,
        github_url || null,
        technologiesJson,
        featured ? 1 : 0,
        id
      ]
    );

    // Get the updated project
    const updatedProject = await getRow(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    // Format response
    const formattedProject = {
      ...updatedProject,
      technologies: updatedProject.technologies ? JSON.parse(updatedProject.technologies) : [],
      featured: Boolean(updatedProject.featured)
    };

    res.json({
      message: 'Project updated successfully',
      project: formattedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const existingProject = await getRow(
      'SELECT id FROM projects WHERE id = ?',
      [id]
    );

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await runQuery('DELETE FROM projects WHERE id = ?', [id]);

    res.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

