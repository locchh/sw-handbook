# Linux Command Reference

A practical command-line reference for Linux development and operations. Read `command --help` or `man command` before using an unfamiliar option, especially with elevated privileges.

For *when* to reach for these — sizing a machine, diagnosing a full disk, triaging a slow box — see [Running a Server](server_operations.md).

## Navigation and Files

| Command | Purpose | Example |
|---|---|---|
| `pwd` | Print the current directory | `pwd` |
| `ls` | List directory contents | `ls -lah` |
| `cd` | Change directory | `cd /etc`, `cd ..`, `cd -` |
| `touch` | Create a file or update timestamps | `touch notes.md` |
| `mkdir` | Create directories | `mkdir -p app/config` |
| `cp` | Copy files or trees | `cp -a source/ backup/` |
| `mv` | Move or rename | `mv old.md new.md` |
| `rm` | Remove files | `rm obsolete.txt` |
| `rmdir` | Remove an empty directory | `rmdir empty-dir` |
| `ln` | Create hard or symbolic links | `ln -s target shortcut` |
| `file` | Identify a file’s type | `file archive.bin` |

Useful `ls` options:

```bash
ls -l       # long format
ls -a       # include hidden entries
ls -h       # human-readable sizes with -l
ls -t       # newest first
```

!!! danger "Removal is normally irreversible"
    Confirm the resolved path before recursive removal. Avoid combining `sudo`, `rm -r`, unquoted variables, and broad globs. Prefer moving valuable files to a recoverable location first.

## Reading and Comparing Files

| Command | Purpose | Example |
|---|---|---|
| `cat` | Print or concatenate files | `cat config.yaml` |
| `less` | Page through content | `less application.log` |
| `head` | Show the beginning | `head -n 20 data.csv` |
| `tail` | Show the end | `tail -f application.log` |
| `wc` | Count lines, words, or bytes | `wc -l access.log` |
| `cmp` | Compare byte by byte | `cmp image-a image-b` |
| `diff` | Compare text line by line | `diff -u old.conf new.conf` |

Inside `less`, use `/pattern` to search, `n` for the next match, `b` to move back, and `q` to quit.

Redirection changes where data flows:

```bash
command > output.txt        # replace file with stdout
command >> output.txt       # append stdout
command 2> errors.txt       # redirect stderr
producer | consumer         # pipe stdout into another command
```

`>` truncates an existing file before the command runs. Check the target carefully.

## Searching and Text Processing

| Command | Purpose | Example |
|---|---|---|
| `rg` | Fast recursive text search | `rg -n "timeout" src` |
| `find` | Search filesystem metadata | `find . -type f -name '*.md'` |
| `sort` | Sort lines | `sort -u names.txt` |
| `uniq` | Collapse adjacent duplicate lines | `sort names.txt \| uniq -c` |
| `cut` | Select delimited fields | `cut -d: -f1 /etc/passwd` |
| `tr` | Translate characters | `tr '[:lower:]' '[:upper:]'` |
| `sed` | Transform a text stream | `sed -n '20,40p' file` |
| `awk` | Process structured text | `awk -F, '{print $1}' data.csv` |
| `xargs` | Build arguments from stdin | `printf '%s\n' *.log \| xargs wc -l` |

Prefer null-delimited pipelines for arbitrary filenames:

```bash
find . -type f -name '*.log' -print0 | xargs -0 wc -l
```

Quote variables unless you explicitly need word splitting:

```bash
printf '%s\n' "$project_path"
```

## Permissions and Identity

```text
r = read   w = write   x = execute
u = owner  g = group   o = others
```

| Command | Purpose | Example |
|---|---|---|
| `whoami` | Show effective username | `whoami` |
| `id` | Show user and group IDs | `id` |
| `chmod` | Change mode bits | `chmod u+x script.sh` |
| `chown` | Change owner/group | `sudo chown app:app config` |
| `sudo` | Run an authorized command as another user | `sudo systemctl status nginx` |
| `passwd` | Change a password | `passwd` |

Numeric modes:

| Digit | Permission |
|---:|---|
| 4 | read |
| 2 | write |
| 1 | execute |

`chmod 755 script.sh` gives the owner `rwx` and everyone else `r-x`. Avoid recursively setting one mode on a mixed tree: directories and files usually need different execute bits.

## Packages and Help

On Ubuntu/Debian:

```bash
sudo apt update
apt search package-name
sudo apt install package-name
sudo apt upgrade
sudo apt remove package-name
```

Help commands:

```bash
command --help
man command
whatis command
apropos "search phrase"
```

Package managers and command behavior vary by distribution. Confirm the platform before following an installation guide.

## Archives

```bash
tar -czf archive.tar.gz folder/     # create gzip-compressed tar
tar -tzf archive.tar.gz             # inspect without extracting
tar -xzf archive.tar.gz             # extract

zip -r archive.zip folder/
unzip -l archive.zip                # inspect
unzip archive.zip -d target/
```

Inspect untrusted archives before extracting them. Archive paths can overwrite unexpected files if the tool or archive is malicious.

## Networking

| Command | Purpose | Example |
|---|---|---|
| `ssh` | Open a secure remote shell | `ssh -p 2222 user@host` |
| `curl` | Transfer data over URLs | `curl -fsS https://example.com/health` |
| `ip` | Inspect interfaces and routes | `ip address`, `ip route` |
| `ping` | Test ICMP reachability | `ping -c 4 example.com` |
| `ss` | Inspect sockets | `ss -tuln` |
| `resolvectl` | Inspect systemd DNS state | `resolvectl status` |
| `dig` | Query DNS | `dig example.com A` |

`ifconfig` and `netstat` are legacy tools; prefer `ip` and `ss`.

Common `curl` patterns:

```bash
curl -I https://example.com              # response headers
curl -fLO https://example.com/file.tgz   # fail on HTTP error, keep name
curl -fsS -X POST \
  -H 'Content-Type: application/json' \
  -d '{"key":"value"}' \
  https://example.com/api
```

Avoid putting access tokens directly on the command line: they may appear in shell history and process listings.

## System and Storage

| Command | Purpose | Example |
|---|---|---|
| `uname` | Kernel/system information | `uname -a` |
| `hostnamectl` | Host identity and OS details | `hostnamectl` |
| `free` | Memory use | `free -h` |
| `df` | Filesystem capacity | `df -h` |
| `du` | Directory/file usage | `du -sh .` |
| `lsblk` | Block devices and mounts | `lsblk -f` |
| `env` | Environment or one-command overrides | `env DEBUG=1 ./app` |
| `date` | Date and time | `date --iso-8601=seconds` |

`df` answers “which filesystem is full?” while `du` answers “which visible files use space?” Deleted-but-open files and reserved blocks can make the numbers differ.

## Processes

| Command | Purpose | Example |
|---|---|---|
| `ps` | Process snapshot | `ps aux` |
| `top` | Interactive process monitor | `top` |
| `htop` | Friendlier interactive monitor | `htop` |
| `pstree` | Process hierarchy | `pstree -p` |
| `kill` | Send a signal by PID | `kill 1234` |
| `pkill` | Signal processes by pattern | `pkill -TERM worker` |
| `jobs` | Shell background jobs | `jobs -l` |

Start with `SIGTERM`, which lets a process clean up:

```bash
kill -TERM 1234
```

Use `SIGKILL` (`kill -9`) only when the process cannot terminate normally. It prevents cleanup and can leave partial state.

## Services and Logs

On systemd distributions:

```bash
systemctl status nginx
sudo systemctl start nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

journalctl -u nginx
journalctl -u nginx -f
journalctl -u nginx --since "1 hour ago"
```

`enable` controls startup at boot; it does not necessarily start the service immediately. Use `enable --now` when both behaviors are intended.

## Shell Sessions

```bash
history                  # command history
history 20               # recent entries
history | rg ssh         # search history
clear                    # clear display (Ctrl+L)
exit                     # leave shell (Ctrl+D)
```

Do not type secrets into command arguments. History files are persistent, and process arguments may be visible to other users.

For persistent remote work, see the [tmux Cheatsheet](tmux.md).

## Git Essentials

```bash
git status
git diff
git diff --staged
git add -p
git commit
git log --oneline --graph --decorate -n 20
git fetch --all --prune
git switch -c feature/name origin/main
git push -u origin feature/name
```

For branch integration and history rewriting, see [Git: Merge vs Rebase](../basics/git.md). For reviewing branch changes, see [Code Review](../basics/code_review.md).

## Docker Essentials

```bash
docker ps
docker ps -a
docker images
docker pull nginx
docker run --rm -p 8080:80 nginx
docker logs -f container-name
docker exec -it container-name sh
docker build -t app:dev .
docker compose up -d
docker compose logs -f
docker compose down
```

Containers, images, volumes, and networks have separate lifecycles. Before removing anything, list the exact target and understand whether it contains persistent data.

Use the current [Docker installation instructions](https://docs.docker.com/engine/install/) rather than copying repository setup commands from an old cheatsheet.

## Kubernetes Essentials

```bash
kubectl config current-context
kubectl config get-contexts
kubectl get pods -A
kubectl describe pod pod-name
kubectl logs -f pod-name -c container-name
kubectl exec -it pod-name -- sh
kubectl apply -f deployment.yaml
kubectl rollout status deployment/app
kubectl port-forward service/app 8080:80
```

Always check the current context and namespace before a mutating command:

```bash
kubectl config current-context
kubectl config view --minify --output 'jsonpath={..namespace}'
```

Production clusters should use reviewable manifests or deployment automation. Interactive `kubectl` changes are difficult to reproduce and audit. See [CI/CD Platforms §10](cicd.md#10-how-the-deploy-actually-happens) for push-based and pull-based deployment mechanics.

## Rule of Thumb

Before a command that changes state:

1. inspect the current state;
2. resolve the exact target;
3. run the narrowest command;
4. verify the result;
5. know how to recover.
