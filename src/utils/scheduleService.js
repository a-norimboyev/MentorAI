import { collection, addDoc, deleteDoc, doc, getDocs, query, where, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'

// Create schedule event
export const createScheduleEvent = async (userId, eventData) => {
  try {
    const eventsRef = collection(db, 'users', userId, 'scheduleEvents')
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    toast.success('Dars qo\'shildi')
    return docRef.id
  } catch (error) {
    console.error('Create event error:', error)
    toast.error('Dars qo\'shishda xatolik')
    throw error
  }
}

// Update schedule event
export const updateScheduleEvent = async (userId, eventId, eventData) => {
  try {
    const eventRef = doc(db, 'users', userId, 'scheduleEvents', eventId)
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp()
    })
    toast.success('Dars yangilandi')
  } catch (error) {
    console.error('Update event error:', error)
    toast.error('Dars yangilashda xatolik')
    throw error
  }
}

// Delete schedule event
export const deleteScheduleEvent = async (userId, eventId) => {
  try {
    const eventRef = doc(db, 'users', userId, 'scheduleEvents', eventId)
    await deleteDoc(eventRef)
    toast.success('Dars o\'chirildi')
  } catch (error) {
    console.error('Delete event error:', error)
    toast.error('Darsni o\'chirishda xatolik')
    throw error
  }
}

// Get user's schedule events
export const getUserScheduleEvents = async (userId) => {
  try {
    const eventsRef = collection(db, 'users', userId, 'scheduleEvents')
    const querySnapshot = await getDocs(eventsRef)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => new Date(a.date) - new Date(b.date))
  } catch (error) {
    console.error('Get events error:', error)
    throw error
  }
}

// Get events for specific date
export const getEventsForDate = async (userId, date) => {
  try {
    const eventsRef = collection(db, 'users', userId, 'scheduleEvents')
    const q = query(eventsRef, where('date', '==', date))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Get date events error:', error)
    throw error
  }
}

// Get upcoming events
export const getUpcomingEvents = async (userId, maxResults = 5) => {
  try {
    const eventsRef = collection(db, 'users', userId, 'scheduleEvents')
    const querySnapshot = await getDocs(eventsRef)
    
    const currentDate = new Date().toISOString().split('T')[0]
    const events = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(event => event.date >= currentDate)
      .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
      .slice(0, maxResults)
    
    return events
  } catch (error) {
    console.error('Get upcoming events error:', error)
    throw error
  }
}
