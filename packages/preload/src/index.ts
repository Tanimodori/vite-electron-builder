/**
 * @module preload
 */

const semver = require('semver');

console.log(semver.satisfies('4.2.4', '>= 4.0.0'));

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
