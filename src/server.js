require("dotenv").config();
const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const AlbumServices = require("./services/postgres/AlbumServices");

const init = async () => {
  const albumServices = new AlbumServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumServices,
      //validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
