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

type Dependencies = keyof Pick<
  PackageJson,
  'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies'
>;

export const getDependencies = (packageJson: PackageJson): PackageJson.Dependency => {
  const dependencyTypes = core.getMultilineInput('dependency-types') as Dependencies[];
  const dependencies = dependencyTypes.reduce(
    (acc, dependencyType) => ({ ...acc, ...packageJson[dependencyType] }),
    {}
  );
  if (!Object.keys(dependencies).length) {
    core.setFailed('Dependencies in package.json are undefined.');
    throw new Error();
  }
  return dependencies;
};
