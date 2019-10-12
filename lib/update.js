"use strict";

const getGrammar = require("./get_grammar");
const writeGrammar = require("./write_grammar");

async function update(repoId, repoPath, dest, modifyGrammar, version = "master", packageJSONPathOverride = "") {
    const { result, info } = await getGrammar(repoId, repoPath, modifyGrammar, version);
    await writeGrammar(repoId, result, info, dest, packageJSONPathOverride);
}

module.exports = update;
