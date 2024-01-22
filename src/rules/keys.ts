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
import { getDependencies, getDependencyTypes } from '../utils/get-dependencies';

export const validateKeys = (packageJson: PackageJson, packageJsonPath: string) => {
  const dependencies = getDependencies(packageJson);
  const dependencyTypes = getDependencyTypes();
  const stringifiedPackageJson = readFileSync(packageJsonPath).toString();
  const stringifiedDependencyObjects = dependencyTypes.map(dependencyType =>
    getStringifiedPackageJsonObject(dependencyType, stringifiedPackageJson)
  );
  Object.keys(dependencies).forEach(dependency => {
    stringifiedDependencyObjects.forEach(stringifiedDependencyObject => {
      const regexMatches = stringifiedDependencyObject.match(new RegExp(`"${dependency}"`, 'g'));
      if (regexMatches && regexMatches.length > 1) {
        core.setFailed(`Duplicate keys found in package.json: ${regexMatches}`);
      }
    });
  });
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach(script => {
      const regexMatches = getStringifiedPackageJsonObject('scripts', stringifiedPackageJson).match(
        new RegExp(`"${script}"`, 'g')
      );
      if (regexMatches && regexMatches.length > 1) {
        core.setFailed(`Duplicate keys found in package.json: ${regexMatches}`);
      }
    });
  }
};

const getStringifiedPackageJsonObject = (field: string, stringifiedPackageJson: string) => {
  const startIndex = stringifiedPackageJson.indexOf(`"${field}"`);
  const endIndex = stringifiedPackageJson.indexOf('}', startIndex);
  return stringifiedPackageJson.substring(startIndex, endIndex + 1);
};
