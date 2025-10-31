/**
 * @license
 * Copyright 2025 cofy-x
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Message, Part, TaskState } from '@a2a-js/sdk';
import type { ExecutionEventBus } from '@a2a-js/sdk/server';
import { v4 as uuidv4 } from 'uuid';

export class TaskUpdater {
  private eventBus: ExecutionEventBus;
  private taskId: string;
  private contextId: string;

  constructor(eventBus: ExecutionEventBus, taskId: string, contextId: string) {
    this.eventBus = eventBus;
    this.taskId = taskId;
    this.contextId = contextId;
  }

  async updateStatus(state: TaskState, message?: Message): Promise<void> {
    this.eventBus.publish({
      kind: 'status-update',
      taskId: this.taskId,
      contextId: this.contextId,
      final: false,
      status: {
        state,
        message,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async addArtifact(parts: Part[], name: string): Promise<void> {
    this.eventBus.publish({
      kind: 'artifact-update',
      taskId: this.taskId,
      contextId: this.contextId,
      artifact: {
        artifactId: uuidv4(),
        name,
        parts,
      },
    });
  }

  async complete(): Promise<void> {
    this.eventBus.publish({
      kind: 'status-update',
      taskId: this.taskId,
      contextId: this.contextId,
      final: true,
      status: {
        state: 'completed',
        timestamp: new Date().toISOString(),
      },
    });
    this.eventBus.finished();
  }
}
