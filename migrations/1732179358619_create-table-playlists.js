exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"', // Foreign key to users table
      onDelete: "CASCADE", // Cascade deletion if a user is deleted
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlists");
};
