# Literature Update Protocol

## Search window

Record an explicit search date and query window. Use arXiv, OpenReview, official proceedings, author project pages, and official repositories/model cards. Community awesome lists may seed candidates but never serve as the sole evidence source.

## Screening

1. Title/abstract screen for a robot-relevant evaluator signal.
2. Full-paper or official-page screen for output semantics, supervision, inputs, and downstream role.
3. Artifact audit for code, weights, data, benchmark, and licenses separately.
4. Assign a primary semantics family and secondary tags with an evidence note.
5. For policy/world-model-coupled systems, record the coupling pattern and whether the value is independently queryable at inference.
6. Log exclusions when a plausible candidate is outside scope.
7. For robot datasets, record the arm, gripper, real/sim domain, task family, sensor views, and the unit behind every reported count.
8. Tag failure supervision as `real_executed`, `sim_executed`, `counterfactual`, `world_model_synth`, `weak_auto`, `expert_only`, `arena_scored`, or `evaluation_only`; do not infer physical failure from real-source imagery.
9. For arenas and challenges, record the task rubric, stage/critical-step definition, partial-credit rule, retry penalty, rollout count, human/automatic grader, public run artifacts, and robot instance separately.
10. For generative failure pipelines, record the source episode, generator/version, intervention type/parameters, event keyframe, seed, verifier scores, correction derivation, and whether the generated failure was ever executed on hardware.
11. For benchmarks, record the evaluation unit, label source, reality/provenance, split policy, capabilities, metrics, baseline protocol, artifact state, and whether the test is independent or model-native.

## Primary semantics

- `outcome`: task success, completion, or discrete outcome.
- `absolute_progress`: current task progress or completion state.
- `relative_preference`: pairwise ordering, progress delta, preference, or advantage.
- `temporal_value`: trajectory-contextual, stage-aware, or future-conditioned value.
- `hybrid_verifier`: multiple reward heads or explicit process/outcome/verifier decomposition.
- `data_resource`: failure/recovery supervision or benchmark without a central reward model.
- `adjacent_interface`: system use of evaluator-like signals, retained as boundary context.

## Model coupling (cross-cutting)

Architecture does not replace reward semantics. Use `model_coupling` only when a task-conditioned value, progress, advantage, reward, or critic signal is explicitly predicted.

- `standalone_evaluator`: evaluator is separable from the policy/world model.
- `policy_internal`: auxiliary value/progress heads share the policy representation.
- `joint_world_action_value`: one generative model predicts future state, action, and value.
- `compositional_world_value`: separate dynamics and value modules jointly drive planning or policy improvement.
- `shared_backbone_multi_interface`: one backbone exposes distinct action and execution-monitoring interfaces.
- `value_world_model`: value is coupled to generative foresight but the model does not itself generate actions.

Also record `value_availability` as `inference_queryable`, `training_only`, `internal_control_only`, or `unknown`. Do not include a VLA/world model merely because it predicts actions or future observations.

## Benchmark audit

Use [`registry/benchmarks.yaml`](../registry/benchmarks.yaml) for benchmark-specific metadata. Tag each entry as `direct_reward`, `diagnostic`, `model_native`, or `downstream_source`; do not compare these categories as if they measured the same target.

- Direct reward tests must state whether the target is outcome, ordinal progress, dense value, relative ordering, calibration, onset, or recovery.
- Diagnostic tests such as process QA and failure verification are supporting capability evidence, not substitutes for calibrated reward evaluation.
- Model-native test sets must be reported separately from independent or hidden external tests.
- Report `N/A` for unsupported capabilities and a profile across axes; do not fabricate a single aggregate score by imputing missing tests.
- A downstream policy gain must use a frozen policy/optimizer protocol and remain separate from evaluator-quality metrics.
- Any derived benchmark item must inherit its source episode, view, transformation, generator version, and provenance for leakage control.

## Version policy

The README is a living overview. `registry/papers.yaml` is the authoritative metadata record. A camera-ready paper or benchmark release should use a frozen registry tag; later papers stay in the living registry until the next formal freeze.

## Quality checks

- Links point to original/official sources.
- Dates and venues are not inferred from filenames or third-party posts.
- Preprints are labelled as preprints.
- Author-reported results remain author-reported until independently reproduced.
- No model is normalized to a different output semantics merely to fit a common table.
- Policy success does not substitute for direct value calibration, ranking, or error evaluation.
- The record distinguishes inference-queryable value outputs from training-only auxiliary critics.
- Unsupported benchmark capabilities remain `N/A`, not coerced scores.
- Parent-dataset overlap, episode overlap, view overlap, and derived-prompt overlap are reported separately.
- Raw episodes, video–language annotations, temporal pairs, and VQA items are never compared as though they were the same unit.
- Robot/gripper names remain `not_reported` when a primary source does not specify them; conflicting metadata is preserved as a conflict.
- A human-authored stage rubric is not called a frame-level annotation unless temporal boundaries are present in the released episode data.
- Real source imagery does not make a world-model-generated counterfactual a `real_executed` failure; validate synthetic models on held-out physical failures.
- Benchmark reports include invalid-output rate, uncertainty/confidence intervals, and per-task/per-robot/per-provenance slices rather than only a pooled mean.
