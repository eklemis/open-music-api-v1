const { Pool } = require("pg");
const { nanoid } = require("nanoid");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }
  async getAlbums() {}
  async getAlbumById(id) {}
  async addAlbum({ name, year }) {}
  async changeAlbumById(id, { name, year }) {}
  async deleteAlbumById(id) {}
}
module.exports = AlbumService;
