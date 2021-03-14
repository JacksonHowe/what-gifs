const giphy = jest.createMockFromModule("@giphy/js-fetch-api");

let resultURL = "giphy.com/result";
function __setResultURL(url) {
    resultURL = url;
}

function search(_, _2) {
    return Promise.resolve({
        data: [{
            images: {
                original: {
                    webp: resultURL
                }
            }
        }],
        pagination: {
            total_count: 100000,
            count: 1,
            offset: 0
        },
        meta: {
            status: 200,
            msg: "OK",
            response_id: "responseId"
        }
    });
}

function trending(_) {
    return Promise.resolve({
        data: [{
            images: {
                original: {
                    webp: resultURL
                }
            }
        }],
        pagination: {
            total_count: 100000,
            count: 1,
            offset: 0
        },
        meta: {
            status: 200,
            msg: "OK",
            response_id: "responseId"
        }
    });
}

function random(_) {
    return Promise.resolve({
        data: [{
            images: {
                original: {
                    webp: resultURL
                }
            }
        }],
        pagination: {
            total_count: 100000,
            count: 1,
            offset: 0
        },
        meta: {
            status: 200,
            msg: "OK",
            response_id: "responseId"
        }
    });
}

giphy.__setResultURL = __setResultURL;
giphy.GiphyFetch.prototype.search = search;
giphy.GiphyFetch.prototype.trending = trending;
giphy.GiphyFetch.prototype.random = random;

module.exports = giphy;