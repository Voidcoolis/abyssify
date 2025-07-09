import { Song } from "../models/song.model.js";

//* Controller to get all songs sorted by creation date (newest first)
export const getAllSongs = async (req, res, next) => {
  try {
    //* Fetch all songs from database and sort by createdAt in descending order
    // -1 (Descending) means the newest song will be at the top & the oldest at the bottom
    //  1 (Ascending) means the oldest song will be at the top & the newest at the bottom
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

//* Controller to get featured songs (random selection of 6 songs)
export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      //? aggregate data ??
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

//* Controller to get "Made For You" songs (random selection of 4 songs)
export const getMadeForYouSongs = async (req, res, next) => {
  try {
    // Get random sample of 4 songs with specific fields
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

//* Controller to get trending songs (random selection of 4 songs)
export const getTrendingSongs = async (req, res, next) => {
  try {
    //? Could be enhanced to use actual trending metrics (e.g., by play count)
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};
