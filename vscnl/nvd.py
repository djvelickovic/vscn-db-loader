
from vscnl.const import TMP_DIR
from urllib import request
import zipfile


def nvd_cve_url(year):
    return f'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-{year}.json.zip'


def nvd_meta_url(year):
    return f'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-{year}.meta'


def load_nvd(year):
    file_name = f'nvdcve-1.1-{year}.json'
    zip_path = f'{TMP_DIR}/{file_name}.zip'
    url = nvd_cve_url(year)
    download_file(url, zip_path)

    print(f'Extracting {zip_path}')

    extract_zip(zip_path, TMP_DIR)

    return f'{TMP_DIR}{file_name}'


def download_file(url, destination):
    print(f'loading nvd file from {url}')
    request.urlretrieve(url, destination)


def extract_zip(zip_path, destination_dir):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(destination_dir)
