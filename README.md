# react-native-setdevteam

Set the development team for the iOS arm of your React Native project.

This is useful for deployment, but even before that it is critical for either 1) using Apple Push Notification Service or 2) testing on devices at all.

Finally, freedom from simulators without opening xcode!

# Installation

```bash
yarn add react-native-setdevteam
# or: npm i --save react-native-setdevteam
```

# Usage

## 1. Add a development team

First-time use:

```bash
yarn add react-native-setdevteam
react-native setdevteam
Scanning folders for symlinks in /path/to/my/project (27ms)
? Would you like me to search for a valid development team for you? Yes
? Where should I search for your existing XCode projects? /Users/me
Looking for development teams...
? Which development team do you want to use? (Use arrow keys)
❯ ABCDEFGHI0
  1QRSTUVQXY
  None of these
? Would you like to save this choice so that I use it by default when passing --development-team without arguments next time? Yes
Saving development team to cache for future use: ABCDEFGHI0
Next time, running --development-team without argument will use this saved value.
Updated with selected development team ABCDEFGHI0
```

In the future, packages can get your saved default development team non-interactively by running

```
react-native setdevteam
```

Select from a list by adding interactive mode:

```
react-native setdevteam --interactive
```

**Note** the development team you selected for this project will be saved in your `package.json` as `xcodeDevTeam`.

Also note that running `react-native setdevteam` _without_ the `--interactive` flag will also use the `xcodeDevTeam` value, if available.

## Updated For React >=0.60

No changes are required for use - same `react-native setdevteam` as before
