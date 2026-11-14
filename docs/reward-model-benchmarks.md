# Robot Reward-Model Benchmarks

**Verified:** 2026-09-28
**Purpose:** map the existing evaluation landscape and place RRM-Bench-1K in it.

A reward-model benchmark is not the same thing as a policy benchmark or a training corpus. The evaluator itself must be scored against independent human, physical, or simulator ground truth before its downstream policy gains are considered. The current landscape is fragmented: each benchmark tests a useful slice, but none covers outcome, process, failure onset, recoverability, recovery re-entry, robustness, and policy usefulness together.

## Existing benchmark landscape

| Benchmark | Released | Evaluation unit and scale | Signal / metric | Failure and recovery coverage | Important boundary |
|---|---|---|---|---|---|
| [RoboRMBench](https://arxiv.org/abs/2609.05401) | 2026-09 | 2,390 real-robot trajectories from RoboRewardBench × 21,673 machine-filtered paraphrases | Score Crossing Rate, Flip Rate, and Mean Error versus human progress labels | No direct failure-onset or recovery annotations | Strong controlled language-robustness test, but parent-episode overlap requires leakage checks and benchmark files were not verified as public |
| [HumanTracker / HumanScore](https://arxiv.org/abs/2608.13555) | 2026-08 | 6,000 released preference pairs and 2,500 released motion references; simulated humanoid tracking of real mocap | Human preference agreement, HumanScore, kinematic error and tracker success | Contact, support, and stability quality in tracking rollouts | Specialist motion-tracking evaluator; released subset is smaller than paper corpus, not general task success or a separate gold reward test |
| [TrustRoboReward multi-paradigm benchmark](https://arxiv.org/abs/2608.08491) | 2026-08 | 7,030 human-annotated test items across Score-A, Score-B, Pair-A, and Pair-B | Pointwise normalized-error metrics, pairwise accuracy, and score-pair consistency | RoboReward-derived video pool contains task-progress variation; no explicit onset, recoverability, or recovery re-entry protocol | Paper-associated split; data and weights were not verified as public releases. Its combined Overall average is interface-specific and is not adopted as a universal RRM-Bench score |
| [DenseReward evaluation suite](https://arxiv.org/html/2607.13033v1) | 2026-07 | 26,579 / approximately 27K episodes and 7.56M frame samples from DROID, Isaac Sim, RoboSuite, and LIBERO | Dense reward MAE; MPC distance; downstream RL success | Six modes: success, collision, miss, fall, smooth/suboptimal, recover | Model-native labels and splits are valuable but not an independent gold benchmark; simulated reward curves inherit the synthesis rules |
| [Suboptimal-Value-Bench](https://zh1hao.wang/wvm/) | 2026-06 | 800 human-verified trajectories, 15 tasks; AgileX, ARX, and RoboSuite; real + simulation | Retry VOC and Hesitation RMSE with frame-level value annotations | Explicit hesitation and retry segments | Covers two important suboptimal patterns, not the wider failure/recovery taxonomy; the linked data repository was still empty on 2026-07-19 |
| [RoboProcessBench](https://arxiv.org/html/2606.13040) | 2026-06 | About 58K multiple-choice QA items, 260 tasks, four source datasets | Accuracy across 12 static-monitoring and dynamic-reasoning families | Outcome, contact, motion, primitive progress and transitions; not a direct recovery benchmark | Diagnoses VLM prerequisites for reward modeling, but does not directly score a scalar reward curve or calibration |
| [RBM-EVAL-ID / OOD](https://arxiv.org/html/2603.02115v2) | 2026-05 paper v2 | ID: 25,726 trajectories across five embodiments; OOD: 571 trajectories on five robot embodiments from three institutions (the 304 MIT Franka entries are two camera views of 152 executions) | Value Order Correlation (frame reward vs. timestep), Kendall trajectory ranking, preference accuracy, success–failure separation | OOD set includes successful, suboptimal, and failed trajectories | VOC on successful trajectories can reward monotonic time prediction; published failure causes, onset, and recoverability labels remain limited |
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
| Robustness | RoboRMBench for controlled language paraphrases; cross-source evaluations | Camera, view, object, scene, embodiment, and temporal perturbation pairs; parent-episode leakage controls for paraphrases |
| Policy usefulness | Paper-specific RL/MPC studies; arenas | A fixed evaluator-to-policy protocol that separates reward quality from policy and optimizer effects |
| Reward hacking | Scattered task-mismatch or rewind tests | A dedicated adversarial suite targeting shortcuts, terminal-frame bias, looping, and rubric gaming |

## RRM-Bench-1K

RRM-Bench-1K is the benchmark of the survey *Robotic Reward Models in the Foundation-Model Era: A Survey and Capability Benchmark* ([project page](https://ethanliang99.github.io/awesome-robot-reward-model/#bench)). It tests whether a reward follows the task state of a real execution rather than motion, elapsed time, or what the camera happens to show.

- **Data.** 1,117 real-robot videos of closed-loop policy executions on RoboChallenge Table30 and Table30 V2: 52 tasks on five embodiments, up to three cameras per execution. Each execution is kept whole, with its failures, partial completions, retries, and recoveries.
- **Task-state labels.** They record which task conditions hold at each moment and withdraw credit when an achieved condition is lost. The final task state grades every video as zero, partial, or full fulfillment.
- **Camera-evidence labels.** Each view is labeled as giving sufficient (V), partial (P), or insufficient (X) evidence for judging the task.
- **Four contrast suites.** Each separates the credited condition from a cue that usually comes with it:

| Suite | Separates | Validity |
|---|---|---|
| (A) Action–Effect | task-like motion from its effect | proxy |
| (B) Semantic/Ordered Constraint | a successful manipulation from a correct one | proxy |
| (C) Persistence/Reversal | an achieved condition from one that still holds | temporal |
| (D) Visibility | what happened from what a camera shows | evidence |

- **Metrics.** Progress direction on 1 FPS transitions (rising and falling precision, recall, and F1, with Macro-F1), VOC, and Kendall's τ_a, read beside two controls that need no model: an always-rising predictor and normalized elapsed time. Sufficient and reduced views of the same execution are scored on the same transitions.

Results are reported per capability, not as one overall score. The benchmark covers one platform, and its data release is pending.

## Design principle

Successful trajectories define the support of acceptable behavior, failures define its boundary, and recoveries define whether and where an execution can re-enter that support. A useful benchmark must measure all three; otherwise a model can look strong by predicting time, terminal appearance, or a narrow failure vocabulary.

## Primary sources

- [RoboRMBench paper](https://arxiv.org/abs/2609.05401) and its parent [RoboRewardBench dataset](https://huggingface.co/datasets/teetone/RoboReward)
- [HumanTracker paper](https://arxiv.org/abs/2608.13555), [official code and HumanScore weights](https://github.com/GalaxyGeneralRobotics/HumanTracker), and [released subset](https://huggingface.co/datasets/GalaxyGeneralRobotics/HumanTracker)
- [RoboReward paper](https://arxiv.org/abs/2601.00675), [released dataset](https://huggingface.co/datasets/teetone/RoboReward), and [HELM leaderboard](https://crfm.stanford.edu/helm/robo-reward-bench/latest/)
- [TrustRoboReward](https://arxiv.org/abs/2608.08491) and its [partial official repository](https://github.com/TrustRoboreward/TrustRoboReward)
- [Robometer / RBM-EVAL](https://arxiv.org/html/2603.02115v2) and [code](https://github.com/robometer/robometer)
- [PRM-as-a-Judge / RoboPulse](https://arxiv.org/html/2603.21669), [code](https://github.com/Yuheng2000/PRM-as-a-Judge), and [data](https://huggingface.co/datasets/yuheng2000/RoboPulse)
- [World Value Models / Suboptimal-Value-Bench](https://arxiv.org/abs/2606.24742) and [project page](https://zh1hao.wang/wvm/)
- [DenseReward](https://arxiv.org/html/2607.13033v1)
- [RoboProcessBench](https://arxiv.org/html/2606.13040), [code](https://github.com/ProcessBench-2026/RoboProcessBench), and [data](https://huggingface.co/datasets/ProcessBench-2026/RoboProcessBench)
- [Guardian / FailCoT / UR5-Fail](https://arxiv.org/html/2512.01946v3)
- [RoboMonkey](https://proceedings.mlr.press/v305/kwok25a.html), [RoVer](https://arxiv.org/abs/2510.10975), [CoVer-VLA](https://arxiv.org/abs/2602.12281), and [TapSampling](https://arxiv.org/abs/2605.25547)
