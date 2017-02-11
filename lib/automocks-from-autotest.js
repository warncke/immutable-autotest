'use strict'

/* npm modules */
const _ = require('lodash')

/* application modules */
const automockDbQueryFromAutotest = require('./automock-db-query-from-autotest')
const automockDbResponseFromAutotest = require('./automock-db-response-from-autotest')
const automockModuleCallFromAutotest = require('./automock-module-call-from-autotest')
const automockModuleCallResolveFromAutotest = require('./automock-module-call-resolve-from-autotest')
const autotestError = require('./autotest-error')

module.exports = automocksFromAutotest

/**
 * @function automocksFromAutotest
 *
 * @param {object} args
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function automocksFromAutotest (args) {
    var autotest = args.autotest
    var config = args.config
    // list of automocks
    var automocks = []
    // module calls indexed by module call id
    var moduleCallsById = _.keyBy(autotest.moduleCalls, 'moduleCallId')
    // build automocks for db qeries
    _.each(autotest.dbQueries, dbQuery => {
        // get module call data for db query
        var moduleCall = moduleCallsById[dbQuery.moduleCallId]
        // require module call for db query
        if (!moduleCall) {
            return autotestError('missing moduleCall '+dbQuery.moduleCallId+' for dbQuery '+dbQuery.dbQueryId, dbQuery, config)
        }
        // get args for module call
        var args = autotest.data[moduleCall.argsId]
        // require args for module call
        if (!args) {
            return autotestError('missing args '+moduleCall.argsId+' for moduleCall '+dbQuery.moduleCallId+' for dbQuery '+dbQuery.dbQueryId, dbQuery, config)
        }
        // add module call data to db query data
        dbQuery.moduleCallSignature = moduleCall.moduleName+'.'+(moduleCall.methodName || moduleCall.functionName)
        dbQuery.stack = _.clone(args.session && args.session.stack || [])
        // add call signature to module call stack because the db query stack
        // is from the perspective of having been called by the module method
        dbQuery.stack.push(dbQuery.moduleCallSignature)
        // create automock for db query
        automocks.push(automockDbQueryFromAutotest({
            config: config,
            data: autotest.data,
            dbQuery: dbQuery,
        }))
        // create automock for db response
        automocks.push(automockDbResponseFromAutotest({
            config: config,
            data: autotest.data,
            dbQuery: dbQuery,
        }))
    })
    // build automocks for module calls
    _.each(autotest.moduleCalls, moduleCall => {
        automocks.push(automockModuleCallFromAutotest(moduleCall, autotest.data))
        automocks.push(automockModuleCallResolveFromAutotest(moduleCall, autotest.data))
    })

    return automocks
}