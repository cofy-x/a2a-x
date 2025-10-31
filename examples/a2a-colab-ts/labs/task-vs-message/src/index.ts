/**
 * @license
 * Copyright 2025 cofy-x
 * SPDX-License-Identifier: Apache-2.0
 */

import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import {
  type MessageSendParams,
  type Message,
  type TextPart,
} from '@a2a-js/sdk';
import { DefaultRequestHandler, InMemoryTaskStore } from '@a2a-js/sdk/server';
import { A2AExpressApp } from '@a2a-js/sdk/server/express';
import { BookingAgentExecutor } from './booking-agent-executor.js';
import type { AgentCard } from '@a2a-js/sdk';

const agentCard: AgentCard = {
  name: 'Booking Agent',
  version: '1.0.0',
  description: 'An agent that helps users book flights and hotels',
  protocolVersion: '1.0.0',
  url: 'http://localhost:41241',
  capabilities: {
    streaming: true,
  },
  defaultInputModes: ['text/plain'],
  defaultOutputModes: ['text/plain'],
  skills: [
    {
      id: 'booking',
      name: 'Booking',
      description: 'Book flights and hotels',
      tags: ['booking', 'travel'],
    },
  ],
};

const requestHandler = new DefaultRequestHandler(
  agentCard,
  new InMemoryTaskStore(),
  new BookingAgentExecutor(),
);

export async function sendMessage(query: string = 'hi'): Promise<void> {
  const taskId = undefined;
  const contextId = uuidv4();

  const userMessage: Message = {
    kind: 'message',
    role: 'user',
    parts: [
      {
        kind: 'text',
        text: query,
      } as TextPart,
    ],
    messageId: uuidv4(),
    taskId,
    contextId,
  };

  const params: MessageSendParams = {
    message: userMessage,
  };

  const responseStream = requestHandler.sendMessageStream(params);

  console.log('Response events:');
  for await (const event of responseStream) {
    console.log(JSON.stringify(event, null, 2));
  }
}

function extractPortFromUrl(url: string): number | undefined {
  try {
    const urlObj = new URL(url);
    const port = urlObj.port ? parseInt(urlObj.port, 10) : undefined;
    return port;
  } catch {
    return undefined;
  }
}

function startServer(): void {
  const appBuilder = new A2AExpressApp(requestHandler);
  const expressApp = appBuilder.setupRoutes(express());

  const port = extractPortFromUrl(agentCard.url) || 41241;
  expressApp.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
  });
}

// Demo usage - run if this file is executed directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('index.ts') ||
  process.argv[1]?.endsWith('index.js');

if (isMainModule) {
  const args = process.argv.slice(2);
  const isServerMode = args.includes('--server') || args.includes('server');

  if (isServerMode) {
    startServer();
  } else {
    console.log('Testing with "hey, could you help book my trip"');
    await sendMessage('hey, could you help book my trip');
    console.log('\n\nTesting with "book a flight from NY to SF"');
    await sendMessage('book a flight from NY to SF');
  }
}
