import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'

// Search lessons
export const searchLessons = async (searchTerm) => {
  try {
    const lessonsRef = collection(db, 'lessons')
    const querySnapshot = await getDocs(lessonsRef)
    
    const results = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        type: 'lesson',
        ...doc.data()
      }))
      .filter(lesson =>
        lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    return results
  } catch (error) {
    console.error('Search lessons error:', error)
    return []
  }
}

// Search exercises
export const searchExercises = async (searchTerm) => {
  try {
    const exercisesRef = collection(db, 'exercises')
    const querySnapshot = await getDocs(exercisesRef)
    
    const results = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        type: 'exercise',
        ...doc.data()
      }))
      .filter(exercise =>
        exercise.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    return results
  } catch (error) {
    console.error('Search exercises error:', error)
    return []
  }
}

// Search groups
export const searchGroups = async (userId, searchTerm) => {
  try {
    const groupsRef = collection(db, 'groups')
    const q = query(groupsRef, where('members', 'array-contains', userId))
    const querySnapshot = await getDocs(q)
    
    const results = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        type: 'group',
        ...doc.data()
      }))
      .filter(group =>
        group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    return results
  } catch (error) {
    console.error('Search groups error:', error)
    return []
  }
}

// Search users
export const searchUsers = async (searchTerm) => {
  try {
    const usersRef = collection(db, 'users')
    const querySnapshot = await getDocs(usersRef)
    
    const results = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        type: 'user',
        ...doc.data()
      }))
      .filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    return results
  } catch (error) {
    console.error('Search users error:', error)
    return []
  }
}

// Global search
export const globalSearch = async (userId, searchTerm) => {
  try {
    if (!searchTerm.trim() || searchTerm.length < 2) return []

    const [lessons, exercises, groups, users] = await Promise.all([
      searchLessons(searchTerm),
      searchExercises(searchTerm),
      searchGroups(userId, searchTerm),
      searchUsers(searchTerm)
    ])

    return {
      lessons,
      exercises,
      groups,
      users,
      total: lessons.length + exercises.length + groups.length + users.length
    }
  } catch (error) {
    console.error('Global search error:', error)
    return { lessons: [], exercises: [], groups: [], users: [], total: 0 }
  }
}
