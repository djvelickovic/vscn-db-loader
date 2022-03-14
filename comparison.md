```
{
    "id": "CVE-2022-20046",
    "config": {
      "CVE_data_version": "4.0",
      "nodes": [
        {
          "operator": "AND",
          "children": [
            {
              "operator": "OR",
              "children": [],
              "cpe_match": [
                {
                  "vulnerable": true,
                  "cpe23Uri": "cpe:2.3:o:google:android:8.1:*:*:*:*:*:*:*",
                  "cpe_name": []
                },
                {
                  "vulnerable": true,
                  "cpe23Uri": "cpe:2.3:o:google:android:9.0:*:*:*:*:*:*:*",
                  "cpe_name": []
                }
              ]
            },
            {
              "operator": "OR",
              "children": [],
              "cpe_match": [
                {
                  "vulnerable": false,
                  "cpe23Uri": "cpe:2.3:h:mediatek:mt8167:-:*:*:*:*:*:*:*",
                  "cpe_name": []
                },
                {
                  "vulnerable": false,
                  "cpe23Uri": "cpe:2.3:h:mediatek:mt8175:-:*:*:*:*:*:*:*",
                  "cpe_name": []
                }
              ]
            }
          ],
          "cpe_match": []
        }
      ]
    }
  }
```

->

```
{
    "id": "CVE-2022-20046",
    "year": "2022",
    "config": {
      "products" : ["android", "mt8167"]
      "nodes": [
        {
          "operator": "AND",
          "children": [
            {
              "operator": "OR",
              "children": [],
              "cpe_match": [
                {
                  "vulnerable": true,
                  "type": "o",
                  "vendor": "google",
                  "product": "android",
                  "exactVersion" : "8.1",
                  "cpe23Uri": "cpe:2.3:o:google:android:8.1:*:*:*:*:*:*:*",
                },
                {
                  "vulnerable": true,
                  "type": "o",
                  "vendor": "google",
                  "product": "android",
                  "version" : "9.0",
                  "cpe23Uri": "cpe:2.3:o:google:android:9.0:*:*:*:*:*:*:*",
                }
              ]
            },
            {
              "operator": "OR",
              "children": [],
              "cpe_match": [
                {
                  "vulnerable": false,
                  "type": "h",
                  "vendor": "mediatek",
                  "product": "mt8167",
                  "version" : "-",
                  "cpe23Uri": "cpe:2.3:h:mediatek:mt8167:-:*:*:*:*:*:*:*",
                },
                {
                  "vulnerable": false,
                  "type": "h",
                  "vendor": "mediatek",
                  "product": "mt8175",
                  "version" : "-",
                  "cpe23Uri": "cpe:2.3:h:mediatek:mt8175:-:*:*:*:*:*:*:*",
                }
              ]
            }
          ],
          "cpe_match": []
        }
      ]
    }
  }
```