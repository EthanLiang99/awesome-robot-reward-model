# Robot Reward-Model Benchmarks

**Verified:** 2026-07-24
**Purpose:** map the existing evaluation landscape and define the requirements for a unified robot reward-model benchmark.

A reward-model benchmark is not the same thing as a policy benchmark or a training corpus. The evaluator itself must be scored against independent human, physical, or simulator ground truth before its downstream policy gains are considered. The current landscape is fragmented: each benchmark tests a useful slice, but none covers outcome, process, failure onset, recoverability, recovery re-entry, robustness, and policy usefulness together.

## Existing benchmark landscape

| Benchmark | Released | Evaluation unit and scale | Signal / metric | Failure and recovery coverage | Important boundary |
|---|---|---|---|---|---|
| [DenseReward evaluation suite](https://arxiv.org/html/2607.13033v1) | 2026-07 | 26,579 / approximately 27K episodes and 7.56M frame samples from DROID, Isaac Sim, RoboSuite, and LIBERO | Dense reward MAE; MPC distance; downstream RL success | Six modes: success, collision, miss, fall, smooth/suboptimal, recover | Model-native labels and splits are valuable but not an independent gold benchmark; simulated reward curves inherit the synthesis rules |
| [Suboptimal-Value-Bench](https://zh1hao.wang/wvm/) | 2026-06 | 800 human-verified trajectories, 15 tasks; AgileX, ARX, and RoboSuite; real + simulation | Retry VOC and Hesitation RMSE with frame-level value annotations | Explicit hesitation and retry segments | Covers two important suboptimal patterns, not the wider failure/recovery taxonomy; the linked data repository was still empty on 2026-07-19 |
| [RoboProcessBench](https://arxiv.org/html/2606.13040) | 2026-06 | About 58K multiple-choice QA items, 260 tasks, four source datasets | Accuracy across 12 static-monitoring and dynamic-reasoning families | Outcome, contact, motion, primitive progress and transitions; not a direct recovery benchmark | Diagnoses VLM prerequisites for reward modeling, but does not directly score a scalar reward curve or calibration |
| [RBM-EVAL-ID / OOD](https://arxiv.org/html/2603.02115v2) | 2026-05 paper v2 | ID: 25,726 trajectories across five embodiments; OOD: 976 trajectories, six embodiments including human hands, six scenes, three institutions | Value Order Correlation (frame reward vs. timestep), Kendall trajectory ranking, preference accuracy, success–failure separation | OOD set includes successful, suboptimal, and failed trajectories | VOC on successful trajectories can reward monotonic time prediction; published failure causes, onset, and recoverability labels remain limited |
| [RoboPulse](https://huggingface.co/datasets/yuheng2000/RoboPulse) | 2026-03 | 1,800 anchored before/after progress pairs from seven sources and six embodiment groups; real, sim, UMI, and human | Pairwise progress-direction accuracy at Small / Medium / Large hop scales | Tests microscopic progress and regression discrimination | Constructed from manually retained monotonic phases; it does not evaluate natural retry, failure onset, or recovery re-entry |
| [FailCoT / UR5-Fail](https://arxiv.org/html/2512.01946v3) | 2026-03 paper v3 | RLBench-Fail and BridgeDataV2-Fail held-out splits; UR5-Fail has 140 planning + 140 execution cases; also evaluates RoboFail and RoboVQA | Average success/failure classification accuracy for planning and execution verification | Typed planning/execution failures; real UR5 execution failures, plus counterfactual/generated cases | Excellent verifier benchmark; no calibrated task value, dense onset, PONR, or recovery trajectory score |
| [RoboRewardBench](https://arxiv.org/abs/2601.00675) | 2026-01 | 2,831 human-verified real-robot episodes; 14 embodiment types | Episode-level 1–5 progress; MAE | Contains negative and near-miss examples, including counterfactual relabels and temporal clips | Strong standardized outcome/progress test, but not a dense temporal, failure-onset, or recovery benchmark |

The machine-readable version is [`registry/benchmarks.yaml`](../registry/benchmarks.yaml). It also records artifact status, provenance, splits, and known limitations. Arena and challenge data are retained there as **downstream validation sources**, not silently treated as direct reward-model ground truth.

## What the existing benchmarks leave uncovered

| Capability | Best current evidence | Remaining gap |
|---|---|---|
| Final outcome / partial completion | RoboRewardBench; Table30 rubrics | Calibration across tasks and robots; hard success-like failures |
| Fine progress ordering | RBM-EVAL; RoboPulse | Human semantic progress rather than normalized time; non-monotonic execution |
| Candidate-action verification | RoboMonkey; RoVer; CoVer-VLA; TapSampling | A common candidate set with physical outcome labels; separate expert-action proximity, language alignment, predicted progress, and actual success |
| Suboptimal process | Suboptimal-Value-Bench; OPD | More than hesitation/retry; safety, force, collision, redundant motion, irreversible regress |
| Failure type and reasoning | FailCoT / Guardian; DenseReward | Independent real-world taxonomy with onset, severity, causal confidence, and cross-embodiment transfer |
| Recovery | DenseReward `recover`; failure/recovery datasets | True-vs-false recovery, point of no return, and re-entry into a valid success trajectory |
| Robustness | Cross-source evaluations | Controlled camera, view, language, object, scene, embodiment, and temporal perturbation pairs |
| Policy usefulness | Paper-specific RL/MPC studies; arenas | A fixed evaluator-to-policy protocol that separates reward quality from policy and optimizer effects |
| Reward hacking | Scattered task-mismatch or rewind tests | A dedicated adversarial suite targeting shortcuts, terminal-frame bias, looping, and rubric gaming |

## Proposed RRM-Bench design

The benchmark should have two tracks rather than mixing fully open public data with a private real-robot gold test.

### Track A — Open and reproducible

- Use redistributable public episodes with fixed preprocessing, prompts, frame sampling, camera selection, and reference-image policy.
- Publish simple baselines: constant/time-only, vision-only, language-only, terminal-frame-only, CLIP similarity, and an oracle using privileged state where available.
- Group every derived item by `source_episode_id`; counterfactual pairs and multi-view copies must never cross train/test boundaries.
- Freeze model revision, prompt version, parser, calibration method, seeds, and raw outputs.

### Track B — Private real-robot gold test

- Collect real executed success, partial success, hard success-like failure, recoverable failure, false recovery, and irreversible failure.
- Cover multiple institutions, sites, camera layouts, objects, task families, and at least four robot embodiments, including one bimanual platform.
- Use two independent annotators plus adjudication; report inter-annotator agreement and confidence.
- Keep the final test episodes and exact rubrics private while publishing a development set with the same schema.

### Evaluation profile

Do not collapse the benchmark into a single RRM score. Report a profile and category rankings.

| Axis | Required label | Primary metrics |
|---|---|---|
| Outcome calibration | success, partial completion, ordinal score, annotator distribution | AUROC, AUPRC, Brier score, ECE, ordinal correlation |
| Relative ordering | better / worse / tie for same task | Pairwise accuracy with ties, Kendall tau, Spearman correlation |
| Candidate-action verification | fixed candidate action chunks with execution or simulator outcome | Top-1 regret, NDCG, pairwise accuracy, success@selected, oracle-gap closure |
| Process consistency | dense or stage-conditioned progress | VOC plus monotonicity/consistency only on intervals where monotonic progress is valid |
| Failure localization | onset interval, type, severity, confidence | Temporal AP, onset-tolerance F1, time-to-detection, false alarms per nominal episode |
| Recoverability | recoverable flag, point of no return | AUROC/F1, PONR localization tolerance |
| Recovery re-entry | recovery start and valid-trajectory re-entry interval | Interval IoU, boundary tolerance, pre/post score reversal |
| Robustness | paired controlled perturbations | Absolute and relative performance degradation by perturbation family |
| Operational usability | latency, memory, cost, invalid output | p50/p95 latency, throughput, invalid rate, hardware-normalized cost |
| Policy usefulness | fixed policy + fixed optimizer protocol | Success/sample-efficiency delta; always reported separately from evaluator quality |

### Required annotation schema

Each gold episode should retain:

```yaml
episode_id: ...
task_id: ...
robot: {arm: ..., gripper: ..., site: ...}
views: [...]
outcome: {success: false, ordinal_progress: 3, confidence: 0.9}
stages:
  - {name: grasp, start: ..., end: ..., completed: true}
failure:
  onset_interval: [...]
  type: object_slip
  severity: recoverable
  point_of_no_return: null
recovery:
  attempted: true
  successful: true
  reentry_interval: [...]
provenance: real_executed
annotators: [anon_a, anon_b]
adjudicated: true
```

The ontology must allow `unknown`, multi-label causes, and uncertain temporal intervals. A forced single cause is often false precision.

### Split and leakage rules

1. Publish in-domain, cross-task, cross-object, cross-scene, cross-site, cross-view, and cross-embodiment results separately.
2. Hold out source episodes before generating clips, pairs, questions, rewinds, or world-model counterfactuals.
3. Report parent-dataset, episode, view, task-text, and generator-version overlap independently.
4. Keep synthetic and real failures in separate strata; never let a generator signature become the hidden test label.
5. Freeze exact timestamps, temporal windows, camera policy, prompt, parser, and calibration data for each benchmark version.
6. Keep chain-of-thought optional and unscored by default; score the structured answer and preserve raw generations for audit.

### Reward-hacking and shortcut suite

At minimum, include controlled pairs for:

- correct final pose reached through an unsafe or invalid process;
- attractive terminal frame after an earlier irreversible failure;
- repeated oscillation, hesitation, retry loops, and redundant motion;
- correct action video paired with a wrong instruction or wrong object/target;
- static success-looking frames inserted into an unsuccessful trajectory;
- time reversal, frame duplication, temporal clipping, and camera-view removal;
- background, operator, robot, or site cues correlated with outcome;
- partial completion that visually resembles success from one view;
- generator artifacts versus real failures;
- high predicted reward that fails to improve a fixed downstream policy.
- near-identical candidate action sets where expert-action distance, language alignment, short-term progress, and final task outcome disagree.

## Design principle

Successful trajectories define the support of acceptable behavior, failures define its boundary, and recoveries define whether and where an execution can re-enter that support. A useful benchmark must measure all three; otherwise a model can look strong by predicting time, terminal appearance, or a narrow failure vocabulary.

## Primary sources

- [RoboReward paper](https://arxiv.org/abs/2601.00675), [released dataset](https://huggingface.co/datasets/teetone/RoboReward), and [HELM leaderboard](https://crfm.stanford.edu/helm/robo-reward-bench/latest/)
- [Robometer / RBM-EVAL](https://arxiv.org/html/2603.02115v2) and [code](https://github.com/robometer/robometer)
- [PRM-as-a-Judge / RoboPulse](https://arxiv.org/html/2603.21669), [code](https://github.com/Yuheng2000/PRM-as-a-Judge), and [data](https://huggingface.co/datasets/yuheng2000/RoboPulse)
- [World Value Models / Suboptimal-Value-Bench](https://arxiv.org/abs/2606.24742) and [project page](https://zh1hao.wang/wvm/)
- [DenseReward](https://arxiv.org/html/2607.13033v1)
- [RoboProcessBench](https://arxiv.org/html/2606.13040), [code](https://github.com/ProcessBench-2026/RoboProcessBench), and [data](https://huggingface.co/datasets/ProcessBench-2026/RoboProcessBench)
- [Guardian / FailCoT / UR5-Fail](https://arxiv.org/html/2512.01946v3)
- [RoboMonkey](https://proceedings.mlr.press/v305/kwok25a.html), [RoVer](https://arxiv.org/abs/2510.10975), [CoVer-VLA](https://arxiv.org/abs/2602.12281), and [TapSampling](https://arxiv.org/abs/2605.25547)
