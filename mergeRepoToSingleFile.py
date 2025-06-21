import argparse
import os

DEFAULT_IGNORED_FOLDERS = [
    ".turbo",
    "_generated",
    ".git",
    ".github",
    ".pnpm",
    "dist",
    "target",
    "venv",
    ".venv",
    "node_modules",
    "__pycache__",
    "build",
    "public"
]

DEFAULT_IGNORED_FILES = [
    "pnpm-lock.yaml",
    "go.sum",
    "Cargo.lock",
    "uv.lock",
    ".env",
    "flux",
    "README.md",
    "LICENSE",
    "NOTICE",
]


def generate_tree(
    path, prefix="", is_last=True, ignored_folders=None, ignored_files=None
):
    ignored_folders = list(set(DEFAULT_IGNORED_FOLDERS + (ignored_folders or [])))
    ignored_files = list(set(DEFAULT_IGNORED_FILES + (ignored_files or [])))

    output = []
    entries = os.listdir(path)
    entries = [
        e for e in entries if e not in ignored_folders and e not in ignored_files
    ]
    entries.sort()
    for i, entry in enumerate(entries):
        connector = "└── " if is_last and i == len(entries) - 1 else "├── "
        output.append(prefix + connector + entry)
        entry_path = os.path.join(path, entry)
        if os.path.isdir(entry_path):
            extension = "    " if is_last and i == len(entries) - 1 else "│   "
            output.extend(
                generate_tree(
                    entry_path,
                    prefix + extension,
                    i == len(entries) - 1,
                    ignored_folders,
                    ignored_files,
                )
            )
    return output


def combine_files(repo_path, output_file, ignored_folders=None, ignored_files=None):
    ignored_folders = list(set(DEFAULT_IGNORED_FOLDERS + (ignored_folders or [])))
    ignored_files = list(set(DEFAULT_IGNORED_FILES + (ignored_files or [])))

    with open(output_file, "w", encoding="utf-8") as outfile:
        # Write tree structure
        outfile.write("Repository Structure:\n")
        outfile.write("=" * 50 + "\n")
        tree = generate_tree(
            repo_path, ignored_folders=ignored_folders, ignored_files=ignored_files
        )
        outfile.write("\n".join(tree) + "\n\n")
        outfile.write("=" * 50 + "\n\n")

        for root, dirs, files in os.walk(repo_path):
            dirs[:] = [d for d in dirs if d not in ignored_folders]
            for file in files:
                if file in ignored_files:
                    continue
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, repo_path)

                # Write file path
                outfile.write(f"File: {relative_path}\n")
                outfile.write("=" * 50 + "\n")
                # Write file contents
                try:
                    with open(file_path, "r", encoding="utf-8") as infile:
                        outfile.write(infile.read())
                except UnicodeDecodeError:
                    outfile.write(
                        f"[Unable to read file: {relative_path}. It may be a binary file.]\n"
                    )
                except Exception as e:
                    outfile.write(f"[Error reading file {relative_path}: {e}]\n")
                # Write separator
                outfile.write("\n" + "-" * 50 + "\n\n")


def main():
    parser = argparse.ArgumentParser(
        description="Combine files from a repository into a single file."
    )
    parser.add_argument("repo_path", help="Path to the repository")
    parser.add_argument("output_file", help="Name of the output file")
    parser.add_argument(
        "--ignored-folders",
        nargs="*",
        default=[],
        help="List of folders to ignore (will merge with defaults)",
    )
    parser.add_argument(
        "--ignored-files",
        nargs="*",
        default=[],
        help="List of files to ignore (will merge with defaults)",
    )

    args = parser.parse_args()

    combine_files(
        args.repo_path, args.output_file, args.ignored_folders, args.ignored_files
    )
    print(f"All files have been combined into {args.output_file}")


if __name__ == "__main__":
    main()
