import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

//* Helper function to upload a file to Cloudinary and return its secure URL
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto", // Automatically detect file type (audio, image, etc.)
    });
    return result.secure_url; // Return the URL of the uploaded file
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};

//* Create Song
export const createSong = async (req, res, next) => {
  try {
    // Check if both audio and image files are provided in the request
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    // Extract song details from the request body
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // Upload audio and image files to Cloudinary
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    // Create a new Song document with the provided details and uploaded file URLs
    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null, // Set albumId to null if not provided
    });

    await song.save(); //save song to the database

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error); //instead of using : res.status(500).json({message:"internal server error", error})
  }
};

//* Delete Song
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    // if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

//* Create Album
export const createAlbum = async (req, res, next) => {
  try {
    // Extract album details from request body
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files; // album cover image file

    const imageUrl = await uploadToCloudinary(imageFile); //upload cover image to cloudinary

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save(); //save album to db

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

//* Delete Album
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params; // Get album ID from URL parameters
    await Song.deleteMany({ albumId: id }); // Delete all songs that belong to this album
    await Album.findByIdAndDelete(id); // Delete the album itself
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

//Controller to check if user has admin privileges
export const checkAdmin = async (req, res, next) => {
  // Currently just returns true for admin status
  // In a real application, this would verify admin credentials
  res.status(200).json({ admin: true });
};
