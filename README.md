# a2a-x

A2A exploration project - Learning and experimenting with Agent-to-Agent communication patterns

## Overview

This repository contains implementations and examples for the Agent-to-Agent (A2A) protocol, enabling seamless communication between AI agents.

## Examples

### Java Implementation

A comprehensive Java implementation with client and server SDKs, featuring an AI-powered translation service.

**Location**: [`examples/a2a-java-custom-impl/`](examples/a2a-java-custom-impl/)

**Features**:
- Complete A2A protocol implementation
- Spring Boot server SDK
- Pure Java client SDK
- AI translation service demo
- Support for multiple OpenAI-compatible APIs (OpenAI, DeepSeek, Ollama, Azure OpenAI, etc.)

**Quick Start**:
```bash
cd examples/a2a-java-custom-impl
./mvnw clean install -DskipTests
```

See the [Java example README](examples/a2a-java-custom-impl/README.md) for detailed documentation.

## What is A2A?

The Agent-to-Agent (A2A) protocol is a standardized communication protocol that enables different AI agents to interact with each other, share capabilities, and coordinate tasks. It uses JSON-RPC 2.0 for reliable message exchange.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

See [LICENSE](LICENSE) for details.
