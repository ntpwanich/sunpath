### Code comment rule

Write self-documenting code: prefer rename/extract over commenting; no commented-out code.
Comment only the why code can't express, and keep it self-contained: the reader understands
it without opening anything outside the code — so no ADR / issue / spec references
(ADRs are a private workflow, invisible to the team). Traceability runs docs → code,
never code → docs. Existing `ADR-XXXX` / `#NNN` comments stay; clean up only lines
you're already touching.