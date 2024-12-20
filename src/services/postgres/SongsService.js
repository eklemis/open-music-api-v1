const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBSongToModel, mapDBSongToShortModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
class SongsService {
  constructor() {
    this._pool = new Pool();
  }
  async getSongs({ title, performer }) {
    let conditions = [];
    let values = [];

    // Build conditions based on the presence of query parameters
    if (title) {
      conditions.push(`title ILIKE $${conditions.length + 1}`);
      values.push(`%${title}%`);
    }

    if (performer) {
      conditions.push(`performer ILIKE $${conditions.length + 1}`);
      values.push(`%${performer}%`);
    }

    // Create the WHERE clause
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Prepare and execute the query
    const query = {
      text: `SELECT * FROM songs ${whereClause}`,
      values: values,
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBSongToShortModel);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal mencari lagu. Id tidak ditemukan");
    }
    return result.rows.map(mapDBSongToModel)[0];
  }
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
  async changeSongById(
    id,
    { title, year, genre, performer, duration, albumId },
  ) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer=$4, duration=$5, album_id=$6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }
  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
    }
  }
  async verifySongById(id) {
    const query = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
    const song = result.rows[0];
    return song;
  }
}

module.exports = SongsService;
