class AlbumsHandler {
  constructor(service, storageService, likesService, validator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._likesService = likesService;

    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postCoverImageHandler = this.postCoverImageHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
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
    this._validator.validateAlbumPayload(request.payload);
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
    this._validator.validateAlbumPayload(request.payload);
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
  async postCoverImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateCoverImagePayload(cover.hapi.headers);

    const coverUrl = await this._storageService.writeFile(cover, cover.hapi);

    await this._service.updateAlbumCover(id, coverUrl);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
      data: {
        coverUrl,
      },
    });
    response.code(201);
    return response;
  }
  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.verifyAlbumExists(albumId);
    await this._likesService.ensureAlbumNotLiked(albumId, userId);
    await this._likesService.likeAlbum(albumId, userId);

    const response = h.response({
      status: "success",
      message: "Album berhasil disukai",
    });
    response.code(201);
    return response;
  }
  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.verifyAlbumExists(albumId);

    await this._likesService.unlikeAlbum(albumId, userId);

    return {
      status: "success",
      message: "Batal menyukai album berhasil",
    };
  }
  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._service.verifyAlbumExists(albumId);

    // Get the like count
    const { isFromCache, numLikes } =
      await this._likesService.getAlbumLikes(albumId);

    const response = h.response({
      status: "success",
      data: {
        likes: numLikes,
      },
    });

    // Add X-Data-Source header based on cache status
    if (isFromCache) {
      response.header("X-Data-Source", "cache");
    }

    return response;
  }
}
module.exports = AlbumsHandler;
