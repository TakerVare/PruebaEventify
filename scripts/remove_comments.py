"""
Script para eliminar comentarios de archivos en frontend/ y backend/.
Crea copias de seguridad en .comment_backups/<timestamp>/

Usos: python scripts/remove_comments.py
"""
import os
import re
import sys
import shutil
from datetime import datetime

ROOTS = ["frontend", "backend"]
EXTS = {
    "c_like": {".cs", ".ts", ".js", ".css", ".scss", ".http", ".json"},
    "html_like": {".html", ".vue", ".csproj", ".xml", ".md"},
}

BACKUP_DIR = os.path.join(".comment_backups", datetime.now().strftime("%Y%m%d_%H%M%S"))


def remove_c_style_comments(text):
    # State machine to remove // line comments and /* */ block comments
    i = 0
    n = len(text)
    out = []
    in_s = False
    s_delim = None
    in_verbatim = False
    in_char = False
    while i < n:
        ch = text[i]
        nxt = text[i+1] if i+1 < n else ''
        if in_s:
            out.append(ch)
            if in_verbatim:
                # verbatim strings use double quotes "" to escape
                if ch == '"' and i+1 < n and text[i+1] == '"':
                    out.append(text[i+1])
                    i += 1
                elif ch == '"':
                    in_s = False
                    in_verbatim = False
            else:
                if ch == '\\':
                    if i+1 < n:
                        out.append(text[i+1]); i += 1
                elif ch == s_delim:
                    in_s = False
            i += 1
            continue
        if in_char:
            out.append(ch)
            if ch == "'":
                in_char = False
            elif ch == '\\' and i+1 < n:
                out.append(text[i+1]); i += 1
            i += 1
            continue
        # not in string/char
        if ch == '"' or ch == "'":
            # check for @" (C# verbatim) or $@" interpolated verbatim; look backwards for @ or $
            prev = text[i-1] if i-1 >= 0 else ''
            if ch == '"' and prev == '@':
                in_s = True; s_delim = '"'; in_verbatim = True
                out.append(ch); i += 1; continue
            if ch == '"':
                in_s = True; s_delim = '"'; in_verbatim = False
                out.append(ch); i += 1; continue
            if ch == "'":
                in_char = True
                out.append(ch); i += 1; continue
        if ch == '/' and nxt == '/':
            # skip until newline
            i += 2
            while i < n and text[i] != '\n':
                i += 1
            continue
        if ch == '/' and nxt == '*':
            i += 2
            while i < n-1:
                if text[i] == '*' and text[i+1] == '/':
                    i += 2
                    break
                i += 1
            continue
        out.append(ch)
        i += 1
    return ''.join(out)


def remove_html_comments(text):
    return re.sub(r'<!--([\s\S]*?)-->', '', text)


def process_file(path):
    rel = os.path.relpath(path)
    ext = os.path.splitext(path)[1].lower()
    try:
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
    except Exception:
        return False, 'binary_or_unreadable'
    original = text
    modified = text
    if ext in EXTS['html_like']:
        modified = remove_html_comments(modified)
        # also remove c-like comments inside (for .vue scripts/styles)
        modified = remove_c_style_comments(modified)
    elif ext in EXTS['c_like']:
        modified = remove_c_style_comments(modified)
    else:
        # for other extensions, try both removers conservatively
        modified = remove_html_comments(modified)
        modified = remove_c_style_comments(modified)
    if modified != original:
        # write backup
        backup_path = os.path.join(BACKUP_DIR, rel)
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)
        with open(backup_path, 'w', encoding='utf-8') as bf:
            bf.write(original)
        # overwrite original
        with open(path, 'w', encoding='utf-8') as f:
            f.write(modified)
        return True, 'modified'
    return False, 'unchanged'


def main():
    files_processed = 0
    files_modified = 0
    files_skipped = 0
    os.makedirs(BACKUP_DIR, exist_ok=True)
    for root in ROOTS:
        if not os.path.isdir(root):
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            for fn in filenames:
                path = os.path.join(dirpath, fn)
                # skip node_modules, bin, obj
                if any(part in ('node_modules', 'bin', 'obj', '.git') for part in path.split(os.sep)):
                    continue
                files_processed += 1
                ok, status = process_file(path)
                if ok and status == 'modified':
                    files_modified += 1
                elif not ok and status == 'binary_or_unreadable':
                    files_skipped += 1

    print(f"Processed: {files_processed} files")
    print(f"Modified: {files_modified} files")
    print(f"Skipped (binary/unreadable): {files_skipped} files")
    print(f"Backups stored in: {BACKUP_DIR}")

if __name__ == '__main__':
    main()
