const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUniqueOrThrow({
      where: { id: +id },
      include: { tracks: true },
    });

    if (playlist) {
      res.json(playlist);
    } else {
      next({
        status: 404,
        message: `Playlist with id#: ${id} does not exist.`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, description, ownerId, trackIds } = req.body;

  try {
    if (!ownerId || !trackIds) {
      next({ status: 400, message: "ownerId and trackIds are required." });
    }

    const newPlaylist = await prisma.playlist.create({
      data: {
        name,
        description,
        owner: {
          connect: { id: +ownerId },
        },
        tracks: {
          connect: trackIds.map((id) => ({ id: +id })),
        },
      },
    });
    res.status(201).json(newPlaylist);
  } catch (error) {
    next(error);
  }
});
