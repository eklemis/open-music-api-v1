class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }
  async getSongsHandler() {}
  async getSongByIdHandler(request, h) {}
  async postSongHandler(request, h) {}
  async putSongByIdHandler(request, h) {}
  async deleteSongByIdHandler(request, h) {}
}
module.exports = SongHandler;
