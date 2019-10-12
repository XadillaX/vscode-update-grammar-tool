"use strict";

const download = require("./download");

async function getCommitSha(repoId, repoPath) {
    const commitInfo = `https://api.github.com/repos/${repoId}/commits?path=${repoPath}`;
    const content = await download(commitInfo);

    let lastCommit;
    try {
        lastCommit = JSON.parse(content)[0];
    } catch(e) {
        throw new Error(`Failed extracting the SHA: ${content}`);
    }

    return {
        commitSha: lastCommit.sha,
        commitDate: lastCommit.commit.author.date
    };
}

module.exports = getCommitSha;
