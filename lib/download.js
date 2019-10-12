"use strict";

const urllib = require("urllib");

function getRequestOptions() {
    const headers = {
        "User-Agent": "VSCode Update Grammar Tool"
    };

    const { GITHUB_TOKEN: token } = process.env;
    if(token) {
        headers.Authorization = `token ${token}`;
    }

    const ret = {
        method: "GET",
        headers,
        followRedirect: true,
        maxRedirects: 0,
        timeout: 60000
    };

    if(process.env.HTTP_PROXY) {
        ret.enableProxy = true;
        ret.proxy = process.env.HTTP_PROXY;
    }

    return ret;
}

async function download(url) {
    const ret = await urllib.request(url, getRequestOptions());
    const { status, data, headers } = ret;

    if(status === 403 && headers["x-ratelimit-remaining"] === "0") {
        throw new Error("GitHub API rate exceeded. Set GITHUB_TOKEN environment variable to increase rate limit.");
    }

    return data.toString();
}

module.exports = download;
