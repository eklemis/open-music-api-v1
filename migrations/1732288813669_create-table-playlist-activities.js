exports.up = (pgm) => {
  pgm.createTable("playlist_activities", {
    id: {
      type: "SERIAL", // Auto-incrementing ID
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"playlists"',
      onDelete: "CASCADE", // Ensures activities are deleted if the playlist is deleted
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"songs"',
      onDelete: "CASCADE", // Ensures activities are deleted if the song is deleted
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE", // Ensures activities are deleted if the user is deleted
    },
    action: {
      type: "TEXT",
      notNull: true,
      check: `action IN ('add', 'delete')`, // Constraint to allow only 'add' or 'delete'
    },
    date_created: {
      type: "TEXT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_activities");
};
