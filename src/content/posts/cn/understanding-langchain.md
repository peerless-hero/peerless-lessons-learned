---
title: LangChain 大语言模型应用开发框架入门指南
description: LangChain 是一个用于构建大语言模型（LLM）驱动应用程序的 Python 框架。它通过将 LLM 与外部数据源、工具和记忆系统连接，让开发者能够快速构建 RAG 问答、智能代理、对话机器人等 AI 应用。本文将简要介绍 LangChain 的核心概念、架构设计以及一个入门实战示例。
category:
  - 技术前沿速递
tags:
  - Python
  - LangChain
  - AI
  - LLM
  - RAG
pubDate: 2026-08-04
cover: /src/assets/langchain.png
coverAlt: LangChain框架介绍
author: peerless_hero
---

### 一、什么是 LangChain？

LangChain 是由 Harrison Chase 于 2022 年创建的开源框架，目前已成为 Python 生态中最受欢迎的 LLM 应用开发框架之一，在 GitHub 上拥有超过 10 万 Star。2024 年 9 月发布的 **LangChain 1.0** 是一次重大重构，基于 LangGraph 运行时构建，引入了全新的 `create_agent` API 和中间件架构，同时承诺 1.x 系列的 API 稳定性。

它的核心目标是**简化大语言模型应用的开发流程**，让开发者能够像搭积木一样组合各种组件来构建复杂的 AI 应用。

传统上，直接调用 OpenAI、Claude 等大模型 API 只能实现简单的"一问一答"。但在实际场景中，我们往往需要让模型：

- 读取外部文档并基于文档内容回答问题（RAG）
- 调用搜索引擎、数据库、API 等外部工具
- 记住多轮对话的上下文
- 按照预定流程执行多步骤推理

LangChain 通过一套标准化的抽象层，将上述能力封装为可组合的模块，极大降低了开发门槛。

### 二、核心概念与架构

LangChain 1.0 的核心设计围绕以下几个关键概念展开：

#### 2.1 Model I/O（模型输入输出）

这是 LangChain 最基础的组件，负责与各种 LLM 进行交互：

- **Chat Models**：通过 `init_chat_model` 统一初始化，支持 OpenAI、Anthropic、Google 等数十家提供商
- **Prompts**：使用 `system_prompt` 参数或 `ChatPromptTemplate` 管理提示词
- **Output Parsers**：通过 `response_format` 参数实现结构化输出，底层自动处理解析

```python
from langchain.chat_models import init_chat_model

# 统一初始化模型（支持 "provider:model" 格式字符串）
model = init_chat_model("openai:gpt-4o")

# 直接调用
response = model.invoke([
    {"role": "system", "content": "你是一个Python编程助手。"},
    {"role": "user", "content": "解释什么是装饰器"}
])

# 读取标准化内容块
for block in response.content_blocks:
    if block["type"] == "text":
        print(block["text"])
```

#### 2.2 Retrieval（检索增强生成 / RAG）

RAG 是 LangChain 最核心的应用场景之一。它允许模型在回答问题时检索外部知识库中的相关文档，从而提供更准确、更及时的回答。

LangChain 的 RAG 流程包括：

- **Document Loaders**：从 PDF、网页、数据库等多种来源加载文档
- **Text Splitters**：将长文档切分为适合模型处理的文本块
- **Embeddings**：通过 `init_embeddings` 统一初始化嵌入模型
- **Vector Stores**：存储和检索向量数据，支持 Chroma、Pinecone、Milvus 等
- **Retrievers**：统一的检索接口，支持相似度搜索、MMR 等多种检索策略

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.embeddings import init_embeddings
from langchain_chroma import Chroma

# 文档切分
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
)
splits = text_splitter.split_documents(documents)

# 向量存储
embeddings = init_embeddings("openai:text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings
)

# 创建检索器
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
```

#### 2.3 Chains（链）

在 LangChain 1.0 中，链的概念已融入 Agent 和中间件体系。对于简单的流水线任务，仍可使用 **LCEL（LangChain Expression Language）** 管道语法：

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# 将检索到的文档格式化为字符串
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 使用 LCEL 管道语法构建 RAG 链
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# 执行查询
result = rag_chain.invoke("LangChain 的核心组件有哪些？")
```

LCEL 使用 `|` 管道运算符连接各组件，语法直观且支持异步、流式输出、并行执行等高级特性。

#### 2.4 Agents（代理）

Agent 是 LangChain 1.0 中最重要的抽象。新版通过 `create_agent` 提供极简的 Agent 创建入口，底层构建在 LangGraph 之上，原生支持持久化、流式处理和人在回路（Human-in-the-Loop）：

```python
from langchain.agents import create_agent

# 定义工具（使用 Python 函数即可）
def get_weather(city: str) -> str:
    """获取指定城市的天气信息。"""
    return f"{city}今天晴，气温25°C。"

# 创建 Agent（极简入口）
agent = create_agent(
    model="openai:gpt-4o",
    tools=[get_weather],
    system_prompt="你是一个 helpful 的助手，可以查询天气信息。"
)

# Agent 会自主决定是否调用工具
result = agent.invoke({
    "messages": [{"role": "user", "content": "北京今天天气怎么样？"}]
})

# 读取最终回答
for block in result["messages"][-1].content_blocks:
    if block["type"] == "text":
        print(block["text"])
```

#### 2.5 Memory（记忆）

LangChain 1.0 使用**中间件（Middleware）**机制来管理对话记忆，替代了旧版的 Memory 类：

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

# 使用内置的总结中间件管理长对话
agent = create_agent(
    model="openai:gpt-4o",
    tools=[get_weather],
    system_prompt="你是一个 helpful 的助手。",
    middleware=[
        SummarizationMiddleware(
            model="openai:gpt-4o-mini",
            trigger={"tokens": 1000}  # 当 token 数超过 1000 时自动总结
        )
    ]
)
```

此外，也可以通过自定义中间件实现更复杂的记忆逻辑，如持久化到数据库、按用户隔离会话等。

### 三、LangChain 1.0 生态系统

LangChain 1.0 对包结构进行了大幅精简，核心模块更加聚焦：

| 包名                       | 用途                                                    |
| -------------------------- | ------------------------------------------------------- |
| `langchain-core`           | 核心抽象层、LCEL、Runnable 协议、消息类型               |
| `langchain`                | 主包，提供 `create_agent`、`init_chat_model` 等核心 API |
| `langchain-community`      | 社区维护的第三方集成（文档加载器、向量存储等）          |
| `langchain-openai`         | OpenAI 模型集成                                         |
| `langchain-anthropic`      | Anthropic Claude 集成                                   |
| `langchain-chroma`         | Chroma 向量数据库集成                                   |
| `langchain-text-splitters` | 文本切分工具                                            |
| `langchain-classic`        | 旧版 Chains、Retrievers 等兼容包（如需迁移旧代码）      |

此外，还有两个重要衍生项目：

- **LangGraph**：底层编排框架，用于构建有状态的、多角色的 LLM 应用，支持复杂的循环和分支控制流
- **LangSmith**：LLM 应用的调试、测试、监控和评估平台

### 四、环境要求与安装

#### 4.1 Python 版本要求

LangChain 1.0 要求 **Python 3.10 或更高版本**（不再支持 Python 3.9）。

```bash
# 检查当前 Python 版本
python --version

# 如版本过低，可使用 conda 创建新环境
conda create -n langchain-env python=3.11
conda activate langchain-env
```

#### 4.2 核心依赖安装

```bash
# 核心框架（1.0 版本）
pip install langchain

# OpenAI 模型集成
pip install langchain-openai

# Chroma 向量数据库
pip install langchain-chroma

# 文本切分工具
pip install langchain-text-splitters

# 社区工具（文档加载器、搜索工具等）
pip install langchain-community

# 如需兼容旧版代码
pip install langchain-classic
```

> **提示**：LangChain 1.0 承诺 API 稳定性，1.x 系列不再会有破坏性的变更。

#### 4.3 API 密钥配置

```bash
# Linux / macOS
export OPENAI_API_KEY="your-api-key-here"

# Windows PowerShell
$env:OPENAI_API_KEY="your-api-key-here"
```

### 五、实战示例：构建一个文档问答系统

下面是一个基于 LangChain 1.0 的完整 RAG 文档问答系统：

```python
from langchain.chat_models import init_chat_model
from langchain.embeddings import init_embeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# 1. 加载文档
loader = WebBaseLoader("https://docs.python.org/3/tutorial/")
docs = loader.load()

# 2. 切分文档
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
)
splits = text_splitter.split_documents(docs)

# 3. 创建向量存储
embeddings = init_embeddings("openai:text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings
)
retriever = vectorstore.as_retriever()

# 4. 构建提示词模板
template = """基于以下上下文回答问题。如果无法从上下文中找到答案，请如实说明。

上下文：
{context}

问题：{question}

回答："""

prompt = ChatPromptTemplate.from_template(template)

# 5. 初始化模型
model = init_chat_model("openai:gpt-4o")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 6. 构建 RAG 链
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# 7. 提问
answer = rag_chain.invoke("Python 中如何处理异常？")
print(answer)
```

### 六、为什么 LangChain 如此受欢迎？

1. **降低开发门槛**：通过统一的接口封装了数十种 LLM 和工具，开发者无需学习每个服务商不同的 API
2. **模块化设计**：各组件松耦合，可以根据需要灵活替换（例如从 OpenAI 切换到 Claude 只需修改模型字符串）
3. **丰富的集成生态**：支持数百种第三方工具，涵盖文档加载、向量存储、搜索引擎、代码执行等
4. **API 稳定性承诺**：1.0 版本承诺语义化版本控制，1.x 系列不再有破坏性变更
5. **基于 LangGraph 的运行时**：原生支持持久化、流式输出、人在回路等企业级特性

### 七、注意事项与局限

尽管 LangChain 功能强大，但在使用时也需要注意：

- **抽象层的学习成本**：框架提供了大量抽象，初学者需要一定时间理解各组件的职责和协作方式
- **1.0 迁移成本**：从 0.x 迁移到 1.0 需要调整部分 API（如 `create_react_agent` → `create_agent`、Memory → Middleware）
- **性能开销**：对于简单场景，直接调用 LLM API 可能更高效
- **调试复杂性**：当 Agent 行为异常时，排查问题需要借助 LangSmith 等工具

### 八、总结

LangChain 1.0 是 Python 生态中构建 LLM 应用的事实标准框架。通过 `create_agent`、`init_chat_model` 等极简 API，以及基于 LangGraph 的强大运行时，开发者可以快速构建从简单问答到复杂多代理协作的各类 AI 应用。1.x 系列的 API 稳定性承诺也让它更适合生产环境部署。

建议从官方文档的快速入门教程开始，动手实践一个 RAG 或 Agent 项目，这是理解框架设计理念的最佳方式。

### 九、参考资料

- **LangChain 官方文档**：https://docs.langchain.com/
- **LangChain Python 开源仓库**：https://github.com/langchain-ai/langchain
- **LangChain v1 迁移指南**：https://docs.langchain.com/oss/python/migrate/langchain-v1
- **LangChain Python 包（PyPI）**：https://pypi.org/project/langchain/
- **LangGraph 官方文档**：https://docs.langchain.com/oss/python/langgraph/overview
- **LangSmith 平台**：https://smith.langchain.com
- **ChatOpenAI 集成文档**：https://docs.langchain.com/oss/python/integrations/chat/openai
- **Chroma 向量数据库**：https://www.trychroma.com/
- **OpenAI 官方 API 文档**：https://platform.openai.com/docs/
