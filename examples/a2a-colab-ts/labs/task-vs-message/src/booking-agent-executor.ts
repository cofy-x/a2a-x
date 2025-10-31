/**
 * @license
 * Copyright 2025 cofy-x
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Message, Task } from '@a2a-js/sdk';
import type {
  AgentExecutor,
  RequestContext,
  ExecutionEventBus,
} from '@a2a-js/sdk/server';
import { RouterAgent, RouterActionType } from './router-agent.js';
import { newAgentTextMessage, newTask, createTextPart } from './utils.js';
import { TaskUpdater } from './task-updater.js';

export class BookingAgentExecutor implements AgentExecutor {
  private routerAgent: RouterAgent;

  constructor() {
    this.routerAgent = new RouterAgent();
  }

  async execute(
    context: RequestContext,
    eventBus: ExecutionEventBus,
  ): Promise<void> {
    const userMessage = context.userMessage;
    const query = this.extractUserInput(userMessage);
    const task = context.task;

    const routerOutput = await this.routerAgent.run(query);

    if (routerOutput.next_step === RouterActionType.NONE) {
      const agentMessage = newAgentTextMessage(
        routerOutput.message,
        context.contextId,
      );
      eventBus.publish(agentMessage);
      eventBus.finished();
      return;
    }

    // Time to create a task.
    let currentTask: Task;
    if (!task) {
      currentTask = newTask(userMessage);
      eventBus.publish(currentTask);
    } else {
      currentTask = task;
    }

    const updater = new TaskUpdater(
      eventBus,
      currentTask.id,
      currentTask.contextId,
    );

    await updater.updateStatus(
      'working',
      newAgentTextMessage(routerOutput.message, context.contextId),
    );

    let bookingResponse = '';

    if (routerOutput.next_step === RouterActionType.BOOK_FLIGHT) {
      bookingResponse = await this.bookFlight();
    } else if (routerOutput.next_step === RouterActionType.BOOK_HOTEL) {
      bookingResponse = await this.bookHotel();
    }

    await updater.addArtifact([createTextPart(bookingResponse)], 'Booking ID');
    await updater.complete();
  }

  async cancelTask(
    _taskId: string,
    _eventBus: ExecutionEventBus,
  ): Promise<void> {
    throw new Error('BookingAgentExecutor does not support cancel operation.');
  }

  private extractUserInput(message: Message): string {
    if (message.parts && message.parts.length > 0) {
      const textParts = message.parts.filter((p) => p.kind === 'text');
      if (textParts.length > 0) {
        return textParts.map((p) => p.text).join('\n');
      }
    }
    return '';
  }

  private async bookFlight(): Promise<string> {
    return 'PNR: FY1234';
  }

  private async bookHotel(): Promise<string> {
    return 'Hotel Reference No: H789';
  }
}
