"use strict";

const assert = require("assert");
const path = require("path");

const rimraf = require("rimraf");
const utility = require("utility");

const update = require("../../lib/update");

describe("lib/update.test.js", () => {
    const destPath = path.join(__dirname, "..", "tmp", "viml.tmLanguage.json");

    function cleanup() {
        rimraf.sync(destPath);
        rimraf.sync(path.join(__dirname, "..", "..", "cgmanifest.json"));
    }

    beforeEach(() => cleanup());
    afterEach(() => cleanup());

    it("should download cson", async function() {
        utility.writeJSONSync(path.join(__dirname, "..", "..", "cgmanifest.json"), {
            registrations: [{
                component: {
                    type: "git",
                    git: {
                        repositoryUrl: "https://github.com/Alhadis/language-viml"
                    }
                }
            }]
        });

        await update("Alhadis/language-viml", "grammars/viml.cson", destPath, null, "v1.1.10");

        const std = utility.readJSONSync(path.join(__dirname, "..", "fixtures", "viml.tmLanguage.1.1.10.json"));
        const dest = utility.readJSONSync(destPath);

        const stdManifest = utility.readJSONSync(path.join(__dirname, "..", "fixtures", "viml.cgmanifest.1.1.10.json"));
        const destManifest = utility.readJSONSync(path.join(__dirname, "..", "..", "cgmanifest.json"));

        assert.deepStrictEqual(dest, std);
        assert.deepStrictEqual(destManifest, stdManifest);
    });

    it("should download cson and modify", async function() {
        utility.writeJSONSync(path.join(__dirname, "..", "..", "cgmanifest.json"), {
            registrations: [{
                component: {
                    type: "git",
                    git: {
                        repositoryUrl: "https://github.com/Alhadis/language-viml"
                    }
                }
            }]
        });

        await update("Alhadis/language-viml", "grammars/viml.cson", destPath, grammar => {
            grammar.repository = { modified: true };
        }, "v1.1.10");

        const std = utility.readJSONSync(path.join(__dirname, "..", "fixtures", "viml.tmLanguage.modified.json"));
        const dest = utility.readJSONSync(destPath);

        const stdManifest = utility.readJSONSync(path.join(__dirname, "..", "fixtures", "viml.cgmanifest.1.1.10.json"));
        const destManifest = utility.readJSONSync(path.join(__dirname, "..", "..", "cgmanifest.json"));

        assert.deepStrictEqual(dest, std);
        assert.deepStrictEqual(destManifest, stdManifest);
    });
});
