/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { z } from '@genkit-ai/core';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { Genkit, genkit } from '../src/genkit.js';

function createTestFlow(ai: Genkit) {
  return ai.defineFlow(
    {
      name: 'testFlow',
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (input) => {
      return `bar ${input}`;
    }
  );
}

function createTestStreamingFlow(ai: Genkit) {
  return ai.defineStreamingFlow(
    {
      name: 'testFlow',
      inputSchema: z.number(),
      outputSchema: z.string(),
      streamSchema: z.object({ count: z.number() }),
    },
    async (input, streamingCallback) => {
      if (streamingCallback) {
        for (let i = 0; i < input; i++) {
          streamingCallback({ count: i });
        }
      }
      return `bar ${input} ${!!streamingCallback}`;
    }
  );
}

describe('flow', () => {
  let ai: Genkit;

  beforeEach(() => {
    // Skips starting reflection server.
    delete process.env.GENKIT_ENV;
    ai = genkit({});
  });

  describe('runFlow', () => {
    it('should run the flow', async () => {
      const testFlow = createTestFlow(ai);

      const result = await testFlow('foo');

      assert.equal(result, 'bar foo');
    });

    it('should rethrow the error', async () => {
      const testFlow = ai.defineFlow(
        {
          name: 'throwing',
          inputSchema: z.string(),
          outputSchema: z.string(),
        },
        async (input) => {
          throw new Error(`bad happened: ${input}`);
        }
      );

      await assert.rejects(() => testFlow('foo'), {
        name: 'Error',
        message: 'bad happened: foo',
      });
    });

    it('should validate input', async () => {
      const testFlow = ai.defineFlow(
        {
          name: 'validating',
          inputSchema: z.object({ foo: z.string(), bar: z.number() }),
          outputSchema: z.string(),
        },
        async (input) => {
          return `ok ${input}`;
        }
      );

      await assert.rejects(
        async () => await testFlow({ foo: 'foo', bar: 'bar' } as any),
        (err: Error) => {
          assert.strictEqual(err.name, 'ZodError');
          assert.equal(
            err.message.includes('Expected number, received string'),
            true
          );
          return true;
        }
      );
    });
  });

  describe('streamFlow', () => {
    it('should run the flow', async () => {
      const testFlow = createTestStreamingFlow(ai);

      const response = testFlow(3);

      const gotChunks: any[] = [];
      for await (const chunk of response.stream) {
        gotChunks.push(chunk);
      }

      assert.equal(await response.output, 'bar 3 true');
      assert.deepEqual(gotChunks, [{ count: 0 }, { count: 1 }, { count: 2 }]);
    });

    it('should rethrow the error', async () => {
      const testFlow = ai.defineStreamingFlow(
        {
          name: 'throwing',
          inputSchema: z.string(),
        },
        async (input) => {
          throw new Error(`stream bad happened: ${input}`);
        }
      );

      const response = testFlow('foo');
      await assert.rejects(() => response.output, {
        name: 'Error',
        message: 'stream bad happened: foo',
      });
    });
  });
});