'use strict'

/* npm modules */
const _ = require('lodash')

/* application modules */
const automockDbQueryFromAutotest = require('./automock-db-query-from-autotest')
const automockDbResponseFromAutotest = require('./automock-db-response-from-autotest')
const automockModuleCallFromAutotest = require('./automock-module-call-from-autotest')
const automockModuleCallResolveFromAutotest = require('./automock-module-call-resolve-from-autotest')

module.exports = automocksFromAutotest

/**
 * @function automocksFromAutotest
 *
 * @param {object} autotest
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automocksFromAutotest (autotest) {
    // list of automocks
    var automocks = []
    // build automocks for db qeries
    _.each(autotest.dbQueries, dbQuery => {
        automocks.push(automockDbQueryFromAutotest(dbQuery, autotest.data))
        automocks.push(automockDbResponseFromAutotest(dbQuery, autotest.data))
    })
    // build automocks for module calls
    _.each(autotest.moduleCalls, moduleCall => {
        automocks.push(automockModuleCallFromAutotest(moduleCall, autotest.data))
        automocks.push(automockModuleCallResolveFromAutotest(moduleCall, autotest.data))
    })

    return automocks
}