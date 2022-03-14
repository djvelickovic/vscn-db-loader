const runner = require('../utils/runner')
const fs = require('fs').promises
const conn = require('../utils/conn')
const { CVE_COLLECTION } = require('../constants')

const path = require('path')
const { TMP_DIR, CVE_SCRIPT } = require('../utils/paths')

module.exports.loadCve = async (year, nvdPath) => {
  const finalCvePath = path.join(TMP_DIR, `/cve-${year}.json`)
  const output = await runner(CVE_SCRIPT, nvdPath, finalCvePath)

  console.log(`Extracted CVE. Output:\n${output}`)

  const rawCve = await fs.readFile(finalCvePath)
  const parsedCve = JSON.parse(rawCve)

  const result = await conn.getDb()
    .collection(CVE_COLLECTION)
    .insertMany(parsedCve)

  console.log(`Inserted ${result.insertedCount} cves for the year ${year}`)
}