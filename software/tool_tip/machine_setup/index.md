# Machine Setup

A checklist for getting a fresh Ubuntu/Debian machine ready for development. Run top to bottom on a new box; cherry-pick when adding one tool. For the commands themselves, see [Linux Commands](https://locchh.github.io/sw-handbook/software/tool_tip/linux_commands/index.md); for the tools worth installing beyond the essentials here, see [Tools](https://locchh.github.io/sw-handbook/software/tool_tip/tools/index.md); for keeping a *server* healthy once it is running, see [Running a Server](https://locchh.github.io/sw-handbook/software/tool_tip/server_operations/index.md).

## Login

- Login Google
- Gen `ssh-keygen`, login Github

## Some prerequisites

```
# Curl
sudo apt install curl

# Git
sudo apt install git

# JQ
sudo apt install jq

# Yamllint
sudo apt install yamllint
```

## Install IDE

- [Install Windsurf](https://windsurf.com/download/editor)
- [Install VSCode](https://code.visualstudio.com/download) (optional)
- [Install Claude Code](https://code.claude.com/docs/en/quickstart): `curl -fsSL https://claude.ai/install.sh | bash`

## Install UV

`curl -LsSf https://astral.sh/uv/install.sh | sh`

[Doc](https://docs.astral.sh/uv/getting-started/installation/)

## Install Nodejs

For Ubuntu/Debian (using NodeSource - recommended for latest version):

```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# For Ubuntu/Debian (default repo version):
sudo apt install nodejs npm

# Verify installation:
node --version
npm --version
```

## Install Docker

For Ubuntu/Debian-based Systems

```
sudo apt update
sudo apt install ca-certificates curl
```

Add Docker's official GPG key:

```
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Add Docker repository:

```
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

Install Docker Engine:

```
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify:

```
sudo docker run hello-world
```

Optional: Run Docker without sudo

```
sudo usermod -aG docker $USER
newgrp docker
```
