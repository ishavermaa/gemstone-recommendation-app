import Gemstone from '../models/Gemstone.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getGemstones = asyncHandler(async (req, res) => {
  const { search, planet, color, sort = 'name' } = req.query;
  const filter = {};

  if (search) filter.$text = { $search: search };
  if (planet) filter.planet = planet;
  if (color) filter.color = color;

  const sortOption = sort === 'nameDesc' ? { name: -1 } : { name: 1 };
  const gemstones = await Gemstone.find(filter).sort(sortOption);
  res.json({ gemstones });
});

export const getGemstone = asyncHandler(async (req, res) => {
  const gemstone = await Gemstone.findById(req.params.id);
  if (!gemstone) {
    const error = new Error('Gemstone not found');
    error.statusCode = 404;
    throw error;
  }

  const related = await Gemstone.find({
    _id: { $ne: gemstone._id },
    $or: [{ planet: gemstone.planet }, { color: gemstone.color }]
  }).limit(4);

  res.json({ gemstone, related });
});

export const createGemstone = asyncHandler(async (req, res) => {
  const gemstone = await Gemstone.create(req.body);
  res.status(201).json({ gemstone });
});

export const updateGemstone = asyncHandler(async (req, res) => {
  const gemstone = await Gemstone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!gemstone) {
    const error = new Error('Gemstone not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ gemstone });
});

export const deleteGemstone = asyncHandler(async (req, res) => {
  const gemstone = await Gemstone.findByIdAndDelete(req.params.id);
  if (!gemstone) {
    const error = new Error('Gemstone not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: 'Gemstone deleted' });
});
