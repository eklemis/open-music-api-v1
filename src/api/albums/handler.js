class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }
  async getAlbumsHandler() {}
  async getAlbumByIdHandler(request, h) {}
  async postAlbumHandler(request, h) {}
  async putAlbumByIdHandler(request, h) {}
  async deleteAlbumByIdHandler(request, h) {}
}
module.exports = AlbumHandler;
