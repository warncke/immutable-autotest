'use strict'

/* npm modules */
var _ = require('lodash')

/* public functions */
module.exports = automockModuleCallFromAutotest

/**
 * @function automockModuleCallFromAutotest
 *
 * @param {object} moduleCall
 * @param {object} data
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automockModuleCallFromAutotest (moduleCall, data) {
    // build automock
    var automock = {
        data: {
            methodName: moduleCall.methodName || moduleCall.functionName,
            moduleCallId: moduleCall.moduleCallId,
            moduleName: moduleCall.moduleName,
        },
        type: 'moduleCall',
    }
    // require args id in data
    if (!moduleCall.argsId) {
        throw new Error('missing property argsId in autotest data')
    }
    // require data
    if (!data[moduleCall.argsId]) {
        throw new Error('missing data for property argsId with id '+moduleCall.argsId)
    }
    // get args data
    automock.data.args = data[moduleCall.argsId]
    // return automock data
    return automock
}