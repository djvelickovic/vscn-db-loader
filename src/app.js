// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
// NODE_ENV=development node ./src/app.js,

const dotenv = require('dotenv')
const { extract } = require('./extract/extract')
const { fetchData } = require('./fetch')

dotenv.config()

const args = process.argv.slice(2)
const nvdUrl = args[0] || process.env.NVD_URL
const nvdMetaUrl = args[1] || process.env.NVD_META_URL
const extractTargetDir = args[3] || process.env.EXTRACT_TARGET_DIR

console.log(nvdUrl)
console.log(nvdMetaUrl)

extract(nvdUrl, extractTargetDir)
