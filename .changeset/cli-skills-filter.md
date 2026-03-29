---
"@comet/cli": minor
---

Add support for filtering skills when installing from external repos. In `agent-skills.json`, a repo entry can now be either a plain string (installs all skills) or an object with `repo` and `skills` fields to install only specific skills:

```json
{
    "repos": [
        "git@github.com:vivid-planet/comet.git",
        {
            "repo": "git@github.com:anthropics/skills.git",
            "skills": ["skill-creator"]
        }
    ]
}
```
