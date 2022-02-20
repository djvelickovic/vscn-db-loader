const fs = require('fs').promises
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async ({ url, zipName, fileName, finalName }) => {
    const { stdout, stderr } = await exec(`./scripts/prepare-nvd.sh ${url} ${zipName} ${fileName} ${finalName}`)
    console.log('stdout:\n', stdout)
    console.log('stderr:\n', stderr)
    const file = await fs.readFile(finalName)
    return JSON.parse(file)
}
