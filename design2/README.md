# Password Strength Checker (Vanilla JS)

A lightweight, responsive password strength checker (no APIs) that provides real-time feedback on password quality.

## Features
- Live strength meter: **Weak → Medium → Strong → Very Strong**
- Live password length counter
- Rule checks via Regex: **lowercase, uppercase, number, symbol**
- Estimated brute-force crack time (demo approximation)
- Show/Hide password toggle
- Accessible UI labels and status updates

## Tech
- HTML + CSS
- Vanilla JavaScript
- Regex-based validation (no external libraries)

## Run locally
Just open `index.html` in your browser.

## Notes / Disclaimer
Crack-time is a **rough brute-force estimate** assuming fast offline guessing (~10B guesses/sec) and a basic character-set model.
Real-world cracking depends on hashing algorithms, rate limits, password reuse, leaked databases, and attacker resources.
