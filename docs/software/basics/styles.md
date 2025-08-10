# My Software Style

## My Favorite Folder Name

- `locch`
- `src`, `utils`, `tests`, `data`
- `docs`, `assets`, `pics`, `imgs`, `logs`, `models`
- `tmp`, `snap`, `notes`, `notebooks`, `misc`

My folder name style reflects the following qualities:
- **Intentional but Flexible Structure**: I separate core logic, data, documentation, and experiments into clearly defined spaces while allowing room for exploration.
- **✨ Minimalistic and Meaningful**: All names are short (1 word), lowercase, and to the point. If a single word doesn’t express enough meaning, I prefer **retro-style abbreviations** — inspired by the 80s/90s developer habits — to preserve brevity and clarity.

### 🔧 Core Code & Logic

| Name  | Meaning                    |
| ----- | -------------------------- |
| `src` | Source code (standard)     |
| `lib` | Reusable libraries/modules |
| `bin` | Executables / scripts      |
| `cfg` | Configuration              |

### 🧪 Development & Testing

| Name  | Meaning                 |
| ----- | ----------------------- |
| `tst` | Tests                   |
| `exp` | Experiments             |
| `dbg` | Debugging tools or logs |
| `wrk` | In-progress or WIP code |

### 📁 Documentation & Support

| Name  | Meaning                      |
| ----- | ---------------------------- |
| `doc` | Documentation                |
| `mds` | Markdown files               |
| `ref` | Reference materials          |
| `rsc` | Resources (images, fonts...) |

### 🧠 Notes & Ideas

| Name  | Meaning                      |
| ----- | ---------------------------- |
| `ntx` | Notes (text-based)           |
| `nbk` | Notebooks (e.g., Jupyter)    |
| `ide` | Ideas, drafts                |
| `sth` | Scratch thoughts (raw notes) |

### 🧹 Temporary / Utility

| Name  | Meaning                 |
| ----- | ----------------------- |
| `tmp` | Temporary files         |
| `snx` | Snapshots (like `snap`) |
| `bak` | Backups                 |
| `zzz` | Archived or deprecated  |

### 📊 Data

| Name  | Meaning               |
| ----- | --------------------- |
| `dat` | Raw or processed data |
| `csv` | Tabular datasets      |
| `dbf` | Flat DB-style files   |
| `mdl` | Models or weights     |

### 🧩 Shortcodes

* `locch/` — your personal sandbox
* `zsrc/` — experimental source code
* `xnb/` — exploratory notebooks

## My Favorite File Name

I follow the same principles in file naming as I do with folders: **short**, **purpose-driven**, and easy to grep or autocomplete.

- **Lowercase with underscores** for readability: `data_loader.py`, `train_model.py`
- Avoid spaces, camelCase, or vague names like `misc.py`
- Prefix files for grouping, e.g., `utils_`, `cfg_`, `test_`

## My Favorite Code Component Name
- Functions **do** things → they should sound like actions (e.g., `load_data()`, `train_model()`) and must start with a verb
- Classes **represent** things → they should sound like objects or concepts (e.g., `DataLoader`, `SnapRunner`) and must start with a noun
- Constant must be **UPPERCASE**

## Code Conventions

- Constants are in **UPPERCASE**
- Use **snake_case** for variable names
- Use **camelCase** for function names
- Use **PascalCase** for class names
- Use `_` at the start of a function name to annotate a internal function
- The Lenght of a line of code should be less than 88 characters