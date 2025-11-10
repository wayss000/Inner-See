## Inner See

Inner See — Journey to the Real Me.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start --offline
   ```

3. Open this app in the Expo Go sandbox environment on your mobile device (Android or iPhone)

   **Why install Expo Go?**
   Expo Go is a sandbox environment for running React Native apps, allowing you to test the app on a real device without building a native app.

   **How to install Expo Go:**
   - **iOS users**: Search for "Expo Go" in the App Store and install
   - **Android users**: Search for "Expo Go" in the Google Play Store and install
   
   **How to use:**
   1. Install the Expo Go app on your phone
   2. After running `npx expo start --offline`, a QR code will appear in the terminal
   3. Open the Expo Go app on your phone
   4. Scan the QR code displayed in the terminal
   5. The app will automatically load and run on your device

4. ⚠️ **Important Note: AI API Configuration**

If the AI model API token is unavailable, you need to apply for a new one from KwaiKAT (streamlake.ai). Then update the following environment variables in `app.json`:

```json
{
  "extra": {
    "EXPO_PUBLIC_WANQING_API_KEY": "your_new_api_key",
    "EXPO_PUBLIC_WANQING_API_URL": "your_new_api_url",
    "EXPO_PUBLIC_WANQING_MODEL_ID": "your_new_model_id"
  }
}
```

**Steps to update API credentials:**
1. Visit [streamlake.ai](https://streamlake.ai) and apply for API access
2. Obtain your API Key, API URL, and Model ID
3. Replace the corresponding values in the `app.json` file
4. Restart the development server for changes to take effect
