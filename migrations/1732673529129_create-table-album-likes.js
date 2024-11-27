/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable("album_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    album_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "albums(id)",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Ensure a user can like an album only once
  pgm.addConstraint(
    "album_likes",
    "unique_album_id_user_id",
    "UNIQUE(album_id, user_id)",
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable("album_likes");
};
