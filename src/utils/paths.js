const path = require('path')

const ROOT_DIR = path.join(__dirname, '../../')
const TMP_DIR = path.join(process.cwd(), '/tmp')
const BIN_DIR = path.join(ROOT_DIR, '/bin')

module.exports.ROOT_DIR = ROOT_DIR
module.exports.TMP_DIR = TMP_DIR
module.exports.BIN_DIR = BIN_DIR
module.exports.CVE_SCRIPT = path.join(BIN_DIR, 'extract-cve.sh')
module.exports.MATCHERS_SCRIPT = path.join(BIN_DIR, 'extract-matchers.sh')