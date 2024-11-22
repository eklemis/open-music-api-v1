const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const InvariantError = require("../../exceptions/InvariantError");

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }
  async addCollaboration(playlistId, userId) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) returning id",
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    const insertedRows = result.rows;

    if (!insertedRows.length) {
      throw new InvariantError("Kolaborasi gagal ditambahkan");
    }

    const insertedCollaborationId = insertedRows[0].id;
    return insertedCollaborationId;
  }
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id=$1 and user_id=$2 returning id",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    const deletedRows = result.rows;
    if (!deletedRows.length) {
      throw new InvariantError("Kolaborasi gagal dihapus");
    }

    const deletedCollaborationId = deletedRows[0].id;
    return deletedCollaborationId;
  }
}
module.exports = CollaborationsService;
