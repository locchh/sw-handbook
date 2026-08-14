# tmux Cheatsheet

`tmux` keeps terminal sessions alive, lets you split a terminal into panes, and makes remote work resilient to disconnects.

Its object hierarchy is:

```
server
└── session
    └── window
        └── pane
```

The default prefix is `Ctrl+b`: press and release it, then press the command key.

## Sessions

| Action                     | Command                        |
| -------------------------- | ------------------------------ |
| Create a named session     | `tmux new -s project`          |
| List sessions              | `tmux ls`                      |
| Attach to the last session | `tmux attach`                  |
| Attach to a named session  | `tmux attach -t project`       |
| Detach from inside tmux    | `Ctrl+b`, then `d`             |
| Rename current session     | `Ctrl+b`, then `$`             |
| Kill a named session       | `tmux kill-session -t project` |

Use descriptive names such as the repository or incident name. A detached session continues running.

## Windows

| Action                  | Keys                     |
| ----------------------- | ------------------------ |
| Create window           | `Ctrl+b`, then `c`       |
| List/select windows     | `Ctrl+b`, then `w`       |
| Next / previous window  | `Ctrl+b`, then `n` / `p` |
| Select window by number | `Ctrl+b`, then `0`–`9`   |
| Rename window           | `Ctrl+b`, then `,`       |
| Close current window    | `Ctrl+b`, then `&`       |

Closing a window terminates its panes and the processes running in them.

## Panes

| Action              | Keys                                |
| ------------------- | ----------------------------------- |
| Split left/right    | `Ctrl+b`, then `%`                  |
| Split top/bottom    | `Ctrl+b`, then `"`                  |
| Move between panes  | `Ctrl+b`, then an arrow key         |
| Show pane numbers   | `Ctrl+b`, then `q`                  |
| Jump to pane number | `Ctrl+b`, then `q`, then the number |
| Resize pane         | `Ctrl+b`, then hold `Ctrl` + arrow  |
| Zoom/unzoom pane    | `Ctrl+b`, then `z`                  |
| Close pane          | `Ctrl+b`, then `x`                  |

## Copy Mode

| Action          | Keys               |
| --------------- | ------------------ |
| Enter copy mode | `Ctrl+b`, then `[` |
| Search forward  | `/`                |
| Search backward | `?`                |
| Exit copy mode  | `q`                |

Mouse selection and copy behavior depends on the terminal and tmux configuration.

## Useful Commands

```
tmux list-keys                 # show all key bindings
tmux show-options -g          # show global options
tmux source-file ~/.tmux.conf # reload configuration
```

A minimal `~/.tmux.conf`:

```
set -g mouse on
set -g history-limit 50000
set -g base-index 1
setw -g pane-base-index 1
```

Reload it with `tmux source-file ~/.tmux.conf`.
