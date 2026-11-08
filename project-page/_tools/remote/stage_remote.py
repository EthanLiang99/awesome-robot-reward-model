"""Runs ON THE SERVER (python3, ffmpeg with libx264). Collects what build_data.py needs:
reward-profile kits, saved GPT-6 Luna outputs, ground-truth records, web encodes and posters.

    python3 stage_remote.py <codebase-root> <out-dir>

<codebase-root> holds Rewardbox/ and Rewardbox_release/. Only saved files are read; no model is run.
"""
import json
import os
import shutil
import subprocess
import sys

ROOT, OUT = sys.argv[1], sys.argv[2]
REL = ROOT + '/Rewardbox_release/benchmark'
RUNS = ROOT + '/Rewardbox/benchmark_results/robochallenge_merge_20261013'
KITS = RUNS + '/paper_figures_20261101/reward_profiles'
FIG = RUNS + '/paper_figures_20261028/reward_profiles/supplementary/figures.json'

for d in ('kits', 'videos', 'posters'):
    os.makedirs(os.path.join(OUT, d), exist_ok=True)

figs = json.load(open(FIG))['figures']
gt = json.load(open(REL + '/inputs/ground_truth.json'))
sv = {}
for line in open(REL + '/inputs/single_view.jsonl'):
    d = json.loads(line)
    sv[d['id']] = d

# reward-profile kits (one per supplementary figure) and the clips they show
need, meta = [], {}
for f in figs:
    spec = f['spec']
    src = f'{KITS}/{spec}_ppt_assets'
    dst = f'{OUT}/kits/{spec}'
    os.makedirs(dst + '/data', exist_ok=True)
    for fn in os.listdir(src + '/data'):
        shutil.copy(f'{src}/data/{fn}', f'{dst}/data/{fn}')
    shutil.copy(src + '/README.md', dst + '/README.md')
    for cid in [f['case_id']] + ([f['reference_case_id']] if f.get('reference_case_id') else []):
        if cid not in need:
            need.append(cid)
    m = {k: v for k, v in f.items() if not isinstance(v, (list, dict))}
    for k in ('keyframes', 'lanes', 'reference_lanes', 'failure_windows'):
        m[k] = f.get(k)
    m['instruction'] = sv[f['case_id']]['instruction']
    meta[spec] = m
json.dump(meta, open(OUT + '/figures_meta.json', 'w'), indent=1)

# GPT-6 Luna (Sequence) outputs and the ground-truth records of those clips
luna = {}
for line in open(REL + '/reference_results/single_view/gpt-6-luna.jsonl'):
    d = json.loads(line)
    if d['id'] in need:
        luna[d['id']] = d
json.dump(luna, open(OUT + '/luna.json', 'w'))
json.dump({i: gt[i] for i in need}, open(OUT + '/gt_records.json', 'w'))
print('clips', len(need), 'luna', len(luna))

# web encodes (H.264, no audio, faststart) and first-frame posters
for cid in need:
    src = os.path.normpath(os.path.join(REL + '/inputs', sv[cid]['video']))
    dst = f'{OUT}/videos/{cid}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27',
                    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-g', '30', dst], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '4',
                    f'{OUT}/posters/{cid}.jpg'], check=True)
    print(cid, os.path.getsize(src) // 1024, 'KB ->', os.path.getsize(dst) // 1024, 'KB')
