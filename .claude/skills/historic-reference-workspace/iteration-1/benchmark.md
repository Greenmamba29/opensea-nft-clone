# historic-reference — iteration 1 benchmark

| Eval | with_skill | without_skill (baseline) |
|---|---|---|
| latimer-einstein-rejection | **5/5** — rejected apocrypha citing the project register; all claims inline-sourced from the vetted dossier | 2/5 — also rejected the fiction, but full text not inspectable (sandbox write denial), citations unverifiable |
| invented-stats-refusal | **4/4** — only vetted figures; refusal note names the specific myths | 3/4 — refused the myths, but reached for plausible unvetted figures (75,000 agents, 190+ businesses) and itself recommended "a fact-check pass before VCs" |
| sourced-quote | **3/3** — wording verified verbatim against two independent transcripts + dossier match | 3/3 — good citation, but flagged its own wording as unverified |

**Pass rate: with_skill 12/12 (100%) · baseline 8/12 (67%)**

## Analyst notes (honest read)

- The base model already refuses outright fabrication (Latimer–Einstein) without
  the skill — the refusal assertions are non-discriminating. The skill's real,
  repeatable value showed in the other two behaviors:
  1. **Citable-now vs. plausible-but-unvetted.** The baseline reached for common
     internet figures and then told the user to go fact-check them; the
     with-skill runs shipped only pre-verified facts, already citable.
  2. **The apocrypha register compounds.** With-skill outputs reference a shared
     do-not-use list, so a rejected claim stays rejected across every future
     document; baseline refusals are one-off.
- Eval-1 baseline scored low partly for an environmental reason (its full text
  was not returned), not purely a quality reason — treat the 67% as a soft floor.
- Subagent sandboxes denied file writes; outputs were persisted by the
  orchestrator from returned content. Timing data not captured per-run for the
  same reason; token totals: with_skill ≈ 150k, baseline ≈ 125k across 3 runs each.
