const { cwd } = require("process");

module.exports = {
  scripts: {
    build: {
      _default: "bsm build.clean build.mkdir build.makeTs build.copy",
      clean: "rimraf ./dist",
      mkdir: "mkdir dist",
      makeTs: `protoc -I=src --ts_proto_out=dist --ts_proto_opt=esModuleInterop=true --ts_proto_opt=env=node --ts_proto_opt=useDate=true --proto_path=${cwd()}/src/ src/*.proto`,
      compile: "tsc",
      copy: "ncp ./src ./dist",
    },
    setup: "bsm build",
  },
};
