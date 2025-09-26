import { Song } from "../lib/models/song.model.js";
import { User } from "../lib/models/user.model.js";
import { Album } from "../lib/models/album.model.js";

export const getStats = async (req, res, next) => {
    // const totalSongs = await Song.countDocuemnts();
    // const totalUsers = await User.countDocuments();
    // const totalAlbums = await Album.countDocuments();
    try {
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),

            Song.aggregate([
                {
                    $unionWith: {
                        coll: "albums",
                        pipeline: []
                    },
                },
                {
                    $group: {
                        _id: "$artist",
                    },
                },
                {
                    $count: "count",
                },
            ]),
        ]);

        res.status(200).json({
            totalAlbums,
            totalSongs,
            totalUsers,
            totalArtists: uniqueArtists[0]?.count || 0,
        });

    } catch (error) {
        next(error);
    }
};