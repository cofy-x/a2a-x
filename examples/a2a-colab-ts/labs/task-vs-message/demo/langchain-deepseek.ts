/**
 * @license
 * Copyright 2025 cofy-x
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatDeepSeek } from '@langchain/deepseek';

const llm = new ChatDeepSeek({
  model: 'deepseek-reasoner',
  temperature: 0,
  // other params...
});

const aiMsg = await llm.invoke([
  [
    'system',
    'You are a helpful assistant that translates English to French. Translate the user sentence.',
  ],
  ['human', 'I love programming.'],
]);

console.log(aiMsg);
