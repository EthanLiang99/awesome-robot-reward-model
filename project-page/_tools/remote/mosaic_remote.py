"""Runs ON THE SERVER after stage_remote.py. Builds the video wall of the Benchmark section:
24 fixed clips, 8 s each from 30% into the clip, 15 fps, 240x180 tiles in an 8x3 grid.

    python3 mosaic_remote.py <codebase-root> <out-dir>
"""
import json
import os
import subprocess
import sys

ROOT, OUT = sys.argv[1], sys.argv[2]
REL = ROOT + '/Rewardbox_release/benchmark'
IDS = '''table30_v2_9d9d_22b41c78-fe13-4953-82da-010855aa1e79__main__videos_1
table30_v2_bf87_14068a91-b7d6-4d2e-9fda-2a59b0755418__main__videos_1
table_30_233i_46091f3b-9967-46e7-bb9e-6e4976280411__main__videos_2
table_30_233y_0f971a49-5558-49b9-a84c-3fdb23bbd61b__main__videos_front
table30_v2_2b13_ec6e4b92-c74f-4b8a-b0f4-85f6c84ea25e__main__videos_front
table30_v2_cb19_1e119c05-717e-49d1-80d0-250bc3c131c6__main__videos_1
table_30_233z_1d88938d-a32f-43e5-97b7-cb020aac8581__main__videos_front
table_30_23cm_88534acc-b015-49ca-8f4a-38fdf88cda30__main__videos_3
table30_v2_2acf_5d1a70bf-dede-46d8-bb25-4d950d1415b2__main__videos_1
table30_v2_6ab4_031e0c1e-dc8c-452b-8141-9c1e36f8d176__main__videos_front
table_30_2343_43d96d94-7857-4eea-a747-8ab29d1d21f3__main__videos_front
table30_v2_bec8_97b89dad-008e-4445-9d45-4f6280e703d8__main__videos_1
table30_v2_2945_12869c56-5cd0-43ef-a65b-c8df2c341bdc__main__videos_front
table_30_2368_10d45b3e-e06b-4a66-8923-b182d228a1b1__main__videos_front
table30_v2_ae1f_9e8f9add-4bc5-4f3a-8028-3f6a0d19a849__main__videos_front
table30_v2_e358_17cb2a01-9944-4946-8a13-9b27cad2545a__main__videos_front
table_30_22wr_549ef3b6-6111-447d-9af4-3dc798677693__main__videos_2
table30_v2_8fc9_9b3b04c0-361d-40f7-9eaa-72aa2a1b2794__main__videos_front
table_30_238i_4cb50517-9b28-4f90-9d21-cc176f9c3142__main__videos_front
table_30_23a8_45751b7b-62de-444f-a336-7ae3700d5773__main__videos_front
table30_v2_d96c_8aa9789f-a59f-416b-b304-3436e8f00793__main__videos_1
table30_v2_43ea_6d354fa6-3805-4d52-b88d-169b493598fd__main__videos_front
table30_v2_90e1_071f5bcf-4e03-44e8-ac82-8b06c88c1375__main__videos_1
table30_v2_abc7_a3ec22a9-ae43-4d83-83d3-5cb1d49400eb__main__videos_front'''.split()

gt = json.load(open(REL + '/inputs/ground_truth.json'))
sv = {}
for line in open(REL + '/inputs/single_view.jsonl'):
    d = json.loads(line)
    sv[d['id']] = d

SEG, W, H, COLS = 8.0, 240, 180, 8
args, filt = ['ffmpeg', '-v', 'error', '-y'], []
for k, cid in enumerate(IDS):
    g = gt[cid]
    dur = g['frames'] / g['fps']
    ss = max(0.0, min(0.3 * dur, dur - SEG - 0.2))
    src = os.path.normpath(os.path.join(REL + '/inputs', sv[cid]['video']))
    args += ['-ss', f'{ss:.2f}', '-t', f'{SEG}', '-i', src]
    filt.append(f'[{k}:v]fps=15,scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,setpts=PTS-STARTPTS[v{k}]')
layout = '|'.join(f'{(k % COLS) * W}_{(k // COLS) * H}' for k in range(len(IDS)))
filt.append(''.join(f'[v{k}]' for k in range(len(IDS))) + f'xstack=inputs={len(IDS)}:layout={layout}[m]')
args += ['-filter_complex', ';'.join(filt), '-map', '[m]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
         '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-t', f'{SEG}', OUT + '/mosaic.mp4']
subprocess.run(args, check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '2', '-i', OUT + '/mosaic.mp4', '-frames:v', '1', '-q:v', '5',
                '-vf', 'scale=960:-2', OUT + '/mosaic_poster.jpg'], check=True)
print('mosaic', os.path.getsize(OUT + '/mosaic.mp4') // 1024, 'KB')
