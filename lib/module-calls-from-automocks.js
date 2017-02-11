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
    })
    // test execute each module call
    return Promise.each(_.values(moduleCallsById), moduleCall => {
        // get method
        try {
            var method = immutable.method(moduleCall.moduleName+'.'+moduleCall.methodName)
        }
        catch (ex) {
            // create new error object
            var error = new Error(ex.message)
            // add module call data to error
            error.data = moduleCall
            // throw error
            throw error
        }
        // clone args to prevent data pollution
        var args = _.cloneDeep(moduleCall.args)
        // do not use automock for this call - all other calls will be mocked
        args.session.automock = false
        // throw error if automocks do not exist for any call
        args.session.requireAutomock = true
        try {
            return method(args)
            // check response data
            .then(res => {
                // console.log("zzzzzzzzzzzzzzzzz")
                // console.log(moduleCall.moduleName+'.'+moduleCall.methodName)
                // console.log("xxxxxxxxxxxxxxxxx")
                // console.log(res)
                // console.log("xxxxxxxxxxxxxxxxx")
                // console.log(moduleCall.resolveData)
                // console.log("yyyyyyyyyyyyyyyyy")
            })
            // catch errors
            .catch(err => {
                console.error(err)
                console.error(err.stack)
                // console.log(JSON.stringify(err.automockCallData, null, 4))
            })
        }
        catch (ex) {
            // create new error object
            var error = new Error(ex.message)
            // add module call data to error
            error.data = moduleCall
            // throw error
            throw error
        }
    })
    // catch errors
    .catch(err => {
        console.error(JSON.stringify(err, null, 4))
    })
}