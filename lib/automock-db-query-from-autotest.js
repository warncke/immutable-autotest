'use strict'

/* npm modules */
var _ = require('lodash')

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
 * @param {object} dbQuery
 * @param {object} data
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automockDbQueryFromAutotest (dbQuery, data) {
    // build automock
    var automock = {
        data: {
            dbQueryId: dbQuery.dbQueryId,
            moduleCallId: dbQuery.moduleCallId,
            requestId: dbQuery.requestId,
        },
        type: 'dbQuery',
    }
    // get data
    _.each(dataProperties, (automockName, autotestName) => {
        // require id in autotest data
        if (!dbQuery[autotestName]) {
            throw new Error('missing property `'+autotestName+'` in autotest data')
        }
        // get data id
        var dataId = dbQuery[autotestName]
        // require data
        if (!data[dataId]) {
            throw new Error('missing data for property `'+autotestName+'` with id '+dataId)
        }
        // set data for automock
        automock.data[automockName] = data[dataId]
    })
    // return automock data
    return automock
}