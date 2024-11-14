const { Pool } = require("pg");
const { nanoid } = require("nanoid");

class SongService {
  constructor() {
    this._pool = new Pool();
  }
  async getSongs() {}
  async getSongById(id) {}
  async addSong({ title, year, genre, performer, duration, albumId }) {}
  async changeSong(id, { title, year, genre, performer, duration, albumId }) {}
  async deleteSongById(id) {}
}

module.exports = SongService;
