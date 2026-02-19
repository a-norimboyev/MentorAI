# Firebase Storage Rules

## Installation

Go to Firebase Console → Storage → Rules tab and paste:

```firebase
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // User profile pictures
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId && request.resource.size < 5 * 1024 * 1024;
    }
    
    // Exercise file uploads - max 10MB
    match /exercise-files/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId && request.resource.size < 10 * 1024 * 1024;
    }
    
    // Course materials - public read, teacher write
    match /course-materials/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins via backend
    }
    
    // Default deny
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Features

- Profile pictures: 5MB max, user owned
- Exercise files: 10MB max, user owned
- Course materials: read-only for authenticated users
