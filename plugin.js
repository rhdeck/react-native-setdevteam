const xcode = require("xcode");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const dvm = require("xcode-devteam-management");

module.exports = [
  {
    name: "setdevteam [devteamid]",
    description: "Set Development team for XCode project",
    func: (argv, config, args) => {
      if (argv && argv[0]) {
        updateProjects(argv[0]);
        console.log("Updated with development team", argv[0]);
        return;
      }
      //Go interactive
      const dt = dvm.getDevTeam();
      if (dt) {
        updateProjects(dt);
        console.log("Updated with development team", dt);
      } else {
        dvm.getFromDevTeams().then(devteam => {
          updateProjects(devteam);
          console.log("Updated with development team", devteam);
        });
      }
    }
  }
];
function updateProjects(devteam) {
  const buildProperties = {
    DEVELOPMENT_TEAM: devteam
  };
  const cwd = process.cwd();
  const iospath = path.join(cwd, "ios");
  if (!fs.existsSync(iospath)) {
    console.log("Could not find ios directory at", iospath);
    return;
  }
  const projglob = path.join(iospath, "**", "project.pbxproj");
  const pgs = glob.sync(projglob);
  if (pgs && pgs.length) {
    pgs.map(pp => {
      const p = xcode.project(pp);
      p.parseSync();
      Object.keys(buildProperties).map(key => {
        p.addBuildProperty(key, buildProperties[key]);
      });
      const out = p.writeSync();
      fs.writeFileSync(pp, out);
      p.writeSync();
    });
  }
}
