require('dotenv').config()
const { loadCve } = require('./services/cveService')
const { loadMatchers } = require('./services/matchersService')
const { loadNvd, loadNvdMetadata } = require('./services/nvdService')
const { shouldInsertSnapshot, updateSnapshots } = require('./services/snapshotService')
const { connectToServer, disconnect } = require('./utils/conn')
const fs = require('fs')
const { TMP_DIR } = require('./utils/paths')

const normalizeYears = (years) => years.split(',').map(year => year.trim())
const years = normalizeYears(process.argv[2] || process.env.LOAD_YEARS)

console.log(`Loading CVEs for ${years}`)

const job = async () => {
  if (!years || years.length === 0) {
    return console.error('[ERROR] - Please specify years')
  }

  try {
    await connectToServer()

    for (const year of years) {
      const metadata = await loadNvdMetadata(year)
      const shouldInsert = await shouldInsertSnapshot(year, metadata)

      if (shouldInsert) {
        console.log(`Metadata for the year ${year} has changed since the last update. Proceeding with the update. SHA256: ${metadata.sha256}`)
        const nvdPath = await loadNvd(year)
        await loadCve(year, nvdPath, metadata)
        await loadMatchers(year, nvdPath, metadata)
        await updateSnapshots(year, metadata)
      } else {
        console.log(`Snapshot for the year: ${year}, with sha256 ${metadata.sha256} already inserted. Skipping insertion...`);
      }
    }
  } finally {
    await disconnect()
  }
}

const prepare = () => {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR)
  }
}

prepare()

job()
  .then(() => console.log('Job is done.'))
  .catch(error => console.error(error))


