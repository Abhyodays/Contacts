Required softwares:
1. Android Studio with Emulator
3. Node

Steps to run:
1. install npm packages:
npm install
2. To use physical device connect it with usb cable and turn on usb debuggin in android for more details:
https://reactnative.dev/docs/running-on-device and stop any android emulator if running.
or to use android emulator
start it from virtual device manager of android studio.
3. Run application using command:
npx expo run:android
then press 'a' to open in android

Features:
1. Using Realm as Database for saving Contact details,
2. Using local file storage for storing profile image and refrence is stored in Database,
3. Contact can be delete and update by swiping in contact list screen,
4. To add contact, press '+' button in bottom right corner,
5. Search contacts using name or number from clicking icon on top right corner.
