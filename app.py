from pymongo import MongoClient
from dotenv import dotenv_values
import sys
from os.path import exists
import os
from vscnl.const import TMP_DIR
from vscnl.nvd import load_nvd


def normalize_years(years: str):
    return list(map(lambda y: y.strip(), years.split(',')))


years = normalize_years(sys.argv[1])

print(years)

config = dotenv_values('.env')
mongo_db_url = config['MONGO_DB_URL']

client = MongoClient(mongo_db_url)
client.get_database('vscn-test')


def load_nvd_metadata(year):
    return {}


def should_insert(year, metadata) -> bool:
    return True


def load_cve(year, nvd_path, metadata):
    pass


def load_matchers(year, nvd_path, metadata):
    pass


def update_snapshots(year, metadata):
    pass


if not exists(TMP_DIR):
    os.mkdir(TMP_DIR)


for year in years:
    metadata = load_nvd_metadata(year)
    insert = should_insert(year, metadata)
    if insert:
        print(
            f'Metadata for the year {year} has changed since the last update. Proceeding with the update. SHA256: {metadata.get("sha256")}')
        nvd_path = load_nvd(year)
        load_cve(year, nvd_path, metadata)
        load_matchers(year, nvd_path, metadata)
        update_snapshots(year, metadata)
    else:
        print(
            f'Snapshot for the year: {year}, with sha256 {metadata.get("sha256")} already inserted. Skipping insertion...')

client.close()
