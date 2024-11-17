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
  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: "success",
      data: {
        albums,
      },
    };
  }
  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: "success",
      data: {
        album,
      },
    };
  }
  async postAlbumHandler(request, h) {
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }
  async putAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.changeAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Catatan berhasil diperbarui",
    };
  }
  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }
}
module.exports = AlbumHandler;
