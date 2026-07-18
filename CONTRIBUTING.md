# Contributing

Thanks for helping maintain the robotic reward-model literature registry.

## Before adding a work

Confirm that the work exposes, learns, evaluates, or directly supplies data for a task-conditioned robot-behavior evaluator. Generic VLA, robot-control, world-model, failure-management, or video-understanding papers belong only when an explicit reward/value/critic/verifier interface is central.

## Required evidence

Every entry must include:

- original paper or official proceedings URL;
- release/submission date and venue or `preprint` status;
- primary reward semantics plus secondary tags;
- inputs, supervision/data provenance, outputs, and downstream role;
- code, weights, data, benchmark, and license status as separate fields;
- source URL and the date each status was checked;
- a short evidence note explaining ambiguous classification.

Prefer official proceedings, arXiv, author project pages, official repositories, and official model/data cards. Discovery lists and third-party summaries are not sufficient evidence.

## Status language

- `available`: a working official link was verified.
- `claimed`: the authors state that an artifact is released, but a usable official link was not verified.
- `coming_soon`: the official page explicitly says it is forthcoming.
- `not_found`: no artifact was found during the recorded search.
- `unknown`: not yet audited.

Never infer weights from code, data from a paper, or a usable license from public visibility.

## Pull requests

Keep one logical literature update per pull request. Update both `README.md` and `registry/papers.yaml`, then add a dated note under `docs/updates/` describing:

1. search date and sources;
2. added or changed entries;
3. exclusions and reasons;
4. unresolved artifact/license questions.

Do not include third-party weights, datasets, or paper PDFs in this repository.
