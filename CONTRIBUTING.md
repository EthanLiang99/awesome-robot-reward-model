# Contributing

Thank you for helping to keep this list current. New papers, corrections, better categorization, and dead-link fixes are all welcome.

## Add a paper

Edit `README.md` and open a pull request against `main`. An entry has two lines:

```markdown
- **Name**: Paper title `YYYY.MM`  
  [![Paper](https://img.shields.io/badge/-Paper-E58A8F?style=flat-square&logo=arxiv&logoColor=white)](https://arxiv.org/abs/XXXX.XXXXX) [![Code](https://img.shields.io/github/stars/OWNER/REPO?style=flat-square&logo=github&label=Code&color=B7CADB)](https://github.com/OWNER/REPO) <sub>Native output: what the model returns</sub>
```

- **Date**: the first public release, usually the first arXiv version.
- **Native output**: what the model returns before any downstream transformation, in a few words.
- **Links**: the paper, and code, weights, or data only when they are released.

## Where it goes

Place the entry in the family whose question its native output answers, under the closest design route, in order of first release.

| Family | Question |
|---|---|
| Outcome | Is the task done, or will it fail? |
| Absolute Progress | How far along is it? |
| Relative | Which is better? |
| Temporal Value | Which stage, and how well is it going? |
| Hybrid | What happened, and on what evidence? |

A model with several independent judgments from different families is Hybrid. A rationale or a confidence attached to one judgment keeps that judgment's family.

## Scope

The list covers task-conditioned evaluators of robot behavior that use a foundation model for representation, supervision, or the judgment itself. Benchmarks and datasets go in their own sections. If you are unsure whether a paper fits, open an issue and we will sort it out together.
