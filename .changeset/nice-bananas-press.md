---
"@comet/eslint-config": major
---

Add eslint rule to restrict barrel react imports

Because the new JSX transform will automatically import the necessary `react/jsx-runtime` functions, React will no
longer need to be in scope when you use JSX.
