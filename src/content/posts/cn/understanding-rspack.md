---
title: 认识 Rspack
description: Rspack 是一个基于 Rust 开发的新一代前端构建工具，它的目标是为前端开发者提供更快的构建速度和更好的开发体验。

category:
  - 技术前沿速递
tags:
  - rspack
  - 前端构建工具
pubDate: 2025-03-03
cover: /src/assets/rspack-logo.svg
coverAlt: rspack logo
author: peerless_hero
---

以下内容摘录自 Rspack 的[官方文档-介绍](https://rspack.dev/zh/guide/start/introduction#%E4%BB%8B%E7%BB%8D)。

## 定义

Rspack（读音为 /'ɑrespæk/,）是一个基于 Rust 编写的高性能 JavaScript 打包工具， 它提供对 webpack 生态良好的兼容性，能够无缝替换 webpack， 并提供闪电般的构建速度。

## 和其他构建工具的对比

### 和 webpack 的区别

webpack 是目前最为成熟的构建工具，有着活跃的生态，灵活的配置和丰富的功能，但是其最为人诟病的是其性能问题，尤其在一些大型项目上，构建花费的时间可能会达到几分钟甚至几十分钟，性能问题是目前 webpack 最大的短板。因此 Rspack 解决的问题核心就是 webpack 的性能问题。 Rspack 比 webpack 快得益于如下几方面：

- **Rust 语言优势**: Rspack 使用 Rust 语言编写， 得益于 Rust 的高性能编译器支持， Rust 编译生成的 Native Code 通常比 JavaScript 性能更为高效。
- **高度并行的架构**: webpack 受限于 JavaScript 对多线程的羸弱支持，导致其很难进行高度的并行化计算，而得益于 Rust 语言的并行化的良好支持， Rspack 采用了高度并行化的架构，如模块图生成，代码生成等阶段，都是采用多线程并行执行，这使得其编译性能随着 CPU 核心数的增长而增长，充分挖掘 CPU 的多核优势。
- **内置大部分的功能**: 事实上 webpack 本身的性能足够高效，但是因为 webpack 本身内置了较少的功能，这使得我们在使用 webpack 做现代 Web App 开发时，通常需要配合很多的 plugin 和 loader 进行使用，而这些 loader 和 plugin 往往是性能的瓶颈，而 Rspack 虽然支持 loader 和 plugin，但是保证绝大部分常用功能都内置在 Rspack 内，从而减小 JS plugin | loader 导致的低性能和通信开销问题。
- **增量编译**: 尽管 Rspack 的全量编译足够高效，但是当项目庞大时，全量的编译仍然难以满足 HMR 的性能要求，因此在 HMR 阶段，我们采用的是更为高效的增量编译策略，从而保证，无论你的项目多大，其 HMR 的开销总是控制在合理范围内。

### 和 Vite 的区别

Vite 提供了很好的开发者体验，但 Vite 在生产构建中依赖了 Rollup ，因此与其他基于 JavaScript 的工具链一样，面临着生产环境的构建性能问题。

另外，Rollup 相较于 webpack 做了一些平衡取舍，在这里同样适用。比如，Rollup 缺失了 webpack 对于拆包的灵活性，即缺失了 optimization.splitChunks 提供的很多功能。

### 和 esbuild 的区别

我们在内部进行过大规模地将 esbuild 作为通用的 Web App 构建工具的实践，但是遇到如下一些问题：
缺乏对 JavaScript HMR 和增量编译的良好支持，这导致大型项目中的 HMR 性能较差。
拆包策略也非常原始，难以满足业务复杂多变的拆包优化需求。

### 和 Turbopack 的区别

Rspack 和 turbopack 都是基于 Rust 实现的 bundler，且都发挥了 Rust 语言的优势。

与 turbopack 不同的是，Rspack 选择了对 webpack 生态兼容的路线，一方面，这些兼容可能会带来一定的性能开销，但在实际的业务落地中，我们发现对于大部分的应用来说，这些性能开销是可以接受的，另一方面，这些兼容也使得 Rspack 可以更好地与上层的框架和生态进行集成，能够实现业务的渐进式迁移。

### 和 Rollup 的区别

Rspack 和 Rollup 虽然都是打包工具，但是两者的侧重领域不同，Rollup 更适合用于打包库，而 Rspack 适合用于打包应用。因此 Rspack 对打包应用进行了很多优化，如 HMR、Bundle splitting 等功能，而 Rollup 则比 Rspack 的编译产物对库更为友好，如更好的 ESM 产物支持。 社区上也有很多的工具在 Rollup 基础上进行了一定的封装，提供了对应用打包更友好的支持，如 vite 和 wmr, 目前 Rspack 比 Rollup 有更好的生产环境构建性能。

### 和 Parcel 的区别

Rspack 的整体架构与 Parcel 有很多共同之处。例如都将 CSS 资源视为一等公民，都支持基于 filter 的 transformer。然而，Parcel 更加注重开箱即用的体验，而 Rspack 更加注重为上层框架提供灵活的配置。Parcel 开创性地设计了 Unified Graph 和使 HTML 成为一等公民的特性。Rspack 也计划在未来支持这些特性。

## 总结

Rspack 是一个基于 Rust 开发的新一代前端构建工具，它的目标是为前端开发者提供更快的构建速度和更好的开发体验。如果不满足于vite的开发体验，可以考虑使用Rspack。

官方文档地址：[https://rspack.dev/zh-cn/](https://rspack.dev/zh-cn/)
