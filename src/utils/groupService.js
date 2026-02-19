import { collection, addDoc, deleteDoc, doc, getDoc, getDocs, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'

// Create a new group
export const createGroup = async (userId, groupData) => {
  try {
    const groupsRef = collection(db, 'groups')
    const docRef = await addDoc(groupsRef, {
      ...groupData,
      createdBy: userId,
      members: [userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    toast.success('Guruh yaratildi')
    return docRef.id
  } catch (error) {
    console.error('Create group error:', error)
    toast.error('Guruh yaratishda xatolik')
    throw error
  }
}

// Join a group by code
export const joinGroupByCode = async (userId, groupCode) => {
  try {
    const groupsRef = collection(db, 'groups')
    const q = query(groupsRef, where('code', '==', groupCode))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      toast.error('Guruh kodi topilmadi')
      return null
    }

    const groupDoc = querySnapshot.docs[0]
    const groupId = groupDoc.id
    
    // Send join request
    const requestsRef = collection(db, 'groups', groupId, 'requests')
    await addDoc(requestsRef, {
      studentId: userId,
      status: 'pending',
      createdAt: serverTimestamp()
    })

    toast.success('So\'rov yuborildi')
    return groupId
  } catch (error) {
    console.error('Join group error:', error)
    toast.error('Guruhga qo\'shilishda xatolik')
    throw error
  }
}

// Approve student request
export const approveStudentRequest = async (groupId, requestId, studentId) => {
  try {
    // Update request status
    const requestRef = doc(db, 'groups', groupId, 'requests', requestId)
    await updateDoc(requestRef, { status: 'approved' })

    // Add student to group members
    const groupRef = doc(db, 'groups', groupId)
    await updateDoc(groupRef, {
      members: arrayUnion(studentId),
      updatedAt: serverTimestamp()
    })

    toast.success('O\'quvchi qo\'shildi')
  } catch (error) {
    console.error('Approve request error:', error)
    toast.error('So\'rovni tasdiqlashda xatolik')
    throw error
  }
}

// Reject student request
export const rejectStudentRequest = async (groupId, requestId) => {
  try {
    const requestRef = doc(db, 'groups', groupId, 'requests', requestId)
    await deleteDoc(requestRef)
    toast.success('So\'rov bekor qilindi')
  } catch (error) {
    console.error('Reject request error:', error)
    toast.error('So\'rovni bekor qilishda xatolik')
    throw error
  }
}

// Remove student from group
export const removeStudentFromGroup = async (groupId, studentId) => {
  try {
    const groupRef = doc(db, 'groups', groupId)
    await updateDoc(groupRef, {
      members: arrayRemove(studentId),
      updatedAt: serverTimestamp()
    })
    toast.success('O\'quvchi olib tashlandi')
  } catch (error) {
    console.error('Remove student error:', error)
    toast.error('O\'quvchini olib tashashda xatolik')
    throw error
  }
}

// Delete group
export const deleteGroup = async (groupId) => {
  try {
    const groupRef = doc(db, 'groups', groupId)
    await deleteDoc(groupRef)
    toast.success('Guruh o\'chirildi')
  } catch (error) {
    console.error('Delete group error:', error)
    toast.error('Guruhni o\'chirishda xatolik')
    throw error
  }
}

// Get group details
export const getGroupDetails = async (groupId) => {
  try {
    const groupRef = doc(db, 'groups', groupId)
    const groupSnap = await getDoc(groupRef)
    
    if (!groupSnap.exists()) {
      throw new Error('Guruh topilmadi')
    }

    return { id: groupSnap.id, ...groupSnap.data() }
  } catch (error) {
    console.error('Get group error:', error)
    toast.error('Guruh ma\'lumotlarini yuklashda xatolik')
    throw error
  }
}

// Get user's groups
export const getUserGroups = async (userId) => {
  try {
    const groupsRef = collection(db, 'groups')
    const q = query(groupsRef, where('members', 'array-contains', userId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Get user groups error:', error)
    throw error
  }
}

// Get pending requests for teacher
export const getPendingRequests = async (groupId) => {
  try {
    const requestsRef = collection(db, 'groups', groupId, 'requests')
    const q = query(requestsRef, where('status', '==', 'pending'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Get pending requests error:', error)
    throw error
  }
}
