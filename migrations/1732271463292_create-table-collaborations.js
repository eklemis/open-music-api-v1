exports.up = (pgm) => {
  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"playlists"',
      onDelete: "CASCADE", // Deletes collaborations if the playlist is deleted
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE", // Deletes collaborations if the user is deleted
    },
  });

  // Ensure no duplicate collaborations for the same playlist and user
  pgm.addConstraint(
    "collaborations",
    "unique_playlist_user",
    "UNIQUE(playlist_id, user_id)",
  );
};

exports.down = (pgm) => {
  pgm.dropTable("collaborations");
};
