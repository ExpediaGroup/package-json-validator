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

import * as core from '@actions/core'
import { RULES_MAP, run } from '../src/main';
import { readFileSync } from 'fs';
import { PackageJson } from 'type-fest';
import { validateVersionRanges } from '../src/rules/ranges';
import { validateVersionTags } from '../src/rules/tags';

jest.mock('@actions/core')
jest.mock('fs')
jest.mock('../src/rules/ranges')
jest.mock('../src/rules/tags')

const mockPackageJson = (packageJson: PackageJson) => {
  (readFileSync as jest.Mock).mockReturnValue(({
    toString: jest.fn(() => JSON.stringify(packageJson))
  }))
};

describe('main', () => {
  describe('version ranges case', () => {
    const packageJson = {
      name: 'my-package-json'
    };
    const rules = ['ranges', 'tags'];
    beforeEach(() => {
      mockPackageJson(packageJson);
      (core.getMultilineInput as jest.Mock).mockReturnValue(rules);
      run()
    })

    it('should call correct methods', () => {
      expect(validateVersionRanges).toHaveBeenCalledWith(packageJson, RULES_MAP.ranges.extraInputName)
      expect(validateVersionTags).toHaveBeenCalledWith(packageJson, RULES_MAP.tags.extraInputName)
    });
  })
})
