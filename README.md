# Awesome Robot Reward Models

A curated, evidence-tracked list of **robotic reward models (RRMs)**, process/value models, verifiers, and failure/recovery data relevant to evaluating robot behavior.

This repository accompanies the survey *Robotic Reward Models in the Foundation-Model Era: A Survey and Capability Benchmark* ([project page](https://ethanliang99.github.io/awesome-robot-reward-model/)). It is a discovery and collaboration resource, not a claim that every listed method is directly comparable or reproducible.

- **Last literature check:** 2026-09-28
- **Living registry:** [`registry/papers.yaml`](registry/papers.yaml)
- **Robot/data registry:** [`registry/robot_datasets.yaml`](registry/robot_datasets.yaml) · [human-readable matrix](docs/robot-data-matrix.md)
- **Benchmark registry:** [`registry/benchmarks.yaml`](registry/benchmarks.yaml) · [landscape and RRM-Bench-1K](docs/reward-model-benchmarks.md)
- **Latest audit:** [`docs/updates/2026-09-28.md`](docs/updates/2026-09-28.md)
- **Targeted addition:** [`docs/updates/2026-11-10.md`](docs/updates/2026-11-10.md) (three evaluators benchmarked in the survey)
- **Family alignment:** [`docs/updates/2026-11-14.md`](docs/updates/2026-11-14.md) (Sections 1–5 follow the families of the survey)
- **Project page:** [`project-page/`](project-page/), published to GitHub Pages by [`.github/workflows/project-page.yml`](.github/workflows/project-page.yml)

## Scope

Included work must expose, learn, or directly study a task-conditioned signal that evaluates robot-relevant behavior: Outcome, Absolute Progress, Relative, Temporal Value, or Hybrid.

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

1. [Outcome](#1-outcome)
2. [Absolute Progress](#2-absolute-progress)
3. [Relative](#3-relative)
4. [Temporal Value](#4-temporal-value)
5. [Hybrid](#5-hybrid)
6. [Failure, retry, and recovery data](#6-failure-retry-and-recovery-data)
7. [Training data and supervision resources](#7-training-data-and-supervision-resources)
8. [Policy- and world-model-coupled value prediction](#8-policy--and-world-model-coupled-value-prediction)
9. [Robot reward-model benchmarks](#9-robot-reward-model-benchmarks)
10. [Adjacent system interfaces](#10-adjacent-system-interfaces)
11. [Related surveys, perspectives, and community discovery resources](#11-related-surveys-perspectives-and-community-discovery-resources)

Sections 1–5 follow the five semantic families of the survey, which assigns each method to the family whose question its native output answers. The list is broader than the survey's corpus: it also keeps evaluators without foundation models and adjacent work, and it does not yet hold every method of the corpus. The [project page](https://ethanliang99.github.io/awesome-robot-reward-model/#taxonomy) shows all of them by family and design route. Section 7 is a cross-cutting data index, Section 8 records where a value signal lives without treating architectural coupling as a new reward meaning, and Section 9 evaluates the evaluator itself. The registries preserve these dimensions through primary semantics, supervision provenance, `model_coupling`, and benchmark-capability metadata.

## 1. Outcome

*Is the task done, or will it fail?*

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-06 | [Early Warning Signals for OpenVLA Failure](https://arxiv.org/abs/2606.29699) | Policy-internal linear probe predicts near-term execution failure from OpenVLA activations under visual distribution shift | — | 2026-08-13 |
| 2026-02 | [World-VLA-Loop](https://arxiv.org/abs/2602.06508) | Video world model jointly predicts imagined future frames and binary reward; the reward drives VLA RL and policy failures are fed back to refine the world model | [project/repo; source code in preparation](https://github.com/showlab/World-VLA-Loop) | 2026-07-18 |
| 2026-01 | [RoboReward](https://arxiv.org/abs/2601.00675) | General-purpose vision-language reward models; outcome/progress scoring with counterfactual negatives and near-misses | [W](https://huggingface.co/teetone/RoboReward-4B) | 2026-07-18 |
| 2025-09 | [I-FailSense](https://arxiv.org/abs/2509.16072) | VLM with internal failure-sensing heads detects instruction–execution semantic misalignment and transfers to broader failures | [C](https://github.com/clemgris/I-FailSense) · [W](https://huggingface.co/collections/ACIDE/failsense-3b) · [D](https://clemgris.github.io/I-FailSense/); licenses ? | 2026-07-24 |
| 2023-10 | [RoboCLIP](https://proceedings.neurips.cc/paper_files/paper/2023/hash/ae54ce310476218f26dd48c1626d5187-Abstract-Conference.html) | Video-language similarity reward from a single demonstration for robot policy learning | [C](https://github.com/sumedh7/RoboCLIP) · [upstream S3D W](https://www.robots.ox.ac.uk/~vgg/software/S3D/) | 2026-08-02 |

## 2. Absolute Progress

*How far along is it?*

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-09 | [HiRE](https://arxiv.org/abs/2609.27068) | Hindsight edits foundation-feature rewards using successful and failed rollouts to penalize deceptively high-scoring trap states for policy fine-tuning | [qualitative project](https://hire-project.github.io/); code/data not verified | 2026-09-28 |
| 2026-09 | [AnyviewMeter](https://arxiv.org/abs/2609.20106) | Camera geometry and synchronized views adapt Robometer for task-specific scalar progress; real-robot reward evaluation is offline | Code/weights/data not verified; paper's release link unresolved | 2026-09-28 |
| 2026-08 | [GORDON](https://arxiv.org/abs/2608.03753) | Object-centric scene-graph goal distance supplies dense progress reward and exposes stage transitions for automatic long-horizon decomposition | [project](https://andreaprotopapa.github.io/graph-reward-learning/); code/weights/data not verified | 2026-08-13 |
| 2026-07 | [DenseReward](https://arxiv.org/abs/2607.13033) | Dense frame-level reward trained with phase-aware success, failure, and recovery synthesis | [W](https://huggingface.co/densereward/densereward-3frame-thinking) · [D](https://huggingface.co/datasets/densereward/DenseReward) (Apache-2.0 cards); [code repo empty](https://github.com/dense-reward/dense-reward) | 2026-09-28 |
| 2026-06 | [NavWAM](https://arxiv.org/abs/2606.13494) | Joint future-view, action-chunk, and goal-progress prediction for closed-loop visual navigation | [project](https://dachii-azm.github.io/navwam/); code/weights links not verified | 2026-07-18 |
| 2026-06 | [RARM](https://arxiv.org/abs/2606.22027) | Reference-anchored, confidence-gated dense progress reward from one successful demonstration | [project; code coming soon](https://rarm-robotics.github.io/) | 2026-07-18 |
| 2026-06 | [ReTVL](https://arxiv.org/abs/2606.24633) | Retry-supervised value learning around local degradation and recovery events | — | 2026-07-18 |
| 2026-06 | [WVM](https://arxiv.org/abs/2606.24742) | Temporally grounded value estimation with a human-labelled suboptimal/retry benchmark | [repo](https://github.com/255isWhite/WVM); release status ? | 2026-07-18 |
| 2026-06 | [WARP-RM](https://arxiv.org/abs/2606.28320) | Dense signed relative-progress velocity learned self-supervised from time-warped successful demonstrations | [C, MIT](https://github.com/uynitsuj/WARP-RM) | 2026-07-18 |
| 2026-05 | [ProcVLM](https://arxiv.org/abs/2605.08774) | Procedure-grounded progress with remaining-action reasoning over a recent frame window | [C](https://github.com/ProcVLM/ProcVLM) · [W](https://huggingface.co/ce-amtic/ProcVLM-2B) · [D](https://huggingface.co/datasets/ce-amtic/ProcCorpus-60M) | 2026-07-18 |
| 2026-03 | [ProgressVLA](https://arxiv.org/abs/2603.27670) | Progress estimator scores action-conditioned future latents from an inverse-dynamics world model and differentiably guides the diffusion policy | — | 2026-07-24 |
| 2026-03 | [SOLE-R1](https://arxiv.org/abs/2603.28730) | Per-timestep video-language reasoning and dense progress used as the sole online-RL reward | [C](https://github.com/rai-opensource/sole-r1) · [W/D collection](https://huggingface.co/collections/theaiinstitute/sole-r1) | 2026-07-18 |
| 2026-03 | [ProgAgent](https://arxiv.org/abs/2603.07784) | Initial/current/goal progress potential for continual robot RL with OOD regularization | — | 2026-07-18 |
| 2026-03 | [Rewarding DINO](https://arxiv.org/abs/2603.16978) | Language-conditioned dense visual reward distilled from analytical simulator rewards | — | 2026-07-18 |
| 2026-02 | [TOPReward: Token Probabilities as Hidden Zero-Shot Rewards for Robotics](https://arxiv.org/abs/2602.19313) | Zero-shot reward extracted from VLM token probabilities; evaluated with ManiRewardBench | [C, MIT](https://github.com/TOPReward/TOPReward) | 2026-08-02 |
| 2025-12 | [EVOLVE-VLA](https://arxiv.org/abs/2512.14666) | Learned visual progress estimator provides smoothed dense reward for test-time VLA adaptation, stopping, and horizon extension | [project/repo shell](https://github.com/showlab/EVOLVE-VLA); runnable release not verified | 2026-07-24 |
| 2025-09 | [World-Env](https://arxiv.org/abs/2509.24948) | LLaVA-based instant reflector with a trained scalar head estimates task-completion probability over imagined video for VLA reward and early termination | [C, Apache-2.0](https://github.com/amap-cvlab/world-env) · [W](https://www.modelscope.cn/models/junjxiao/world-env) | 2026-07-18 |
| 2025-05 | [ReWiND](https://proceedings.mlr.press/v305/zhang25a.html) | Language-conditioned progress reward learned from human/robot video for reward relabeling and policy learning | [C](https://github.com/rewind-reward/ReWiND) | 2026-08-02 |
| 2024-11 | [Generative Value Learning (GVL)](https://openreview.net/forum?id=friHAl5ofG) | Generative completion-percentage prediction from shuffled trajectory frames for robot policy learning | [project](https://generative-value-learning.github.io/); code/weights not verified | 2026-08-02 |
| 2024-07 | [Adapt2Reward](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/07430.pdf) | Failure-prompt adaptation for generalizable robotic rewards | — | 2026-08-02 |
| 2024-05 | [Video-Language Critic](https://openreview.net/forum?id=jJOVpnNrEp) | Video-language preference critic supplies temporal reward for robot policy learning | [C, MIT](https://github.com/minttusofia/video_language_critic) | 2026-08-02 |
| 2023-10 | [VLM-RM](https://openreview.net/forum?id=N0I2RtD8je) | Zero-shot CLIP-family vision-language reward for language-conditioned robot reinforcement learning | [C, MIT](https://github.com/AlignmentResearch/vlmrm) | 2026-08-02 |
| 2023-06 | [LIV](https://proceedings.mlr.press/v202/ma23b.html) | Language-image representations trained from video provide goal-conditioned visual reward for robotic manipulation | [C, MIT](https://github.com/penn-pal-lab/LIV) · [W](https://huggingface.co/jasonyma/LIV) | 2026-08-02 |
| 2022-09 | [VIP](https://openreview.net/forum?id=0kR3wP6ZKq) | Pretrained visual value representation supplies dense distance-based reward from passive human video | [C](https://github.com/facebookresearch/vip) | 2026-08-02 |
| earlier | [PROGRESSOR](https://github.com/ripl/progressor) | Perceptually guided progress estimator with online refinement | C | 2026-07-18 |

## 3. Relative

*Which is better?*

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-08 | [Dream2Reward](https://arxiv.org/abs/2608.18787) | Signed transition reward compares observed visual change with predicted successful latent change from positive demonstrations; tested as dense policy-learning feedback | — | 2026-09-28 |
| 2026-06 | [Freeform Preference Learning](https://arxiv.org/abs/2606.32027) | Language-conditioned, axis-specific trajectory reward from freeform pairwise human preferences | [C](https://github.com/freeform-pl/fpl) · [real-world tools](https://github.com/freeform-pl/fpl_real); license ? | 2026-07-18 |
| 2026-05 | [TapSampling](https://arxiv.org/abs/2605.25547) | Task-progress-outcome verifier ranks sampled candidate action chunks at inference time | [C](https://github.com/aipixel/TapSampling) · [W](https://huggingface.co/collections/SizheZhao/tapsampling) · [D](https://huggingface.co/datasets/SizheZhao/TapSampling-CALVIN-Part-Data); licenses ? | 2026-07-24 |
| 2026-03 | [MVR](https://openreview.net/forum?id=7lw6s9ELfr) | Multi-view video-text state relevance with state-dependent shaping for locomotion and manipulation RL | [C, MIT](https://github.com/mvr-rl/mvr) · [upstream ViCLIP W](https://github.com/OpenGVLab/InternVideo/tree/main/InternVideo1/Downstream/Video-Text-Retrieval) | 2026-08-02 |
| 2026-02 | [CoVer-VLA](https://arxiv.org/abs/2602.12281) | 1B contrastive verifier ranks rephrased instructions and action chunks by vision–language–action alignment | [C](https://github.com/cover-vla/cover-vla) · [W](https://huggingface.co/cover-vla); licenses ? | 2026-07-24 |
| 2025-12 | [Robo-Dopamine](https://arxiv.org/abs/2512.23703) | Multi-view pairwise process reward for signed progress/regress between before/after observations | [C](https://github.com/FlagOpen/Robo-Dopamine) · [W](https://huggingface.co/tanhuajie2001/Robo-Dopamine-GRM-8B) · [gated D](https://huggingface.co/datasets/tanhuajie2001/Robo-Dopamine-GRM-Dataset) | 2026-07-18 |
| 2025-10 | [RoVer](https://arxiv.org/abs/2510.10975) | External PRM scores candidate actions and predicts a 6D refinement direction for test-time VLA scaling | — | 2026-07-24 |
| 2025-09 | [TimeRewarder](https://arxiv.org/abs/2509.26627) | Frame-wise temporal distance from passive human and robot video as dense reward | [C](https://github.com/CowAndSheep/TimeRewarder) | 2026-07-18 |
| 2025-06 | [RoboMonkey](https://proceedings.mlr.press/v305/kwok25a.html) | VLM verifier selects among policy samples and Gaussian action perturbations | [C, MIT](https://github.com/robomonkey-vla/RoboMonkey) · [W, MIT](https://huggingface.co/robomonkey-vla/monkey-verifier-7b) · [D; license ?](https://huggingface.co/datasets/robomonkey-vla/action_preference_bridge) | 2026-07-24 |
| 2024-02 | [RL-VLM-F](https://proceedings.mlr.press/v235/wang24bn.html) | VLM-generated pairwise preferences converted into a learned reward for robot RL | [paper](https://arxiv.org/abs/2402.03681) | 2026-07-18 |

RoboMonkey and RoVer construct preferences from proximity to demonstrated actions; CoVer learns instruction–action alignment; TapSampling predicts task-progress outcomes. These are useful test-time verifiers, but their scores are not interchangeable with calibrated task success or trajectory-level progress.

## 4. Temporal Value

*Which stage, and how well is it going?*

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-09 | [SeeQ](https://arxiv.org/abs/2609.22085) | PaliGemma-based subtask Q-function predicts the current subtask and ranks candidate action chunks for best-of-N steering; paper fine-tunes on target tasks | [W, pretrained only; Gemma terms](https://huggingface.co/CMU-AIRe/SeeQ-3B); method code not verified | 2026-09-28 |
| 2026-08 | [RynnValue](https://arxiv.org/abs/2608.09853) | Language-conditioned absolute and relative temporal distance (physical-seconds cost-to-go) used as a value interface and potential-based dense reward | [C, Apache-2.0](https://github.com/alibaba-damo-academy/RynnValue) · [W 4B](https://huggingface.co/Alibaba-DAMO-Academy/RynnValue-4B) · [W 8B](https://huggingface.co/Alibaba-DAMO-Academy/RynnValue-8B) (model cards Apache-2.0; GitHub release note stale) | 2026-09-28 |
| 2026-07 | [WCM](https://arxiv.org/abs/2607.29613) | History-aware critic jointly learns future latent prediction and task value for VLA reinforcement learning under partial observability | [C, MIT](https://github.com/sylvestf/WCM) · [example W/D](https://huggingface.co/collections/Sylvest/wcm) | 2026-08-13 |
| 2026-07 | [Robo-ValueRL](https://arxiv.org/abs/2607.09866) | History-conditioned three-view value estimator trained on normalized remaining time with a failure penalty; value differences label action quality for quality-conditioned policy pretraining and online adaptation | [C, license not stated](https://github.com/Open-X-Humanoid/Robo-ValueRL) · [W, MIT card](https://huggingface.co/X-Humanoid/Robo-ValueRL) · [D, license not stated](https://huggingface.co/datasets/X-Humanoid/Robo-ValueRL) | 2026-11-10 |
| 2026-06 | [SARM2](https://arxiv.org/abs/2606.10305) | Multi-task action-primitive stage estimator plus MoE value head for dense progress | [C](https://github.com/xdofai/opensarm) · [SPIRAL](https://github.com/Qianzhong-Chen/openspiral); weights — | 2026-07-18 |
| 2026-06 | [MV-WAM](https://arxiv.org/abs/2606.21088) | Joint visual/action/value generation with task-completion estimation, action–frame misalignment detection, and value-guided rollback | — | 2026-07-18 |
| 2026-05 | [ProgVLA](https://arxiv.org/abs/2605.28231) | Policy-internal V/Q-style progress critics over normalized remaining horizon, used for advantage- and success-weighted imitation | code/checkpoints/data promised upon publication | 2026-07-18 |
| 2026-04 | [ViVa](https://arxiv.org/abs/2604.08168) | Video-generative scalar value coupled to predicted future proprioception | [C](https://github.com/GigaAI-research/ViVa); license/weights ? | 2026-07-18 |
| 2026-02 | [RISE](https://arxiv.org/abs/2602.11075) | Progress value evaluates action-conditioned imagined futures and supplies advantages for policy improvement | [C](https://github.com/OpenDriveLab/RISE) · [W: dynamics only](https://github.com/OpenDriveLab/RISE); code Apache-2.0, released data/checkpoints CC BY-NC-SA 4.0 | 2026-07-18 |
| 2026-02 | [MARVL](https://arxiv.org/abs/2602.15872) | Multi-stage VLM guidance with spatial/semantic consistency and task-direction projection for robot manipulation | — | 2026-08-02 |
| 2026-01 | [Cosmos Policy](https://arxiv.org/abs/2601.16163) | Joint action, future-state, and expected rewards-to-go prediction for direct control and best-of-N planning | [C, Apache-2.0](https://github.com/NVlabs/cosmos-policy) · [W/D](https://huggingface.co/collections/nvidia/cosmos-policy); item licenses require review | 2026-07-18 |
| 2026-01 | [PALM](https://arxiv.org/abs/2601.07060) | Continuous within-subtask progress jointly decoded with actions to stabilize transitions in long-horizon manipulation | [C](https://github.com/PLAN-Lab/PALM) · [W](https://github.com/PLAN-Lab/PALM#-checkpoints); license ? | 2026-07-18 |
| 2025-09 | [SARM](https://openreview.net/forum?id=aemqAxScl9) | Stage-aware video reward for long-horizon manipulation | [C](https://github.com/xdofai/opensarm) | 2026-08-02 |
| 2025-05 | [Hume](https://arxiv.org/abs/2505.21432) | Policy-internal value-query head estimates state–action value for sampled action chunks and drives System-2 best-of-N selection | [C, MIT](https://github.com/hume-vla/hume) · [W, MIT](https://huggingface.co/Hume-vla/Hume-System2) | 2026-07-24 |
| 2023-12 | [Diffusion Reward](https://arxiv.org/abs/2312.14134) | Negative conditional entropy from a video diffusion model provides history-conditioned reward for expert-like robot behavior | [C, MIT](https://github.com/TEA-Lab/diffusion_reward) · [W](https://huggingface.co/tauhuang/diffusion_reward) · [D](https://huggingface.co/datasets/tauhuang/diffusion_reward) | 2026-08-02 |

## 5. Hybrid

*What happened, and on what evidence?*

| Date | Work | Signal and role | Artifacts | Verified |
|---|---|---|---|---|
| 2026-10 | [Flora-Rewarder](https://arxiv.org/abs/2610.31779) | One fine-tuned VLM returns an episode outcome score (1–5), dense action-quality scores per 0.5 s step, and rubric step scores for deployment monitoring, data filtering, and RL post-training | [C, NVIDIA License](https://github.com/NVlabs/Flora) · [W, non-commercial research only](https://huggingface.co/nvidia/Flora-Rewarder); training data not found | 2026-11-10 |
| 2026-09 | [VLA-Corrector (Song et al.)](https://arxiv.org/abs/2609.06508) | Stage-aware learned verifier uses visual, proprioceptive, and action history to trigger prompt-based recovery of a frozen VLA; separate from the July VLA-Corrector | — | 2026-09-28 |
| 2026-08 | [TrustRoboReward](https://arxiv.org/abs/2608.08491) | Four-interface pointwise/pairwise trajectory-progress and grounded-video-QA reward model with preference-ordered isotonic score editing | [partial C](https://github.com/TrustRoboreward/TrustRoboReward); weights/data/license not verified | 2026-08-13 |
| 2026-08 | [Thea](https://arxiv.org/abs/2608.11246) | Independent post-condition evaluator maps current physical evidence to in-progress/success/failure exit codes for termination, retry, and recovery | [C, Apache-2.0](https://github.com/EIT-HAI/Thea); evaluator weights/data not released | 2026-08-13 |
| 2026-07 | [VLAC-Cut (HELP)](https://arxiv.org/abs/2607.09776) | Rollout segmentation critic estimates signed, non-monotonic progress with a diagnosis of each change and cuts autonomous rollouts into progress-making, idle, failure-inducing, and recovery segments for post-training data curation | [C, MIT](https://github.com/InternRobotics/VLAC-cut) · [W](https://huggingface.co/InternRobotics/VLAC-Cut) · [D](https://huggingface.co/datasets/InternRobotics/VLAC-Cut-FullData) · [benchmark D](https://huggingface.co/datasets/InternRobotics/VLAC-Cut-Benchmark) (model and data cards: license "other") | 2026-11-10 |
| 2026-07 | [CoRe](https://arxiv.org/abs/2607.01721) | Combines a VLM-optimized formal reward with a residual reward learned from VLM-labelled video preferences | [project](https://core-2026.github.io/); code/weights/data not verified | 2026-08-02 |
| 2026-07 | [ACE-Brain-0.5](https://arxiv.org/abs/2607.04426) | Shared embodied backbone estimates execution progress for self-monitoring, verification, and recovery alongside planning and action generation | [W](https://huggingface.co/ACERobotics/ACE-Brain-0.5-8B) · [project repo; runnable task code not verified](https://github.com/DAXIAORobotics/ACE-Brain-0.5) | 2026-07-18 |
| 2026-06 | [Success Visitation Matching](https://arxiv.org/abs/2606.23640) | Discriminator turns successful-vs-unsuccessful state–action visitation into dense, outcome-preserving process reward for robot RL | [project; code coming soon](https://success-visitation-matching.github.io/) | 2026-07-24 |
| 2026-06 | [Reward as An Agent](https://arxiv.org/abs/2606.19990) | Agentic evaluator judges physical plausibility and task completion in embodied world-model rollouts to provide robust reward signals | [C](https://github.com/SpursLipu/Reward-as-An-Agent-for-Embodied-World-Models); license ? | 2026-08-02 |
| 2026-05 | [RoboAlign-R1](https://arxiv.org/abs/2605.03821) | Qwen3-VL-8B-Thinking teacher judge is distilled into a 98M six-dimensional reward model for GRPO post-training of robot video world models | [project](https://roboalign-r1.netlify.app/); public repo is currently a placeholder | 2026-07-18 |
| 2026-04 | [ARM](https://arxiv.org/abs/2604.03037) | Tri-state progressive/regressive/stagnant advantage over temporal segments; global progress reconstruction | [project](https://aiming1998.github.io/ARM/); code not verified | 2026-07-18 |
| 2026-03 | [Large Reward Models](https://arxiv.org/abs/2603.16065) | Multi-source VLM process, completion, and temporal-contrast reward generation for online refinement | [C](https://github.com/physical-superintelligence-lab/Large-Reward-Models) | 2026-07-18 |
| 2026-03 | [PRIMO R1](https://arxiv.org/abs/2603.15600) | RL-induced process reasoning for progress estimation and zero-shot failure detection | — | 2026-07-18 |
| 2026-03 | [PRM-as-a-Judge](https://arxiv.org/abs/2603.21669) | Dense robotic auditing with outcome/process/diagnosis metrics and progress-potential judges | [project](https://prm-as-a-judge.github.io/); artifact audit pending | 2026-07-18 |
| 2026-03 | [Generalizable Dense Reward / VLLR](https://arxiv.org/abs/2604.00055) | VLM subtask progress plus policy self-certainty for long-horizon RL | [project](https://silongyong.github.io/vllr_project_page/); artifact audit pending | 2026-07-18 |
| 2026-03 | [Robometer](https://arxiv.org/abs/2603.02115) | Trajectory-comparison reward with intra-trajectory progress and inter-trajectory preference supervision | [C](https://github.com/robometer/robometer) · [W](https://huggingface.co/robometer/Robometer-4B) · [processed D; canonical release caveat](https://huggingface.co/datasets/robometer/processed_datasets) | 2026-07-18 |
| 2026-01 | [ReWorld](https://arxiv.org/abs/2601.12428) | Hierarchical four-dimensional reward model scores physical realism, task completion, embodiment plausibility, and visual quality for robot video-world-model alignment | — | 2026-07-24 |
| 2025-12 | [Guardian / FailCoT](https://arxiv.org/abs/2512.01946) | Multi-view planning and execution verifier trained on synthesized cross-environment failures | [C, MIT](https://github.com/paulpacaud/Guardian-FailCot) · [W, Apache-2.0](https://huggingface.co/paulpacaud/guardian-thinking) · [D](https://huggingface.co/collections/paulpacaud/robotic-failure-detection-dataset-and-model-guardian) | 2026-07-18 |
| 2025-09 | [VLAC](https://arxiv.org/abs/2509.15937) | Vision-language-action critic with pairwise transition-level advancement signals | [C](https://github.com/InternRobotics/VLAC) | 2026-07-18 |

## 6. Failure, retry, and recovery data

These works are not automatically reward models. They are catalogued as supervision or benchmark candidates for failure onset, recoverability/PONR, recovery re-entry, and verifier evaluation.

| Date | Work | Potential use in RRM research | Artifacts | Verified |
|---|---|---|---|---|
| 2026-07 | [EgoRecovery](https://arxiv.org/abs/2607.19745) | Human egocentric recovery clips plus small robot anchors provide recovery-needed labels, an explicit recovery/normal boundary, corrective magnitude, and success-trajectory re-entry supervision | paper-linked repo returned 404; data/weights not released | 2026-07-24 |
| 2026-06 | [Robot Self-Improvement via Human-Video Dynamics Models](https://arxiv.org/abs/2606.21406) | Human-video value/dynamics priors adapted with robot failures; corrective-action ranking around recoverable states | [project; code coming soon](https://ethz-mrl.github.io/robot-self-improvement-website/) | 2026-07-18 |
| 2026-06 | [SO-101 failure/recovery benchmark](https://arxiv.org/abs/2606.08881) | Low-cost real-robot failure/recovery evaluation candidate; data license pending | — | 2026-07-18 |
| 2026-03 | [Dream2Fix](https://arxiv.org/abs/2603.13528) | Ctrl-World action perturbations turn successful real demonstrations into >120K paired failure videos with type/stage labels and deterministic trajectory corrections | [project; code coming soon](https://dream2fix.github.io/); dataset/weights not verified | 2026-07-19 |
| 2025-12 | [FailCoT / Guardian](https://arxiv.org/abs/2512.01946) | Planning/execution failures, reasoning traces, and multi-view real-robot OOD evaluation | [C/W/D](https://github.com/paulpacaud/Guardian-FailCot) | 2026-07-18 |
| 2025-12 | [ViFailback](https://arxiv.org/abs/2512.02787) | Real manipulation failures and correction supervision; onset/type/recovery-facing evaluation candidate | [C](https://github.com/x1nyuzhou/ViFailback); data license ? | 2026-07-18 |
| 2025-10 | [FailSafe](https://arxiv.org/abs/2510.01642) | Failure/recovery action data and reasoning; release conditions pending | — | 2026-07-18 |
| 2025-05 | [RoboFAC](https://arxiv.org/abs/2505.12224) | Error trajectories plus hierarchical QA/correction labels; failure taxonomy and verifier benchmark | [C](https://github.com/MINT-SJTU/RoboFAC) | 2026-07-18 |
| 2024-12 | [RoboMIND](https://arxiv.org/abs/2412.13877) | Multi-embodiment robot data with reported failure coverage | [project](https://x-humanoid-robomind.github.io/); split/license audit required | 2026-07-18 |
| 2024-10 | [AHA](https://arxiv.org/abs/2410.00371) | Failure reasoning/detection with synthetic perturbations; taxonomy baseline | [C](https://github.com/NVlabs/AHA) | 2026-07-18 |
| 2023-06 | [REFLECT](https://arxiv.org/abs/2306.15724) | Historical failure explanation and replanning context; not itself a reward model | — | 2026-07-18 |

### Counterfactual and generative failure synthesis

This is an emerging data axis rather than a new reward semantics. See the [failure-synthesis pipeline audit](docs/failure-synthesis-pipelines.md) for the full comparison and safeguards.

| Synthesis level | Representative pipeline | Negative signal | Reward/recovery use | Reality caveat |
|---|---|---|---|---|
| Temporal/semantic pseudo-negative | Robo-Dopamine; RoboReward; Guardian BridgeDataV2-Fail | Reverse order, task mismatch, relabel, or image substitution | Progress contrast and verifier training | No failed physical dynamics are produced |
| Simulator intervention | DenseReward; FAILSafe; RACER | Perturb grasp, motion, action, or state and execute in simulation | Dense reward, failure onset/type, simulated recovery | Physical rollout exists only in simulation |
| World-model counterfactual video | Dream2Fix | Perturb real-demo actions around a keyframe and generate the resulting video | Outcome/type/stage plus deterministic executable correction | Real source context, but generated failure is not real execution |
| Real failure | RoboArena; REASSEMBLE; ViFailback | Natural policy, operator, object, or environment deviation | Ground-truth outcome/preference/recovery anchor | Highest fidelity, highest collection cost/risk |

The likely scalable recipe is a **hybrid**: use generative pipelines for coverage, simulator interventions for dense physical labels, and a smaller set of real failures for calibration and held-out evaluation. `world_model_synth` must remain distinct from `real_executed`.

## 7. Training data and supervision resources

This is a cross-cutting index of data that can instantiate reward targets. It records **where the negative signal came from**: a real failure, an induced error, a mixed-expertise rollout, a corrective action, or a synthetic temporal reversal. Those sources should not be treated as interchangeable.

### Model-associated reward corpora

| Corpus | Scale and composition | Reward supervision recipe | Release status | Important caveat |
|---|---|---|---|---|
| [Robo-Dopamine GRM data](https://huggingface.co/datasets/tanhuajie2001/Robo-Dopamine-GRM-Dataset) | 35M samples from ~3,400h, >100K trajectories, and >350 tasks; real robot, simulation, and human egocentric video | Human-annotated keyframes define step segments; ordered state pairs yield progress hops and reversed-order pairs yield regress hops | Gated dataset; Apache-2.0 card | Most negative supervision is constructed by reversing temporal order inside expert trajectories. It is not equivalent to observing a robot make and recover from a real mistake. |
| [RBM-1M / Robometer](https://arxiv.org/abs/2603.02115) | 1,059,370 video–language annotations across 21 robot embodiments; expert, paired human–robot, mixed-expertise/failure, and human-only sources | Frame-level progress/success on expert trajectories plus trajectory preferences over expert, suboptimal, failed, rewound, and task-mismatched pairs | [Processed data repository](https://huggingface.co/datasets/robometer/processed_datasets) exists; official project still labels the canonical RBM-1M release “coming soon” | The aggregate count may include multiple views/annotations from one episode. Source licenses and failure provenance remain dataset-specific. |

| [DenseReward corpus](https://huggingface.co/datasets/densereward/DenseReward) | Paper reports 26,579 episodes and 7.56M frame samples across DROID, Isaac Sim, RoboSuite, and LIBERO; released dataset card is Apache-2.0 | Phase-aware frame reward with synthesized physical failure modes and recovery cases | [D](https://huggingface.co/datasets/densereward/DenseReward) · [W](https://huggingface.co/densereward/densereward-3frame-thinking); [code repo empty](https://github.com/dense-reward/dense-reward) | Simulated failure synthesis is not real executed failure; model-native reward targets are not independent gold labels. |

### Robot embodiment and failure provenance audit

The [detailed robot/data matrix](docs/robot-data-matrix.md) records arm, gripper, sensing, task, count unit, label granularity, concrete failure modes, and reuse by Robometer/Robo-Dopamine. Its structured counterpart is [`registry/robot_datasets.yaml`](registry/robot_datasets.yaml).

| Resource | Robot(s) | Reward-ready signal | Failure status |
|---|---|---|---|
| [RoboArena 2026-02-03 dump](https://huggingface.co/datasets/RoboArena/DataDump_02-03-2026/tree/main) | Real Franka Panda + Robotiq 2F-85 | 9,589 autonomous-policy episodes; preferences/ties, 0–100 progress, binary and partial success, free-form explanations | Real executed failure/partial progress; no fixed cause taxonomy |
| [REASSEMBLE](https://researchdata.tuwien.ac.at/records/0ewrv-8cb44) | Real Franka Emika FR3 | 4,551 demonstrations; high-action and low-skill Boolean success; 4,035 success / 516 unsuccessful | Real misses, slips, alignment/orientation errors, jams, failed release, and placement obstruction |
| [Guardian: RLBench-Fail](https://arxiv.org/html/2512.01946v3) | Simulated Franka Panda | Typed planning/execution errors plus reasoning | Simulated/injected and counterfactual |
| [Guardian: BridgeDataV2-Fail](https://huggingface.co/collections/paulpacaud/robotic-failure-detection-dataset-and-model-guardian) | Real-source WidowX 250 imagery | Typed errors plus reasoning | Counterfactual text/image failures; not physically executed failures |
| [Guardian: UR5-Fail](https://arxiv.org/html/2512.01946v3) | Real UR5, three D435 cameras | Manual subtask success/failure plus reasoning | Real execution failures; generated planning failures |
| [RH20T](https://rh20t.github.io/) | Flexiv, UR5, Franka Panda, KUKA LBR iiwa | `0=robot failure`, `1=task failure`, `2–9=completion quality` | Real but coarse; no published unified cause taxonomy |
| [RoboChallenge Table30 V2](https://huggingface.co/datasets/RoboChallenge/Table30v2) | ARX5, UR5, ALOHA, DOS-W1 | 30-task multi-view demonstrations; `task_info.json` includes prompt, description, scoring criteria, and task tags; challenge rollouts receive stage progress and success scores | Human-defined process rubric plus real-robot evaluation outcomes; no fixed failure-cause taxonomy or demonstrated frame-level stage-boundary labels |

Known parent-source overlap between Robometer and Robo-Dopamine is limited to **AgiBotWorld, DROID, and LIBERO** at the published metadata level. Exact episode overlap is unknown. Robo-Dopamine's reversed-order `REGRESS` pairs are constructed temporal supervision; Robometer additionally includes real, simulated, automatically labelled, and counterfactual failure sources. Do not pool these as one undifferentiated negative class.

### Arena and challenge supervision

Arena/challenge platforms are a separate cross-cutting data source: they join expert demonstrations, a human-defined evaluation rubric, real policy rollouts, and comparable scores. They are especially useful for learning or testing value models across policies and partial completion—not only final success.

| Platform | Training side | Evaluation side | Reward/value opportunity |
|---|---|---|---|
| [RoboChallenge Table30 / V2](https://robochallenge.ai/) | Up to 1,000 demonstrations per task in the original protocol; V2 releases multi-view demonstrations for four embodiments and embeds task-level scoring criteria/tags | A task is divided into scored stages; critical stages determine success, retries reduce progress, and public runs include score, success rate, video, and logs | Absolute stage value, critical-stage verifier, retry penalty, terminal success, multi-task and cross-machine calibration |
| [RoboArena](https://arxiv.org/abs/2506.18123) | No fixed expert-training requirement; evaluates submitted policies on distributed real DROID setups | Human pairwise preference including ties, maximum progress, binary/partial success, and free-form explanation over autonomous rollouts | Pairwise reward, partial-completion value, explanation-grounded failure mining, policy ranking |

For Table30, the published `scoring` field is a **task/stage rubric**, not evidence of per-frame stage-boundary annotations in every demonstration. Keep `rubric`, `rollout score`, and `frame label` as three separate metadata fields.

### Egocentric, procedural-error, and cross-embodiment supervision

| Date | Dataset | Failure / correction evidence | Reward targets it can support | Data and license | Transfer caveat |
|---|---|---|---|---|---|
| 2026-07 | [EgoRecovery](https://arxiv.org/abs/2607.19745) | Per task, 300 human recovery clips plus 50 robot recovery and 50 normal robot demonstrations; recovery-state frames, recovery-to-normal boundary, corrective timing/magnitude, and final success | Recovery-needed probability; recovery boundary; corrective value; valid-trajectory re-entry | Paper only; linked code URL returned 404 and no data/weights release was verified | Human clips supervise corrective intent and timing, not robot action tokens; robot arm/gripper were not reported in accessible paper text. |
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
| 2026-09 | [SeeQ](https://arxiv.org/abs/2609.22085) | Separate subtask Q-function over a VLM backbone | Predicts the active subtask, then scores candidate action chunks for best-of-N steering after target-task fine-tuning | [W, pretrained only](https://huggingface.co/CMU-AIRe/SeeQ-3B); code not verified | 2026-09-28 |
| 2026-09 | [VLA-Corrector (Song et al.)](https://arxiv.org/abs/2609.06508) | Separate execution verifier in a frozen-policy recovery loop | Stage/progress and binary risk trigger prompt recovery; not a scalar completion reward | — | 2026-09-28 |
| 2026-07 | [WCM](https://arxiv.org/abs/2607.29613) | History-aware value/world critic | Task return from observation history and language; joint future-latent prediction shapes the representation used by on- or off-policy VLA RL | [C, MIT](https://github.com/sylvestf/WCM) · [example W/D](https://huggingface.co/collections/Sylvest/wcm) | 2026-08-13 |
| 2026-07 | [ACE-Brain-0.5](https://arxiv.org/abs/2607.04426) | Shared embodied backbone | Execution progress; self-monitoring, verification, and recovery | [W](https://huggingface.co/ACERobotics/ACE-Brain-0.5-8B) · [repo](https://github.com/DAXIAORobotics/ACE-Brain-0.5) | 2026-07-18 |
| 2026-06 | [MV-WAM](https://arxiv.org/abs/2606.21088) | Joint world–action–value generator | Task completion/progress; misalignment detection and rollback | — | 2026-07-18 |
| 2026-06 | [NavWAM](https://arxiv.org/abs/2606.13494) | Joint world–action–value generator | Goal-progress value; closed-loop navigation and optional best-of-N selection | [project](https://dachii-azm.github.io/navwam/) | 2026-07-18 |
| 2026-06 | [Robot Self-Improvement via Human-Video Dynamics Models](https://arxiv.org/abs/2606.21406) | Compositional policy + dynamics + value | Progress-aligned value; ranks corrective actions after failures | [project; code coming soon](https://ethz-mrl.github.io/robot-self-improvement-website/) | 2026-07-18 |
| 2026-05 | [RoboAlign-R1](https://arxiv.org/abs/2605.03821) | Standalone teacher→student evaluator inside a world-model loop | Six-dimensional semantic/physical reward; GRPO post-training of the robot video world model, not the VLA policy | [project](https://roboalign-r1.netlify.app/); releases claimed | 2026-07-18 |
| 2026-05 | [ProgVLA](https://arxiv.org/abs/2605.28231) | Policy-internal auxiliary critics | Remaining-horizon V/Q and near-completion success; reweights imitation training | — | 2026-07-18 |
| 2026-04 | [ViVa](https://arxiv.org/abs/2604.08168) | Value coupled to generative foresight | Scalar future-conditioned task value; robot RL | [C](https://github.com/GigaAI-research/ViVa) | 2026-07-18 |
| 2026-03 | [ProgressVLA](https://arxiv.org/abs/2603.27670) | Compositional inverse-dynamics world model + progress estimator | Future-latent progress; differentiable action-token guidance and termination | — | 2026-07-24 |
| 2026-02 | [RISE](https://arxiv.org/abs/2602.11075) | Compositional dynamics + progress value | Imagined-outcome value; advantage estimation for policy improvement | [C](https://github.com/OpenDriveLab/RISE) · [W: dynamics only](https://github.com/OpenDriveLab/RISE) | 2026-07-18 |
| 2026-02 | [World-VLA-Loop](https://arxiv.org/abs/2602.06508) | Reward head integrated into the video world model | Binary imagined outcome reward; iterative VLA RL plus policy-failure feedback to the world model | [project/repo; code in preparation](https://github.com/showlab/World-VLA-Loop) | 2026-07-18 |
| 2026-01 | [Cosmos Policy](https://arxiv.org/abs/2601.16163) | Joint world–action–value generator | Expected cumulative reward at predicted future state; planning and rollout refinement | [C](https://github.com/NVlabs/cosmos-policy) · [W/D](https://huggingface.co/collections/nvidia/cosmos-policy) | 2026-07-18 |
| 2026-01 | [PALM](https://arxiv.org/abs/2601.07060) | Joint action–progress decoder | Continuous within-subtask progress; transition timing and long-horizon control | [C/W](https://github.com/PLAN-Lab/PALM) | 2026-07-18 |
| 2025-12 | [EVOLVE-VLA](https://arxiv.org/abs/2512.14666) | Standalone learned progress estimator in a test-time policy loop | Smoothed visual progress; GRPO reward, stopping, and progressive horizon extension | [project/repo shell](https://github.com/showlab/EVOLVE-VLA) | 2026-07-24 |
| 2025-09 | [VLAC](https://arxiv.org/abs/2509.15937) | Unified action/critic token model | Transition advancement critic; action generation and real-world RL | [C](https://github.com/InternRobotics/VLAC) | 2026-07-18 |
| 2025-09 | [World-Env](https://arxiv.org/abs/2509.24948) | Compositional world simulator + VLM reward model | Continuous task-completion probability; imagined VLA RL and early termination | [C, Apache-2.0](https://github.com/amap-cvlab/world-env) · [W](https://www.modelscope.cn/models/junjxiao/world-env) | 2026-07-18 |
| 2025-05 | [Hume](https://arxiv.org/abs/2505.21432) | Policy-internal value-query head | State–action value; low-frequency System-2 candidate selection before System-1 denoising | [C, MIT](https://github.com/hume-vla/hume) · [W, MIT](https://huggingface.co/Hume-vla/Hume-System2) | 2026-07-24 |

The coupling patterns are deliberately separate from output meaning:

- `policy_internal`: auxiliary value/progress heads share the policy representation.
- `joint_world_action_value`: one generative model predicts future state, action, and value.
- `compositional_world_value`: dynamics and value remain distinct modules but jointly drive planning or policy improvement.
- `shared_backbone_multi_interface`: one foundation backbone exposes separate action and monitoring interfaces.
- `value_world_model`: reward/value is predicted by the generative world model, while actions come from a separate policy.
- `standalone_evaluator`: a separate evaluator supplies reward to a policy- or world-model training loop.

For benchmark design, record whether the value is externally queryable at inference, used only as an auxiliary training target, calibrated across tasks, and evaluable independently from policy success.

## 9. Robot reward-model benchmarks

Benchmarking is a first-class category because a reward model can fit one output format while failing at a different requirement: calibration, fine progress, non-monotonic behavior, failure onset, or recovery. The [detailed benchmark landscape](docs/reward-model-benchmarks.md) separates direct reward tests, diagnostic prerequisites, model-native suites, and downstream policy sources; [`registry/benchmarks.yaml`](registry/benchmarks.yaml) is the machine-readable inventory.

| Released | Benchmark | Primary target | Scale and metric | Main missing axis |
|---|---|---|---|---|
| 2026-11 | [RRM-Bench-1K](https://ethanliang99.github.io/awesome-robot-reward-model/#bench) | Whether credit follows the task state of a real execution: fulfillment, credit withdrawal, and camera evidence | 1,117 real-robot videos, 52 tasks, five embodiments; rising/falling direction F1, VOC, Kendall τ_a, paired sufficient and reduced views | One platform (RoboChallenge Table30 and Table30 V2); data release pending |
| 2026-09 | [RoboRMBench](https://arxiv.org/abs/2609.05401) | Score stability under semantically equivalent task instructions on the same trajectory | 2,390 real-robot trajectories, 21,673 filtered paraphrases; SCR / flip rate / mean error | Derived from RoboRewardBench; benchmark files not verified as released; no temporal failure/recovery tests |
| 2026-08 | [HumanTracker / HumanScore](https://arxiv.org/abs/2608.13555) | Human preference alignment for humanoid motion-tracking quality | [6,000 preference pairs and 2,500 motion references released](https://huggingface.co/datasets/GalaxyGeneralRobotics/HumanTracker); [C/W](https://github.com/GalaxyGeneralRobotics/HumanTracker) | Specialized motion-tracking metric, not task-completion reward; public release is a subset of the paper's full data |
| 2026-08 | [TrustRoboReward benchmark](https://arxiv.org/abs/2608.08491) | Pointwise/pairwise trajectory progress and grounded-video-QA quality, plus cross-interface consistency | 7,030 human-annotated test items across four paradigms; MAE-style score metrics, pairwise accuracy, consistency | Paper-associated split is not a released independent gold test; no closed-loop physical-robot validation |
| 2026-07 | [DenseReward evaluation suite](https://arxiv.org/html/2607.13033v1) | Dense failure-aware reward plus MPC/RL use | 26,579 episodes / 7.56M frames; reward MAE | Model-native rather than independent gold test |
| 2026-06 | [Suboptimal-Value-Bench](https://zh1hao.wang/wvm/) | Hesitation and retry value | 800 trajectories, 15 tasks; Retry VOC / Hesitation RMSE | Data repository still empty on 2026-07-19; only two suboptimal modes |
| 2026-06 | [RoboProcessBench](https://arxiv.org/html/2606.13040) | Process-aware VLM capability | ~58K QA, 260 tasks, 12 families; accuracy | Diagnostic QA, not direct reward calibration |
| 2026-05 v2 | [RBM-EVAL-ID / OOD](https://arxiv.org/html/2603.02115v2) | Reward order and trajectory quality | ID 25,726; OOD 571; VOC / Kendall / preference accuracy | Limited typed onset, causal, and recovery annotations |
| 2026-03 | [RoboPulse](https://huggingface.co/datasets/yuheng2000/RoboPulse) | Micro-scale relative progress | 1,800 pairs; Small/Medium/Large-hop accuracy | No natural failure onset or recovery re-entry |
| 2026-03 | [FailCoT / UR5-Fail](https://arxiv.org/html/2512.01946v3) | Planning/execution failure verification | Real and generated held-out sets; classification accuracy | No dense value, PONR, or recovery metric |
| 2026-01 | [RoboRewardBench](https://arxiv.org/abs/2601.00675) | Human-verified episode progress | 2,831 episodes, 14 embodiment types; 1–5 reward MAE | Episode-level, not dense temporal recovery evaluation |

RRM-Bench-1K is the benchmark of the survey. Its videos keep closed-loop policy executions whole, with their failures, partial completions, retries, and recoveries. Task-state labels record which task conditions hold at each moment and withdraw credit when an achieved condition is lost, and each camera view is labeled by whether it shows enough to judge the task. Four contrast suites separate the credited condition from a cue that usually comes with it: (A) Action–Effect, (B) Semantic/Ordered Constraint, (C) Persistence/Reversal, and (D) Visibility. Results are reported per capability, not as one overall score ([project page](https://ethanliang99.github.io/awesome-robot-reward-model/#leaderboard)).

## 10. Adjacent system interfaces

These are useful boundary papers when the evaluator is consumed for policy selection, termination, recovery, or world-model policy evaluation. They should not displace the core reward-model taxonomy.

| Date | Work | Why it is adjacent |
|---|---|---|
| 2026-09 | [RoboRecover](https://arxiv.org/abs/2609.28952) | Simulation policy-recovery scenarios from replayed deviation states; possible source for future reward-model probes, but its reported metric is policy recovery rather than evaluator quality |
| 2026-08 | [Agentic Harnesses](https://arxiv.org/abs/2608.09857) | Pre-execution governance layer verifies natural-language robot plans for feasibility, safety, ethics, and security; useful verifier context, but it does not evaluate observed robot behavior or expose a trajectory reward/value interface |
| 2026-07 | [EgoRecovery](https://arxiv.org/abs/2607.19745) | Learned recovery gate and human-to-robot corrective-intent transfer; directly useful for re-entry labels, but not a general reward model |
| 2026-06 | [VERITAS](https://arxiv.org/abs/2606.18247) | Gradient-free visual-trace verifier ranks candidate actions and recycles verified rollouts; an evaluator interface rather than a learned standalone reward model |
| 2026-04 | [dWorldEval](https://arxiv.org/abs/2604.22152) | World-model proxy for scalable policy evaluation rather than a standalone robot reward model |
| 2025-05 | [WorldEval](https://arxiv.org/abs/2505.19017) | World-model policy ranking and safety checking; evaluator-system boundary |
| 2026-06 | [Recover, Discover, Plan](https://arxiv.org/abs/2606.18328) | Failure-driven skill/concept learning and planning, without a separately benchmarked reward model |

## 11. Related surveys, perspectives, and community discovery resources

- [No Free Checker: A Survey of Verifiers for Robot Policies](https://arxiv.org/abs/2609.09250) — September 2026 preprint with a broader policy-verification scope, including human and formal verifiers, availability/credibility, and reward-hacking validation; complements the semantics-first reward-model scope here.
- [Intrinsic Robot Rewarding](https://arxiv.org/abs/2609.17115) — September 2026 position paper proposing to reuse a frozen VLA encoder and successful demonstration endpoints for outcome scoring; empirical policy-improvement validation remains future work.
- [Progress Reward Modeling for Robotic Learning: A Comprehensive Survey](https://arxiv.org/abs/2607.21655) — 2026 arXiv preprint with a progress-centered organization of model interfaces, construction, supervision, and evaluation.
- [Position: Good Embodied Reward Models Need Bad Behavior Data](https://arxiv.org/abs/2606.01036) — ICML 2026 Position Track spotlight arguing for evaluation and training on low-quality, unsafe, and superficially task-like behavior.
- [Awesome Progress Reward Model](https://github.com/VanceChu/Awesome-Progress-Reward-Model)
- [Awesome Robot Failure Management](https://robot-failures.github.io/awesome-robot-failure-management/datasets.html)
- [RewardScope](https://github.com/philfung/reward-scope)

Surveys, perspectives, and community lists are used for field framing and discovery. Claims in this repository must still be rechecked against original papers, author project pages, official repositories, or model/data cards.

## Contribution and update policy

- Add papers through the [paper issue template](.github/ISSUE_TEMPLATE/add-paper.yml) or a pull request.
- Add benchmark metadata to [`registry/benchmarks.yaml`](registry/benchmarks.yaml), including evaluation unit, provenance, split, metrics, release state, and limitations.
- Supply an original-paper URL and a verification date.
- Report paper, code, weights, data, benchmark, and license status separately.
- Use a primary semantics category plus secondary tags; do not force false exclusivity.
- Label preprints and author-reported claims.
- Do not convert “repository exists” into “open and reproducible.”
- Keep reward-model quality evaluation separate from downstream policy-improvement results.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/update-protocol.md`](docs/update-protocol.md) for the full checklist.

## Citation note

Always cite the original paper when discussing or using a listed model. This repository is a living discovery registry and should not replace original attribution.
