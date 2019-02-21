##NOTE: This repository is just a proof of concept. Because of too high delay in the midi I/O I opted for a python implementation: https://github.com/khusseini/livecoder-py

# Installation

1. Clone repository

```
yarn setup
yarn start
# development
yarn install
yarn start
```

# Usage

In order to enter command mode simply type in `:`,
when the application starts. Press `ESC` to exit the
mode and `CTRL+C` to exit the application.

Currently the following commands are available:
- `dev`: Select MIDI device
- `ch(n)`: Select output channel
- `hist`: Select previously used sequences

## Sequences

Sequences can be typed in with the following structure:

```
(i|ii|iii|iv|v|vi|vii)(maj|m|...)@\d+/\d+
```

The roman numerals are the chords in the current key.
Any of the chord variations listen in `./src/chord/chordMods` can be used.

Example:
```
i@1/4 v@1/8 vi@1/8 ii@1/4 iii@1/4
```

Or Single Notes:
```
C@1/4 A3@1/8
```

