/**
 * @license
 * Copyright 2025 cofy-x
 * SPDX-License-Identifier: Apache-2.0
 */

import { v4 as uuidv4 } from 'uuid';
import type { Message, Task, Part, TextPart } from '@a2a-js/sdk';

export function newAgentTextMessage(text: string, contextId: string): Message {
  return {
    kind: 'message',
    messageId: uuidv4(),
    role: 'agent',
    parts: [
      {
        kind: 'text',
        text,
      } as TextPart,
    ],
    contextId,
  };
}

export function newTask(message: Message): Task {
  return {
    kind: 'task',
    id: uuidv4(),
    contextId: message.contextId || uuidv4(),
    status: {
      state: 'submitted',
    },
    history: [message],
  };
}

export function createTextPart(text: string): Part {
  return {
    kind: 'text',
    text,
  } as TextPart;
}
