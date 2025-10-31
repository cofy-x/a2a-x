# Task vs Message

This example demonstrates how to use a2a-js and LangChain 1.0 to implement a
booking agent that can distinguish between simple messages (chit-chat) and tasks
(booking operations).

## Features

- **RouterAgent**: Uses LangChain with structured output (Zod schema) to
  determine the next action based on user queries
- **BookingAgentExecutor**: Implements the A2A AgentExecutor interface to handle
  message routing and task execution
- **Task vs Message**: Automatically creates tasks for booking operations while
  responding directly to general queries

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your DeepSeek API key (required for DeepSeek model):

```bash
export DEEPSEEK_API_KEY=your-api-key-here
```

## Usage

Run the example:

```bash
npm start
```

This will execute two test scenarios:

1. "hey, could you help book my trip" - Should return a message (NONE action)
2. "book a flight from NY to SF" - Should create a task (BOOK_FLIGHT action)

## Implementation Details

- **RouterAgent** (`router-agent.ts`): Uses LangChain's `createAgent` with
  response format to parse LLM responses into typed RouterOutput objects
- **BookingAgentExecutor** (`booking-agent-executor.ts`): Implements the A2A
  protocol's AgentExecutor interface
- **TaskUpdater** (`task-updater.ts`): Helper class to manage task status
  updates and artifacts
- **Utils** (`utils.ts`): Utility functions for creating messages and tasks

## Architecture

1. User sends a message
2. RouterAgent analyzes the query and determines the next step
3. If NONE: Return a direct message response
4. If BOOK_FLIGHT/BOOK_HOTEL: Create a task, update status, execute booking, add
   artifact, and complete
