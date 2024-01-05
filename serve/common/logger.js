const log4js = require("log4js");
const fs = require("fs");
const consoleLog = console.log;

/**
 *  日志等级从低到高分为6个等级，
    trace - 最低等级
    debug
    info
    warn
    error
    fatal - 最高等级
 */

if (!fs.existsSync(`${global.$config.loggerPath}`)) fs.mkdirSync(`${global.$config.loggerPath}`);

log4js.configure({
    appenders: {
        file: { type: "file", filename: `${global.$config.loggerPath}/${getDate()}.log` },
        console: { type: "console" },
    },
    categories: {
        default: { appenders: ["console"], level: "trace" },
        file: { appenders: ['file'], level: 'trace' },
    },
});

// info
console.log = console.info = function (...args) {
    let logger = null;

    const logs = args.join(",");
    if (process.env.NODE_ENV === "production") {
        logger = log4js.getLogger("file")
    } else {
        logger = log4js.getLogger("default");
    }

    logger.info(logs)
};

// error
console.error = function (...args) {
    let logger = null;

    const logs = args.join(",");
    if (process.env.NODE_ENV === "production") {
        logger = log4js.getLogger("file")
    } else {
        logger = log4js.getLogger("default");
    }

    logger.error(logs)
};

// warn
console.warn = function (...args) {
    let logger = null;

    const logs = args.join(",");
    if (process.env.NODE_ENV === "production") {
        logger = log4js.getLogger("file")
    } else {
        logger = log4js.getLogger("default");
    }

    logger.warn(logs)
};

function getDate() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    return `${year}_${month}_${day}`
}
