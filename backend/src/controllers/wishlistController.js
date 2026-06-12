import Wishlist from '../models/Wishlist.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get all wishlists for user
export const getUserWishlists = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const wishlists = await Wishlist.find({ user: userId })
    .populate('gemstones', 'name image color planet')
    .sort('-createdAt');
  res.json(wishlists);
});

// Get single wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const { wishlistId } = req.params;
  const wishlist = await Wishlist.findById(wishlistId).populate(
    'gemstones',
    'name image color planet description benefits'
  );

  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  // Check authorization
  if (wishlist.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  res.json(wishlist);
});

// Create wishlist
export const createWishlist = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;
  const userId = req.user.id;

  const wishlist = new Wishlist({
    user: userId,
    name,
    description,
    isPublic: isPublic || false,
    gemstones: [],
  });

  await wishlist.save();
  res.status(201).json(wishlist);
});

// Update wishlist
export const updateWishlist = asyncHandler(async (req, res) => {
  const { wishlistId } = req.params;
  const { name, description, isPublic } = req.body;
  const userId = req.user.id;

  let wishlist = await Wishlist.findById(wishlistId);
  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  // Check authorization
  if (wishlist.user.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  wishlist.name = name || wishlist.name;
  wishlist.description = description || wishlist.description;
  if (isPublic !== undefined) wishlist.isPublic = isPublic;

  await wishlist.save();
  res.json(wishlist);
});

// Delete wishlist
export const deleteWishlist = asyncHandler(async (req, res) => {
  const { wishlistId } = req.params;
  const userId = req.user.id;

  const wishlist = await Wishlist.findById(wishlistId);
  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  // Check authorization
  if (wishlist.user.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await Wishlist.findByIdAndDelete(wishlistId);
  res.json({ message: 'Wishlist deleted successfully' });
});

// Add gemstone to wishlist
export const addGemstoneToWishlist = asyncHandler(async (req, res) => {
  const { wishlistId } = req.params;
  const { gemstoneId } = req.body;
  const userId = req.user.id;

  let wishlist = await Wishlist.findById(wishlistId);
  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  // Check authorization
  if (wishlist.user.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (!wishlist.gemstones.includes(gemstoneId)) {
    wishlist.gemstones.push(gemstoneId);
    await wishlist.save();
  }

  await wishlist.populate('gemstones', 'name image color planet');
  res.json(wishlist);
});

// Remove gemstone from wishlist
export const removeGemstoneFromWishlist = asyncHandler(async (req, res) => {
  const { wishlistId } = req.params;
  const { gemstoneId } = req.body;
  const userId = req.user.id;

  let wishlist = await Wishlist.findById(wishlistId);
  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  // Check authorization
  if (wishlist.user.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  wishlist.gemstones = wishlist.gemstones.filter(
    (gem) => gem.toString() !== gemstoneId
  );
  await wishlist.save();

  await wishlist.populate('gemstones', 'name image color planet');
  res.json(wishlist);
});
