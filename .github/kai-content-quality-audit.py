#!/usr/bin/env python3
"""KAI non-blocking content originality audit.

Reports repeated long sentences across editorial HTML files.
Never edits content and never fails CI; intended as a handoff signal for editorial/SEO review.
"""
from pathlib import Path
from collections import defaultdict
import html, os, re

ROOT = Path(__file__).resolve().parents[1]
EDITORIAL_MARKERS = ("/blog/", "/articles/", "publisher/queue/")
SKIP_DIRS = {".git", "node_modules", "dist", "vendor"}
IGNORE_TERMS = (
    "privacy policy", "cookie policy", "all rights reserved", "cookie settings",
    "amazon and the amazon logo", "general information only"
)

def editorial(path: Path) -> bool:
    p = "/" + path.relative_to(ROOT).as_posix()
    return any(m in p for m in EDITORIAL_MARKERS)

files = [
    p for p in ROOT.rglob("*.html")
    if not any(part in SKIP_DIRS for part in p.parts) and editorial(p)
]

sentence_files = defaultdict(set)
display = {}
for path in files:
    raw = path.read_text("utf-8", errors="ignore")
    raw = re.sub(r"<(script|style|nav|footer)\b[\s\S]*?</\1>", " ", raw, flags=re.I)
    text = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    text = re.sub(r"\s+", " ", text).strip()
    for sentence in re.split(r"(?<=[.!?])\s+", text):
        s = sentence.strip()
        if not 60 <= len(s) <= 320:
            continue
        if len(re.findall(r"[A-Za-zÀ-ÿ\u0600-\u06FF]+", s)) < 10:
            continue
        key = re.sub(r"\s+", " ", s.lower())
        if any(term in key for term in IGNORE_TERMS):
            continue
        sentence_files[key].add(path.relative_to(ROOT).as_posix())
        display.setdefault(key, s)

rows = sorted(
    ((len(paths), display[k], sorted(paths)) for k, paths in sentence_files.items() if len(paths) >= 4),
    reverse=True,
)

lines = [
    "## KAI Content Originality Audit",
    "",
    f"Editorial HTML files scanned: **{len(files)}**",
    f"Repeated long sentences found in 4+ files: **{len(rows)}**",
    "",
]
for count, sentence, paths in rows[:20]:
    sample = ", ".join(paths[:3])
    lines += [f"- **{count} files** — {sentence[:220]}", f"  - examples: {sample}"]
if not rows:
    lines.append("- No high-frequency long-sentence duplication detected.")

report = "\n".join(lines) + "\n"
print(report)
summary = os.environ.get("GITHUB_STEP_SUMMARY")
if summary:
    with open(summary, "a", encoding="utf-8") as fh:
        fh.write(report)
