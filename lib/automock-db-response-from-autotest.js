'use strict'

/* npm modules */
var _ = require('lodash')

module.exports = automockDbResponseFromAutotest

/**
 * @function automockDbResponseFromAutotest
 *
 * @param {object} dbQuery
 * @param {object} data
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automockDbResponseFromAutotest (dbQuery, data) {
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
        throw new Error('missing property `dbResponseId` in autotest data')
    }
    // require data
    if (!data[dbQuery.dbResponseId]) {
        throw new Error('missing data for property `dbResponseId` with id '+dbQuery.dbResponseId)
    }
    // add data to automock
    automock.data.data = data[dbQuery.dbResponseId].data
    automock.data.info = data[dbQuery.dbResponseId].info
    // return automock data
    return automock
}