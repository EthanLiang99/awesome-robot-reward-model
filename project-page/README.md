# Robotic Reward Models — project page

Static page for *Robotic Reward Models in the Foundation-Model Era: A Survey and Capability Benchmark*.
Plain HTML, CSS and JavaScript with no build step. Everything the page shows is in this folder, and it makes no requests outside it.

```
index.html              the page
assets/css/style.css    one warm, light theme
assets/css/fonts.css    @font-face rules for the bundled fonts
assets/fonts/           Inter, Instrument Serif, JetBrains Mono (SIL OFL 1.1, see OFL.txt)
assets/js/main.js       hero trace, taxonomy, findings charts, leaderboard, hub, citation
assets/js/lab.js        Reward Lab: a clip played against the task-state label and nine evaluators
assets/data/cases.js    10 benchmark clips: labels, events, evaluator outputs (window.RRM_CASES)
assets/data/site.js     110 surveyed methods by family, 26-evaluator leaderboard (window.RRM_SITE)
assets/video/           web encodes of the clips and the 24-clip wall (about 11 MB)
assets/img/             posters, favicon, og.jpg (social card)
_tools/                 preview server, data rebuild, social card; not deployed
```

## Preview

```bash
python project-page/_tools/serve.py
```

Then open http://127.0.0.1:8765. `python -m http.server` also works, but it ignores Range requests, so seeking inside videos breaks.

## Publishing

[`.github/workflows/project-page.yml`](../.github/workflows/project-page.yml) deploys `index.html` and `assets/` to GitHub Pages whenever a push to `main` changes this folder. The address is https://ethanliang99.github.io/awesome-robot-reward-model/.

- A repository admin sets this up once: Settings → Pages → Source: **GitHub Actions**.
- While the repository is private, pushes skip the deploy. Pages on a private repository needs a paid plan, and the site would be public anyway. To deploy by hand, use **Run workflow** on the Actions tab.
- Making the repository public does not deploy by itself, because a visibility change is not a push. After the switch, use **Run workflow** once, or push a change to this folder.

Before the site goes public:

1. In `index.html`, search for `data-soon`. Put the real URL in each `href="#"` (Paper, arXiv, Code, Data) and delete `data-soon`. Until then those buttons show "link coming soon".
2. The clips are RoboChallenge Table30 and Table30 V2 executions from RRM-Bench-1K. The benchmark release notes list their redistribution terms as "to be decided before public release". Confirm those terms before publishing the videos.
3. If the site moves, for example to a custom domain, update `og:url`, `og:image` and `twitter:image` in `index.html`.

## Rebuild the data

`assets/data/*.js` and the media are generated. The text and numbers in `index.html` are written by hand from the paper.

```bash
bash project-page/_tools/stage_from_server.sh <ssh-host> <codebase-root> <stage-dir>
python project-page/_tools/build_data.py --stage <stage-dir> --paper <paper-repo>
```

The first command copies saved outputs and encodes the clips on the lab server. `<codebase-root>` is the server directory that holds `Rewardbox/` and `Rewardbox_release/`. `build_data.py` then reads `fig/taxonomy_tree.tex` and `sections/06_evaluation.tex` from the paper repository, plus the staged reward-profile kits. These are the saved outputs behind Fig. 9 and the supplementary reward-profile figures, along with the GPT-6 Luna reference results. No model is run.

To redraw the social card after a title change, run `serve.py` and open http://127.0.0.1:8765/_tools/og_card.html. It overwrites `assets/img/og.jpg`.

Every number on the page is quoted from the paper or computed from its saved outputs. Re-check it against the camera-ready version.
