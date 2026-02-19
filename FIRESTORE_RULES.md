# Firestore Security Rules

## Installation

Go to Firebase Console → Firestore Database → Rules tab and paste:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profiles - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Subcollections
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Groups - members can read, teacher can write
    match /groups/{groupId} {
      allow read: if request.auth.uid in resource.data.members;
      allow create: if request.auth.uid == request.resource.data.createdBy;
      allow update, delete: if request.auth.uid == resource.data.createdBy;
    }
    
    // Group requests
    match /groups/{groupId}/requests/{requestId} {
      allow read: if request.auth.uid in get(/databases/$(database)/documents/groups/$(groupId)).data.members;
      allow create: if request.auth.uid == request.resource.data.studentId;
      allow update, delete: if request.auth.uid == get(/databases/$(database)/documents/groups/$(groupId)).data.createdBy;
    }
    
    // Public data (read-only)
    match /lessons/{document=**} {
      allow read: if request.auth != null;
    }
    
    match /exercises/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Features

- Users can only access their own data
- Groups accessible only to members
- Teachers manage their groups
- Public lessons/exercises readable by all authenticated users
