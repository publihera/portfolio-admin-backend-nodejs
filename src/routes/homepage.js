const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, getRow } = require('../database/database');

const router = express.Router();

// Get homepage content
router.get('/homepage', async (req, res) => {
  try {
    const homepage = await getRow(
      'SELECT * FROM homepage ORDER BY id LIMIT 1'
    );

    if (!homepage) {
      return res.status(404).json({ error: 'Homepage content not found' });
    }

    // Parse JSON fields
    const formattedHomepage = {
      ...homepage,
      skills: homepage.skills ? JSON.parse(homepage.skills) : [],
      social_links: homepage.social_links ? JSON.parse(homepage.social_links) : {}
    };

    res.json(formattedHomepage);

  } catch (error) {
    console.error('Get homepage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update homepage content
router.put('/homepage', authenticateToken, async (req, res) => {
  try {
    const {
      hero_title,
      hero_subtitle,
      about_text,
      skills,
      contact_email,
      contact_phone,
      social_links
    } = req.body;

    // Check if homepage entry exists
    const existingHomepage = await getRow(
      'SELECT id FROM homepage ORDER BY id LIMIT 1'
    );

    // Convert arrays/objects to JSON strings
    const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : JSON.stringify([]);
    const socialLinksJson = typeof social_links === 'object' ? JSON.stringify(social_links) : JSON.stringify({});

    if (existingHomepage) {
      // Update existing homepage
      await runQuery(
        `UPDATE homepage SET 
         hero_title = ?, hero_subtitle = ?, about_text = ?, skills = ?, 
         contact_email = ?, contact_phone = ?, social_links = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          hero_title,
          hero_subtitle,
          about_text,
          skillsJson,
          contact_email,
          contact_phone,
          socialLinksJson,
          existingHomepage.id
        ]
      );
    } else {
      // Create new homepage entry
      await runQuery(
        `INSERT INTO homepage 
         (hero_title, hero_subtitle, about_text, skills, contact_email, contact_phone, social_links) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          hero_title,
          hero_subtitle,
          about_text,
          skillsJson,
          contact_email,
          contact_phone,
          socialLinksJson
        ]
      );
    }

    // Get updated homepage
    const updatedHomepage = await getRow(
      'SELECT * FROM homepage ORDER BY id LIMIT 1'
    );

    // Format response
    const formattedHomepage = {
      ...updatedHomepage,
      skills: updatedHomepage.skills ? JSON.parse(updatedHomepage.skills) : [],
      social_links: updatedHomepage.social_links ? JSON.parse(updatedHomepage.social_links) : {}
    };

    res.json({
      message: 'Homepage updated successfully',
      homepage: formattedHomepage
    });

  } catch (error) {
    console.error('Update homepage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get homepage stats (optional - for admin dashboard)
router.get('/homepage/stats', authenticateToken, async (req, res) => {
  try {
    // Get some basic stats
    const projectCount = await getRow('SELECT COUNT(*) as count FROM projects');
    const imageCount = await getRow('SELECT COUNT(*) as count FROM images');
    const userCount = await getRow('SELECT COUNT(*) as count FROM users');

    res.json({
      projects: projectCount.count,
      images: imageCount.count,
      users: userCount.count
    });

  } catch (error) {
    console.error('Get homepage stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

