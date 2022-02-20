// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
// NODE_ENV=development node ./src/app.js,

const dotenv = require('dotenv')
const precheck = require('./precheck')
const load = require('./load')
const extract = require('./extract')

module.exports.NVD_YEAR = '2022'

dotenv.config()

const year = process.argv[2]

const NVD_FILE = `nvdcve-1.1-${year}.json`
const NVD_ZIP_FILE = `${NVD_FILE}.zip`
const NVD_FINAL = `nvdcve-1.1-${year}-final.json`
const NVD_META_URL = `https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${year}.meta`
const NVD_URL = `https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${year}.json.zip`

const uri = process.env.MONGODB_URI
const databaseName = process.env.MONGODB_DATABASE_NAME

const job = async () => {
    const result = await precheck(NVD_META_URL, year, { uri, databaseName })

    if (!result.success) return

    const data = await extract({ url: NVD_URL, zipName: NVD_ZIP_FILE, fileName: NVD_FILE, finalName: NVD_FINAL })

    await load(data, result.meta, { uri, databaseName })
}

job()
