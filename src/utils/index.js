const mapDBAlbumToModel = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});
const mapDBAlbumWithSongsToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});
const mapDBSongToModel = ({ id, title, year, performer, genre, duration }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
});
const mapDBSongToShortModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});
const mapSong = (row) => ({
  id: row.song_id,
  title: row.song_title,
  performer: row.performer,
});
const mapAlbum = (rows) => {
  if (!rows.length) return null;

  return {
    id: rows[0].album_id,
    name: rows[0].album_name,
    year: rows[0].album_year,
    songs: rows.filter((row) => row.song_id).map(mapSong),
  };
};

module.exports = {
  mapDBAlbumToModel,
  mapDBSongToModel,
  mapDBSongToShortModel,
  mapAlbum,
};
