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
import { readFileSync } from 'fs';
import { validateVersionRanges } from './rules/ranges';
import { validateVersionTags } from './rules/tags';

type GithubError = {
  status: number;
  message: string;
};

export const RULES_MAP: {
  [key: string]: {
    method: (packageJson: PackageJson, extraInputName: string) => void;
    extraInputName: string;
  };
} = {
  ranges: {
    method: validateVersionRanges,
    extraInputName: 'allowed-ranges'
  },
  tags: {
    method: validateVersionTags,
    extraInputName: 'allowed-tags'
  }
};

export const run = () => {
  try {
    const packageJson: PackageJson = JSON.parse(readFileSync('./package.json').toString());

    const rules = core.getMultilineInput('rules', { required: true });
    rules.forEach(rule => {
      const { method, extraInputName } = RULES_MAP[rule];
      method(packageJson, extraInputName);
    });
  } catch (error) {
    core.setFailed((error as GithubError).message);
  }
};

run();
