'use strict'

/* npm modules */
const Promise = require('bluebird')
const _ = require('lodash')
const immutable = require('immutable-core')

/* public functions */
module.exports = moduleCallsFromAutomocks

/**
 * @function moduleCallsFromAutomocks
 *
 * extract and test all module calls from automock data
 *
 * @param {array} automocks
 * @param {object} config
 *
 * @returns {array}
 *
 * @throws {Error}
 */
function moduleCallsFromAutomocks (automocks, config) {
    // module calls and resolves indexed by moduleCallId
    var moduleCallsById = {}
    // combine module calls and resolves
    _.each(automocks, automock => {
        // skip automocks that are not module calls
        if (automock.type !== 'moduleCall' && automock.type !== 'moduleCallResolve') {
            return
        }
        // create entry for moduleCallId if it does not exist
        if (!moduleCallsById[automock.data.moduleCallId]) {
            moduleCallsById[automock.data.moduleCallId] = {}
        }
        // add call/resolve to entry
        moduleCallsById[automock.data.moduleCallId][automock.type] = automock.data
    })
    // check module calls for missing data and format data
    _.each(moduleCallsById, (moduleCall, moduleCallId) => {
        // module call should have both call and resolve
        if (!moduleCall.moduleCall || !moduleCall.moduleCallResolve) {
            // create new error object
            var error = new Error('missing data for module call '+moduleCallId)
            // add module call data to error
            error.data = moduleCall
            // throw error
            throw error
        }
        // format data to remove duplicate information
        moduleCall = moduleCallsById[moduleCallId] = {
            args: moduleCall.moduleCall.args,
            methodName: moduleCall.moduleCall.methodName,
            moduleCallId: moduleCallId,
            moduleName: moduleCall.moduleCall.moduleName,
            resolved: moduleCall.moduleCallResolve.resolved,
            resolveData: moduleCall.moduleCallResolve.moduleCallResolveData,
        }
        // test execute module call
        try {
            // get method
            var method = immutable.method(moduleCall.moduleName+'.'+moduleCall.methodName)
            // clone args to prevent pollution
            var args = _.cloneDeep(moduleCall.args)
        }
        catch (ex) {
            console.log(ex)
        }
    })
}