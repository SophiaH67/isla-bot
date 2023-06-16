const { cwd } = require("process");

module.exports = {
  scripts: {
    build: {
      _default:
        "bsm build.clean build.mkdir build.makeTs build.compile build.copy",
      clean: "rm -rf ./dist ./proto-dist",
      mkdir: "mkdir -p proto-dist",
      makeTs: `protoc -I=src --ts_proto_out=proto-dist --ts_proto_opt=nestJs=true --ts_proto_opt=esModuleInterop=true --ts_proto_opt=env=node --ts_proto_opt=useDate=true --proto_path=${cwd()}/src/ src/*.proto`,
      compile: "tsc",
      copy: "cp -r ./src ./dist",
    },
    setup: "bsm build",
  },
};
