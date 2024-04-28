/*
Copyright 2021 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as core from '@actions/core';
import { PackageJson } from 'type-fest';

export const validateResolutions = (packageJson: PackageJson) => {
  const ignoredResolutions = core.getMultilineInput('ignore-resolutions');

  const skipIgnoreResolutions =
    !Array.isArray(ignoredResolutions) || ignoredResolutions.length === 0;
  if (packageJson.resolutions && skipIgnoreResolutions) {
    core.setFailed(
      'Resolutions may not be set. Please investigate the root cause of your dependency issues!'
    );
  }

  if (packageJson.resolutions && Array.isArray(ignoredResolutions)) {
    const resolutions = Object.keys(packageJson.resolutions);

    const isMatching = resolutions.every(resolution => ignoredResolutions.includes(resolution));
    if (!isMatching) {
      core.setFailed(
        'Resolutions contain packages not included in "ignore-resolutions". Please investigate the root cause of your dependency issues!'
      );
    }
  }
};
