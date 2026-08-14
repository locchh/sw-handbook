# Running a Server

Choosing a machine, then keeping it healthy. This page covers the layers you are responsible for, how to size CPU / memory / disk / network, the diagnostic commands worth memorising, and runbooks for the failures that actually happen.

It assumes a Linux VPS or bare-metal box. For setting up a *development* machine see [Machine Setup](https://locchh.github.io/sw-handbook/software/tool_tip/machine_setup/index.md); for the commands themselves as a flat lookup see [Linux Commands](https://locchh.github.io/sw-handbook/software/tool_tip/linux_commands/index.md).

______________________________________________________________________

## 1. The Stack, and Where Your Responsibility Starts

Every server is the same pile of layers. What changes between hosting models is **where the line falls between "someone else's problem" and yours**.

```
flowchart TB
    APP[Your application]
    RT[Container runtime / systemd units]
    OS[Distro userland: packages, libs, config]
    KRN[Kernel, drivers, filesystem]
    VIRT[Hypervisor / virtualisation]
    FW[Firmware: BIOS / UEFI]
    HW[Hardware: CPU, RAM, disk, NIC]
    APP --> RT
    RT --> OS
    OS --> KRN
    KRN --> VIRT
    VIRT --> FW
    FW --> HW
```

Who owns each layer:

| Layer               | Bare metal | VPS / cloud VM | Managed container (ECS, Cloud Run) | Serverless |
| ------------------- | ---------- | -------------- | ---------------------------------- | ---------- |
| Application         | you        | you            | you                                | you        |
| Runtime / container | you        | you            | you                                | provider   |
| Distro userland     | you        | you            | you (image)                        | provider   |
| Kernel & drivers    | you        | provider       | provider                           | provider   |
| Hypervisor          | —          | provider       | provider                           | provider   |
| Firmware / BIOS     | you        | provider       | provider                           | provider   |
| Hardware            | you        | provider       | provider                           | provider   |

Two things follow from this table:

- **Most VPS problems are yours.** You don't own the kernel, but you own everything that fills the disk, leaks the memory, and opens the port. "It's the host's fault" is almost never true.
- **Moving up the table trades control for less surface area.** Bare metal is the only place you tune BIOS settings or pick a filesystem at install time — and the only place a failed disk is your job to replace.

**Rule of thumb:** pick the highest layer that still lets you do what you need. Own the kernel only when you have a reason to.

______________________________________________________________________

## 2. Sizing the Machine

Sizing from a guess is how you end up paying for idle cores while the disk fills. Measure first — run the workload somewhere cheap, watch the four resources under realistic load, then size with headroom.

### CPU

| What to check                       | Why it matters                                                                                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **vCPU vs dedicated core**          | A "vCPU" is usually a hyperthread on a shared physical core. Burstable tiers (AWS `t`-family, similar elsewhere) throttle hard once credits run out. |
| **Steal time** (`st` in `top`)      | Time your VM was ready to run but the hypervisor gave the core to someone else. Persistently above a few percent means a noisy neighbour — move.     |
| **Single-core speed vs core count** | Compilers, most web request handling, and anything single-threaded want clock speed. Batch and parallel workloads want cores.                        |

### Memory

Memory is the resource that kills processes rather than slowing them. When the kernel can't satisfy an allocation, the **OOM killer** picks a victim and terminates it — usually your largest process, which is usually the thing you cared about.

Size for peak, not average, and leave headroom for page cache. Swap buys you a slow death instead of a fast one: useful as a safety margin, not as capacity.

### Disk

Three separate questions, and people usually only ask the first:

- **Capacity** — how many bytes.
- **Type and IOPS** — NVMe ≫ SSD ≫ network-attached ≫ spinning rust. Databases care enormously; static file servers barely at all.
- **Inode count** — how many *files*, which is fixed at format time on ext4. See §6.

### Network

- **Bandwidth** is rarely the constraint. **Egress cost** frequently is — many providers give generous ingress and bill hard on the way out.
- **Latency to your users** beats raw throughput for interactive apps. Pick the region, then the machine.

### GPU

For AI workloads, **VRAM is the binding constraint**, not FLOPS. A model that doesn't fit in VRAM doesn't run at any speed. Size VRAM to the model plus KV cache plus batch, then worry about throughput.

### Matching the workload

| Workload                    | Prioritise             | Watch out for                       |
| --------------------------- | ---------------------- | ----------------------------------- |
| Static site / reverse proxy | Network, a little CPU  | Egress billing                      |
| API / web app               | CPU, memory            | Connection limits, memory leaks     |
| Database                    | Disk IOPS, memory      | Slow network storage, fsync latency |
| Batch / ETL                 | Cores, disk throughput | Filling the disk mid-job            |
| CI runner                   | Cores, disk **inodes** | `node_modules`, container layers    |
| LLM inference               | GPU VRAM               | Model + context won't fit           |

**Rule of thumb:** size memory and disk for peak, CPU for p95, and always leave 30% disk headroom — a full disk takes the whole machine down, while a busy CPU only makes it slow.

______________________________________________________________________

## 3. The USE Method

Rather than memorising symptoms, use a checklist. Brendan Gregg's **USE method** says: for every resource, check three things.

|                 | Question                             | Example                          |
| --------------- | ------------------------------------ | -------------------------------- |
| **U**tilisation | What percent of the time is it busy? | CPU at 90%                       |
| **S**aturation  | How much work is queued and waiting? | Load average above core count    |
| **E**rrors      | Are operations failing outright?     | Disk I/O errors, dropped packets |

The trap it saves you from: **utilisation alone lies**. A disk at 100% utilisation with a queue depth of 1 is fine. A CPU at 60% with a run queue of 40 is on fire. Always look at saturation next to utilisation.

Apply it across the four resources — CPU, memory, disk, network — and you have covered nearly everything a single box can do wrong.

______________________________________________________________________

## 4. The First Sixty Seconds

When you SSH into a box that "is slow", run these in order before forming a theory:

```
uptime                  # load average vs core count (nproc)
dmesg -T | tail -30     # OOM kills, disk errors, link flaps
free -h                 # look at "available", not "free"
df -h                   # bytes
df -i                   # inodes
vmstat 1 5              # r (run queue), si/so (swapping), wa (I/O wait)
iostat -xz 1 3          # per-disk utilisation and await
ss -tulpn               # what is listening
top -o %CPU             # who is burning it
```

Reading the load average requires the core count: `uptime` showing `4.00` is **fully loaded on 4 cores** and **badly oversubscribed on 1**. Always pair it with `nproc`.

**Rule of thumb:** the answer is in `dmesg`, `df -i`, or `free -h` far more often than in the application logs.

______________________________________________________________________

## 5. CPU and Memory

### Reading `free -h` correctly

The single most misread number on Linux:

```
              total   used   free   shared  buff/cache   available
Mem:           15Gi   6Gi    300Mi   1Gi      9Gi         8Gi
```

`free` being near zero is **normal and good** — Linux uses otherwise-idle RAM for page cache and hands it back on demand. The number that matters is **`available`**: how much a new process could actually get. Alarm on `available`, never on `free`.

### When memory runs out

```
dmesg -T | grep -i -E 'killed process|out of memory'    # did the OOM killer fire?
ps aux --sort=-%mem | head -10                          # who is biggest now
systemd-cgtop -m                                        # memory by cgroup/service
```

If the OOM killer fired, the log names the victim and its RSS. That is your leak, or your undersized box.

### CPU saturation

```
uptime; nproc                     # load vs cores
top -o %CPU                       # per-process
pidstat 1 5                       # per-process over time
vmstat 1 5                        # r = run queue, st = steal time
```

High `wa` (I/O wait) means the CPU is idle *waiting for disk* — the fix is in §6, not here. High `st` means the hypervisor is starving you: that's a hosting problem, not a code problem.

______________________________________________________________________

## 6. Disk: The Three Ways It Fills Up

This is the section worth reading twice. `No space left on device` has **three distinct causes**, and only one of them is what people assume.

```
flowchart TD
    S[Writes fail: No space left on device] --> A{df -h shows 100%?}
    A -->|No| B{df -i shows IUse 100%?}
    B -->|Yes| C[Out of inodes: too many small files]
    B -->|No| D[Check quota, read-only remount, or a different mount point]
    A -->|Yes| E{Does du total agree with df used?}
    E -->|Yes| F[Genuinely full: find and delete large files]
    E -->|No| G[Deleted but still-open files: restart the holder]
```

### Cause 1 — Out of bytes

The ordinary case. `df -h` says 100%, and `du` agrees.

```
df -h                                        # which filesystem
du -xh / --max-depth=2 2>/dev/null | sort -rh | head -20
ncdu -x /                                    # interactive, if installed
journalctl --disk-usage                      # systemd logs are a common culprit
docker system df                             # so are container layers
```

The `-x` matters: it keeps `du` on one filesystem instead of wandering into `/proc` and network mounts.

### Cause 2 — Out of inodes

An **inode** is the metadata record for one file: its permissions, timestamps, size, and pointers to the data blocks. The filename lives in the directory; everything else about the file lives in the inode.

On **ext4 the number of inodes is fixed when the filesystem is created** and cannot be grown afterwards. `mke2fs` defaults to one inode per 16 KB of space. That is the whole trap: **if your average file is smaller than 16 KB, you run out of inodes before you run out of bytes.**

Concretely, on a 457 GB ext4 root filesystem:

```
$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p4  457G   55G  379G  13% /

$ df -i /
Filesystem       Inodes   IUsed    IFree IUse% Mounted on
/dev/nvme0n1p4 30466048 1070206 29395842    4% /
```

30.5 million inodes for 457 GB — one per ~16 KB, exactly the default. Thirteen percent of the space is used but only four percent of the inodes, so this box is healthy. Had it been filled with small files instead, `IUse%` would have hit 100% while `Avail` still read hundreds of gigabytes, and every write would fail with `ENOSPC` — a full disk that isn't full.

Finding the offender:

```
df -i                                        # confirm which filesystem
# count files per top-level directory, staying on one filesystem
for d in /*; do
  printf '%8s  %s\n' "$(find "$d" -xdev 2>/dev/null | wc -l)" "$d"
done | sort -rn

# then drill down
find /var -xdev -printf '%h\n' 2>/dev/null | sort | uniq -c | sort -rn | head -20
```

The usual suspects, all of which are millions of tiny files:

| Source                           | Typical path             |
| -------------------------------- | ------------------------ |
| PHP / framework session files    | `/var/lib/php/sessions`  |
| Mail spool                       | `/var/spool/`            |
| Unrotated or per-request logs    | `/var/log/`              |
| Container layers and build cache | `/var/lib/docker/`       |
| Package manager caches           | `/var/cache/`            |
| JavaScript dependencies          | `node_modules/` anywhere |

Fixes, in order of preference: **delete the files** (usually a missing cleanup cron or logrotate rule); **move that tree to its own filesystem**; or, as a last resort, **recreate the filesystem** with `mkfs.ext4 -i 4096` or `-N <count>` — which means backup and restore, since it cannot be done in place.

**XFS does not have this problem** — it allocates inodes dynamically. If you are formatting a box that will hold many small files and you have the choice, that is a real argument for XFS.

### Cause 3 — Deleted but still open

The one that wastes an afternoon. `df` says full, `du` says the files aren't there, and there is nothing left to delete.

When a process holds a file open, deleting the directory entry does **not** free the blocks. The kernel keeps them until the last file descriptor closes. Classic trigger: someone `rm`s a 40 GB log that an application is still writing to.

```
lsof +L1                        # open files with a link count of 0 = deleted but held
lsof -nP | grep '(deleted)'     # same idea, more portable
```

The fix is **not** `rm`. Restart or signal the holding process — for a log, `systemctl restart <service>` or a `logrotate` `copytruncate`. Space returns instantly.

**Rule of thumb:** when a disk is full, run `df -h`, then `df -i`, then `lsof +L1`. Three commands, three different diseases, thirty seconds.

______________________________________________________________________

## 7. Network, Ports, and Exposure

### What is listening

```
ss -tulpn              # TCP/UDP listening sockets with owning process
ss -s                  # summary of socket states
ip -brief address      # interfaces and IPs
```

`ss` replaces `netstat`, which is deprecated and often not installed on modern distros.

### Traffic and reachability

```
ping -c 4 host                    # basic reachability
mtr host                          # traceroute + loss, the better tool
curl -sSv https://host/path       # what actually happens at L7
iftop / nload / bmon              # live bandwidth by connection
dig +short name                    # DNS resolution
```

### The exposure chain

Everything public should sit behind a firewall and a reverse proxy, with the application bound to localhost:

```
flowchart LR
    I[Internet] --> F[Firewall: ufw or cloud security group]
    F --> N[nginx on 80/443]
    N --> A[App on 127.0.0.1:8000]
    A --> D[(Database on private network)]
```

```
ufw status verbose
ufw allow 22/tcp && ufw allow 80,443/tcp && ufw enable
nginx -t && systemctl reload nginx    # ALWAYS test config before reload
```

Three rules that prevent most incidents:

- **Bind services to `127.0.0.1`**, not `0.0.0.0`, unless they are genuinely public. A database listening on a public interface will be found within hours.
- **Terminate TLS at the proxy.** Use [certbot](https://certbot.eff.org/) for certificates and generate the TLS config from [Mozilla's SSL Configuration Generator](https://ssl-config.mozilla.org/) rather than copying a blog post.
- **Never `systemctl reload nginx` without `nginx -t` first.** A syntax error takes the site down until you notice.

See [Networking & the Web](https://locchh.github.io/sw-handbook/software/basics/networking/index.md) for the protocol layer beneath this, and [Security](https://locchh.github.io/sw-handbook/software/basics/security/index.md) for the threat model.

______________________________________________________________________

## 8. Containers and Orchestration

Containers move the same four resources around; they don't remove them. Two failure modes dominate — and for watching containers once they are running, see §9.

### Docker eats the disk

Images, stopped containers, volumes, build cache, and **container logs** all accumulate silently under `/var/lib/docker`.

```
docker system df                  # what is using space
docker system df -v               # itemised
docker system prune -a            # reclaim: images, containers, networks, build cache
docker volume ls -qf dangling=true | xargs -r docker volume rm
```

Container logs grow without bound by default. Cap them in `/etc/docker/daemon.json`:

```
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
```

### Kubernetes needs requests and limits

A pod with no `resources` block can consume the whole node and take its neighbours with it.

```
kubectl top nodes                 # node-level utilisation
kubectl top pods -A               # per-pod
kubectl describe node <node>      # allocatable vs requested, eviction pressure
kubectl get events -A --sort-by=.lastTimestamp
```

Set **requests** (what the scheduler reserves) and **limits** (the hard ceiling) on everything. A memory limit turns a node-wide outage into one restarted pod — which is the entire point.

**Rule of thumb:** the orchestrator only protects you from what you told it to reserve. Unbounded pods are unbounded blast radius.

______________________________________________________________________

## 9. Watching Containers

Container tooling answers two different questions, and mixing them up is why people install a dashboard and then discover they still have no history:

- **"What is running, and can I restart it?"** → a **management UI**. Live state, logs, shell access. No memory of yesterday.
- **"How has it behaved over time, and will it wake me up?"** → a **metrics and logs pipeline**. Time series, retention, alerting.

You want one of each. Neither substitutes for the other.

### The pipeline

The standard open-source shape, and what each piece is for:

```
flowchart LR
    C[Containers] --> CA[cAdvisor]
    H[Host OS] --> NE[node_exporter]
    CA --> P[(Prometheus)]
    NE --> P
    C --> AL[Grafana Alloy]
    AL --> LK[(Loki)]
    P --> G[Grafana]
    LK --> G
    P --> AM[Alertmanager]
```

| Piece             | Role                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **cAdvisor**      | Reads per-container CPU, memory, disk, and network from the runtime; exposes them in Prometheus format. |
| **node_exporter** | The same for the host itself — the four resources from §5 and §6.                                       |
| **Prometheus**    | Scrapes those endpoints on an interval and stores the time series. The database, not the dashboard.     |
| **Grafana**       | Queries and draws. Reads from Prometheus, Loki, and most other things.                                  |
| **Loki**          | Log aggregation, indexed by label rather than full text — cheap to run next to Prometheus.              |
| **Grafana Alloy** | The collector that ships logs (and metrics/traces) into Loki.                                           |
| **Alertmanager**  | Turns Prometheus alert rules into pages, emails, and Slack messages.                                    |

Promtail is end of life

If you follow an older tutorial you will be told to ship logs to Loki with **Promtail**. Promtail reached **end of life on 2 March 2026**; all further development is in **Grafana Alloy**, and the Loki docs ship a tool that converts a Promtail config to an Alloy one in a single command. Start with Alloy. ([Loki: Promtail agent](https://grafana.com/docs/loki/latest/send-data/promtail/), [migrate to Alloy](https://grafana.com/docs/loki/latest/setup/migrate/migrate-to-alloy/))

### Picking by situation

| Situation                                       | Reach for                                                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **One box, want answers in 5 minutes**          | [Netdata](https://github.com/netdata/netdata) — one install, per-second metrics, dashboards with no configuration |
| **One box, want to manage containers by hand**  | [Portainer](https://docs.portainer.io/) CE, plus [Dozzle](https://github.com/amir20/dozzle) for logs              |
| **Terminal only, over SSH**                     | [lazydocker](https://github.com/jesseduffield/lazydocker)                                                         |
| **A handful of boxes, want history and alerts** | Prometheus + Grafana + cAdvisor + node_exporter                                                                   |
| **Also want centralised logs**                  | Add Loki + Alloy to the above                                                                                     |
| **"Is my site up?" from outside**               | [Uptime Kuma](https://github.com/louislam/uptime-kuma) — run it somewhere *else*                                  |
| **Kubernetes**                                  | kube-prometheus-stack; `kubectl top` for a quick look                                                             |

### Tool status

Ecosystem churn is real, and stale tutorials recommend dead tools. Snapshot **as of August 2026** — re-check any of these with `curl -s https://github.com/<owner>/<repo>/releases.atom | grep -m1 updated`:

| Tool                                                      | What it is                                       | Latest release |
| --------------------------------------------------------- | ------------------------------------------------ | -------------- |
| [Grafana Alloy](https://grafana.com/docs/alloy/latest/)   | Telemetry collector (OpenTelemetry distribution) | 2026-08        |
| [Portainer](https://github.com/portainer/portainer)       | Container management UI                          | 2026-08        |
| [Netdata](https://github.com/netdata/netdata)             | Zero-config real-time monitoring                 | 2026-08        |
| [Dozzle](https://github.com/amir20/dozzle)                | Live container log viewer in the browser         | 2026-08        |
| [Uptime Kuma](https://github.com/louislam/uptime-kuma)    | Self-hosted uptime monitoring                    | 2026-08        |
| [cAdvisor](https://github.com/google/cadvisor)            | Per-container metrics exporter                   | 2026-07        |
| [lazydocker](https://github.com/jesseduffield/lazydocker) | Terminal UI for Docker                           | 2026-04        |
| [Beszel](https://github.com/henrygd/beszel)               | Lightweight server monitoring hub                | 2026-04        |
| [ctop](https://github.com/bcicen/ctop)                    | Terminal container metrics                       | ⚠️ 2022-03     |
| [Watchtower](https://github.com/containrrr/watchtower)    | Automatic container updates                      | ⚠️ 2023-11     |

The two marked entries have had no release in years. `ctop` still works but `lazydocker` is the maintained equivalent. For Watchtower, the community has moved to the [`nicholas-fedor/watchtower`](https://github.com/nicholas-fedor/watchtower) fork, which is actively released — though see the warning about auto-updates below.

Portainer's Community Edition is open source and enough for most self-hosting. Business Edition adds RBAC and richer auth, and is [free for up to three nodes](https://docs.portainer.io/sts/faqs/licensing.md).

### Your monitoring stack will try to fill your disk

This is the part tutorials skip, and it loops straight back to §6. **A Prometheus TSDB and a Loki chunk store are exactly the "millions of small files" pattern that exhausts inodes** — as is an uncapped `json-file` log driver. The stack you installed to warn you about disk usage is a leading cause of it.

Set retention deliberately, on day one:

```
# Prometheus: cap by time and/or by size
--storage.tsdb.retention.time=15d
--storage.tsdb.retention.size=20GB

# Loki: set retention_period in limits_config, and enable the compactor
#   limits_config: { retention_period: 720h }
#   compactor:     { retention_enabled: true }

# Check what it is actually costing you
docker system df -v
df -i                       # inodes, not just bytes
```

### Pitfalls

- **Mounting the Docker socket is granting root.** Portainer, Dozzle, Watchtower, and lazydocker all want `/var/run/docker.sock`. Anything that can talk to that socket can start a privileged container and own the host. Mount it read-only where the tool supports it, never expose such a container to the internet, and prefer a socket proxy that whitelists API endpoints.
- **Do not publish dashboards.** Grafana, Portainer, and Prometheus on a public port are an invitation — Prometheus in particular has no authentication at all by default. Bind to localhost and reach them over an SSH tunnel or a VPN, or put them behind the authenticated proxy from §7.
- **Automatic updates cut both ways.** Watchtower-style auto-pulling means an upstream tag change can roll a breaking release into production at 3am unattended. Pin digests for anything that matters, and let it auto-update only what you can afford to lose.
- **Monitoring is not free.** Per-second collection across many containers costs real CPU and disk. On a small VPS, sample less often rather than dropping monitoring entirely.

**Rule of thumb:** one management UI, one metrics pipeline, retention capped on both, and nothing on a public port.

______________________________________________________________________

## 10. Operational Baseline

The unglamorous work that prevents most incidents:

| Practice                       | Concretely                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| **Monitor the four resources** | Pick a stack from §9. Whatever you choose, alert on disk **and inode** percentage. |
| **Rotate logs**                | `logrotate` for files, `SystemMaxUse=` in `journald.conf`, `max-size` for Docker.  |
| **Cap what grows**             | Every cache, upload directory, and log needs an eviction policy on day one.        |
| **Patch**                      | `unattended-upgrades` for security updates; reboot on kernel updates.              |
| **Back up, and restore**       | A backup you have never restored is a hypothesis. Test it.                         |
| **Harden SSH**                 | Keys only, no root login, no password auth.                                        |
| **Alert before the cliff**     | 80% disk, not 100%. You need time to react.                                        |

Alert on **inode usage** as well as byte usage. Almost nobody does, and it is the same one-line change in every monitoring tool.

______________________________________________________________________

## 11. Runbooks

### Disk full

1. `df -h` — which filesystem, and is it really at 100%?
1. `df -i` — inodes exhausted? If yes, jump to the small-file hunt in §6.
1. `du -xh / --max-depth=2 | sort -rh | head -20` — where are the bytes?
1. If `du` disagrees with `df`: `lsof +L1`, then restart the holding process.
1. Clear the safe wins: `journalctl --vacuum-size=200M`, `docker system prune -a`, `apt clean`.
1. Fix the cause — add rotation or eviction — then raise the alert threshold to 80%.

### Out of memory

1. `dmesg -T | grep -i 'killed process'` — did the OOM killer fire, and on whom?
1. `ps aux --sort=-%mem | head` — current largest consumers.
1. Watch RSS over time; a steady climb is a leak, a spike is a workload.
1. Short term: add swap or resize. Long term: fix the leak or cap the service with a systemd `MemoryMax=`.

### Load is high, app is slow

1. `uptime` against `nproc` — is the run queue actually oversubscribed?
1. `vmstat 1 5` — is it `r` (CPU), `wa` (disk), `si/so` (swapping), or `st` (steal)?
1. Follow the winner: CPU → `top`/`pidstat`; disk → `iostat -xz`; swap → §5; steal → change host.
1. Only then read application logs.

### Port not reachable

1. `ss -tulpn` on the box — is anything listening, and on which interface?
1. Bound to `127.0.0.1` when it should be `0.0.0.0`? That's the answer more often than not.
1. `ufw status` and the cloud provider's security group — two firewalls, both must allow it.
1. From outside: `curl -sSv` / `mtr` to separate DNS, routing, and application failures.

______________________________________________________________________

## Command Reference

| Resource          | Commands                                                              | What you are looking for                             |
| ----------------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| **Overview**      | `uptime`, `htop`, `glances`, `dstat`                                  | Load vs `nproc`; anything obviously pegged           |
| **CPU**           | `top -o %CPU`, `pidstat 1`, `vmstat 1`, `mpstat -P ALL`               | Run queue `r`, steal `st`, I/O wait `wa`             |
| **Memory**        | `free -h`, `ps aux --sort=-%mem`, `smem`, `systemd-cgtop`             | `available` (not `free`); OOM kills in `dmesg`       |
| **Disk space**    | `df -h`, `df -i`, `du -xh`, `ncdu`, `lsof +L1`                        | Bytes, **inodes**, deleted-but-open files            |
| **Disk I/O**      | `iostat -xz 1`, `iotop`, `biotop`                                     | `%util` with `await`; queue depth                    |
| **Network**       | `ss -tulpn`, `mtr`, `iftop`, `nload`, `dig`, `tcpdump`                | Listeners, loss, per-connection bandwidth            |
| **Processes**     | `ps auxf`, `pstree`, `lsof -p`, `strace -p`                           | Parentage, open files, syscall stalls                |
| **Logs**          | `journalctl -u X -f`, `journalctl --disk-usage`, `dmesg -T`           | Service errors, OOM, disk and link errors            |
| **Containers**    | `docker system df -v`, `docker stats`, `ctr`/`nerdctl`, `kubectl top` | Layer/volume growth, per-container limits            |
| **Container UIs** | `lazydocker`, Portainer, Dozzle, Netdata                              | Live state and logs; see §9 for the metrics pipeline |

`htop` and `ncdu` are worth installing on every box you will visit twice.

______________________________________________________________________

## References

- [The USE Method](https://www.brendangregg.com/usemethod.html) — Brendan Gregg. The checklist §3 is built on.
- [Linux Performance](https://www.brendangregg.com/linuxperf.html) — Gregg's index of tools, tracing, and the 60-second checklist. The canonical starting point.
- [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) — Google SRE Book, on the Four Golden Signals and what deserves an alert.
- [Linux man-pages](https://man7.org/linux/man-pages/) — authoritative reference; see [`proc(5)`](https://man7.org/linux/man-pages/man5/proc.5.html) for what the tools above are actually reading.
- [ext4 documentation](https://www.kernel.org/doc/html/latest/filesystems/ext4/index.html) and [XFS documentation](https://docs.kernel.org/filesystems/xfs/index.html) — the inode behaviour in §6.
- [Julia Evans](https://jvns.ca/) — the clearest explanations anywhere of `strace`, networking, and how Linux actually works.
- [nginx documentation](https://nginx.org/en/docs/) · [Mozilla SSL Config Generator](https://ssl-config.mozilla.org/) · [certbot](https://certbot.eff.org/)
- [Docker: prune unused objects](https://docs.docker.com/engine/manage-resources/pruning/) · [Kubernetes: resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- Container observability (§9): [Prometheus](https://prometheus.io/docs/introduction/overview/) · [Grafana](https://grafana.com/oss/grafana/) · [Grafana Alloy](https://grafana.com/docs/alloy/latest/) · [Loki](https://grafana.com/oss/loki/) · [cAdvisor](https://github.com/google/cadvisor) · [node_exporter](https://github.com/prometheus/node_exporter)
- Container management (§9): [Portainer docs](https://docs.portainer.io/) · [Netdata](https://github.com/netdata/netdata) · [Dozzle](https://github.com/amir20/dozzle) · [lazydocker](https://github.com/jesseduffield/lazydocker) · [Uptime Kuma](https://github.com/louislam/uptime-kuma) · [Beszel](https://github.com/henrygd/beszel)
- [Arch Wiki: systemd](https://wiki.archlinux.org/title/Systemd) — distro-agnostic and consistently the best-written Linux documentation on the web.
- [Ubuntu Server documentation](https://ubuntu.com/server/docs) · [DigitalOcean community tutorials](https://www.digitalocean.com/community/tutorials)
