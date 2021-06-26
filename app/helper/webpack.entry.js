const glob = require("glob");

const entry = (url) => {
    $arr = glob.sync(url);
    return $arr;
};

module.exports = { entry };
