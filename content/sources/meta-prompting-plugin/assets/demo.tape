# VHS tape for chain-demo.gif
# Usage: vhs assets/demo.tape  (produces assets/chain-demo.gif)
# https://github.com/charmbracelet/vhs

Output assets/chain-demo.gif

Set Theme "Catppuccin Mocha"
Set FontSize 16
Set Width 1200
Set Height 600
Set Padding 20
Set LoopOffset 5%
Set TypingSpeed 30ms
Set Shell zsh
Set PlaybackSpeed 1

# Hero demo — a /chain run
Type "claude"
Sleep 300ms
Enter

Sleep 800ms

Type '/chain [/meta→/rmp→/review] @quality:0.9 "add rate limiting to /api/login"'
Sleep 600ms
Enter

# Simulated stage: /meta picks strategy
Sleep 1200ms
Type "# → /meta classified as L4 · strategy: algorithm+integration"
Sleep 400ms

# Simulated stage: /rmp iterates
Sleep 800ms
Type "# → /rmp  v0 0.42  ▁▂"
Sleep 300ms
Type "# → /rmp  v1 0.71  ▃▅"
Sleep 300ms
Type "# → /rmp  v2 0.88  ▆▇▇  (threshold 0.85 ✓)"
Sleep 500ms

# Simulated stage: /review
Sleep 600ms
Type "# → /review pass · chain-quality: min(0.9, 0.88, 0.92) = 0.88"
Sleep 1500ms

# Fade
Sleep 2000ms
