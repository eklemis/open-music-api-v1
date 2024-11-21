exports.up = (pgm) => {
  pgm.addColumns("playlists", {
    created_at: {
      type: "TEXT",
      notNull: true,
      default: pgm.func("current_timestamp"), // Default to current timestamp
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
      default: pgm.func("current_timestamp"), // Default to current timestamp
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("playlists", ["created_at", "updated_at"]);
};
