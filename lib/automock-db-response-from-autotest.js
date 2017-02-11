'use strict'

/* npm modules */
var _ = require('lodash')

/* application modules */
const autotestError = require('./autotest-error')

module.exports = automockDbResponseFromAutotest

/**
 * @function automockDbResponseFromAutotest
 *
 * @param {object} args
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automockDbResponseFromAutotest (args) {
    var config = args.config
    var data = args.data
    var dbQuery = args.dbQuery
    // build automock
    var automock = {
        data: {
            dbQueryId: dbQuery.dbQueryId,
            dbResponseSuccess: dbQuery.dbResponseSuccess,
        },
        type: 'dbResponse',
    }
    // require dbResponseId in automock data
    if (!dbQuery.dbResponseId) {
        return autotestError('missing property `dbResponseId` in autotest data', dbQuery, config)
    }
    // require data
    if (!data[dbQuery.dbResponseId]) {
        return autotestError('missing data for property `dbResponseId` with id '+dbQuery.dbResponseId, dbQuery, config)
    }
    // add data to automock
    automock.data.data = data[dbQuery.dbResponseId].data
    automock.data.info = data[dbQuery.dbResponseId].info
    // return automock data
    return automock
}