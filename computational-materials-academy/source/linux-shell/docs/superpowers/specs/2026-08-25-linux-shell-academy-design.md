# Linux / Shell Academy · VASP Research Edition — Design

## Goal
A browser-only Linux/Shell trainer for scientific/HPC work. It teaches transferable shell skills and uses VASP/PBS workflows as realistic scenarios. It never executes user commands.

## Experience
- Fullscreen black/gold hero with particle-built “LINUX / SHELL”. Mouse repels particles in ripple-like waves; particles spring back.
- First downward scroll fades/blurs/moves hero upward and reveals the learning workspace.
- Sticky frosted left chapter directory; glassmorphism content panels on the right.
- 30 chapters, each with teaching content, examples, mistakes, habits, recap, and >=6 exercises.
- One-question-at-a-time terminal trainer. Refresh randomizes and clears state. Correct => BINGO, small burst, auto-next. Wrong => WRONG, stay on question.
- Local progress in localStorage.
- Coverage & Sources audit panel.

## Safety
No shell command is executed. Validation is string/semantic parsing only. Dangerous broad deletion commands are rejected unless a prompt explicitly targets a safe scoped deletion.

## Content sourcing
VASP-specific material is paraphrased from VASP Wiki, VASP Tutorials and representative VASP Forum issue classes. Source metadata is visible from exercise disclosures. The app explicitly does not claim exhaustive coverage of every forum post.

## Architecture
Static ES modules with no runtime dependencies, so the final artifact can run locally. Modules: curriculum data, validator, UI/app controller, particle hero, stylesheet. Node’s built-in test runner verifies validator behavior and curriculum integrity.
