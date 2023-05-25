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
import { readFileSync } from 'fs';
import { PackageJson } from 'type-fest';
import { getDependencies } from '../utils/get-dependencies';

export const validateKeys = (packageJson: PackageJson, packageJsonPath: string) => {
  const dependencies = getDependencies(packageJson);
  Object.keys(dependencies).forEach(dependency => {
    const stringifiedPackageJson = readFileSync(packageJsonPath).toString();
    const regexMatches = stringifiedPackageJson.match(new RegExp(dependency, 'g'));
    if (regexMatches && regexMatches.length > 1) {
      core.setFailed(`Duplicate keys found in package.json: ${regexMatches}`);
    }
  });
};
