const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }
  async addActivity({ playlistId, songId, userId, action }) {
    const time = new Date().toISOString();
    const query = {
      text: `
          INSERT INTO playlist_activities (playlist_id, song_id, user_id, action, date_created)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id;
        `,
      values: [playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Failed to add activity");
    }

    return result.rows[0].id;
  }
  async getPlaylistActivitiesById(playlistId) {
    const query = {
      text: `
        SELECT
          u.username,
          s.title,
          pa.action,
          pa.date_created AS time
        FROM playlist_activities pa
        JOIN users u ON pa.user_id = u.id
        JOIN songs s ON pa.song_id = s.id
        WHERE pa.playlist_id = $1
        ORDER BY pa.date_created ASC;
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("No activities found for this playlist");
    }

    const activities = result.rows.map((row) => ({
      username: row.username,
      title: row.title,
      action: row.action,
      time: row.time,
    }));

    return {
      playlistId,
      activities,
    };
  }
}

module.exports = PlaylistActivitiesService;
