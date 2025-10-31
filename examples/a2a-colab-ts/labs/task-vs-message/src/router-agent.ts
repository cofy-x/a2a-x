/**
 * @license
 * Copyright 2025 cofy-x
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import type { ReactAgent } from 'langchain';
import { createAgent } from 'langchain';

export enum RouterActionType {
  NONE = 'NONE',
  BOOK_FLIGHT = 'BOOK_FLIGHT',
  BOOK_HOTEL = 'BOOK_HOTEL',
}

export const RouterOutputSchema = z.object({
  message: z
    .string()
    .describe('A user visible message based on the suggested next step'),
  next_step: z
    .nativeEnum(RouterActionType)
    .describe('The next step to take: NONE, BOOK_FLIGHT, or BOOK_HOTEL'),
  next_step_input: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Optional. Not needed if next step is NONE. Relevant info from user conversation required for the selected next step.',
    ),
});

export type RouterOutput = z.infer<typeof RouterOutputSchema>;

export class RouterAgent {
  private agent: ReactAgent<RouterOutput>;

  constructor() {
    const instruction = `You are an agent who responds to user queries on behalf of a booking company. The booking company can book flights, hotels & car rentals.

Based on user query, you need to suggest next step. Follow below guidelines to choose below next step:
- BOOK_FLIGHT: If the user shows intent to book a flight.
- BOOK_HOTEL: If the user shows intent to book a hotel.
- Otherwise the next step is NONE.

Your responses should be in JSON format matching the required schema.`;

    this.agent = createAgent({
      model: 'deepseek:deepseek-reasoner',
      tools: [],
      systemPrompt: instruction,
      responseFormat: RouterOutputSchema,
    });
  }

  async run(query: string): Promise<RouterOutput> {
    const result = await this.agent.invoke({
      messages: [{ role: 'user', content: query }],
    });

    return result.structuredResponse;
  }
}
