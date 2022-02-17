const axios = require('axios').default
const fs = require('fs').promises

exports.fetchData = (url, fileName = 'database.zip') => {
    return axios
        .get(url, {
            responseType: 'stream',
        })
        .then((response) => fs.writeFile(fileName, response.data))
        .catch((error) => console.log(error))
        .then(() => fileName)
}
