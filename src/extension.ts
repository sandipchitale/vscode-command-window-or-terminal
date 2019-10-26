'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, window, commands, Location, workspace } from 'vscode';

import * as path from 'path';
import * as fileSystem from 'fs';
import * as child_process from 'child_process';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('command-window-or-terminal.open.windows', openCommandWindowOrTerminal);
    context.subscriptions.push(disposable);
    disposable = commands.registerCommand('command-window-or-terminal.open.nonwindows', openCommandWindowOrTerminal);
    context.subscriptions.push(disposable);
}

function openCommandWindowOrTerminal(uri) {
    if (uri && uri.scheme === 'file') {
      let fsPath = uri.fsPath;
      if (isDirectory(uri.fsPath)) {
        openConsoleAtLocation(fsPath);
      } else if (isFile(uri.fsPath)) {
        fsPath = path.dirname(fsPath);
        openConsoleAtLocation(fsPath);
      }
    }
}

  // Utility
  const isFile = function(path) {
    try {
      return fileSystem.statSync(path) && fileSystem.statSync(path).isFile()
    } catch (e) {
      return false;
    }
  }

  const isDirectory = function(path) {
    try {
      return fileSystem.statSync(path) && fileSystem.statSync(path).isDirectory()
    } catch (e) {
      return false;
    }
  }

function openConsoleAtLocation(location) {
  if (isDirectory(location)) {
    var consoleProcess;
    if (process.platform === 'win32') {
      consoleProcess = child_process.spawn('cmd', ['/K', 'start', 'cd', '/D', location]);
    } else if (process.platform === 'darwin') {
      consoleProcess = child_process.spawn('open', [
        '-n',
        '-a',
        '/Applications/Utilities/Terminal.app',
        location
      ]);
    } else if (process.platform === 'linux') {
      consoleProcess = child_process.spawn('gnome-terminal', ['--working-directory=' + location]);
    }
    consoleProcess.on('exit', (code) => {
      console.info(code);
    });
  }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
