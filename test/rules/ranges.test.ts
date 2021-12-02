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

import { dependencySatisfiesAllowedRanges } from '../../src/rules/ranges';
import * as core from '@actions/core';

jest.mock('@actions/core');

describe('dependencySatisfiesAllowedRanges', () => {
  const packageName = 'some-package'

  describe('no allowed version ranges case', () => {
    const allowedVersionRanges: string[] = []

    describe('exact version case', () => {
      const version = '1.2.3'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should call core info', () => {
        expect(core.setFailed).not.toHaveBeenCalled();
      })
    })

    describe('caret version case', () => {
      const version = '^1.2.3'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should return expected result', () => {
        expect(core.setFailed).toHaveBeenCalled();
      })
    })

    describe('canary version case', () => {
      const version = '0.0.2-canary.323.0'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should return expected result', () => {
        expect(core.setFailed).not.toHaveBeenCalled();
      })
    })
  })

  describe('some allowed version ranges case', () => {
    const allowedVersionRanges = ['^', '>=', '*']

    describe('exact version case', () => {
      const version = '1.2.3'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should return expected result', () => {
        expect(core.setFailed).not.toHaveBeenCalled();
      })
    })

    describe('caret version case', () => {
      const version = '^1.2.3'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should return expected result', () => {
        expect(core.setFailed).not.toHaveBeenCalled();
      })
    })

    describe('>= version case', () => {
      const version = '>=1.2.3'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should return expected result', () => {
        expect(core.setFailed).not.toHaveBeenCalled();
      })
    })

    describe('tilde version case', () => {
      const version = '~1.2.3'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should call core setFailed', () => {
        expect(core.setFailed).toHaveBeenCalled()
      })
    })

    describe('star version case', () => {
      const version = '*'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should not call core setFailed', () => {
        expect(core.setFailed).not.toHaveBeenCalled()
      })
    })

    describe('canary version case', () => {
      const version = '0.0.2-canary.323.0'

      beforeEach(() => {
        dependencySatisfiesAllowedRanges(packageName, version, allowedVersionRanges)
      })

      it('should return expected result', () => {
        expect(core.setFailed).not.toHaveBeenCalled();
      })
    })
  })
})
