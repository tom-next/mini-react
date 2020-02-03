const log = console.log.bind(console)

const isObject = o => Object.prototype.toString.call(o) === '[object Object]'

module.exports = {
    log,
    isObject,
}