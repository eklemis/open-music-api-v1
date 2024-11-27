const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const {
  mapGetPlayListToModel,
  mapDbPlaylistSongToModel,
} = require("../../utils");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }
  async addPlayList({ name, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, owner, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    const newPlaylistId = result.rows[0].id;
    return newPlaylistId;
  }
  async getPlaylists(userId) {
    const query = {
      text: "SELECT p.*, u.username FROM playlists p JOIN users u ON p.owner=u.id LEFT JOIN collaborations c ON c.playlist_id=p.id WHERE p.owner=$1 OR c.user_id=$1",
      values: [userId],
    };
    const queryResult = await this._pool.query(query);
    const mappedData = queryResult.rows.map(mapGetPlayListToModel);
    return mappedData;
  }
  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Playlist gagal dihapus. Playlist tidak ditemukan",
      );
    }
  }
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
  async verifyPlaylistExists(playlistId) {
    const query = {
      text: "SELECT EXISTS(SELECT 1 FROM playlists WHERE id = $1)",
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].exists) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }
  async verifyPlaylistAccess(playlistId, userId) {
    const query = {
      text: `
        SELECT 1
        FROM playlists p
        LEFT JOIN collaborations c ON c.playlist_id = p.id
        WHERE p.id = $1 AND (p.owner = $2 OR c.user_id = $2);
      `,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }
  }
  async getPlaylistSongsById(playlistId) {
    const query = {
      text: "select p.id as playlistId, p.name, u.username, s.id, s.title, s.performer from users u join playlists p on u.id=p.owner join playlist_songs ps on ps.playlist_id=p.id join songs s on ps.song_id=s.id WHERE p.id=$1",
      values: [playlistId],
    };

    const queryResult = await this._pool.query(query);

    const firstResultRow = queryResult.rows[0];
    const playlistSongs = queryResult.rows.map(mapDbPlaylistSongToModel);

    const playlist = {
      id: firstResultRow.playlistid,
      name: firstResultRow.name,
      username: firstResultRow.username,
      songs: playlistSongs,
    };

    return playlist;
  }
  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id=$2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Lagu gagal dihapus dari playlist. Playlist atau lagu tidak ditemukan",
      );
    }
  }
}

module.exports = PlaylistsService;
