"use strict";

const assert = require("assert");

const getCommitSHA = require("../../lib/get_commit_sha");

describe("lib/get_commit_sha.test.js", () => {
    it("should download cson", async function() {
        const ret = await getCommitSHA("Alhadis/language-viml", "grammars/viml.cson&sha=v0.2.0");
        assert.deepStrictEqual(ret, {
            commitSha: "458309533268ef3ee69f9e06625a773abace99c3",
            commitDate: "2014-07-23T11:30:32Z"
        });
    });
});
