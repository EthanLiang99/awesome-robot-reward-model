# Awesome Robot Reward Models

A curated, evidence-tracked list of **robotic reward models (RRMs)**, process/value models, verifiers, and failure/recovery data relevant to evaluating robot behavior.

This repository supports the research project *Robotic Reward Models: A Taxonomy, Unified Benchmark, and Open Infrastructure*. It is a discovery and collaboration resource—not a claim that every listed method is directly comparable or reproducible.

- **Last literature check:** 2026-07-18
- **Living registry:** [`registry/papers.yaml`](registry/papers.yaml)
- **Latest audit:** [`docs/updates/2026-07-18.md`](docs/updates/2026-07-18.md)

## Scope

Included work must expose, learn, or directly study a task-conditioned signal that evaluates robot-relevant behavior: outcome/success, absolute process progress, relative/preference reward, temporal/stage-aware value, or a hybrid evaluator/verifier.

Failure and recovery work is included when it contributes evaluator supervision, a failure/recovery benchmark, or data that can test reward-model boundaries. Generic VLA, world-model, failure-management, and video-understanding work stays outside the core tables unless it has a direct evaluator interface.

Human and egocentric video are treated as possible reward/value supervision—not as direct human-to-robot action labels.

## Reading the tables

| Mark | Meaning |
|---|---|
| `C` | code link verified |
| `W` | model weights/checkpoint link verified |
| `D` | data/benchmark link verified |
| `—` | no public artifact link verified |
| `?` | artifact or license status still needs audit |

Artifact availability and licensing are tracked separately. A GitHub repository does **not** imply released weights or reusable data, and a public file does not imply a compatible license.

## Taxonomy

1. [Outcome and success reward](#1-outcome-and-success-reward)
2. [Absolute process progress](#2-absolute-process-progress)
3. [Relative and preference reward](#3-relative-and-preference-reward)
4. [Temporal and stage-aware value](#4-temporal-and-stage-aware-value)
5. [Hybrid evaluators and verifiers](#5-hybrid-evaluators-and-verifiers)
6. [Failure, retry, and recovery data](#6-failure-retry-and-recovery-data)
7. [Adjacent system interfaces](#7-adjacent-system-interfaces)
8. [Community discovery resources](#8-community-discovery-resources)

Methods may span multiple families. The table placement is the primary narrative category; the registry preserves secondary tags and evidence notes.

## 1. Outcome and success reward

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-01 | [RoboReward](https://arxiv.org/abs/2601.00675) | General-purpose vision-language reward models; outcome/progress scoring with counterfactual negatives and near-misses | [W](https://huggingface.co/teetone/RoboReward-4B) | 2026-07-18 |
| 2024-07 | [Adapt2Reward](https://arxiv.org/abs/2407.14872) | Failure-prompt adaptation for generalizable robotic rewards | — | 2026-07-18 |

## 2. Absolute process progress

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-06 | [RARM](https://arxiv.org/abs/2606.22027) | Reference-anchored, confidence-gated dense progress reward from one successful demonstration | [project; code coming soon](https://rarm-robotics.github.io/) | 2026-07-18 |
| 2026-05 | [ProcVLM](https://arxiv.org/abs/2605.08774) | Procedure-grounded progress with remaining-action reasoning over a recent frame window | [C](https://github.com/ProcVLM/ProcVLM) · [W](https://huggingface.co/ce-amtic/ProcVLM-2B) · [D](https://huggingface.co/datasets/ce-amtic/ProcCorpus-60M) | 2026-07-18 |
| 2026-03 | [SOLE-R1](https://arxiv.org/abs/2603.28730) | Per-timestep video-language reasoning and dense progress used as the sole online-RL reward | [C](https://github.com/rai-opensource/sole-r1) · [W/D collection](https://huggingface.co/collections/theaiinstitute/sole-r1) | 2026-07-18 |
| 2026-03 | [ProgAgent](https://arxiv.org/abs/2603.07784) | Initial/current/goal progress potential for continual robot RL with OOD regularization | — | 2026-07-18 |
| 2026-03 | [Rewarding DINO](https://arxiv.org/abs/2603.16978) | Language-conditioned dense visual reward distilled from analytical simulator rewards | — | 2026-07-18 |
| 2025-09 | [TimeRewarder](https://arxiv.org/abs/2509.26627) | Frame-wise temporal distance from passive human and robot video as dense reward | [C](https://github.com/CowAndSheep/TimeRewarder) | 2026-07-18 |
| 2025-05 | [ReWiND](https://arxiv.org/abs/2505.10911) | Language-conditioned progress reward learned from human/robot video for reward relabeling and policy learning | [C](https://github.com/rewind-reward/ReWiND) | 2026-07-18 |
| earlier | [PROGRESSOR](https://github.com/ripl/progressor) | Perceptually guided progress estimator with online refinement | C | 2026-07-18 |
| 2026-02 | [TOPReward](https://github.com/TOPReward/TOPReward) | Zero-shot reward extracted from VLM token probabilities | C; paper metadata pending | 2026-07-18 |

## 3. Relative and preference reward

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-06 | [Freeform Preference Learning](https://arxiv.org/abs/2606.32027) | Language-conditioned, axis-specific trajectory reward from freeform pairwise human preferences | [C](https://github.com/freeform-pl/fpl) · [real-world tools](https://github.com/freeform-pl/fpl_real); license ? | 2026-07-18 |
| 2026-06 | [WARP-RM](https://arxiv.org/abs/2606.28320) | Dense signed relative-progress velocity learned self-supervised from time-warped successful demonstrations | [C, MIT](https://github.com/uynitsuj/WARP-RM) | 2026-07-18 |
| 2026-04 | [ARM](https://arxiv.org/abs/2604.03037) | Tri-state progressive/regressive/stagnant advantage over temporal segments; global progress reconstruction | [project](https://aiming1998.github.io/ARM/); code not verified | 2026-07-18 |
| 2026-03 | [Robometer](https://arxiv.org/abs/2603.02115) | Trajectory-comparison reward with intra-trajectory progress and inter-trajectory preference supervision | [C](https://github.com/robometer/robometer) | 2026-07-18 |
| 2025-12 | [Robo-Dopamine](https://arxiv.org/abs/2512.23703) | Multi-view pairwise process reward for signed progress/regress between before/after observations | [C](https://github.com/FlagOpen/Robo-Dopamine) | 2026-07-18 |
| 2025-09 | [VLAC](https://arxiv.org/abs/2509.15937) | Vision-language-action critic with pairwise transition-level advancement signals | [C](https://github.com/InternRobotics/VLAC) | 2026-07-18 |
| 2024-02 | [RL-VLM-F](https://proceedings.mlr.press/v235/wang24bn.html) | VLM-generated pairwise preferences converted into a learned reward for robot RL | [paper](https://arxiv.org/abs/2402.03681) | 2026-07-18 |

## 4. Temporal and stage-aware value

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-06 | [SARM2](https://arxiv.org/abs/2606.10305) | Multi-task action-primitive stage estimator plus MoE value head for dense progress | [C](https://github.com/xdofai/opensarm) · [SPIRAL](https://github.com/Qianzhong-Chen/openspiral); weights — | 2026-07-18 |
| 2026-06 | [WVM](https://arxiv.org/abs/2606.24742) | Temporally grounded value estimation with a human-labelled suboptimal/retry benchmark | [repo](https://github.com/255isWhite/WVM); release status ? | 2026-07-18 |
| 2026-06 | [ReTVL](https://arxiv.org/abs/2606.24633) | Retry-supervised value learning around local degradation and recovery events | — | 2026-07-18 |
| 2026-04 | [ViVa](https://arxiv.org/abs/2604.08168) | Video-generative scalar value coupled to predicted future proprioception | [C](https://github.com/GigaAI-research/ViVa); license/weights ? | 2026-07-18 |
| 2025-09 | [SARM](https://arxiv.org/abs/2509.25358) | Stage-aware video reward for long-horizon manipulation | [C](https://github.com/xdofai/opensarm) | 2026-07-18 |

## 5. Hybrid evaluators and verifiers

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-07 | [DenseReward](https://arxiv.org/abs/2607.13033) | Dense frame-level reward trained with phase-aware success, failure, and recovery synthesis | [project](https://dense-reward.github.io/); code/data/weights links not yet verified | 2026-07-18 |
| 2026-03 | [Large Reward Models](https://arxiv.org/abs/2603.16065) | Multi-source VLM process, completion, and temporal-contrast reward generation for online refinement | [C](https://github.com/physical-superintelligence-lab/Large-Reward-Models) | 2026-07-18 |
| 2026-03 | [PRIMO R1](https://arxiv.org/abs/2603.15600) | RL-induced process reasoning for progress estimation and zero-shot failure detection | — | 2026-07-18 |
| 2026-03 | [PRM-as-a-Judge](https://arxiv.org/abs/2603.21669) | Dense robotic auditing with outcome/process/diagnosis metrics and progress-potential judges | [project](https://prm-as-a-judge.github.io/); artifact audit pending | 2026-07-18 |
| 2026-03 | [Generalizable Dense Reward / VLLR](https://arxiv.org/abs/2604.00055) | VLM subtask progress plus policy self-certainty for long-horizon RL | [project](https://silongyong.github.io/vllr_project_page/); artifact audit pending | 2026-07-18 |
| 2025-12 | [Guardian / FailCoT](https://arxiv.org/abs/2512.01946) | Multi-view planning and execution verifier trained on synthesized cross-environment failures | [C, MIT](https://github.com/paulpacaud/Guardian-FailCot) · [W, Apache-2.0](https://huggingface.co/paulpacaud/guardian-thinking) · [D](https://huggingface.co/collections/paulpacaud/robotic-failure-detection-dataset-and-model-guardian) | 2026-07-18 |

## 6. Failure, retry, and recovery data

These works are not automatically reward models. They are catalogued as supervision or benchmark candidates for failure onset, recoverability/PONR, recovery re-entry, and verifier evaluation.

| Date | Work | Potential use in RRM research | Artifacts | Verified |
|---|---|---|---|---|
| 2026-06 | [Robot Self-Improvement via Human-Video Dynamics Models](https://arxiv.org/abs/2606.21406) | Human-video value/dynamics priors adapted with robot failures; corrective-action ranking around recoverable states | [project; code coming soon](https://ethz-mrl.github.io/robot-self-improvement-website/) | 2026-07-18 |
| 2026-06 | [SO-101 failure/recovery benchmark](https://arxiv.org/abs/2606.08881) | Low-cost real-robot failure/recovery evaluation candidate; data license pending | — | 2026-07-18 |
| 2026-03 | [Dream2Fix](https://arxiv.org/abs/2603.13528) | Counterfactual failure/correction rollouts with structured diagnosis and trajectory-level correction targets | [project; code coming soon](https://dream2fix.github.io/) | 2026-07-18 |
| 2025-12 | [FailCoT / Guardian](https://arxiv.org/abs/2512.01946) | Planning/execution failures, reasoning traces, and multi-view real-robot OOD evaluation | [C/W/D](https://github.com/paulpacaud/Guardian-FailCot) | 2026-07-18 |
| 2025-12 | [ViFailback](https://arxiv.org/abs/2512.02787) | Real manipulation failures and correction supervision; onset/type/recovery-facing evaluation candidate | [C](https://github.com/x1nyuzhou/ViFailback); data license ? | 2026-07-18 |
| 2025-10 | [FailSafe](https://arxiv.org/abs/2510.01642) | Failure/recovery action data and reasoning; release conditions pending | — | 2026-07-18 |
| 2025-05 | [RoboFAC](https://arxiv.org/abs/2505.12224) | Error trajectories plus hierarchical QA/correction labels; failure taxonomy and verifier benchmark | [C](https://github.com/MINT-SJTU/RoboFAC) | 2026-07-18 |
| 2024-12 | [RoboMIND](https://arxiv.org/abs/2412.13877) | Multi-embodiment robot data with reported failure coverage | [project](https://x-humanoid-robomind.github.io/); split/license audit required | 2026-07-18 |
| 2024-10 | [AHA](https://arxiv.org/abs/2410.00371) | Failure reasoning/detection with synthetic perturbations; taxonomy baseline | [C](https://github.com/NVlabs/AHA) | 2026-07-18 |
| 2023-06 | [REFLECT](https://arxiv.org/abs/2306.15724) | Historical failure explanation and replanning context; not itself a reward model | — | 2026-07-18 |

## 7. Adjacent system interfaces

These are useful boundary papers when the evaluator is consumed for policy selection, termination, recovery, or world-model policy evaluation. They should not displace the core reward-model taxonomy.

| Date | Work | Why it is adjacent |
|---|---|---|
| 2026-04 | [dWorldEval](https://arxiv.org/abs/2604.22152) | World-model proxy for scalable policy evaluation rather than a standalone robot reward model |
| 2025-05 | [WorldEval](https://arxiv.org/abs/2505.19017) | World-model policy ranking and safety checking; evaluator-system boundary |
| 2026-06 | [Recover, Discover, Plan](https://arxiv.org/abs/2606.18328) | Failure-driven skill/concept learning and planning, without a separately benchmarked reward model |

## 8. Community discovery resources

- [Awesome Progress Reward Model](https://github.com/VanceChu/Awesome-Progress-Reward-Model)
- [Awesome Robot Failure Management](https://robot-failures.github.io/awesome-robot-failure-management/datasets.html)
- [RewardScope](https://github.com/philfung/reward-scope)

These lists are used for discovery. Claims in this repository must be rechecked against original papers, author project pages, official repositories, or model/data cards.

## Contribution and update policy

- Add papers through the [paper issue template](.github/ISSUE_TEMPLATE/add-paper.yml) or a pull request.
- Supply an original-paper URL and a verification date.
- Report paper, code, weights, data, benchmark, and license status separately.
- Use a primary semantics category plus secondary tags; do not force false exclusivity.
- Label preprints and author-reported claims.
- Do not convert “repository exists” into “open and reproducible.”
- Keep reward-model quality evaluation separate from downstream policy-improvement results.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/update-protocol.md`](docs/update-protocol.md) for the full checklist.

## Citation note

Always cite the original paper when discussing or using a listed model. This repository is a living discovery registry and should not replace original attribution.
