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
import { validateResolutions } from './rules/resolutions';
import { validateKeys } from './rules/keys';
import { validateAlphabetical } from './rules/alphabetical';

type GithubError = {
  status: number;
  message: string;
};

const pathToPackageJson = core.getInput('package-json-location') || './package.json';

export const RULES_MAP: {
  [key: string]: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    method: Function;
    extraInput?: string;
  };
} = {
  ranges: {
    method: validateVersionRanges,
    extraInput: 'allowed-ranges'
  },
  tags: {
    method: validateVersionTags,
    extraInput: 'allowed-tags'
  },
  resolutions: {
    method: validateResolutions
  },
  keys: {
    method: validateKeys,
    extraInput: pathToPackageJson
  },
  alphabetical: {
    method: validateAlphabetical
  }
};

export const run = () => {
  try {
    const packageJson: PackageJson = JSON.parse(readFileSync(pathToPackageJson).toString());

    const rules = core.getMultilineInput('rules', { required: true });
    rules.forEach(rule => {
      const { method, extraInput } = RULES_MAP[rule] ?? {};
      method?.(packageJson, extraInput);
    });
  } catch (error) {
    core.setFailed((error as GithubError).message);
  }
};

run();
