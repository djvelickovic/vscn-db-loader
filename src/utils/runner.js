const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async (scriptPath, ...args) => {
  const command = `${scriptPath} ${args.join(' ')}`
  console.log(`Executing command ${command}`)
  const { stdout, stderr } = await exec(command)
  if (stderr) {
    throw Error(`Failed to execute script ${scriptPath}. Error:\n${stderr}`)
  }
  return stdout
}
