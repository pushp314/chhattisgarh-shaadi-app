# iOS Setup Required

## New Native Dependency Added
`@react-native-community/datetimepicker` requires native linking for iOS.

## Setup Steps

### 1. Install CocoaPods Dependencies
```bash
cd ios
bundle exec pod install
cd ..
```

### 2. Rebuild iOS App
```bash
npm run ios
```

## Common Issues

### If Pod Install Fails
```bash
# Clean pod cache
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install --repo-update
cd ..
```

### If Build Fails
```bash
# Clean build folder
cd ios
xcodebuild clean -workspace AwesomeProject.xcworkspace -scheme AwesomeProject
cd ..

# Rebuild
npm run ios
```

## Verification
After successful build, verify date picker works by:
1. Navigate to Profile → Create Profile
2. Tap on "Date of Birth" button
3. Date picker should appear
4. Select a date
5. Date should be formatted and displayed

## Android Note
Android auto-links the native module. No additional steps needed.
Just rebuild: `npm run android`
