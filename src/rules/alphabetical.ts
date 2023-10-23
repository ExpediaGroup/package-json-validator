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
import { getDependencyTypes } from '../utils/get-dependencies';

export const validateAlphabetical = (packageJson: PackageJson) => {
  const dependencyTypes = getDependencyTypes();
  dependencyTypes.forEach(dependencyType => {
    const dependencies = packageJson[dependencyType];
    if (!dependencies) {
      throw new Error(
        `${dependencyType} specified in dependency-types but missing in package.json`
      );
    }
    const sortedDependencies = Object.keys(dependencies).sort();
    const isSorted =
      JSON.stringify(Object.keys(dependencies)) === JSON.stringify(sortedDependencies);
    if (!isSorted) {
      core.setFailed(`${dependencyType} in package.json are not sorted alphabetically.`);
    }
  });
};
