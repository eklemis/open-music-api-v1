const ClientError = require("../../exceptions/ClientError");
class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postExportPlaylistsHandler =
      this.postExportPlaylistsHandler.bind(this);
  }
  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);

      const { playlistId } = request.params;
      const credentialId = request.auth.credentials.id;

      await this._playlistsService.verifyPlaylistExists(playlistId);
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId,
      );

      const message = {
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this._service.sendMessage(
        "export:playlists",
        JSON.stringify(message),
      );
      const response = h.response({
        status: "success",
        message: "Permintaan Anda sedang kami proses",
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
}

module.exports = ExportsHandler;
