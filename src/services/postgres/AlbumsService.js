const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBAlbumToModel, mapAlbum } = require("../../utils");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }
  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");
    return result.rows.map(mapDBAlbumToModel);
  }
  async getAlbumById(id) {
    const query = {
      text: `SELECT
                     a.id as album_id,
                     a.name as album_name,
                     a.year as album_year,
                     a."coverUrl" as coverUrl,
                     s.id as song_id,
                     s.title as song_title,
                     s.performer
                   FROM albums a
                   LEFT JOIN songs s ON s.album_id = a.id
                   WHERE a.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = mapAlbum(result.rows);

    return album;
  }
  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    return result.rows[0].id;
  }
  async changeAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at=$3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }
  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
  async updateAlbumCover(id, coverUrl) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [coverUrl, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui cover album. Id tidak ditemukan",
      );
    }
  }
  async verifyAlbumExists(albumId) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }
}
module.exports = AlbumsService;
