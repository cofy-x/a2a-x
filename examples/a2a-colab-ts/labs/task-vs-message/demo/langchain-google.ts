/**
 * @license
 * Copyright 2025 cofy-x
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash-lite',
  maxOutputTokens: 2048,
});

// Batch and stream are also supported
const res = await model.invoke([
  [
    'human',
    'What would be a good company name for a company that makes colorful socks?',
  ],
]);

console.log(res);
