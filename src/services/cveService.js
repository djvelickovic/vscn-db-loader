const runner = require('../utils/runner')
const fs = require('fs').promises
const conn = require('../utils/conn')
const { CVE_COLLECTION } = require('../constants')

const path = require('path')
const { TMP_DIR, CVE_SCRIPT } = require('../utils/paths')

module.exports.loadCve = async (year, nvdPath, nvdMetadata) => {
  const finalCvePath = path.join(TMP_DIR, `/cve-${year}.json`)
  const output = await runner(CVE_SCRIPT, nvdPath, finalCvePath)

  console.log(`Extracted CVE. Output:\n${output}`)

  const rawCve = await fs.readFile(finalCvePath)
  const cves = JSON.parse(rawCve)

  const transformedCVEs = await transform(cves, year, nvdMetadata.sha256)

  const result = await conn.getDb()
    .collection(CVE_COLLECTION)
    .insertMany(transformedCVEs)

  console.log(`Inserted ${result.insertedCount} cves for the year ${year}`)
}


const transform = async (cves, year, sha256) => {
  cves.forEach(cve => {
    cve.sha256 = sha256
    cve.year = year
  })
  return cves
}