const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBSongToModel } = require("../../utils");
class SongServices {
  constructor() {
    this._pool = new Pool();
  }
  async getSongs() {
    const result = await this._pool.query("SELECT * FROM songs");
    return result.rows.map(mapDBSongToModel);
  }
  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBSongToModel)[0];
  }
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        albumId,
        title,
        year,
        genre,
        performer,
        duration,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
  async changeSong(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer=$4, duration=$5, album_id=$6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }
  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("Catatan gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = SongServices;
