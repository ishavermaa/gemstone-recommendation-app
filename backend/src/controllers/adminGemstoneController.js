import Gemstone from '../models/Gemstone.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get all gemstones (with search and filter)
export const getAllGemstones = asyncHandler(async (req, res) => {
  const { search, color, planet, page = 1, limit = 10 } = req.query;

  let query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { benefits: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by color
  if (color) {
    query.color = { $regex: color, $options: 'i' };
  }

  // Filter by planet
  if (planet) {
    query.planet = { $regex: planet, $options: 'i' };
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const gemstones = await Gemstone.find(query)
    .skip(skip)
    .limit(limitNum)
    .sort('-createdAt');

  const total = await Gemstone.countDocuments(query);

  res.json({
    gemstones,
    pagination: {
      current: pageNum,
      total: Math.ceil(total / limitNum),
      count: gemstones.length,
    },
  });
});

// Get single gemstone
export const getGemstoneDetail = asyncHandler(async (req, res) => {
  const { gemstoneId } = req.params;
  const gemstone = await Gemstone.findById(gemstoneId);

  if (!gemstone) {
    return res.status(404).json({ message: 'Gemstone not found' });
  }

  res.json(gemstone);
});

// Create gemstone (Admin only)
export const createGemstone = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    gallery,
    description,
    benefits,
    color,
    planet,
    recommendedFor,
    recommendedGoals,
    wearingInstructions,
    suggestedMetal,
    suggestedDay,
  } = req.body;

  // Validation
  if (!name || !image || !description || !benefits || !color || !planet) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const gemstone = new Gemstone({
    name,
    image,
    gallery: gallery || [],
    description,
    benefits,
    color,
    planet,
    recommendedFor: recommendedFor || [],
    recommendedGoals: recommendedGoals || [],
    wearingInstructions: wearingInstructions || '',
    suggestedMetal: suggestedMetal || 'Silver',
    suggestedDay: suggestedDay || 'Friday',
  });

  await gemstone.save();
  res.status(201).json(gemstone);
});

// Update gemstone (Admin only)
export const updateGemstone = asyncHandler(async (req, res) => {
  const { gemstoneId } = req.params;
  const {
    name,
    image,
    gallery,
    description,
    benefits,
    color,
    planet,
    recommendedFor,
    recommendedGoals,
    wearingInstructions,
    suggestedMetal,
    suggestedDay,
  } = req.body;

  let gemstone = await Gemstone.findById(gemstoneId);
  if (!gemstone) {
    return res.status(404).json({ message: 'Gemstone not found' });
  }

  // Update fields
  if (name) gemstone.name = name;
  if (image) gemstone.image = image;
  if (gallery) gemstone.gallery = gallery;
  if (description) gemstone.description = description;
  if (benefits) gemstone.benefits = benefits;
  if (color) gemstone.color = color;
  if (planet) gemstone.planet = planet;
  if (recommendedFor) gemstone.recommendedFor = recommendedFor;
  if (recommendedGoals) gemstone.recommendedGoals = recommendedGoals;
  if (wearingInstructions) gemstone.wearingInstructions = wearingInstructions;
  if (suggestedMetal) gemstone.suggestedMetal = suggestedMetal;
  if (suggestedDay) gemstone.suggestedDay = suggestedDay;

  await gemstone.save();
  res.json(gemstone);
});

// Delete gemstone (Admin only)
export const deleteGemstone = asyncHandler(async (req, res) => {
  const { gemstoneId } = req.params;
  const gemstone = await Gemstone.findByIdAndDelete(gemstoneId);

  if (!gemstone) {
    return res.status(404).json({ message: 'Gemstone not found' });
  }

  res.json({ message: 'Gemstone deleted successfully' });
});
