# Contributing

Thanks for helping maintain the robotic reward-model literature registry.

## Before adding a work

Confirm that the work exposes, learns, evaluates, or directly supplies data for a task-conditioned robot-behavior evaluator. Generic VLA, robot-control, world-model, failure-management, or video-understanding papers belong only when an explicit reward/value/critic/verifier interface is central.

## Required evidence

Every entry must include:

- original paper or official proceedings URL;
- release/submission date and venue or `preprint` status;
- primary reward semantics plus secondary tags;
- for policy/world-model-coupled value prediction, the coupling pattern and whether the value is queryable at inference or only used during training/control;
- inputs, supervision/data provenance, outputs, and downstream role;
- code, weights, data, benchmark, and license status as separate fields;
- source URL and the date each status was checked;
- a short evidence note explaining ambiguous classification.

Prefer official proceedings, arXiv, author project pages, official repositories, and official model/data cards. Discovery lists and third-party summaries are not sufficient evidence.

## Status language

- `available`: a working official link was verified.
- `claimed`: the authors state that an artifact is released, but a usable official link was not verified.
- `coming_soon`: the official page explicitly says it is forthcoming.
- `placeholder`: an official repository exists but does not yet contain the promised implementation.
- `placeholder_empty`: an official data repository exists but has no usable data files at the verification date.
- `not_verified`: the artifact may be referenced, but a usable official release could not be confirmed during the audit.
- `not_found`: no artifact was found during the recorded search.
- `unknown`: not yet audited.

Never infer weights from code, data from a paper, or a usable license from public visibility.

## Coupled value predictors

Do not propose a VLA or world model solely because it predicts actions or future observations. A coupled-value entry must expose an explicit task-conditioned value, progress, reward, advantage, or critic target. Keep its reward meaning in `primary_semantics`; use `model_coupling` only for the architecture (`policy_internal`, `joint_world_action_value`, `compositional_world_value`, `shared_backbone_multi_interface`, or `value_world_model`).

## Benchmark contributions

Update [`registry/benchmarks.yaml`](registry/benchmarks.yaml) and the benchmark section of the README for any new evaluation resource. Record:

- benchmark type: `direct_reward`, `diagnostic`, `model_native`, or `downstream_source`;
- release date, evaluation unit, scale, embodiments, and real/sim/counterfactual provenance;
- exact targets and metrics, including unsupported capabilities as `N/A`;
- split and leakage controls, label source, baseline protocol, artifact/license status, and verification date;
- whether failures are typed, temporally localized, recoverable, or followed by a labelled recovery;
- a limitation note explaining what the benchmark cannot establish.

Do not present a model-native test set as an independent gold benchmark, or downstream policy success as a substitute for reward calibration and error analysis.

## Pull requests

Keep one logical literature update per pull request. Update `README.md` and the applicable paper, dataset, or benchmark registry, then add a dated note under `docs/updates/` describing:

1. search date and sources;
2. added or changed entries;
3. exclusions and reasons;
4. unresolved artifact/license questions.

Do not include third-party weights, datasets, or paper PDFs in this repository.
