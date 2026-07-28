const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'locations.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readLocations() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeLocations(locations) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));
}

// Get all saved locations
app.get('/api/locations', (req, res) => {
  res.json(readLocations());
});

// Save a new location
app.post('/api/locations', (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const locations = readLocations();
  const entry = {
    id: 'loc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    name,
    category: req.body.category || '',
    rating: req.body.rating || null,
    address: req.body.address || '',
    city: req.body.city || '',
    lat: req.body.lat != null ? req.body.lat : null,
    lng: req.body.lng != null ? req.body.lng : null,
    dateVisited: req.body.dateVisited || '',
    phone: req.body.phone || '',
    website: req.body.website || '',
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    notes: req.body.notes || '',
    dateAdded: new Date().toISOString()
  };
  locations.push(entry);
  writeLocations(locations);
  res.status(201).json(entry);
});

// Update an existing location
app.put('/api/locations/:id', (req, res) => {
  const locations = readLocations();
  const idx = locations.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const existing = locations[idx];
  const name = req.body.name !== undefined ? req.body.name.trim() : existing.name;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const updated = {
    ...existing,
    name,
    category: req.body.category !== undefined ? req.body.category : existing.category,
    rating: req.body.rating !== undefined ? req.body.rating : existing.rating,
    address: req.body.address !== undefined ? req.body.address : existing.address,
    city: req.body.city !== undefined ? req.body.city : existing.city,
    lat: req.body.lat !== undefined ? req.body.lat : existing.lat,
    lng: req.body.lng !== undefined ? req.body.lng : existing.lng,
    dateVisited: req.body.dateVisited !== undefined ? req.body.dateVisited : existing.dateVisited,
    phone: req.body.phone !== undefined ? req.body.phone : existing.phone,
    website: req.body.website !== undefined ? req.body.website : existing.website,
    tags: req.body.tags !== undefined ? req.body.tags : existing.tags,
    notes: req.body.notes !== undefined ? req.body.notes : existing.notes
  };
  locations[idx] = updated;
  writeLocations(locations);
  res.json(updated);
});

// Delete a location
app.delete('/api/locations/:id', (req, res) => {
  const locations = readLocations();
  const filtered = locations.filter(l => l.id !== req.params.id);
  if (filtered.length === locations.length) {
    return res.status(404).json({ error: 'Not found' });
  }
  writeLocations(filtered);
  res.status(204).end();
});

app.listen(PORT, '0.0.0.0', () => {
 console.log(`Location Saver running on port ${PORT}`);
});