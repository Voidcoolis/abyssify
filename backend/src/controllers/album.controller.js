import { Album } from "../models/album.model.js";

//* Controller to get all albums
export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find(); // Fetch all albums from the database
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

//* Controller to get a single album by its ID
export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params; // Extract albumId from URL parameters

    // Find the album by ID and populate its 'songs' field with actual song documents
    const album = await Album.findById(albumId).populate("songs"); //songs in the album.model

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album); // Return the found album with its populated songs
  } catch (error) {
    next(error);
  }
};
