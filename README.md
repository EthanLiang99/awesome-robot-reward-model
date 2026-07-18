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
7. [Training data and supervision resources](#7-training-data-and-supervision-resources)
8. [Policy- and world-model-coupled value prediction](#8-policy--and-world-model-coupled-value-prediction)
9. [Adjacent system interfaces](#9-adjacent-system-interfaces)
10. [Community discovery resources](#10-community-discovery-resources)

Methods may span multiple families. Sections 1–5 use reward semantics as the primary narrative taxonomy. Section 7 is a cross-cutting data index, while Section 8 records where a value signal lives without treating architectural coupling as a new reward meaning. The registry preserves these dimensions through primary semantics, supervision provenance, and `model_coupling` metadata.

## 1. Outcome and success reward

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-02 | [World-VLA-Loop](https://arxiv.org/abs/2602.06508) | Video world model jointly predicts imagined future frames and binary reward; the reward drives VLA RL and policy failures are fed back to refine the world model | [project/repo; source code in preparation](https://github.com/showlab/World-VLA-Loop) | 2026-07-18 |
| 2026-01 | [RoboReward](https://arxiv.org/abs/2601.00675) | General-purpose vision-language reward models; outcome/progress scoring with counterfactual negatives and near-misses | [W](https://huggingface.co/teetone/RoboReward-4B) | 2026-07-18 |
| 2024-07 | [Adapt2Reward](https://arxiv.org/abs/2407.14872) | Failure-prompt adaptation for generalizable robotic rewards | — | 2026-07-18 |

## 2. Absolute process progress

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-07 | [ACE-Brain-0.5](https://arxiv.org/abs/2607.04426) | Shared embodied backbone estimates execution progress for self-monitoring, verification, and recovery alongside planning and action generation | [W](https://huggingface.co/ACERobotics/ACE-Brain-0.5-8B) · [project repo; runnable task code not verified](https://github.com/DAXIAORobotics/ACE-Brain-0.5) | 2026-07-18 |
| 2026-06 | [MV-WAM](https://arxiv.org/abs/2606.21088) | Joint visual/action/value generation with task-completion estimation, action–frame misalignment detection, and value-guided rollback | — | 2026-07-18 |
| 2026-06 | [NavWAM](https://arxiv.org/abs/2606.13494) | Joint future-view, action-chunk, and goal-progress prediction for closed-loop visual navigation | [project](https://dachii-azm.github.io/navwam/); code/weights links not verified | 2026-07-18 |
| 2026-06 | [RARM](https://arxiv.org/abs/2606.22027) | Reference-anchored, confidence-gated dense progress reward from one successful demonstration | [project; code coming soon](https://rarm-robotics.github.io/) | 2026-07-18 |
| 2026-05 | [ProcVLM](https://arxiv.org/abs/2605.08774) | Procedure-grounded progress with remaining-action reasoning over a recent frame window | [C](https://github.com/ProcVLM/ProcVLM) · [W](https://huggingface.co/ce-amtic/ProcVLM-2B) · [D](https://huggingface.co/datasets/ce-amtic/ProcCorpus-60M) | 2026-07-18 |
| 2026-03 | [SOLE-R1](https://arxiv.org/abs/2603.28730) | Per-timestep video-language reasoning and dense progress used as the sole online-RL reward | [C](https://github.com/rai-opensource/sole-r1) · [W/D collection](https://huggingface.co/collections/theaiinstitute/sole-r1) | 2026-07-18 |
| 2026-03 | [ProgAgent](https://arxiv.org/abs/2603.07784) | Initial/current/goal progress potential for continual robot RL with OOD regularization | — | 2026-07-18 |
| 2026-03 | [Rewarding DINO](https://arxiv.org/abs/2603.16978) | Language-conditioned dense visual reward distilled from analytical simulator rewards | — | 2026-07-18 |
| 2026-01 | [PALM](https://arxiv.org/abs/2601.07060) | Continuous within-subtask progress jointly decoded with actions to stabilize transitions in long-horizon manipulation | [C](https://github.com/PLAN-Lab/PALM) · [W](https://github.com/PLAN-Lab/PALM#-checkpoints); license ? | 2026-07-18 |
| 2025-09 | [World-Env](https://arxiv.org/abs/2509.24948) | LLaVA-based instant reflector with a trained scalar head estimates task-completion probability over imagined video for VLA reward and early termination | [C, Apache-2.0](https://github.com/amap-cvlab/world-env) · [W](https://www.modelscope.cn/models/junjxiao/world-env) | 2026-07-18 |
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
| 2026-03 | [Robometer](https://arxiv.org/abs/2603.02115) | Trajectory-comparison reward with intra-trajectory progress and inter-trajectory preference supervision | [C](https://github.com/robometer/robometer) · [W](https://huggingface.co/robometer/Robometer-4B) · [processed D; canonical release caveat](https://huggingface.co/datasets/robometer/processed_datasets) | 2026-07-18 |
| 2025-12 | [Robo-Dopamine](https://arxiv.org/abs/2512.23703) | Multi-view pairwise process reward for signed progress/regress between before/after observations | [C](https://github.com/FlagOpen/Robo-Dopamine) · [W](https://huggingface.co/tanhuajie2001/Robo-Dopamine-GRM-8B) · [gated D](https://huggingface.co/datasets/tanhuajie2001/Robo-Dopamine-GRM-Dataset) | 2026-07-18 |
| 2025-09 | [VLAC](https://arxiv.org/abs/2509.15937) | Vision-language-action critic with pairwise transition-level advancement signals | [C](https://github.com/InternRobotics/VLAC) | 2026-07-18 |
| 2024-02 | [RL-VLM-F](https://proceedings.mlr.press/v235/wang24bn.html) | VLM-generated pairwise preferences converted into a learned reward for robot RL | [paper](https://arxiv.org/abs/2402.03681) | 2026-07-18 |

## 4. Temporal and stage-aware value

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-06 | [SARM2](https://arxiv.org/abs/2606.10305) | Multi-task action-primitive stage estimator plus MoE value head for dense progress | [C](https://github.com/xdofai/opensarm) · [SPIRAL](https://github.com/Qianzhong-Chen/openspiral); weights — | 2026-07-18 |
| 2026-06 | [WVM](https://arxiv.org/abs/2606.24742) | Temporally grounded value estimation with a human-labelled suboptimal/retry benchmark | [repo](https://github.com/255isWhite/WVM); release status ? | 2026-07-18 |
| 2026-06 | [ReTVL](https://arxiv.org/abs/2606.24633) | Retry-supervised value learning around local degradation and recovery events | — | 2026-07-18 |
| 2026-05 | [ProgVLA](https://arxiv.org/abs/2605.28231) | Policy-internal V/Q-style progress critics over normalized remaining horizon, used for advantage- and success-weighted imitation | code/checkpoints/data promised upon publication | 2026-07-18 |
| 2026-04 | [ViVa](https://arxiv.org/abs/2604.08168) | Video-generative scalar value coupled to predicted future proprioception | [C](https://github.com/GigaAI-research/ViVa); license/weights ? | 2026-07-18 |
| 2026-02 | [RISE](https://arxiv.org/abs/2602.11075) | Progress value evaluates action-conditioned imagined futures and supplies advantages for policy improvement | [C](https://github.com/OpenDriveLab/RISE) · [W: dynamics only](https://github.com/OpenDriveLab/RISE); code Apache-2.0, released data/checkpoints CC BY-NC-SA 4.0 | 2026-07-18 |
| 2026-01 | [Cosmos Policy](https://arxiv.org/abs/2601.16163) | Joint action, future-state, and expected rewards-to-go prediction for direct control and best-of-N planning | [C, Apache-2.0](https://github.com/NVlabs/cosmos-policy) · [W/D](https://huggingface.co/collections/nvidia/cosmos-policy); item licenses require review | 2026-07-18 |
| 2025-09 | [SARM](https://arxiv.org/abs/2509.25358) | Stage-aware video reward for long-horizon manipulation | [C](https://github.com/xdofai/opensarm) | 2026-07-18 |

## 5. Hybrid evaluators and verifiers

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-07 | [DenseReward](https://arxiv.org/abs/2607.13033) | Dense frame-level reward trained with phase-aware success, failure, and recovery synthesis | [project](https://dense-reward.github.io/); code/data/weights links not yet verified | 2026-07-18 |
| 2026-05 | [RoboAlign-R1](https://arxiv.org/abs/2605.03821) | Qwen3-VL-8B-Thinking teacher judge is distilled into a 98M six-dimensional reward model for GRPO post-training of robot video world models | [project](https://roboalign-r1.netlify.app/); public repo is currently a placeholder | 2026-07-18 |
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

## 7. Training data and supervision resources

This is a cross-cutting index of data that can instantiate reward targets. It records **where the negative signal came from**: a real failure, an induced error, a mixed-expertise rollout, a corrective action, or a synthetic temporal reversal. Those sources should not be treated as interchangeable.

### Model-associated reward corpora

| Corpus | Scale and composition | Reward supervision recipe | Release status | Important caveat |
|---|---|---|---|---|
| [Robo-Dopamine GRM data](https://huggingface.co/datasets/tanhuajie2001/Robo-Dopamine-GRM-Dataset) | 35M samples from ~3,400h, >100K trajectories, and >350 tasks; real robot, simulation, and human egocentric video | Human-annotated keyframes define step segments; ordered state pairs yield progress hops and reversed-order pairs yield regress hops | Gated dataset; Apache-2.0 card | Most negative supervision is constructed by reversing temporal order inside expert trajectories. It is not equivalent to observing a robot make and recover from a real mistake. |
| [RBM-1M / Robometer](https://arxiv.org/abs/2603.02115) | 1,059,370 trajectories across 21 robot embodiments; expert, paired human–robot, mixed-expertise/failure, and human-only sources | Frame-level progress/success on expert trajectories plus trajectory preferences over expert, suboptimal, failed, rewound, and task-mismatched pairs | [Processed data repository](https://huggingface.co/datasets/robometer/processed_datasets) exists; official project still labels the canonical RBM-1M release “coming soon” | The aggregate inherits dataset-specific upstream terms; the MIT code license and Apache-2.0 model license do not license every source trajectory. |

### Egocentric, procedural-error, and cross-embodiment supervision

| Date | Dataset | Failure / correction evidence | Reward targets it can support | Data and license | Transfer caveat |
|---|---|---|---|---|---|
| 2026-04 | [HRDexDB](https://snuvclab.github.io/HRDexDB/) | Paired human and dexterous-robot grasps with real robot success/failure labels, object 6D pose, ego/multi-view video, and tactile signals | Outcome reward; contact-aware value; human–robot outcome alignment | [D, CC BY-NC 4.0](https://huggingface.co/datasets/HRDexDB/HRDexDB) | Strongest robot-facing item here, but currently narrow to grasping and largely outcome-level labels. |
| 2025-11 | [IndEgo](https://indego-dataset.github.io/) | 3,460 ego (~197h) + 1,092 exo (~97h); industrial keysteps, recording/mistake labels, mistake summaries, gaze, hand pose, and other signals | Error onset; stage-conditioned value; correct-vs-deviated preference; process verifier | [D, CC BY 4.0](https://huggingface.co/datasets/FraunhoferIPK/IndEgo) | Highly relevant domain, but the large Mistake Detection tree is still receiving files/annotations; pin a dataset revision before training. |
| 2024-03 | [EgoPER](https://khoury.northeastern.edu/home/eelhami/egoper.htm) | 386 videos / 28h; 213 normal and 173 erroneous; frame-wise steps and five error types including slip and correction | Signed local reward (`slip < 0`, `correction > 0`); frame error probability; recovery re-entry | [D/code](https://github.com/robert80203/EgoPER_official); dataset license not verified | Fine-grained but only five cooking tasks; action appearance and embodiment differ from robots. |
| 2023-12 | [CaptainCook4D](https://captaincook4d.github.io/captain-cook/) | 384 recordings / 94.5h with normal and induced-error executions; step/fine-action and error-type annotations | Controlled correct-vs-error preferences; step value; typed error verifier | [D, Apache-2.0](https://captaincook4d.github.io/captain-cook/) | Induced errors are useful counterfactuals, but their frequency and style are not natural robot-failure statistics. |
| 2023-09 | [HoloAssist](https://holoassist.github.io/) | 166h from 350 instructor–performer pairs; fine actions marked correct/mistake plus intervention purpose and timing | Mistake onset; intervention need; pre/post-correction value; recovery intent | [D, CDLA v2](https://holoassist.github.io/data_links/README.html) | Assistance dialogue is an extra causal signal unavailable in ordinary autonomous robot rollouts. |
| 2022-03 | [Assembly101](https://assembly-101.github.io/) | 4,321 procedures with 4 ego + 8 exo views; natural ordering variation, mistakes, propagated mistakes, and corrections | Order-aware value; mistake-chain penalty; correction/recovery reward; cross-view consistency | [D](https://huggingface.co/datasets/cvml-nus/assembly101) · [mistake annotations](https://github.com/assembly-101/assembly101-mistake-detection); CC BY-NC 4.0 | Natural errors are valuable, but the domain is toy assembly and the non-commercial license restricts reuse. |

A safe first training recipe is to use expert robot data for calibrated progress, real/mixed robot failures for trajectory preference and success, ego mistakes for semantic error/correction auxiliaries, and paired human–robot data for cross-embodiment alignment. Human ego clips should supervise object/step semantics rather than robot action tokens.

## 8. Policy- and world-model-coupled value prediction

This is a **cross-cutting integration axis**, not a sixth reward-semantics family. It includes a system only when a task-conditioned value/progress/critic signal is explicitly predicted and consumed by the policy, planner, recovery mechanism, or policy-learning objective. A VLA or world model that predicts only actions or future observations is out of scope.

| Date | Work | Coupling pattern | Predicted value and how it is used | Artifacts | Verified |
|---|---|---|---|---|---|
| 2026-07 | [ACE-Brain-0.5](https://arxiv.org/abs/2607.04426) | Shared embodied backbone | Execution progress; self-monitoring, verification, and recovery | [W](https://huggingface.co/ACERobotics/ACE-Brain-0.5-8B) · [repo](https://github.com/DAXIAORobotics/ACE-Brain-0.5) | 2026-07-18 |
| 2026-06 | [MV-WAM](https://arxiv.org/abs/2606.21088) | Joint world–action–value generator | Task completion/progress; misalignment detection and rollback | — | 2026-07-18 |
| 2026-06 | [NavWAM](https://arxiv.org/abs/2606.13494) | Joint world–action–value generator | Goal-progress value; closed-loop navigation and optional best-of-N selection | [project](https://dachii-azm.github.io/navwam/) | 2026-07-18 |
| 2026-06 | [Robot Self-Improvement via Human-Video Dynamics Models](https://arxiv.org/abs/2606.21406) | Compositional policy + dynamics + value | Progress-aligned value; ranks corrective actions after failures | [project; code coming soon](https://ethz-mrl.github.io/robot-self-improvement-website/) | 2026-07-18 |
| 2026-05 | [RoboAlign-R1](https://arxiv.org/abs/2605.03821) | Standalone teacher→student evaluator inside a world-model loop | Six-dimensional semantic/physical reward; GRPO post-training of the robot video world model, not the VLA policy | [project](https://roboalign-r1.netlify.app/); releases claimed | 2026-07-18 |
| 2026-05 | [ProgVLA](https://arxiv.org/abs/2605.28231) | Policy-internal auxiliary critics | Remaining-horizon V/Q and near-completion success; reweights imitation training | — | 2026-07-18 |
| 2026-04 | [ViVa](https://arxiv.org/abs/2604.08168) | Value coupled to generative foresight | Scalar future-conditioned task value; robot RL | [C](https://github.com/GigaAI-research/ViVa) | 2026-07-18 |
| 2026-02 | [RISE](https://arxiv.org/abs/2602.11075) | Compositional dynamics + progress value | Imagined-outcome value; advantage estimation for policy improvement | [C](https://github.com/OpenDriveLab/RISE) · [W: dynamics only](https://github.com/OpenDriveLab/RISE) | 2026-07-18 |
| 2026-02 | [World-VLA-Loop](https://arxiv.org/abs/2602.06508) | Reward head integrated into the video world model | Binary imagined outcome reward; iterative VLA RL plus policy-failure feedback to the world model | [project/repo; code in preparation](https://github.com/showlab/World-VLA-Loop) | 2026-07-18 |
| 2026-01 | [Cosmos Policy](https://arxiv.org/abs/2601.16163) | Joint world–action–value generator | Expected cumulative reward at predicted future state; planning and rollout refinement | [C](https://github.com/NVlabs/cosmos-policy) · [W/D](https://huggingface.co/collections/nvidia/cosmos-policy) | 2026-07-18 |
| 2026-01 | [PALM](https://arxiv.org/abs/2601.07060) | Joint action–progress decoder | Continuous within-subtask progress; transition timing and long-horizon control | [C/W](https://github.com/PLAN-Lab/PALM) | 2026-07-18 |
| 2025-09 | [VLAC](https://arxiv.org/abs/2509.15937) | Unified action/critic token model | Transition advancement critic; action generation and real-world RL | [C](https://github.com/InternRobotics/VLAC) | 2026-07-18 |
| 2025-09 | [World-Env](https://arxiv.org/abs/2509.24948) | Compositional world simulator + VLM reward model | Continuous task-completion probability; imagined VLA RL and early termination | [C, Apache-2.0](https://github.com/amap-cvlab/world-env) · [W](https://www.modelscope.cn/models/junjxiao/world-env) | 2026-07-18 |

The coupling patterns are deliberately separate from output meaning:

- `policy_internal`: auxiliary value/progress heads share the policy representation.
- `joint_world_action_value`: one generative model predicts future state, action, and value.
- `compositional_world_value`: dynamics and value remain distinct modules but jointly drive planning or policy improvement.
- `shared_backbone_multi_interface`: one foundation backbone exposes separate action and monitoring interfaces.
- `value_world_model`: reward/value is predicted by the generative world model, while actions come from a separate policy.
- `standalone_evaluator`: a separate evaluator supplies reward to a policy- or world-model training loop.

For benchmark design, record whether the value is externally queryable at inference, used only as an auxiliary training target, calibrated across tasks, and evaluable independently from policy success.

## 9. Adjacent system interfaces

These are useful boundary papers when the evaluator is consumed for policy selection, termination, recovery, or world-model policy evaluation. They should not displace the core reward-model taxonomy.

| Date | Work | Why it is adjacent |
|---|---|---|
| 2026-04 | [dWorldEval](https://arxiv.org/abs/2604.22152) | World-model proxy for scalable policy evaluation rather than a standalone robot reward model |
| 2025-05 | [WorldEval](https://arxiv.org/abs/2505.19017) | World-model policy ranking and safety checking; evaluator-system boundary |
| 2026-06 | [Recover, Discover, Plan](https://arxiv.org/abs/2606.18328) | Failure-driven skill/concept learning and planning, without a separately benchmarked reward model |

## 10. Community discovery resources

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
