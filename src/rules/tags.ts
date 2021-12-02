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
import { validateDependencies } from '../utils/validateDependencies';

export const validateVersionTags = (packageJson: PackageJson, extraInputName: string) => {
  validateDependencies(dependencySatisfiesAllowedTags, packageJson, extraInputName);
};

export const dependencySatisfiesAllowedTags = (
  packageName: string,
  version: string,
  allowedTags: string[]
) => {
  const versionContainsTag = new RegExp(/[a-zA-Z]/g).test(version);
  const versionIsValid = !versionContainsTag || allowedTags.some(tag => version.includes(tag));
  if (!versionIsValid) {
    core.setFailed(`Dependency "${packageName}": "${version}" has an invalid tag.`);
  }
};
