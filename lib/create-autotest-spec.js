'use strict'

/* npm modules */
const _ = require('lodash')
const automock = require('immutable-automock')
const immutable = require('immutable-core')
const requireAll = require('require-all')

/* application modules */
const moduleCallsFromAutomocks = require('./module-calls-from-automocks')

/* public functions */
module.exports = createAutotestSpec

/**
 * @function createAutotestSpec
 *
 * test all method calls from autotest dump file and generate autotest spec
 * for methods that have deterministic return values and automocks for external
 * dependencies.
 * 
 * config options:
 *
 *
 * @param {object} args
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function createAutotestSpec (args) {
    var automocks = args.automocks
    var autotest = args.autotest
    var config = args.config
    // call require all for all of the require paths in config
    _.each(config.require, require => {
        var required = requireAll(require)
    })
    // load all automocks
    automock.loadMock(automocks)
    // get module calls from automock data
    return moduleCallsFromAutomocks(automocks, config).then(moduleCalls => {

    })
    // exit when done
    .finally(() => {
        process.exit()
    })
}

