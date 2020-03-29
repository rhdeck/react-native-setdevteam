const xcode = require("@raydeck/xcode");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const dvm = require("xcode-devteam-management");

module.exports = {
  commands: [
    {
      name: "setdevteam [devteamid]",
      description: "Set Development team for XCode project",
      options: [
        {
          command: "-i --interactive",
          description: "Force interactive devteam selection"
        }
      ],
      func: async (argv, config, args) => {
        const { xcodeDevTeam } = require(path.join(
          process.cwd(),
          "package.json"
        ));
        if (argv && argv[0]) {
          updateProjects(argv[0]);
          console.log("Updated with specified development team", argv[0]);
          return;
        }
        //Go interactive
        if (args.interactive) {
          dvm.getFromDevTeams().then(devteam => {
            updateProjects(devteam);
            savePackage(devteam);
            console.log("Updated with selected development team", devteam);
          });
        } else if (xcodeDevTeam) {
          updateProjects(xcodeDevTeam);
          savePackage(xcodeDevTeam);
          console.log(
            "Updated projects with previously-selected development team",
            xcodeDevTeam
          );
        } else {
          const dt = dvm.getDevTeam();
          if (dt) {
            updateProjects(dt);
            savePackage(dt);
            console.log("Updated with user-wide development team", dt);
          } else {
            try {
              const devteam = await dvm.getFromDevTeams();
              if (devteam) {
                updateProjects(devteam);
                savePackage(devteam);
                console.log("Updated with selected development team", devteam);
              } else {
                console.log("No dev team selected. Aborting");
              }
            } catch (e) {
              console.log("Error while selecting development team. Aborting");
            }
          }
        }
      }
    }
  ]
};
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
function savePackage(xcodeDevTeam) {
  const fp = path.join(process.cwd(), "package.json");
  const project = require(fp);
  const out = { ...project, xcodeDevTeam };
  fs.writeFileSync(fp, JSON.stringify(out, null, 2));
}
