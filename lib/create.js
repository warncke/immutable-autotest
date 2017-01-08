'use strict'

/* native modules */
const fs = require('fs')
const zlib = require('zlib')

/* npm modules */
const _ = require('lodash')

/* application modules */
const automocksFromAutotest = require('./automocks-from-autotest')
const createAutotestSpec = require('./create-autotest-spec')
const loadConfig = require('./load-config')

module.exports = create

/**
 * @function create
 *
 * create autotest test and automock data file
 *
 * @param {string} file
 * @param {object} options
 *
 * @throws {Error}
 */
function create (file, options) {
    // load config from file in options or default
    var config = loadConfig(options)
    // load autotest data from file
    var autotest = JSON.parse( zlib.unzipSync( fs.readFileSync(file) ) )
    // build automock data from autotest data
    var automocks = automocksFromAutotest(autotest)
    // create autotest specification
    var autotestSpec = createAutotestSpec({
        automocks: automocks,
        autotest: autotest,
        config: config,
    })

}