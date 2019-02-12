# Installation

1. Clone repository

```
yarn setup
yarn start
# development
yarn install
yarn watch
```

# Usage

Type in any of the following commands to execute:

- `conf`: Select a Midi Device
- `start`: Start sequence
- `stop`: Stop sequence
- `quit`: Quit

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
