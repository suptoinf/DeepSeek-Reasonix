# Reasonix — VS Code Extension

将 Reasonix AI 编程助手直接集成到 VS Code 编辑器中。

[Reasonix](https://github.com/esengine/DeepSeek-Reasonix) 是一个 DeepSeek 原生的 AI 编程代理，采用缓存优先（cache-first）循环、flash-first 成本控制和工具调用修复（tool-call repair）机制。

## 先决条件

需要已在系统上安装 Reasonix CLI：

```sh
npm install -g reasonix
# 或
# 参见 https://github.com/esengine/DeepSeek-Reasonix 获取更多安装方式
```

并确保 `reasonix` 命令在 PATH 中可用。WSL 用户直接在 WSL 中安装即可。

## 功能

| 功能 | 快捷键 | 说明 |
|---|---|---|
| **打开 Reasonix** | `Ctrl+Esc` (Win/Linux) / `Cmd+Esc` (Mac) | 在分屏终端中打开 Reasonix；已存在时聚焦 |
| **新建会话** | `Ctrl+Shift+Esc` (Win/Linux) / `Cmd+Shift+Esc` (Mac) | 强制创建一个新的 Reasonix 终端标签页 |
| **插入文件引用** | `Ctrl+Alt+K` (Win/Linux) / `Cmd+Alt+K` (Mac) | 在终端中插入当前文件路径和选区行号 |
| **一键启动** | 编辑器右上角按钮 | 点击 Reasonix 图标按钮快速启动 |

### 上下文感知

启动 Reasonix 时，扩展会自动将当前打开的文件作为初始上下文发送。例如，如果你正在编辑 `src/index.ts` 且选中了第 10-20 行，扩展会自动输入：

```
@src/index.ts#L10-20
```

Reasonix 的 `@file` 引用机制将自动读取该文件作为上下文。

### 文件引用格式

- 当前文件：`@src/foo.ts`
- 单行：`@src/foo.ts#L42`
- 多行选区：`@src/foo.ts#L10-20`

## 使用方法

### 方式 1：快捷键
按 `Ctrl+Esc`（Mac: `Cmd+Esc`）快速打开 Reasonix 分屏终端。

### 方式 2：编辑器按钮
点击编辑器右上角的 Reasonix 图标按钮。

### 方式 3：命令面板
按 `Ctrl+Shift+P` 搜索并运行：
- `Reasonix: Open Reasonix`
- `Reasonix: Open Reasonix in New Tab`
- `Reasonix: Insert File Reference`

## 开发

```sh
cd extensions/vscode
npm install
npm run compile        # 编译
npm run watch:esbuild  # 监听模式
```

按 `F5` 启动调试，会打开一个加载了该扩展的新 VS Code 窗口。

## WSL 支持

本扩展专为 WSL 场景设计。当在 WSL 中运行 VS Code（通过 Remote-WSL 扩展）时：
- 终端自动使用 WSL shell
- `reasonix code` 直接在 WSL 环境中运行
- 文件路径自动映射为 WSL 路径

## 许可证

MIT
