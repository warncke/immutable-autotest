'use strict'

/* native modules */
const fs = require('fs')

/* npm modules */
const _ = require('lodash')
const JSON5 = require('json5')

// default require-all config
const defaultRequire = {
    dirname: '.',
    excludeDirs: /^(\.|.*test)/,
    filter: /js$/,
    recursive: true,
}

// default configuration settings
const defaultConfig = {
    require: [defaultRequire],
}
// default configuration file
const defaultConfigFile = 'autotest.conf'

/* public functions */
module.exports = loadConfig

/**
 * @function loadConfig
 *
 * load config 
 *
 * @param {object} options
 *
 * @returns {object}
 *
 * @throws {Error}
 */
function loadConfig (options) {
    // get config file from options or default
    var configFile = options.parent.config || defaultConfigFile
    // check if config file exists
    try {
        fs.statSync(configFile)
    }
    catch (ex) {
        if (!options.parent.silent) {
            console.log('loadConfig: '+ex.message+' - using default config')
        }
        // use default config if stat fails
        return defaultConfig
    }
    // use defaults for base config
    var config = _.cloneDeep(defaultConfig)
    // attempt to load and parse config file
    try {
        var loadedConfig = JSON5.parse( fs.readFileSync(configFile) )
    }
    catch (ex) {
        throw new Error('loadConfig error: '+ex.message)
    }
    // set defauls for require
    if (loadedConfig.require) {
        // require must be array
        if (!Array.isArray(loadedConfig.require)) {
            throw new Error('loadConfig error: require must be array but was '+typeof loadedConfig.require)
        }
        // values in require can be either a string path or an object
        // that will be passed to require-all
        loadedConfig.require = _.map(loadedConfig.require, (require) => {
            // if require is a string then assume it is dirName
            if (typeof require === 'string') {
                // capture value
                var dirname = require
                // create new require object from defaults
                require = _.cloneDeep(defaultRequire)
                // set dirName for require-all
                require.dirname = dirname
            }
            return require
        })
    }
    // merge loaded config values over defaults
    _.merge(config, loadedConfig)

    return config
}