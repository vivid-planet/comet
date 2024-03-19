---
"@comet/blocks-admin": minor
---

Add `resolveDependencyPath()` to `BlockMethods` interface

Blocks must now offer a `resolveDependencyPath()` method that returns a URL path based on the block's `state` and `jsonPath`. 
It can be used to build the URL to a block's edit view. 

For most cases, the default implementation of this method should be sufficient, so you don't have to implement it yourself. 
You must only override it manually if your block's admin component contains special routing logic (e.g. `RouterTabs`). 
