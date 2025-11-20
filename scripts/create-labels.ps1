# PowerShell script to create standard labels for AuroraEngine using GitHub CLI
$labels = @(
    @{name="type:bug"; color="d73a4a"; description="Something isn’t working (bugs, errors)"},
    @{name="type:feat"; color="a2eeef"; description="New feature or enhancement"},
    @{name="type:docs"; color="0075ca"; description="Documentation or tutorial changes"},
    @{name="type:refactor"; color="cfd3d7"; description="Code refactor, no behavior change"},
    @{name="type:test"; color="e4e669"; description="Testing improvements or coverage"},
    @{name="type:chore"; color="bfe5bf"; description="Maintenance, infra, or tooling"},
    @{name="good first issue"; color="7057ff"; description="Simple, well-described issues for first-time contributors"},
    @{name="help wanted"; color="008672"; description="Maintainers would love help here"},
    @{name="prio:high"; color="b60205"; description="User-facing impact, needed soon"},
    @{name="prio:med"; color="fbca04"; description="Normal priority"},
    @{name="prio:low"; color="d4c5f9"; description="Nice to have"},
    @{name="status:help-wanted"; color="008672"; description="Good candidate for new contributors"},
    @{name="status:needs-info"; color="d876e3"; description="More details required"},
    @{name="status:wip"; color="fef2c0"; description="In progress"},
    @{name="area:vn"; color="1d76db"; description="VN runtime & steps"},
    @{name="area:state"; color="0052cc"; description="State, flags, persistence"},
    @{name="area:docs"; color="0e8a16"; description="Docs & tutorials"},
    @{name="area:build"; color="5319e7"; description="Build, CI, packaging"}
)

$repo = "DianaABA/AuroraEngine"

foreach ($label in $labels) {
    gh label create $label.name --color $label.color --description $label.description --repo $repo -f
}
