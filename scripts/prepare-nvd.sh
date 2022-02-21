echo ">>> Downloading $1"

curl --no-progress-meter $1 --output $2

echo ">>> Extracting $2"

unzip -oq $2

echo ">>> Transforming $3"

jq '[ .CVE_Items[] | select((.configurations.nodes | length > 0) and (.configurations.nodes[0].operator != "AND") and (.cve.description.description_data | length > 0)) | { 
    id: .cve.CVE_data_meta.ID, 
    ref: [ .cve.references.reference_data[] | .url ] , 
    desc: .cve.description.description_data[0].value,
    publishedDate: .publishedDate,
    lastModifiedDate: .lastModifiedDate, 
    config: [.configurations.nodes[0].cpe_match[] | {
            cpe: split(":") | { type: .[2], vendor: .[3], product: .[4], target: .[9] },
            target: .cpe23Uri | split(":") | .[9],
            update: .cpe23Uri | split(":") | .[6],
            exactVersion: .cpe23Uri | split(":") | .[5], 
            versionEndExcluding: .versionEndExcluding,
            versionEndIncluding: .versionEndIncluding,
            versionStartExcluding: .versionStartExcluding,
            versionStartIncluding: .versionStartIncluding
            }]
        } 
    }]' $3 | jq '[.[] | select(.config.type == "a") | .config.versions = [.config.versions[] |  with_entries(select( (.value != null) and (.value != "-") and (.value != "*") )) ]]' > $4

echo "[DONE] Download, extraction and transformation done"



