const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDBAlbumToModel } = require("../../utils");

class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }
  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");
    console.log("result:", result.rows);
    return result.rows.map(mapDBAlbumToModel);
  }
  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBAlbumToModel)[0];
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
      throw new Error("Gagal memperbarui album. Id tidak ditemukan");
    }
  }
  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}
module.exports = AlbumServices;
