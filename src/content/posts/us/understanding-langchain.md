---
title: LangChain: A Complete Guide to the Popular Python Framework for LLM Applications
description: LangChain is a Python framework for building Large Language Model (LLM) driven applications. By connecting LLMs with external data sources, tools, and memory systems, it enables developers to quickly build RAG question-answering, intelligent agents, chatbots, and other AI applications. This article provides a comprehensive introduction to LangChain 1.0's core concepts, architecture, and practical examples.
category:
  - TechFront
tags:
  - Python
  - LangChain
  - AI
  - LLM
  - RAG
pubDate: 2026-08-04
cover: /src/assets/langchain.png
coverAlt: LangChain Framework Introduction
author: peerless_hero
---

### I. What is LangChain?

LangChain is an open-source framework created by Harrison Chase in 2022. It has become one of the most popular LLM application development frameworks in the Python ecosystem, with over 100,000 stars on GitHub. The **LangChain 1.0** released in September 2024 was a major rewrite built on the LangGraph runtime, introducing the new `create_agent` API and middleware architecture, while committing to API stability throughout the 1.x series.

Its core goal is to **simplify the development of LLM-powered applications**, allowing developers to combine various components like building blocks to construct complex AI applications.

Traditionally, directly calling LLM APIs like OpenAI or Claude only enables simple "question-and-answer" interactions. However, in real-world scenarios, we often need the model to:

- Read external documents and answer questions based on their content (RAG)
- Call external tools such as search engines, databases, and APIs
- Remember context from multi-turn conversations
- Execute multi-step reasoning following a predefined workflow

LangChain encapsulates these capabilities into composable modules through a standardized abstraction layer, greatly lowering the development barrier.

### II. Core Concepts and Architecture

LangChain 1.0's core design revolves around the following key concepts:

#### 2.1 Model I/O

This is LangChain's most fundamental component, responsible for interacting with various LLMs:

- **Chat Models**: Unified initialization via `init_chat_model`, supporting dozens of providers including OpenAI, Anthropic, and Google
- **Prompts**: Managed via the `system_prompt` parameter or `ChatPromptTemplate`
- **Output Parsers**: Structured output achieved through the `response_format` parameter, with parsing handled automatically under the hood

```python
from langchain.chat_models import init_chat_model

# Unified model initialization (supports "provider:model" string format)
model = init_chat_model("openai:gpt-4o")

# Direct invocation
response = model.invoke([
    {"role": "system", "content": "You are a Python programming assistant."},
    {"role": "user", "content": "Explain what a decorator is."}
])

# Read standardized content blocks
for block in response.content_blocks:
    if block["type"] == "text":
        print(block["text"])
```

#### 2.2 Retrieval-Augmented Generation (RAG)

RAG is one of LangChain's most important application scenarios. It allows the model to retrieve relevant documents from an external knowledge base when answering questions, providing more accurate and up-to-date answers.

The RAG pipeline in LangChain includes:

- **Document Loaders**: Load documents from various sources such as PDFs, web pages, and databases
- **Text Splitters**: Split long documents into text chunks suitable for model processing
- **Embeddings**: Unified initialization via `init_embeddings`
- **Vector Stores**: Store and retrieve vector data, supporting Chroma, Pinecone, Milvus, and more
- **Retrievers**: A unified retrieval interface supporting similarity search, MMR, and other strategies

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.embeddings import init_embeddings
from langchain_chroma import Chroma

# Document splitting
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
)
splits = text_splitter.split_documents(documents)

# Vector store
embeddings = init_embeddings("openai:text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings
)

# Create retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
```

#### 2.3 Chains

In LangChain 1.0, the concept of chains has been integrated into the Agent and middleware ecosystem. For simple pipeline tasks, the **LCEL (LangChain Expression Language)** pipe syntax remains available:

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Format retrieved documents as a string
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Build an RAG chain using LCEL pipe syntax
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# Execute the query
result = rag_chain.invoke("What are the core components of LangChain?")
```

LCEL connects components with the `|` pipe operator. The syntax is intuitive and supports async, streaming output, and parallel execution.

#### 2.4 Agents

Agents are the most important abstraction in LangChain 1.0. The new version provides a minimal Agent creation entry point via `create_agent`, built on top of LangGraph with native support for persistence, streaming, and Human-in-the-Loop:

```python
from langchain.agents import create_agent

# Define a tool (any Python function works)
def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"It's sunny in {city} today, 25°C."

# Create an Agent (minimal entry point)
agent = create_agent(
    model="openai:gpt-4o",
    tools=[get_weather],
    system_prompt="You are a helpful assistant that can check the weather."
)

# The Agent autonomously decides whether to call the tool
result = agent.invoke({
    "messages": [{"role": "user", "content": "What's the weather in Beijing today?"}]
})

# Read the final answer
for block in result["messages"][-1].content_blocks:
    if block["type"] == "text":
        print(block["text"])
```

#### 2.5 Memory

LangChain 1.0 uses a **Middleware** mechanism to manage conversation memory, replacing the legacy Memory classes:

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

# Use the built-in summarization middleware for long conversations
agent = create_agent(
    model="openai:gpt-4o",
    tools=[get_weather],
    system_prompt="You are a helpful assistant.",
    middleware=[
        SummarizationMiddleware(
            model="openai:gpt-4o-mini",
            trigger={"tokens": 1000}  # Auto-summarize when token count exceeds 1000
        )
    ]
)
```

Additionally, custom middleware can be implemented for more complex memory logic, such as persisting to a database or isolating sessions per user.

### III. LangChain 1.0 Ecosystem

LangChain 1.0 significantly streamlined its package structure, with a more focused core:

| Package                    | Purpose                                                   |
| -------------------------- | --------------------------------------------------------- |
| `langchain-core`           | Core abstractions, LCEL, Runnable protocol, message types |
| `langchain`                | Main package with `create_agent`, `init_chat_model`, etc. |
| `langchain-community`      | Community-maintained third-party integrations             |
| `langchain-openai`         | OpenAI model integration                                  |
| `langchain-anthropic`      | Anthropic Claude integration                              |
| `langchain-chroma`         | Chroma vector database integration                        |
| `langchain-text-splitters` | Text splitting utilities                                  |
| `langchain-classic`        | Compatibility package for legacy Chains, Retrievers, etc. |

There are also two important companion projects:

- **LangGraph**: The underlying orchestration framework for building stateful, multi-agent LLM applications with complex loops and branching control flows
- **LangSmith**: A debugging, testing, monitoring, and evaluation platform for LLM applications

### IV. Environment Requirements and Installation

#### 4.1 Python Version Requirements

LangChain 1.0 requires **Python 3.10 or higher** (Python 3.9 is no longer supported).

```bash
# Check your current Python version
python --version

# If the version is too low, create a new environment with conda
conda create -n langchain-env python=3.11
conda activate langchain-env
```

#### 4.2 Core Dependency Installation

```bash
# Core framework (1.0 version)
pip install langchain==1.0.0

# OpenAI model integration
pip install langchain-openai

# Chroma vector database
pip install langchain-chroma

# Text splitting utilities
pip install langchain-text-splitters

# Community tools (document loaders, search tools, etc.)
pip install langchain-community

# For legacy code compatibility
pip install langchain-classic
```

> **Note**: LangChain 1.0 commits to API stability — no breaking changes within the 1.x series.

#### 4.3 API Key Configuration

```bash
# Linux / macOS
export OPENAI_API_KEY="your-api-key-here"

# Windows PowerShell
$env:OPENAI_API_KEY="your-api-key-here"
```

### V. Practical Example: Building a Document Q&A System

Here is a complete RAG document question-answering system built with LangChain 1.0:

```python
from langchain.chat_models import init_chat_model
from langchain.embeddings import init_embeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# 1. Load documents
loader = WebBaseLoader("https://docs.python.org/3/tutorial/")
docs = loader.load()

# 2. Split documents
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
)
splits = text_splitter.split_documents(docs)

# 3. Create vector store
embeddings = init_embeddings("openai:text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings
)
retriever = vectorstore.as_retriever()

# 4. Build the prompt template
template = """Answer the question based on the context below. If the answer cannot be found in the context, say so honestly.

Context:
{context}

Question: {question}

Answer:"""

prompt = ChatPromptTemplate.from_template(template)

# 5. Initialize the model
model = init_chat_model("openai:gpt-4o")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 6. Build the RAG chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# 7. Ask a question
answer = rag_chain.invoke("How do you handle exceptions in Python?")
print(answer)
```

### VI. Why is LangChain So Popular?

1. **Lower Development Barrier**: A unified interface encapsulates dozens of LLMs and tools, so developers don't need to learn each provider's different API
2. **Modular Design**: Loosely coupled components can be flexibly swapped (e.g., switching from OpenAI to Claude only requires changing the model string)
3. **Rich Integration Ecosystem**: Supports hundreds of third-party tools covering document loading, vector stores, search engines, code execution, and more
4. **API Stability Commitment**: Version 1.0 commits to semantic versioning — no breaking changes within the 1.x series
5. **LangGraph-Based Runtime**: Native support for enterprise-grade features like persistence, streaming output, and Human-in-the-Loop

### VII. Caveats and Limitations

Despite its power, there are some considerations when using LangChain:

- **Learning Curve of Abstractions**: The framework provides a large number of abstractions; beginners need time to understand the responsibilities and collaboration of each component
- **1.0 Migration Cost**: Migrating from 0.x to 1.0 requires adjusting some APIs (e.g., `create_react_agent` → `create_agent`, Memory → Middleware)
- **Performance Overhead**: For simple scenarios, calling the LLM API directly may be more efficient
- **Debugging Complexity**: When an Agent behaves unexpectedly, debugging requires tools like LangSmith

### VIII. Conclusion

LangChain 1.0 is the de facto standard framework for building LLM applications in the Python ecosystem. With minimal APIs like `create_agent` and `init_chat_model`, combined with the powerful LangGraph-based runtime, developers can quickly build everything from simple Q&A systems to complex multi-agent collaborations. The API stability commitment of the 1.x series also makes it more suitable for production deployment.

Start with the official quickstart tutorial and practice building a RAG or Agent project — that's the best way to understand the framework's design philosophy.

### IX. References

- **LangChain Official Documentation**: https://docs.langchain.com/
- **LangChain Python GitHub Repository**: https://github.com/langchain-ai/langchain
- **LangChain v1 Migration Guide**: https://docs.langchain.com/oss/python/migrate/langchain-v1
- **LangChain Python Package (PyPI)**: https://pypi.org/project/langchain/
- **LangGraph Official Documentation**: https://docs.langchain.com/oss/python/langgraph/overview
- **LangSmith Platform**: https://smith.langchain.com
- **ChatOpenAI Integration Docs**: https://docs.langchain.com/oss/python/integrations/chat/openai
- **Chroma Vector Database**: https://www.trychroma.com/
- **OpenAI API Documentation**: https://platform.openai.com/docs/
