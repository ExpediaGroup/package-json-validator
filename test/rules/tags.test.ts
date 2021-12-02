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

import { dependencySatisfiesAllowedTags } from '../../src/rules/tags';
import * as core from '@actions/core';

jest.mock('@actions/core');

describe('dependencySatisfiesAllowedTags', () => {
  const packageName = 'some-package'
  const allowedTags = ['canary']

  describe('clean version case', () => {
    const version = '1.2.3'

    beforeEach(() => {
      dependencySatisfiesAllowedTags(packageName, version, allowedTags)
    })

    it('should return expected result', () => {
      expect(core.setFailed).not.toHaveBeenCalled();
    })
  })

  describe('caret version case', () => {
    const version = '^1.2.3'

    beforeEach(() => {
      dependencySatisfiesAllowedTags(packageName, version, allowedTags)
    })

    it('should return expected result', () => {
      expect(core.setFailed).not.toHaveBeenCalled();
    })
  })

  describe('canary tag case', () => {
    const version = '0.0.2-canary.323.0'

    beforeEach(() => {
      dependencySatisfiesAllowedTags(packageName, version, allowedTags)
    })

    it('should return expected result', () => {
      expect(core.setFailed).not.toHaveBeenCalled();
    })
  })

  describe('caret canary tag case', () => {
    const version = '^0.0.2-canary.323.0'

    beforeEach(() => {
      dependencySatisfiesAllowedTags(packageName, version, allowedTags)
    })

    it('should return expected result', () => {
      expect(core.setFailed).not.toHaveBeenCalled();
    })
  })

  describe('invalid tag case', () => {
    const version = '0.0.2-invalid.323.0'

    beforeEach(() => {
      dependencySatisfiesAllowedTags(packageName, version, allowedTags)
    })

    it('should call core setFailed', () => {
      expect(core.setFailed).toHaveBeenCalled()
    })

    it('should return expected result', () => {
      expect(core.setFailed).toHaveBeenCalled();
    })
  })
})
