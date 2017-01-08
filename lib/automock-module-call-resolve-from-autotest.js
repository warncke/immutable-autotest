'use strict'

/* npm modules */
var _ = require('lodash')

module.exports = automockModuleCallResolveFromAutotest

/**
 * @function automockModuleCallResolveFromAutotest
 *
 * @param {object} moduleCall
 * @param {object} data
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automockModuleCallResolveFromAutotest (moduleCall, data) {
    // build automock
    var automock = {
        data: {
            moduleCallId: moduleCall.moduleCallId,
            resolved: parseInt(moduleCall.resolved) ? true : false,
        },
        type: 'moduleCallResolve',
    }
    // get data id
    var dataId = moduleCall.moduleCallResolveDataId
    // if data id is undefined then call resolved with undefined
    if (dataId === undefined) {
        automock.data.moduleCallResolveData = undefined
    }
    // otherwise get resolve data
    else {
        // require data
        if (!data[dataId]) {
            throw new Error('missing data for property moduleCallResolveDataId with id '+dataId)
        }
        // get args data
        automock.data.moduleCallResolveData = data[dataId] 
    }
    // return automock data
    return automock
}