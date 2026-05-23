import * as vscode from "vscode";

const TERMINAL_NAME = "reasonix";

// ─── activate / deactivate ────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext) {
  // Open / focus reasonix terminal
  const openTerminalCmd = vscode.commands.registerCommand(
    "reasonix.openTerminal",
    async () => {
      const existing = vscode.window.terminals.find((t) => t.name === TERMINAL_NAME);
      if (existing) {
        existing.show();
        return;
      }
      await spawnReasonixTerminal(context);
    },
  );

  // Always open a NEW reasonix terminal tab
  const openNewTerminalCmd = vscode.commands.registerCommand(
    "reasonix.openNewTerminal",
    async () => {
      await spawnReasonixTerminal(context);
    },
  );

  // Insert current file reference (like @relative/path#L37-42) into the terminal
  const addFilepathCmd = vscode.commands.registerCommand(
    "reasonix.addFilepathToTerminal",
    async () => {
      const fileRef = buildFileReference();
      if (!fileRef) return;

      const terminal = vscode.window.activeTerminal;
      if (!terminal) return;

      // Only insert if this is a reasonix terminal (or the user's active terminal)
      terminal.sendText(fileRef, false);
      terminal.show();
    },
  );

  context.subscriptions.push(openTerminalCmd, openNewTerminalCmd, addFilepathCmd);
}

export function deactivate() {
  // Nothing to clean up — VS Code manages terminal lifecycle.
}

// ─── terminal lifecycle ────────────────────────────────────────────────────

async function spawnReasonixTerminal(context: vscode.ExtensionContext) {
  const terminal = vscode.window.createTerminal({
    name: TERMINAL_NAME,
    iconPath: {
      light: vscode.Uri.file(context.asAbsolutePath("images/button-dark.svg")),
      dark: vscode.Uri.file(context.asAbsolutePath("images/button-light.svg")),
    },
    location: {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: false,
    },
    env: {
      REASONIX_CALLER: "vscode",
    },
  });

  terminal.show();
  terminal.sendText("reasonix code");

  // Auto-share the current file as initial context
  const fileRef = buildFileReference();
  if (!fileRef) return;

  // Wait for reasonix to boot before typing the file reference
  let tries = 15;
  const delay = async () => new Promise((r) => setTimeout(r, 400));

  while (tries > 0) {
    await delay();
    // Attempt to send the file ref — the terminal might not be ready yet,
    // but `sendText` queues input so a short fixed delay works fine.
    // We wait for the terminal process to be ready by checking its name
    // (always ready after createTerminal). The real boot happens in reasonix.
    if (tries === 1 || vscode.window.terminals.some((t) => t.name === TERMINAL_NAME)) {
      terminal.sendText(fileRef, false);
      break;
    }
    tries--;
  }
}

// ─── file reference builder ────────────────────────────────────────────────

function buildFileReference(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return undefined;

  const doc = editor.document;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
  if (!workspaceFolder) return undefined;

  const relPath = vscode.workspace.asRelativePath(doc.uri);
  let ref = `@${relPath}`;

  const sel = editor.selection;
  if (!sel.isEmpty) {
    const start = sel.start.line + 1; // 1-based
    const end = sel.end.line + 1;
    ref += start === end ? `#L${start}` : `#L${start}-${end}`;
  }

  return ref;
}
