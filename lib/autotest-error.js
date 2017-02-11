'use strict'

/* public functions */
module.exports = autotestError

/**
 * autotestError
 *
 * log a warning or throw an error based on config
 *
 * @param {string} message
 * @oaran {object} data
 * @param {object} config
 *
 * @returns {undefined}
 *
 * @throws {Error}
 */
function autotestError (message, data, config) {
    // give warning
    if (config.warn) {
        if (!config.silent) {
            console.error('[warning] '+message)
            if (config.data) {
                console.error(JSON.stringify(data, null, 4))
            }
        }
    }
    // throw error
    else {
        // build error object
        var err = new Error(message)
        // add data to error
        err.data = data
        // remove call to autotestError from stack
        err.stack = err.stack.replace(/^.*?at autotestError.*?\n/m, '')
        // throw exception
        throw err
    }
}