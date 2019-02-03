#!/usr/bin/env node
const { join } = require("path");
const { xcodeDevTeam } = require(join(process.cwd(), "package.json"));
const xcode = require("@raydeck/xcode");
const glob = require("glob");
const { existsSync, writeFileSync } = require("fs");

if (xcodeDevTeam) {
  //let's update the package
  updateProjects(xcodeDevTeam);
  console.log(
    "Updated xcode projects with save development team",
    xcodeDevTeam
  );
}
function updateProjects(devteam) {
  const buildProperties = {
    DEVELOPMENT_TEAM: devteam
  };
  const cwd = process.cwd();
  const iospath = join(cwd, "ios");
  if (!existsSync(iospath)) {
    console.log("Could not find ios directory at", iospath);
    return;
  }
  const projglob = join(iospath, "**", "project.pbxproj");
  const pgs = glob.sync(projglob);
  if (pgs && pgs.length) {
    pgs.map(pp => {
      const p = xcode.project(pp);
      p.parseSync();
      Object.keys(buildProperties).map(key => {
        p.addBuildProperty(key, buildProperties[key]);
      });
      const out = p.writeSync();
      writeFileSync(pp, out);
      p.writeSync();
    });
  }
}
