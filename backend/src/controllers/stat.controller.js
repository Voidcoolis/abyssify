import { Album } from "../models/album.model.js"
import { Song } from "../models/song.model.js"
import { User } from "../models/user.model.js"

//* Controller to get statistics about the music platform
export const getStats = async (req, res, next) => {
    try {
         //! Use Promise.all to execute multiple database queries in parallel for better performance
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] =  await Promise.all([
            Song.countDocuments(), // 1. Count total number of songs in the database
            Album.countDocuments(), // 2. Count total number of albums in the database
            User.countDocuments(), // 3. Count total number of users in the database

            // 4. Count unique artists across both songs and albums
            Song.aggregate([
                {
                    $unionWith: {
                       coll: "albums",
                        pipeline: [],
					},
                },
                // Group documents by artist name
                {
                    $group: {
						_id: "$artist",
					},
                },
                // Count the number of unique artists
                {
					$count: "count",
				},
            ]),
        ]);

        res.status(200).json({
            totalAlbums,
            totalSongs,
            totalUsers,
            totalArtists: uniqueArtists[0]?.count || 0, // extracts the count of unique artists from the aggregation result while handling cases where no artists exist.
        })
    } catch (error) {
        next(error);
    }
};