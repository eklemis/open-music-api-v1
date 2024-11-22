const ClientError = require("../../exceptions/ClientError");

class CollaborationsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }
  async postCollaborationHandler(request, h) {
    try {
      this._validator.validatePostCollaborationPayload(request.payload);

      const { playlistId, userId: collaboratorId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

      const collaborationId = await this._service.addCollaboration(
        playlistId,
        collaboratorId,
      );
      const response = h.response({
        status: "success",
        message: "Collaboration berhasil ditambahkan",
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validatePostCollaborationPayload(request.payload);
      const { playlistId, userId: collaboratorId } = request.payload;

      const { id: owner } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
      await this._service.deleteCollaboration(playlistId, collaboratorId);

      return {
        status: "success",
        message: "Collaboration berhasil dihapus",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = CollaborationsHandler;
