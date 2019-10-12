"use strict";

const fs = require("fs");
const path = require("path");

const download = require("./download");

async function writeGrammar(repoId, result, info, dest, packageJSONPathOverride) {
    fs.writeFileSync(dest, JSON.stringify(result, null, 2));

    let commitDate = "0000-00-00";
    let cgmanifestRead;

    try {
        cgmanifestRead = JSON.parse(fs.readFileSync("./cgmanifest.json").toString());
    } catch(e) {
        cgmanifestRead = { registrations: []};
    }

    const promises = [];
    const currentCommitDate = info.commitDate.substr(0, 10);
    if(currentCommitDate > commitDate) {
        let packageJSONPath = `https://raw.githubusercontent.com/${repoId}/${info.commitSha}/`;
        if(packageJSONPathOverride) {
            packageJSONPath += packageJSONPathOverride;
        }
        packageJSONPath += "package.json";

        for(const registration of cgmanifestRead.registrations) {
            const {
                component: { git }
            } = registration;

            const { repositoryUrl } = git;
            if(repositoryUrl.substr(repositoryUrl.length - repoId.length, repoId.length) === repoId) {
                git.commitHash = info.commitSha;

                commitDate = currentCommitDate;
                promises.push(download(packageJSONPath).then(packageJSON => {
                    if(packageJSON) {
                        try {
                            registration.version = JSON.parse(packageJSON).version;
                        } catch(e) {
                            console.log(`Cannot get version. File does not exists at ${packageJSONPath}`);
                        }
                    }
                }));
                break;
            }
        }
    }

    await Promise.all(promises);
    fs.writeFileSync("./cgmanifest.json", JSON.stringify(cgmanifestRead, null, 2));

    if(info) {
        console.log(
            `Updated ${path.basename(dest)} to ${repoId}@${info.commitSha.substr(0, 7)} (${currentCommitDate})`);
    } else {
        console.log(`Updated ${path.basename(dest)}`);
    }
}

module.exports = writeGrammar;
