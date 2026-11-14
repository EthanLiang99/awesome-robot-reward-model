# Data, Coupled Value Models, and Adjacent Work

Detailed tables behind the short lists of the [README](../README.md): failure and recovery data, training corpora, value signals coupled to policies and world models, and adjacent systems. Artifact marks: `C` code, `W` weights, `D` data, each a verified link.

## Failure, retry, and recovery data

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

This is an emerging data axis rather than a new reward semantics. See the [failure-synthesis pipeline audit](failure-synthesis-pipelines.md) for the full comparison and safeguards.

| Synthesis level | Representative pipeline | Negative signal | Reward/recovery use | Reality caveat |
|---|---|---|---|---|
| Temporal/semantic pseudo-negative | Robo-Dopamine; RoboReward; Guardian BridgeDataV2-Fail | Reverse order, task mismatch, relabel, or image substitution | Progress contrast and verifier training | No failed physical dynamics are produced |
| Simulator intervention | DenseReward; FAILSafe; RACER | Perturb grasp, motion, action, or state and execute in simulation | Dense reward, failure onset/type, simulated recovery | Physical rollout exists only in simulation |
| World-model counterfactual video | Dream2Fix | Perturb real-demo actions around a keyframe and generate the resulting video | Outcome/type/stage plus deterministic executable correction | Real source context, but generated failure is not real execution |
| Real failure | RoboArena; REASSEMBLE; ViFailback | Natural policy, operator, object, or environment deviation | Ground-truth outcome/preference/recovery anchor | Highest fidelity, highest collection cost/risk |

The likely scalable recipe is a **hybrid**: use generative pipelines for coverage, simulator interventions for dense physical labels, and a smaller set of real failures for calibration and held-out evaluation. `world_model_synth` must remain distinct from `real_executed`.

## Training data and supervision resources

This is a cross-cutting index of data that can instantiate reward targets. It records **where the negative signal came from**: a real failure, an induced error, a mixed-expertise rollout, a corrective action, or a synthetic temporal reversal. Those sources should not be treated as interchangeable.

### Model-associated reward corpora

| Corpus | Scale and composition | Reward supervision recipe | Release status | Important caveat |
|---|---|---|---|---|
| [Robo-Dopamine GRM data](https://huggingface.co/datasets/tanhuajie2001/Robo-Dopamine-GRM-Dataset) | 35M samples from ~3,400h, >100K trajectories, and >350 tasks; real robot, simulation, and human egocentric video | Human-annotated keyframes define step segments; ordered state pairs yield progress hops and reversed-order pairs yield regress hops | Gated dataset; Apache-2.0 card | Most negative supervision is constructed by reversing temporal order inside expert trajectories. It is not equivalent to observing a robot make and recover from a real mistake. |
| [RBM-1M / Robometer](https://arxiv.org/abs/2603.02115) | 1,059,370 video–language annotations across 21 robot embodiments; expert, paired human–robot, mixed-expertise/failure, and human-only sources | Frame-level progress/success on expert trajectories plus trajectory preferences over expert, suboptimal, failed, rewound, and task-mismatched pairs | [Processed data repository](https://huggingface.co/datasets/robometer/processed_datasets) exists; official project still labels the canonical RBM-1M release “coming soon” | The aggregate count may include multiple views/annotations from one episode. Source licenses and failure provenance remain dataset-specific. |

| [DenseReward corpus](https://huggingface.co/datasets/densereward/DenseReward) | Paper reports 26,579 episodes and 7.56M frame samples across DROID, Isaac Sim, RoboSuite, and LIBERO; released dataset card is Apache-2.0 | Phase-aware frame reward with synthesized physical failure modes and recovery cases | [D](https://huggingface.co/datasets/densereward/DenseReward) · [W](https://huggingface.co/densereward/densereward-3frame-thinking); [code repo empty](https://github.com/dense-reward/dense-reward) | Simulated failure synthesis is not real executed failure; model-native reward targets are not independent gold labels. |

### Robot embodiment and failure provenance audit

The [detailed robot/data matrix](robot-data-matrix.md) records arm, gripper, sensing, task, count unit, label granularity, concrete failure modes, and reuse by Robometer/Robo-Dopamine. Its structured counterpart is [`registry/robot_datasets.yaml`](../registry/robot_datasets.yaml).

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

## Policy- and world-model-coupled value prediction

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

## Adjacent system interfaces

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
