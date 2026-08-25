# Linux / Shell Academy Implementation Plan

> **For agentic workers:** implement task-by-task with tests before production behavior.

**Goal:** Build the complete interactive Linux/Shell training website with VASP/HPC exercises, particle hero, semantic answer checking and two-round audits.

**Architecture:** Dependency-free ES modules in browser, Node tests for validator/data. Canvas 2D particle hero. localStorage for progress.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Canvas 2D, Node 22 built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-25-linux-shell-academy-design.md`

## Tasks
1. Write validator tests, implement safe normalization and validators.
2. Write data-integrity tests, create 30 chapters and 180+ exercises with sources.
3. Build trainer state/UI and localStorage behavior.
4. Build particle hero + scroll reveal + reduced-motion fallback.
5. Build black/gold glass design and responsive navigation.
6. Add Coverage & Sources audit view.
7. Run automated tests and static checks; create distribution ZIP.
