const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }
  async ensureAlbumNotLiked(albumId, userId) {
    const query = {
      text: "SELECT id FROM album_likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }
  }
  async likeAlbum(albumId, userId) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO album_likes (id, album_id, user_id) VALUES ($1, $2, $3)",
      values: [id, albumId, userId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`numLikes:${albumId}`);
  }
  async unlikeAlbum(albumId, userId) {
    const query = {
      text: "DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal batal menyukai album. Like tidak ditemukan",
      );
    }
    await this._cacheService.delete(`numLikes:${albumId}`);
  }
  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`numLikes:${albumId}`);
      return {
        isFromCache: true,
        numLikes: parseInt(result),
      };
    } catch (error) {
      const query = {
        text: "SELECT COUNT(*) AS likes FROM album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const numLikes = parseInt(result.rows[0].likes, 10);
      // catatan akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      await this._cacheService.set(`numLikes:${albumId}`, numLikes);
      return {
        isFromCache: false,
        numLikes,
      };
    }
  }
}

module.exports = AlbumLikesService;
