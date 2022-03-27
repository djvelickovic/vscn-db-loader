# vscn-db-loader

Vulnerability Database Loader

## Introduction

Loader transforms and loads **NVD** data. Transformation is done in two steps (Matcher and CVE transformation)

### Requirements
Host machine must have `nodejs` and `jq` installed

## Matcher transformation

**First** step is to load matchers into the matcher collection. Matcher collection is used only for identifying whether
product (with version) is affected by vulnerabilities (and what exact CVEs)

### First `jq` transformation

```json
{
  "cve": {
    "data_type": "CVE",
    "data_format": "MITRE",
    "data_version": "4.0",
    "CVE_data_meta": {
      "ID": "CVE-2022-22947",
      "ASSIGNER": "security@vmware.com"
    },
    "problemtype": {
      "problemtype_data": [
        {
          "description": [
            {
              "lang": "en",
              "value": "CWE-94"
            }
          ]
        }
      ]
    },
    "references": {
      "reference_data": [
        {
          "url": "https://tanzu.vmware.com/security/cve-2022-22947",
          "name": "https://tanzu.vmware.com/security/cve-2022-22947",
          "refsource": "MISC",
          "tags": [
            "Mitigation",
            "Vendor Advisory"
          ]
        },
        {
          "url": "http://packetstormsecurity.com/files/166219/Spring-Cloud-Gateway-3.1.0-Remote-Code-Execution.html",
          "name": "http://packetstormsecurity.com/files/166219/Spring-Cloud-Gateway-3.1.0-Remote-Code-Execution.html",
          "refsource": "MISC",
          "tags": [
            "Exploit",
            "Third Party Advisory"
          ]
        }
      ]
    },
    "description": {
      "description_data": [
        {
          "lang": "en",
          "value": "In spring cloud gateway versions prior to 3.1.1+ and 3.0.7+ , applications are vulnerable to a code injection attack when the Gateway Actuator endpoint is enabled, exposed and unsecured. A remote attacker could make a maliciously crafted request that could allow arbitrary remote execution on the remote host."
        }
      ]
    }
  },
  "configurations": {
    "CVE_data_version": "4.0",
    "nodes": [
      {
        "operator": "OR",
        "children": [],
        "cpe_match": [
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:*:*:*:*:*:*:*:*",
            "versionEndExcluding": "3.0.7",
            "cpe_name": []
          },
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:3.1.0:*:*:*:*:*:*:*",
            "cpe_name": []
          }
        ]
      }
    ]
  },
  "impact": {
    "baseMetricV3": {
      "cvssV3": {
        "version": "3.1",
        "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        "attackVector": "NETWORK",
        "attackComplexity": "LOW",
        "privilegesRequired": "NONE",
        "userInteraction": "NONE",
        "scope": "CHANGED",
        "confidentialityImpact": "HIGH",
        "integrityImpact": "HIGH",
        "availabilityImpact": "HIGH",
        "baseScore": 10.0,
        "baseSeverity": "CRITICAL"
      },
      "exploitabilityScore": 3.9,
      "impactScore": 6.0
    },
    "baseMetricV2": {
      "cvssV2": {
        "version": "2.0",
        "vectorString": "AV:N/AC:M/Au:N/C:P/I:P/A:P",
        "accessVector": "NETWORK",
        "accessComplexity": "MEDIUM",
        "authentication": "NONE",
        "confidentialityImpact": "PARTIAL",
        "integrityImpact": "PARTIAL",
        "availabilityImpact": "PARTIAL",
        "baseScore": 6.8
      },
      "severity": "MEDIUM",
      "exploitabilityScore": 8.6,
      "impactScore": 6.4,
      "acInsufInfo": false,
      "obtainAllPrivilege": false,
      "obtainUserPrivilege": false,
      "obtainOtherPrivilege": false,
      "userInteractionRequired": false
    }
  },
  "publishedDate": "2022-03-03T22:15Z",
  "lastModifiedDate": "2022-03-17T16:47Z"
}
```

Is transformed into:

```json
{
  "id": "CVE-2022-22947",
  "config": {
    "CVE_data_version": "4.0",
    "nodes": [
      {
        "operator": "OR",
        "children": [],
        "cpe_match": [
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:*:*:*:*:*:*:*:*",
            "versionEndExcluding": "3.0.7",
            "cpe_name": []
          },
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:3.1.0:*:*:*:*:*:*:*",
            "cpe_name": []
          }
        ]
      }
    ]
  }
}
```

`nodejs` transformation

```json
{
  "id": "CVE-2022-22947",
  "products": [
    "spring_cloud_gateway"
  ],
  "vendors": [
    "vmware"
  ],
  "sha256": "87D89D5C410190ED49A99E31B3ED2846E4E84DCE6645C6C45612D67312A21BD7",
  "year": "2022",
  "config": {
    "CVE_data_version": "4.0",
    "nodes": [
      {
        "operator": "OR",
        "children": [],
        "cpe_match": [
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:*:*:*:*:*:*:*:*",
            "versionEndExcluding": "3.0.7",
            "cpe_name": [],
            "type": "a",
            "vendor": "vmware",
            "product": "spring_cloud_gateway",
            "exactVersion": null,
            "update": null,
            "target": null
          },
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:3.1.0:*:*:*:*:*:*:*",
            "cpe_name": [],
            "type": "a",
            "vendor": "vmware",
            "product": "spring_cloud_gateway",
            "exactVersion": "3.1.0",
            "update": null,
            "target": null
          }
        ]
      }
    ]
  }
}
```

## CVE transformation

```json
{
  "cve": {
    "data_type": "CVE",
    "data_format": "MITRE",
    "data_version": "4.0",
    "CVE_data_meta": {
      "ID": "CVE-2022-22947",
      "ASSIGNER": "security@vmware.com"
    },
    "problemtype": {
      "problemtype_data": [
        {
          "description": [
            {
              "lang": "en",
              "value": "CWE-94"
            }
          ]
        }
      ]
    },
    "references": {
      "reference_data": [
        {
          "url": "https://tanzu.vmware.com/security/cve-2022-22947",
          "name": "https://tanzu.vmware.com/security/cve-2022-22947",
          "refsource": "MISC",
          "tags": [
            "Mitigation",
            "Vendor Advisory"
          ]
        },
        {
          "url": "http://packetstormsecurity.com/files/166219/Spring-Cloud-Gateway-3.1.0-Remote-Code-Execution.html",
          "name": "http://packetstormsecurity.com/files/166219/Spring-Cloud-Gateway-3.1.0-Remote-Code-Execution.html",
          "refsource": "MISC",
          "tags": [
            "Exploit",
            "Third Party Advisory"
          ]
        }
      ]
    },
    "description": {
      "description_data": [
        {
          "lang": "en",
          "value": "In spring cloud gateway versions prior to 3.1.1+ and 3.0.7+ , applications are vulnerable to a code injection attack when the Gateway Actuator endpoint is enabled, exposed and unsecured. A remote attacker could make a maliciously crafted request that could allow arbitrary remote execution on the remote host."
        }
      ]
    }
  },
  "configurations": {
    "CVE_data_version": "4.0",
    "nodes": [
      {
        "operator": "OR",
        "children": [],
        "cpe_match": [
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:*:*:*:*:*:*:*:*",
            "versionEndExcluding": "3.0.7",
            "cpe_name": []
          },
          {
            "vulnerable": true,
            "cpe23Uri": "cpe:2.3:a:vmware:spring_cloud_gateway:3.1.0:*:*:*:*:*:*:*",
            "cpe_name": []
          }
        ]
      }
    ]
  },
  "impact": {
    "baseMetricV3": {
      "cvssV3": {
        "version": "3.1",
        "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        "attackVector": "NETWORK",
        "attackComplexity": "LOW",
        "privilegesRequired": "NONE",
        "userInteraction": "NONE",
        "scope": "CHANGED",
        "confidentialityImpact": "HIGH",
        "integrityImpact": "HIGH",
        "availabilityImpact": "HIGH",
        "baseScore": 10.0,
        "baseSeverity": "CRITICAL"
      },
      "exploitabilityScore": 3.9,
      "impactScore": 6.0
    },
    "baseMetricV2": {
      "cvssV2": {
        "version": "2.0",
        "vectorString": "AV:N/AC:M/Au:N/C:P/I:P/A:P",
        "accessVector": "NETWORK",
        "accessComplexity": "MEDIUM",
        "authentication": "NONE",
        "confidentialityImpact": "PARTIAL",
        "integrityImpact": "PARTIAL",
        "availabilityImpact": "PARTIAL",
        "baseScore": 6.8
      },
      "severity": "MEDIUM",
      "exploitabilityScore": 8.6,
      "impactScore": 6.4,
      "acInsufInfo": false,
      "obtainAllPrivilege": false,
      "obtainUserPrivilege": false,
      "obtainOtherPrivilege": false,
      "userInteractionRequired": false
    }
  },
  "publishedDate": "2022-03-03T22:15Z",
  "lastModifiedDate": "2022-03-17T16:47Z"
}
```
is transformed into:

```json
{
  "id": "CVE-2022-22947",
  "ref": [
    "https://tanzu.vmware.com/security/cve-2022-22947",
    "http://packetstormsecurity.com/files/166219/Spring-Cloud-Gateway-3.1.0-Remote-Code-Execution.html"
  ],
  "desc": "In spring cloud gateway versions prior to 3.1.1+ and 3.0.7+ , applications are vulnerable to a code injection attack when the Gateway Actuator endpoint is enabled, exposed and unsecured. A remote attacker could make a maliciously crafted request that could allow arbitrary remote execution on the remote host.",
  "severity": "MEDIUM",
  "published": "2022-03-03T22:15Z",
  "lastModified": "2022-03-17T16:47Z"
}
```

and `nodejs` processed into (added sha256 and year):

```json
{
  "id": "CVE-2022-22947",
  "sha256": "87D89D5C410190ED49A99E31B3ED2846E4E84DCE6645C6C45612D67312A21BD7",
  "year": "2022",
  "ref": [
    "https://tanzu.vmware.com/security/cve-2022-22947",
    "http://packetstormsecurity.com/files/166219/Spring-Cloud-Gateway-3.1.0-Remote-Code-Execution.html"
  ],
  "desc": "In spring cloud gateway versions prior to 3.1.1+ and 3.0.7+ , applications are vulnerable to a code injection attack when the Gateway Actuator endpoint is enabled, exposed and unsecured. A remote attacker could make a maliciously crafted request that could allow arbitrary remote execution on the remote host.",
  "severity": "MEDIUM",
  "published": "2022-03-03T22:15Z",
  "lastModified": "2022-03-17T16:47Z"
}
```


## Search

**product** array in the **matcher** collection is indexed. It means that search by
any of the array items is very fast. First all related cves are loaded into the application
and then non-related ones are filtered out. 

## Refreshing data
There is **snapshot** collection that stores **sha256** and **year** for all 
yearly packages. When job is run for the specific year, it compares NVD sha256 
with one stored in the **snapshot** collection. If they do not match, NVD is loaded
and all old matchers and CVEs for required year are removed.


Running job:
```shell
npm start 2018,2019,2020,2021,2022
```

## Configuration
Specify `.env` file
```shell
MONGODB_URI="<<mongouri>>"
MONGODB_DATABASE_NAME="vscn"
LOAD_YEARS=2022 #Optional. Command args have priority
```