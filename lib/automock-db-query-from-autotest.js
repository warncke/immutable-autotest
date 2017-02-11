'use strict'

/* npm modules */
var _ = require('lodash')

/* application modules */
const autotestError = require('./autotest-error')

module.exports = automockDbQueryFromAutotest

// data properties with autotest name mapped to automock name
const dataProperties = {
    dbQueryOptionsId: 'options',
    dbQueryParamsId: 'params',
    dbQueryStringId: 'query',
}

/**
 * @function automockDbQueryFromAutotest
 *
 * @param {object} args
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automockDbQueryFromAutotest (args) {
    var config = args.config
    var data = args.data
    var dbQuery = args.dbQuery
    // build automock
    var automock = {
        data: _.pick(dbQuery, ['dbQueryId', 'moduleCallSignature', 'requestId', 'stack']),
        type: 'dbQuery',
    }
    // get data
    _.each(dataProperties, (automockName, autotestName) => {
        // require id in autotest data
        if (!dbQuery[autotestName]) {
            return autotestError('missing property `'+autotestName+'` in autotest data', dbQuery, config)
        }
        // get data id
        var dataId = dbQuery[autotestName]
        // require data
        if (!data[dataId]) {
            return autotestError('missing data for property `'+autotestName+'` with id '+dataId, dbQuery, config)
        }
        // set data for automock
        automock.data[automockName] = data[dataId]
    })
    // return automock data
    return automock
}