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
