# Firebase Realtime Database App Setup Guide

This guide will walk you through the process of setting up a Firebase Realtime Database app with Google authentication and storage separated by users.

Make sure to follow each step carefully to ensure a successful setup.

---

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Follow the prompts to set up your project and enable Firebase services for your app.
3. Free plan is enough for this project.

![Firebase Project](./images/firebase/project.png)

## Step 2: Set Up Authentication

1. In the Firebase Console, navigate to the **Authentication** section.
2. Enable the **Google** sign-in method.

![Firebase Authentication](./images/firebase/auth-methods.png)

3. Follow the prompts to configure the Google sign-in method.
4. Add `localhost` to the **Authorized domains** list if it hasn't appeared.

![Firebase Auth Domain](./images/firebase/auth-domain.png)

## Step 3: Set Up Storage

1. In the Firebase Console, navigate to the **Storage** section.
2. Follow the prompts to set up your storage bucket.
3. Rules example:

```
rules_version = '2';

// Grants a user access to a node matching their user ID
service firebase.storage {
  match /b/{bucket}/o {
    // Files look like: "user/<UID>/path/to/file.txt"
    match /user/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Here the app will store audio files of the user speaking.

![Storage Rules](./images/firebase/storage-rules.png)

## Step 4: Set Up Realtime Database

[WIP]

1. In the Firebase Console, navigate to the **Database** section.
2. Create a new **Realtime Database**.
3. Follow the prompts to configure your database.

---

Congratulations! You have successfully set up a Firebase Realtime Database app with Google authentication and storage separated by users.