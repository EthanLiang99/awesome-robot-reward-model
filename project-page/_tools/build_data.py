"""Build the data files of the project page from the paper sources and the staged
benchmark outputs.

    python _tools/build_data.py --stage <stage_dir> --paper <repo_root>
    python _tools/build_data.py --site-only --paper <repo_root>   # taxonomy and leaderboard only

<stage_dir> is what _tools/stage_from_server.sh copies from the server:
  kits/<spec>/data/*.csv     reward-profile kits (paper_figures_20261101)
  luna.json                  GPT-6 Luna Sequence outputs for the kit clips
  gt_records.json            ground_truth.json entries of the kit clips
  figures_meta.json          supplementary figures.json (+ instructions)
  saved_cases.json           kit-less visibility cases: clip ids of both views, task-state
                             events and the nine evaluators' saved outputs (stage_remote.SAVED)
  videos/<case_id>.mp4       web encodes of the kit clips
  posters/<case_id>.jpg      first frames
  mosaic.mp4, mosaic_poster.jpg

Writes assets/data/cases.js and assets/data/site.js and copies media into
assets/video and assets/img. Only saved model outputs are read; nothing is run.
"""
import argparse, csv, json, math, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.dirname(HERE)

# Fig. 9 roster (final, 2 Nov 2026): lane 2 is GPT-6 Luna (Sequence), which
# replaced Gemini Robotics ER 2. VOC values are Table III of the paper.
MODELS = [
    ("opus", 1, "Claude Opus 5.5", "Closed · general-purpose VLM", 0.929),
    ("luna", 2, "GPT-6 Luna", "Closed · general-purpose VLM", 0.805),
    ("vlaccut", 3, "VLAC-Cut", "Open · 30B-A3B MoE", 0.695),
    ("flora", 4, "Flora-Rewarder", "Open · 27B", 0.915),
    ("sole", 5, "SOLE-R1", "Open · 8B", 0.683),
    ("primo", 6, "PRIMO-R1", "Open · 7B", 0.828),
    ("rd2", 7, "Robo-Dopamine-GRM-2.0", "Open · 4B", 0.598),
    ("rd1", 8, "Robo-Dopamine-GRM", "Open · 3B", 0.324),
    ("procvlm", 9, "ProcVLM", "Open · 2B", 0.382),
]

# The kits use the dev package's internal letters; the paper swaps B and C.
SUITE_OF_INTERNAL = {"A": "A", "B": "C", "C": "B", "D": "D"}

CASES = [
    # spec, suite (paper letter), short title, one-line description
    ("sweep_trash_not_swept", "A", "Sweep that never lands",
     "The robot keeps sweeping, but the trash never enters the dustpan."),
    ("watering_can_tips", "A", "Watering without water",
     "The watering motion runs, nothing is watered, and the can tips over on release."),
    ("shred_paper_falls", "A", "Paper misses the shredder",
     "The paper reaches the feed slot, then drops onto the table in the last 0.3 s."),
    ("sandwich_order_skipped", "B", "Lettuce before bread",
     "Lettuce goes down before the bread, so the order constraint holds progress at zero."),
    ("electronics_wrong_basket", "B", "Wrong basket",
     "A clean pick and place, into the wrong category basket."),
    ("drawer_opener_jams", "B", "Drawer that won't close",
     "The opener jams at the drawer mouth, so the drawer cannot be closed."),
    ("books_shelf_swept", "C", "Shelf knocked over",
     "One book is shelved, then the arm knocks the shelf over at 19.6 s and all progress is lost."),
    ("flowers_retries", "C", "Three failed tries",
     "Three attempts fail, then two flowers stay in the vase."),
    ("plates_wrist_view", "D", "Placed out of sight",
     "A plate set upright in the rack, seen from the wrist camera, which never shows the rack."),
    ("drawer_wrist_view", "D", "Success, out of sight",
     "A successful execution seen from the wrist camera, which only shows the drawer front."),
    ("books_wrist_view", "D", "The fall nobody sees",
     "The bookshelf execution from the wrist camera, which never shows the shelf falling."),
]

# Event wording of the paper's Fig. 9 for the bookshelf execution.
BOOK_LABELS = {"Shelved": "Book 1 shelved", "Shelf falls": "Shelf knocked over",
               "Final GT 0": "End · GT 0"}

# Kit-less cases (saved_cases.json): saved-output file of each lane and its fixed unit change,
# the same as the kits' (percentages / 100, the rest as is; checked against drawer_wrist_view).
SAVED_FILES = {
    "opus": ("claude-opus-5.5", 100), "luna": ("gpt-6-luna", 100), "vlaccut": ("vlac-cut", 100),
    "flora": ("flora-rewarder-27b-prefix", 1), "sole": ("sole-r1-8b", 100), "primo": ("primo-r1-7b-prefix", 100),
    "rd2": ("robodopamine-v2-4b", 1), "rd1": ("robodopamine-v1-3b", 1), "procvlm": ("procvlm-2b", 100),
}
# Event wording by the task-state event's phase, and the name of the clip's V camera.
SAVED_EVENT_LABELS = {"plates_wrist_view": {"pick": "Plate picked up", "place": "Plate in the rack"}}
SAVED_V_LABEL = {"plates_wrist_view": "Fixed camera"}


def rd(x, n=3):
    return None if x is None else round(float(x), n)


def read_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def interp(curve, t):
    if t <= curve[0][0]:
        return curve[0][1]
    for (t0, v0), (t1, v1) in zip(curve, curve[1:]):
        if t0 <= t <= t1:
            return v0 if t1 == t0 else v0 + (v1 - v0) * (t - t0) / (t1 - t0)
    return curve[-1][1]


def pearson(xs, ys):
    n = len(xs)
    if n < 2:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    sy = math.sqrt(sum((y - my) ** 2 for y in ys))
    if sx < 1e-12 or sy < 1e-12:
        return None
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (sx * sy)


def luna_curve(luna, gt_records, case_id):
    rec = luna[case_id]
    fps = gt_records[case_id]["fps"]
    pts = [(f / fps, p / 100.0) for f, p in zip(rec["frame_indices"], rec["progress"])
           if p is not None]
    return pts


def falling_windows(gt):
    """Spans where the task-state label decreases (the kits' failure_windows)."""
    wins, start = [], None
    for (t0, v0), (t1, v1) in zip(gt, gt[1:]):
        if v1 < v0 - 1e-9:
            start = t0 if start is None else start
            end = t1
        elif start is not None:
            wins.append([rd(start, 2), rd(end, 2)])
            start = None
    if start is not None:
        wins.append([rd(start, 2), rd(end, 2)])
    return wins


def build_saved_case(spec, suite, title, desc, s, gtr):
    """A visibility case read from the benchmark's saved outputs: the wrist view (P) and the
    same clip's fixed view (V) share one task-state label."""
    rec = gtr[s["p"]]
    gt = [(p["time"], p["value"]) for p in rec["curve"]]
    labels = SAVED_EVENT_LABELS[spec]
    events = []
    for e in s["events"]:
        a, b = e["output_time_interval_sec"]
        eff = e.get("completion_count_effect") or 0
        events.append({"t": rd((a + b) / 2, 2), "label": labels[e["phase"]],
                       "kind": "success" if eff > 0 else "failure" if eff < 0 else "neutral"})
    events.sort(key=lambda e: e["t"])
    per_view = {}
    for view, cid in (("P", s["p"]), ("V", s["v"])):
        fps = gtr[cid]["fps"]
        mods = []
        for key, lane, name, sub, voc in MODELS:
            fn, unit = SAVED_FILES[key]
            o = s["outputs"][fn][cid]
            pts = sorted((f / fps, p / unit) for f, p in zip(o["frame_indices"], o["progress"]) if p is not None)
            r = pearson([v for _, v in pts], [interp(gt, t) for t, _ in pts])
            mods.append({"key": key, "r": rd(r, 2), "end": rd(pts[-1][1], 2),
                         "pts": [[rd(t, 2), rd(v, 3)] for t, v in pts]})
        per_view[view] = mods
    video, poster = f"assets/video/{spec}.mp4", f"assets/img/posters/{spec}.jpg"
    ref = spec + "--front"
    return {
        "id": spec, "suite": suite, "title": title, "desc": desc,
        "task": rec["task"].replace("_", " "), "instruction": s["instruction"],
        "duration": rd(rec["frames"] / rec["fps"], 3), "camera": rec["camera"],
        "gt": [[rd(t, 3), rd(v, 3)] for t, v in gt], "gtEnd": rd(rec["gt_fraction"], 2),
        "events": events, "reversals": falling_windows(gt), "video": video, "poster": poster,
        "views": {
            "P": {"label": "Wrist camera", "tag": "P", "video": video, "poster": poster, "models": per_view["P"]},
            "V": {"label": SAVED_V_LABEL.get(spec, "Front camera"), "tag": "V", "video": f"assets/video/{ref}.mp4",
                  "poster": f"assets/img/posters/{ref}.jpg", "models": per_view["V"]},
        },
        "_media": [(s["p"], spec), (s["v"], ref)],
    }


def build_cases(stage):
    meta = json.load(open(os.path.join(stage, "figures_meta.json"), encoding="utf-8"))
    luna = json.load(open(os.path.join(stage, "luna.json"), encoding="utf-8"))
    gtr = json.load(open(os.path.join(stage, "gt_records.json"), encoding="utf-8"))
    sp = os.path.join(stage, "saved_cases.json")
    saved = json.load(open(sp, encoding="utf-8")) if os.path.exists(sp) else {}
    out = []
    for spec, suite, title, desc in CASES:
        if spec in saved:
            out.append(build_saved_case(spec, suite, title, desc, saved[spec], gtr))
            continue
        m = meta[spec]
        assert SUITE_OF_INTERNAL[m["category"]] == suite, (spec, m["category"], suite)
        d = os.path.join(stage, "kits", spec, "data")
        gt = [(float(r["time_s"]), float(r["gt_progress"])) for r in read_csv(os.path.join(d, "gt_curve.csv"))]
        events = []
        for r in read_csv(os.path.join(d, "events.csv")):
            t = float(r["time_s"])
            if t == 0 and r["label"] == "Start":
                continue
            label = r["label"]
            if spec.startswith("books_"):
                label = BOOK_LABELS.get(label, label)
            elif label == "Final GT 0":
                label = "End · GT 0"
            events.append({"t": rd(t, 2), "label": label, "kind": r["kind"]})
        windows = [[rd(r["start_s"], 2), rd(r["end_s"], 2)] for r in read_csv(os.path.join(d, "failure_windows.csv"))]
        lanes = read_csv(os.path.join(d, "lanes.csv"))
        curves = read_csv(os.path.join(d, "model_curves.csv"))
        views = ["P", "V"] if suite == "D" else [None]
        per_view = {}
        for view in views:
            mods = []
            for key, lane, name, sub, voc in MODELS:
                if key == "luna":
                    cid = m["case_id"] if view != "V" else m["reference_case_id"]
                    pts = luna_curve(luna, gtr, cid)
                    r = pearson([v for _, v in pts], [interp(gt, t) for t, _ in pts])
                else:
                    sel = [c for c in curves if int(c["lane"]) == lane and (view is None or c["view"] == view)]
                    pts = [(float(c["time_s"]), float(c["display_value_0_1"])) for c in sel]
                    lrow = [l for l in lanes if int(l["lane"]) == lane and (view is None or l["view"] == view)][0]
                    assert lrow["display_name"].split()[0] in name or key in ("rd1", "rd2"), (lrow["display_name"], name)
                    r = float(lrow["r_vs_gt_this_clip"]) if lrow["r_vs_gt_this_clip"] else None
                pts.sort()
                mods.append({"key": key, "r": rd(r, 2), "end": rd(pts[-1][1], 2),
                             "pts": [[rd(t, 2), rd(v, 3)] for t, v in pts]})
            per_view[view or "main"] = mods
        rec = gtr[m["case_id"]]
        case = {
            "id": spec, "suite": suite, "title": title, "desc": desc,
            "task": m["task"].replace("_", " "), "instruction": m["instruction"],
            "duration": rd(m["duration_s"], 3), "camera": m["camera"],
            "gt": [[rd(t, 3), rd(v, 3)] for t, v in gt], "gtEnd": rd(m["gt_endpoint"], 2),
            "events": events, "reversals": windows,
            "video": f"assets/video/{spec}.mp4", "poster": f"assets/img/posters/{spec}.jpg",
        }
        if suite == "D":
            ref = "books_shelf_swept" if spec == "books_wrist_view" else spec + "--front"
            case["views"] = {
                "P": {"label": "Wrist camera", "tag": "P", "video": case["video"], "poster": case["poster"], "models": per_view["P"]},
                "V": {"label": "Front camera", "tag": "V", "video": f"assets/video/{ref}.mp4",
                      "poster": f"assets/img/posters/{ref}.jpg", "models": per_view["V"]},
            }
        else:
            case["models"] = per_view["main"]
        case["_media"] = [(m["case_id"], spec)] + ([(m["reference_case_id"], spec + "--front")]
                                                   if suite == "D" and spec != "books_wrist_view" else [])
        assert abs(rec["frames"] / rec["fps"] - m["duration_s"]) < 0.05
        out.append(case)
    return out


def check_luna_books(cases, stage):
    """GPT-6 Luna on the bookshelf clip must reproduce the paper's Fig. 9 lane."""
    books = [c for c in cases if c["id"] == "books_shelf_swept"][0]
    luna = [m for m in books["models"] if m["key"] == "luna"][0]
    assert luna["r"] == 0.95, luna["r"]                    # paper: r = 0.95
    assert len(luna["pts"]) == 22 and luna["end"] == 0.0   # 22 native outputs, end 0.00
    assert max(v for _, v in luna["pts"]) == 0.2           # peak 0.20
    opus = [m for m in books["models"] if m["key"] == "opus"][0]
    assert opus["r"] == 0.95 and opus["end"] == 0.05


# ---------------------------------------------------------------- paper text
def tex_clean(s):
    s = re.sub(r"~?\\cite\{[^}]*\}", "", s)
    s = s.replace("$^{\\ast\\ddagger}$", "*‡").replace("$^{\\ast}$", "*").replace("$^{\\ddagger}$", "‡")
    s = s.replace("$^{\\dagger}$", "†").replace("$^{\\S}$", "§").replace("$^{\\P}$", "¶")
    s = s.replace("R$^{2}$VLM", "R²VLM").replace("~", " ").replace("--", "–")
    s = re.sub(r"\\textbf\{([^}]*)\}", r"\1", s)
    return re.sub(r"\s+", " ", s).strip()


def parse_taxonomy(path):
    fams, cur, route = [], None, None
    for line in open(path, encoding="utf-8"):
        fm = re.search(r"\\bfseries ([A-Za-z ]+)\\\\\((\d+)\)", line)
        if fm:
            cur = {"name": fm.group(1).strip(), "count": int(fm.group(2)), "routes": []}
            fams.append(cur)
            continue
        rm = re.search(r"\\parbox\{3\.15cm\}\{\\raggedright ([^}]*)\}", line)
        if rm:
            route = {"name": rm.group(1).strip(), "methods": []}
            cur["routes"].append(route)
            continue
        mm = re.search(r"\\parbox\{10\.9cm\}\{\\raggedright (.*)\}\}, draw", line)
        if mm:
            body = mm.group(1)
            names = [tex_clean(x).strip(" ,") for x in re.split(r"~\\cite\{[^}]*\}", body)]
            route["methods"] = [n for n in names if n]
    for f in fams:
        assert sum(len(r["methods"]) for r in f["routes"]) == f["count"], f["name"]
    # The root node of the tree states the corpus size, e.g. "(114 entries)".
    total = int(re.search(r"\((\d+) entries\)", open(path, encoding="utf-8").read()).group(1))
    assert sum(f["count"] for f in fams) == total, (sum(f["count"] for f in fams), total)
    return fams


def parse_rows(block, ncols):
    rows, group = [], None
    for line in block.splitlines():
        line = line.strip()
        g = re.search(r"\\textit\{([^}]*)\}\}\} \\\\", line)
        if line.startswith("\\rowcolor") and g:
            group = tex_clean(g.group(1))
            continue
        if line.count("&") == ncols - 1 and line.endswith("\\\\") and not line.startswith(("&", "Model")):
            cells = [c.strip() for c in line[:-2].split("&")]
            vals = [float(tex_clean(c)) for c in cells[1:]]
            rows.append({"raw": cells[0], "name": tex_clean(cells[0]), "group": group, "vals": vals})
    return rows


def parse_results(path):
    tex = open(path, encoding="utf-8").read()
    t2 = tex[tex.index("\\label{tab:bench-main-results}"):]
    t2 = t2[:t2.index("\\end{tabularx}")]
    t3 = tex[tex.index("\\label{tab:bench-evidence-results}"):]
    t3 = t3[:t3.index("\\end{tabularx}")]
    # Table II also lists multiview rows (double dagger) since 9 November 2026;
    # the leaderboard is the single-view roster of Table III.
    r2 = [r for r in parse_rows(t2, 9) if "\\ddagger" not in r["raw"]]
    r3 = parse_rows(t3, 6)
    assert len(r2) == 35 and len(r3) == 26, (len(r2), len(r3))

    def key(name):
        return re.sub(r"[†§¶]", "", name).replace(" (Pair)", "").replace(" (Sequence)", "").strip()

    seq = {}
    pair = {}
    for r in r2:
        k = key(r["name"])
        if "Pair" in (r["group"] or "") or r["name"].endswith("(Pair)"):
            pair[k] = r
        else:
            seq[k] = r
    board = []
    for r in r3:
        k = key(r["name"])
        a = seq[k]
        grp = r["group"]
        kind = ("Specialized" if grp.startswith("Specialized") else
                "General VLM" if grp.startswith("General") else "Decision")
        size = grp.split(", ", 1)[1] if kind == "Specialized" else ""
        voc, tau, ff1, v, px = r["vals"]
        prec_r, rec_r, f1_r, prec_f, rec_f, f1_f, mf1, acc = a["vals"]
        assert abs(f1_f - ff1) < 1e-9, (k, f1_f, ff1)
        board.append({
            "name": re.sub(r"[§¶]", "", r["name"]).replace("†", "").strip(),
            "interp": "†" in r["name"] or "†" in a["name"],
            "kind": kind, "size": size,
            "mf1": mf1, "ff1": ff1, "frec": rec_f, "fprec": prec_f, "acc": acc,
            "voc": voc, "tau": tau, "v": v, "px": px,
            "pair": pair[k]["vals"][6] if k in pair else None,
        })
    return board


# ---------------------------------------------------------------- media
def copy_media(stage, cases):
    vdir = os.path.join(PAGE, "assets", "video")
    pdir = os.path.join(PAGE, "assets", "img", "posters")
    for c in cases:
        for cid, name in c.pop("_media"):
            shutil.copy(os.path.join(stage, "videos", cid + ".mp4"), os.path.join(vdir, name + ".mp4"))
            shutil.copy(os.path.join(stage, "posters", cid + ".jpg"), os.path.join(pdir, name + ".jpg"))
    shutil.copy(os.path.join(stage, "mosaic.mp4"), os.path.join(vdir, "mosaic.mp4"))
    shutil.copy(os.path.join(stage, "mosaic_poster.jpg"), os.path.join(PAGE, "assets", "img", "mosaic.jpg"))


def write_js(path, var, obj):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("/* generated by _tools/build_data.py; do not edit by hand */\n")
        f.write(f"window.{var} = ")
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage")
    ap.add_argument("--paper", required=True)
    ap.add_argument("--no-media", action="store_true")
    ap.add_argument("--site-only", action="store_true",
                    help="rewrite only site.js from the paper sources; needs no stage directory")
    a = ap.parse_args()
    if a.site_only:
        fams = parse_taxonomy(os.path.join(a.paper, "fig", "taxonomy_tree.tex"))
        board = parse_results(os.path.join(a.paper, "sections", "06_evaluation.tex"))
        write_js(os.path.join(PAGE, "assets", "data", "site.js"), "RRM_SITE",
                 {"families": fams, "board": board})
        print(f"site.js only · families {len(fams)} · leaderboard rows {len(board)}")
        return
    if not a.stage:
        ap.error("--stage is required unless --site-only is given")

    cases = build_cases(a.stage)
    check_luna_books(cases, a.stage)
    if not a.no_media:
        copy_media(a.stage, cases)
    else:
        for c in cases:
            c.pop("_media")
    models = [{"key": k, "lane": l, "name": n, "sub": s, "voc": v} for k, l, n, s, v in MODELS]
    write_js(os.path.join(PAGE, "assets", "data", "cases.js"), "RRM_CASES",
             {"models": models, "cases": cases})

    fams = parse_taxonomy(os.path.join(a.paper, "fig", "taxonomy_tree.tex"))
    board = parse_results(os.path.join(a.paper, "sections", "06_evaluation.tex"))
    write_js(os.path.join(PAGE, "assets", "data", "site.js"), "RRM_SITE",
             {"families": fams, "board": board})
    n = sum(len(m["pts"]) for c in cases for m in (c.get("models") or c["views"]["P"]["models"] + c["views"]["V"]["models"]))
    print(f"cases {len(cases)} · curve points {n} · families {len(fams)} · leaderboard rows {len(board)}")


if __name__ == "__main__":
    main()
