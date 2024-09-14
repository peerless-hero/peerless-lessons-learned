---
title: Implementing Hot Update Functionality for Uniapp Using Object Storage Services
description: No need to write separate backend code; leverage the interaction of object storage services to achieve hot update functionality for Uniapp.
category:
  - DevGuide
tags:
  - uniapp
pubDate: 2024-09-12
cover: https://images.unsplash.com/photo-1516557070061-c3d1653fa646??w=1960&h=1102&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2t8ZW58MHwwfDB8fHwy
coverAlt: uniapp
author: peerless_hero
---
## The Concept of Hot Update

Hot update refers to the ability to update the application's functionality, resources, interface, etc., without stopping the application.

## Advantages of Hot Update

1. **Saves bandwidth**: The size of the update package is usually much smaller than that of the client resource files, thus saving bandwidth.
2. **Quick updates**: If a full package update method is used, each release must be submitted for app store review, which takes time, and some urgent bug issues may not be resolved in a timely manner.

## Preparations

1. **Object Storage Service**:
   - Such as Alibaba Cloud's OSS, Tencent Cloud's COS, Baidu Cloud's BOS, etc.
   - You need to open the object storage service and create a storage space.

2. **A uniapp Project**:
   Prepare a uniapp project and complete the basic development.

## Special Reminder

- You need to change the version number configuration **versionName** in the manifest.json file.
- If you modify configurations in the manifest.json file other than **versionName**, it will change the SDK base and cause compatibility issues for hot updates. In this case, please use the full package update method to update the APP.

## Core Points

Utilize the OSS head request to obtain version information of the wgt hot update package, and based on business logic, decide whether to prompt the user to update.

## Implementation Steps

1. Create the wgt hot update package in two ways:
   - HbuildX: HBuilderX is the official IDE for uniapp, which can package uniapp projects into installation packages.
   - Use CLI to run `npm run build:app`, and use zip to compress all files in **dist/build/app** into a file with the suffix **.wgt**.

2. Upload the wgt hot update package to the object storage service, set it to public read-only, and add Meta information based on the version number. For example, if the new version **versionName** is **1.1.0** and **versionCode** is **100**, you can add Meta information as follows: **x-oss-meta-version-name: 1.1.0**, **x-oss-meta-version-code: 100**.

3. Set path rules to adjust this file to public read-only; determine the URL accessible for direct download based on the upload region and storage path.

4. In the uniapp project, configure the hot update functionality:
   - When the APP starts or during manual update checks, initiate a head request to the URL obtained in step 3. You can obtain the latest APP version number from the response headers' Meta information and decide whether to prompt the user to update based on your judgment logic.
   - If you decide to update, download the wgt hot update package and install it. After a successful installation, remind the user to restart the application.
   - If the installation fails, prompt the user to reinstall.

5. Use cloud packaging or offline packaging methods to package the uniapp project into installation packages (apk or ipa).

## Why Design the Above Steps?

- Most application updates do not require user login; it is sufficient to obtain the latest version number of the application for self-judgment. OSS's head requests can easily retrieve this.
- The construction in step 1 and uploading in step 2 are very similar to regular frontend project construction and release processes, which can be completed using common CI tools (such as Jenkins, Gitlab CI).
- Based on an automated CI process, version releases can be controlled, saving time on manual operations.
