require('dotenv').config()
const { downloadFile } = require('../utils/downloader')
const extract = require('extract-zip')
const path = require('path')
const { TMP_DIR } = require('../utils/paths')
const axios = require('axios').default

module.exports.loadNvd = async (year) => {
  const fileName = `nvdcve-1.1-${year}.json`
  const zipPath = path.join(TMP_DIR, `${fileName}.zip`)

  const url = buildNvdcveUrl(year)
  await downloadFile({ url: url, destination: zipPath })

  console.log(`Extracting ${zipPath}`)

  await extract(zipPath, { dir: TMP_DIR })
  return path.join(TMP_DIR, fileName)
}

module.exports.loadNvdMetadata = async (year) => {
  const response = await axios.get(buildNvdmetaUrl(year))
  const { data } = response

  return data.split(/\r\n|\n/).reduce((acc, curr) => {
    if (curr) {
      const [name, value] = curr.split(':')
      acc[name] = value
    }
    return acc
  }, {})
}

const buildNvdcveUrl = (year) => `https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${year}.json.zip`
const buildNvdmetaUrl = (year) => `https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-${year}.meta`
