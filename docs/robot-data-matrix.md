# Robot, Dataset, and Failure-Supervision Matrix

**Verified:** 2026-07-24
**Scope:** robot embodiments, grippers/sensors, failure provenance, label granularity, and reward-model reuse.

This page answers a deceptively important question: when a paper says it trained on “failure data,” did the robot actually fail? The answer varies across these resources. We therefore keep physical rollouts, simulated perturbations, counterfactual image–language pairs, weak automatic labels, and temporal reversal as separate supervision types.

## Provenance labels

| Label | Meaning |
|---|---|
| `real_executed` | A real robot executed the behavior and a failure, partial success, or low-quality outcome was observed. |
| `sim_executed` | A simulator executed the behavior; errors may be policy-generated or deliberately injected. |
| `counterfactual` | Images may be real, but the negative example was made by changing text, order, or image pairing rather than executing that failure. |
| `world_model_synth` | Actions from a real or simulated reference are perturbed and a generative world model synthesizes the counterfactual video rollout. |
| `weak_auto` | Outcome labels were supplied or filtered by a classifier/VLM and may be noisy. |
| `expert_only` | Demonstrations are mainly successful; useful for progress/goal modeling but not a direct failure corpus. |
| `arena_scored` | A real evaluation rollout is judged under a human-defined rubric, preference protocol, or partial-progress scale. |
| `evaluation_only` | A benchmark exposes scores or unsuccessful trials, but the released training files do not provide reusable typed failure labels. |

## Robometer and Robo-Dopamine: what actually overlaps?

The two corpora overlap at the **parent-dataset level**, not as interchangeable reward labels. Exact episode- or frame-level intersection has not been published.

| Parent source | Robo-Dopamine use | Robometer / RBM-1M use | Negative signal in each corpus | Overlap judgment |
|---|---|---|---|---|
| AgiBotWorld-Alpha | 3.400M raw samples; the paper calls the embodiment `AGIBot-A2D` | 34,098 selected long trajectories expanded into 216,911 long/subskill annotations; AgiBot G1, head camera | Dopamine constructs regress pairs by reversing temporal order. Robometer applies progress supervision to expert clips. | Direct parent-source overlap; exact split overlap unknown. The A2D/G1 embodiment-name conflict is retained rather than silently normalized. |
| DROID | 8.983M raw samples; Franka Panda | Included through the OXE mixture; Robometer's OXE list explicitly contains DROID | Dopamine: constructed temporal regress. Robometer: expert progress/preference supervision. | Direct parent-source and embodiment overlap; exact episodes unknown. |
| LIBERO | 1.330M raw samples; simulated Franka Panda | 1,709 expert annotations plus 1,473 failure annotations; simulated Franka Panda | Dopamine: temporal reversal within expert trajectories. Robometer: successful demonstrations replayed with Gaussian action noise to create failed rollouts. | Direct benchmark overlap, but different negative-generation processes. |
| RoboArena | Not listed as a Robo-Dopamine source | 12,379 video–language annotations; real DROID/Franka setup | Human preference, partial progress, explanation, and outcome labels on autonomous policy rollouts; most Robometer examples are failures. | Robometer-only source. DROID hardware is shared with Dopamine's DROID data, but the rollouts and supervision are different. |
| Human egocentric video | EgoDex 6.610M plus 0.574M self-collected human samples | EPIC-KITCHENS 37,030 annotations; EgoDex was considered but excluded from final RBM-1M | Dopamine again constructs temporal pairs; Robometer uses human clips for preference-only supervision. | Domain overlap, not a shared released source in the final Robometer mixture. |

Robo-Dopamine reports **35M constructed training samples** after augmentation, with approximately 3,400 hours, more than 100K trajectories, and more than 350 tasks. Its 27.23M pre-augmentation source samples also include RoboBrain-X, self-collected real robot data, RoboTwin, RoboCasa, and human video. A reversed-order `REGRESS` pair is useful process supervision, but it is not evidence that a policy physically entered that state transition.

Robometer reports **1,059,370 video–language annotations** across 21 embodiments. Its paper calls these “trajectories,” but a source episode can contribute multiple views or annotations, so this number should not be compared directly with raw physical episode counts.

## Detailed audit of the requested resources

| Resource | Physical platform | Size / released unit | Labels useful for reward learning | What the failures actually are | Provenance |
|---|---|---|---|---|---|
| [RoboChallenge Table30 V2](https://huggingface.co/datasets/RoboChallenge/Table30v2) | ARX5 single arm; UR5 single arm; ALOHA dual arm; DOS-W1 dual arm. Wrist/global/side camera combinations vary by embodiment. The V2 report identifies DOS-W1 as Airbot Play arms with triangle-tip grippers; other exact V2 gripper products are not stated in the card. | 1.01 TB; demonstrations for 30 tabletop tasks; 18 fresh mostly bimanual tasks and 12 carried-over single/asynchronous tasks | Multi-view video and robot state plus a human-authored prompt, description, `scoring` criteria, and task tags. Challenge evaluation divides a task into stages, assigns points, marks critical stages, penalizes retries, and reports progress and success. | Evaluation rollouts contain genuine failure and partial-completion evidence. The official sources do not establish a fixed failure-cause vocabulary or per-frame stage-boundary annotation for every training demonstration. | `expert_only`, `real_executed`, `arena_scored` |
| [REASSEMBLE](https://researchdata.tuwien.ac.at/records/0ewrv-8cb44) | Real Franka Emika FR3; haptic omega.6 teleoperation; parallel-jaw gripper width is recorded, but the product name is not stated | 4,551 demonstrations, 4,035 successful, therefore 516 unsuccessful; 781 min; NIST Task Board #1, 17 objects | Boolean success at both high-action and low-skill segments; language, RGB, event camera, force/torque, audio, and robot state | Pick: miss/slip. Insert: alignment/orientation/rotation problems, especially BNC/nut and directional Ethernet/USB; workspace reach issues. Remove: poor alignment causes jamming or failed release. Place: premature slip or object lands on/obstructs the board. | `real_executed` |
| [Guardian / FailCoT collection](https://huggingface.co/collections/paulpacaud/robotic-failure-detection-dataset-and-model-guardian) | Three distinct platforms; see the next table | VQA-style planning/execution examples with binary outcome, fine category, and reasoning trace | Strong verifier supervision; provenance must be kept per subset | RLBench is simulated; Bridge uses real imagery with counterfactual failures; UR5 contains real autonomous rollouts for execution evaluation while planning errors remain generated. | mixed; never pool without a source tag |
| [RoboArena dump, 2026-02-03](https://huggingface.co/datasets/RoboArena/DataDump_02-03-2026/tree/main) | Real Franka Panda, Robotiq 2F-85; ZED Mini wrist and ZED2 external cameras through the DROID setup | 3,284 sessions and 9,589 policy episodes; each session contains A/B/C policy directories and multi-view video, actions, and proprioception | Pairwise preference including ties, free-form rationale, maximum progress, binary success, and partial success | Actual autonomous-policy behaviors: no progress, oscillation/hovering, wrong or random gripper behavior, failure to locate/interact with the target, partial completion, and irreversible drops/spills. There is no fixed typed-cause vocabulary; causes must be mined from explanations or relabelled. | `real_executed`, `arena_scored` |
| [RH20T](https://rh20t.github.io/) | Flexiv, UR5, Franka Panda, and KUKA LBR iiwa across seven configurations; exact grippers below | >110K real contact-rich sequences plus paired human demonstrations; 147 tasks and 42 skills | Task-completion rating: `0=robot failure`, `1=task failure`, `2–9=increasing completion quality`; rich multi-view, force, audio, and robot state | Real coarse failure/outcome supervision, but the official paper does not publish a unified failure-cause taxonomy or per-type failure counts. | `real_executed` |
| [EgoRecovery](https://arxiv.org/abs/2607.19745) | Real human egocentric recovery plus real robot anchor/evaluation data; exact robot arm and gripper were not reported in accessible paper text | Four tabletop tasks; per task: 300 human recovery, 50 robot recovery, and 50 normal robot demonstrations | Framewise recovery-state label, explicit recovery-to-normal boundary, 4D corrective intent, correction timing/magnitude, and final success | Task-level failures are arranged before short human/robot recovery clips. This provides recovery and re-entry evidence, but human motions are not robot action-token labels; no data release was verified. | `real_executed`, `human_staged_failure` |

## Arena/challenge supervision as its own axis

| Platform | Scale axis | Human-defined supervision | Real rollout evidence | Important boundary |
|---|---|---|---|---|
| RoboChallenge Table30 / V2 | Four robot types and multiple machine instances; 30 tasks spanning single-arm, asynchronous bimanual, and simultaneous bimanual manipulation | Per-task stage rubric: points, critical/non-critical stages, retry penalty, terminal success; V2 training metadata exposes `scoring` and task tags | Centralized real-robot evaluation publishes per-run score/success plus video/log access; unsuccessful and partially complete executions are therefore valuable reward-model examples | The rubric describes task stages, but is not itself a temporal boundary annotation on every demonstration frame. Programmatic bulk access and reuse terms for evaluated runs should be audited before training. |
| RoboArena | Distributed DROID/Franka evaluators, open-ended tasks/environments, and multiple competing policies | Human pairwise preference/tie, maximum progress, binary/partial success, and free-form rationale | Autonomous real-policy rollouts, including failure and partial completion | One principal embodiment in the audited dump; its diversity comes mainly from sites, tasks, environments, and policies rather than robot hardware. |

These platforms are complementary. RoboChallenge supplies an **absolute, task-decomposed scoring function** across several robot types; RoboArena supplies **relative policy preference plus natural-language judgement** across more open-ended tasks. Together they support stage value, pairwise reward, calibration across policies, and evaluation of reward models against independent human judgement.

### Guardian / FailCoT subsets

| Subset | Robot and sensing | Canonical paper counts | Planning failures | Execution failures | Important caveat |
|---|---|---|---|---|---|
| RLBench-Fail | Simulated Franka Panda; RLBench multi-view observations; 52 tasks | Train 5,808 planning + 12,358 execution; val 500 + 1,000; test 500 + 1,000 | Wrong object; wrong target/state/placement; wrong order; missing subtask; contradiction | Missing gripper closure; wrong object state/placement; wrong object; imprecise grasp/push | Synthetic perturbations in simulation (`sim_executed`/`counterfactual`), not naturally occurring real-robot failures. |
| BridgeDataV2-Fail | Real-source WidowX 250 imagery; four RGB views including wrist and randomized external views | Train 4,880 planning + 7,830 execution; val 500 + 1,000; test 500 + 1,000 | Same five generated plan-error families | Semantically altered subtask paired with unchanged images, or a “revert action” that substitutes the start image for the end image | Real visual domain, but the failed transition was not physically executed (`counterfactual`). |
| UR5-Fail | Real 6-DoF UR5 autonomous 3D-LOTUS++ rollouts; three Intel RealSense D435 cameras; exact gripper model not reported | Test 140 planning + 140 execution examples; current paper v3 states 16 unique tasks | Generated plan perturbations | Manually labelled success/failure of real policy subtask execution | Use `real_executed` for execution items and `counterfactual` for planning items. An older collection/card count of 34 tasks conflicts with paper v3; the current paper is used here. |

The Hugging Face collection UI can show more VQA items than the paper table because one trajectory/supervision unit may be expanded into multiple prompt or reasoning examples. Preserve both `physical_episode_id` and `vqa_item_id` when deduplicating.

### RH20T robot configurations

| Config | Arm | Gripper | Force / tactile |
|---|---|---|---|
| 1 | Flexiv | Dahuan AG95 | OptoForce force/torque |
| 2 | Flexiv | Dahuan AG95 | ATI Axia80-M20 force/torque |
| 3 | UR5 | WSG50 | ATI Axia80-M20 force/torque |
| 4 | UR5 | Robotiq 2F-85 | ATI force/torque |
| 5 | Franka Panda | Franka gripper | Franka internal force sensing |
| 6 | KUKA LBR iiwa | Robotiq 2F-85 | ATI force/torque |
| 7 | KUKA LBR iiwa | Robotiq 2F-85 | ATI force/torque + uSkin fingertip tactile |

Every configuration has one or two in-hand cameras, eight to ten global RGB-D cameras, two microphones, joint/TCP state, gripper width, and force/torque; configuration 7 additionally contains tactile data. RH20T-C scenes 1–5 use CC BY-SA 4.0, whereas RH20T-NC scenes 6–10 use CC BY-NC 4.0, so those subsets must remain separable.

## Robometer's failure-bearing sources, split by provenance

| Source in RBM-1M | Robot / environment | RBM annotation count | Failure mechanism and labels | Provenance |
|---|---|---:|---|---|
| RoboArena | Real Franka Panda + Robotiq 2F-85 | 12,379 | Autonomous policy rollouts; human preference, progress, outcome, and free-form rationale; majority failure | `real_executed`, `arena_scored` |
| SOAR | Real fleet of five WidowX 250 arms | 16,812 | Autonomous policy rollouts with VLM-generated success/failure labels; Robometer filters approximately 45% with Qwen3-VL and uses preference-only supervision | `real_executed`, `weak_auto` |
| AutoEval | Real WidowX 250 at two stations | 8,677 | Arbitrary-policy rollouts on four tasks; automatic success classifiers are noisy, so Robometer uses preference-only supervision | `real_executed`, `weak_auto` |
| Fino-Net / FAILURE | Real Baxter | 229 | Pick/place, push, pour, place-in-container, and put-on-top; misses, collisions, falls, spills, overturns, and post-manipulation failures; RGB/depth/audio | `real_executed` |
| FAILSafe | Simulated Franka Panda in ManiSkill | 71,614 | Translation, rotation, or no-op errors injected at arbitrary points in a successful rollout, with recovery behavior and subtask segmentation | `sim_executed` |
| RACER | Simulated Franka Panda in RLBench | 29,115 | Failed/successful paired trajectories generated by perturbing demonstrations; failure analysis and corrective/recovery language | `sim_executed` |
| LIBERO failures | Simulated Franka Panda | 1,473 | Successful demonstrations replayed with Gaussian action noise until unsuccessful | `sim_executed` |
| RoboReward OXE mix | Mixed embodiments | 45,072 | Counterfactual task-instruction negatives and discrete 1–5 reward labels; “pseudo-failures” need not be executed mistakes | `counterfactual` |

Counts above use RBM-1M's annotation unit. They must not be substituted for the upstream dataset's episode counts.

## Recommended training strata

Keep a mandatory `failure_provenance` field and sample the strata separately:

1. **Real executed outcome/value:** RoboArena, scored RoboChallenge evaluation rollouts, REASSEMBLE, RH20T, SOAR, AutoEval, Fino-Net, and UR5-Fail execution.
2. **Simulated executed/injected:** FAILSafe, RACER, LIBERO failures, and RLBench-Fail execution.
3. **World-model synthesized failures:** Dream2Fix-style action-conditioned counterfactual videos; retain generator, intervention parameters, keyframe, seed, verifier scores, and source episode.
4. **Semantic/temporal counterfactual data:** BridgeDataV2-Fail, Guardian planning failures, RoboReward pseudo-failures, Robo-Dopamine regress pairs, and task-mismatch pairs.
5. **Expert temporal/process data:** Robo-Dopamine, RoboChallenge Table30 V2 demonstrations, and the expert portions of RBM-1M.
6. **Arena/challenge judgements:** Table30 stage rubrics/scores and RoboArena preferences/progress; retain evaluator, task rubric version, robot instance, policy, and run ID.
7. **Weak labels:** retain the upstream confidence/filtering decision; do not turn a VLM label into ground truth.
8. **Recovery and re-entry anchors:** EgoRecovery-style clips; retain failure start, recovery-needed label, correction interval, and the boundary where execution returns to normal task behavior.

For a general reward model, train outcome and pairwise preference heads on strata 1–3 and 6, typed diagnosis on 1–4, and calibrated progress on strata 5–6. Evaluate every synthetic-data model on held-out real failures and report results by provenance rather than only as one pooled accuracy.

## Leakage and count controls

- Deduplicate by parent dataset, physical episode, camera view, temporal window, and derived prompt—not filename alone.
- Treat DROID, AGIBotWorld, and LIBERO as known **parent-level overlaps** between Robo-Dopamine and Robometer. Exact split intersection remains unknown.
- Keep RoboArena separate from ordinary DROID demonstrations even though the hardware stack is shared.
- Do not equate RBM's video–language annotation counts, Guardian's VQA item counts, and raw robot episode counts.
- Preserve the AgiBot embodiment metadata conflict: AgiBotWorld and Robometer identify G1, while the Robo-Dopamine paper table says A2D.
- Pin dataset snapshots and licenses. RoboArena is audited at `DataDump_02-03-2026`; RH20T commercial and non-commercial subsets have different terms.

## Primary sources

- [Robometer paper v2](https://arxiv.org/html/2603.02115v2) and [processed datasets](https://huggingface.co/datasets/robometer/processed_datasets)
- [Robo-Dopamine paper](https://arxiv.org/abs/2512.23703), [official repository](https://github.com/FlagOpen/Robo-Dopamine), and [dataset card](https://huggingface.co/datasets/tanhuajie2001/Robo-Dopamine-GRM-Dataset)
- [RoboChallenge](https://robochallenge.ai/), [Table30 paper](https://arxiv.org/abs/2510.17950), [Table30 V2 report](https://robochallenge.ai/robochallenge_techreport_V2.pdf), and [V2 data card](https://huggingface.co/datasets/RoboChallenge/Table30v2)
- [REASSEMBLE canonical record](https://researchdata.tuwien.ac.at/records/0ewrv-8cb44) and [paper](https://arxiv.org/abs/2502.05086)
- [Guardian paper v3](https://arxiv.org/html/2512.01946v3) and [official data/model collection](https://huggingface.co/collections/paulpacaud/robotic-failure-detection-dataset-and-model-guardian)
- [RoboArena paper](https://arxiv.org/abs/2506.18123) and [2026-02-03 snapshot](https://huggingface.co/datasets/RoboArena/DataDump_02-03-2026/tree/main)
- [RH20T project and data](https://rh20t.github.io/)
- [SOAR paper](https://arxiv.org/abs/2407.20635), [FAILSafe paper](https://arxiv.org/abs/2510.01642), [RACER data](https://huggingface.co/datasets/sled-umich/RACER-augmented_rlbench), [AutoEval paper](https://arxiv.org/abs/2503.24278), and [Fino-Net paper](https://arxiv.org/abs/2011.05817)
- [Dream2Fix paper](https://arxiv.org/html/2603.13528v1), [project page](https://dream2fix.github.io/), and [failure-synthesis pipeline audit](failure-synthesis-pipelines.md)
- [EgoRecovery paper](https://arxiv.org/html/2607.19745v1)
