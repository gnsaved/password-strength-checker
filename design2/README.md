# Password Strength Checker (Vanilla JS)

A clean password strength checker UI (no APIs) that:
- Updates a strength bar (Weak → Medium → Strong → Very Strong)
- Shows password length live
- Checks for: lowercase, uppercase, numbers, symbols (Regex)
- Estimates brute-force crack time (rough demo assumption)

## Run
Just open `index.html` in your browser.

## Notes
Crack-time is a **rough brute-force estimate** assuming very fast offline guessing (~10B guesses/sec).
Real-world cracking depends on hashing algorithm, rate-limits, leaks, and password reuse.
