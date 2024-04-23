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
import { validateVersionRanges } from '../src/rules/ranges';
import { validateVersionTags } from '../src/rules/tags';
import { validateResolutions } from '../src/rules/resolutions';

jest.mock('@actions/core')
jest.mock('../src/rules/ranges')
jest.mock('../src/rules/tags')
jest.mock('../src/rules/resolutions')

const packageJson = {
  name: 'my-package-json'
};

jest.mock('fs', () => ({
  promises: {
    access: jest.fn()
  },
  readFileSync: jest.fn(() => ({
    toString: jest.fn(() => JSON.stringify(packageJson))
  }))
}));

describe('main', () => {
  describe('validates all rules', () => {
    const rules = ['ranges', 'tags', 'resolutions'];
    beforeEach(() => {
      (core.getMultilineInput as jest.Mock).mockReturnValue(rules);
      run()
    })

    it('should call correct methods', () => {
      expect(validateVersionRanges).toHaveBeenCalledWith(packageJson, RULES_MAP.ranges?.extraInput)
      expect(validateVersionTags).toHaveBeenCalledWith(packageJson, RULES_MAP.tags?.extraInput)
      expect(validateResolutions).toHaveBeenCalledWith(packageJson, undefined)
    });
  })
})
