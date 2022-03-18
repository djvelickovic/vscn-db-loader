require('dotenv').config()
const { loadCve } = require('./services/cveService')
const { loadMatchers } = require('./services/matchersService')
const { loadNvd, loadNvdMetadata } = require('./services/nvdService')
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

      const nvdPath = await loadNvd(year)
      const metadata = await loadNvdMetadata(year)
      await loadCve(year, nvdPath, metadata)
      await loadMatchers(year, nvdPath, metadata)
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

loadNvdMetadata(2022).then(result => console.log(result))

job()
  .then(() => console.log('Job is done.'))
  .catch(error => console.error(error))


