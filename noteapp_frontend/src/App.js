import React, {useState, useEffect} from 'react'
import noteService from './services/notes'

const Note = ({note, toggleImportance}) => {
   const label = note.important ? 'make not important':'make important'
   
   return(
      <li>
         {note.content}
         {/*<button onClick={toggleImportance}>{label}</button>*/}
      </li>
   )
}

const App = () => {
   const [notes, setNotes] = useState([])
   const [newNote, setNewNote] = useState('')
   const [showAll, setShowAll] = useState(true)

   useEffect(()=>{
      console.log('effect')
      noteService
         .getAll()
         .then(initialNotes => {
            setNotes(initialNotes)
         })
   }, [])
   console.log('render', notes.length, 'notes')

   const addNote = (event) => {
      event.preventDefault()
      console.log('button clicked', event.target)
      const noteObject = {
         content: newNote,
         date: new Date().toISOString(),
         important: Math.random()>0.5,
      }

      noteService.create(noteObject).then(response=>{
         setNotes(notes.concat(response))
         setNewNote('')
      })
      
   }

   const handleChange = (event) =>{
      console.log(event.target.value)
      setNewNote(event.target.value)
   }

   const notesToShow = showAll
      ? notes
      : notes.filter(note => note.important)
      // sama kuin notes.filter(note => note.important === true)
   
   const toggleImportanceOf = (id) => {
      console.log(`importance of ${id} needs to be toggled`)
      //const url = `http://localhost:3001/notes/${id}`
      const note = notes.find(n=>n.id===id)
      const changedNote = {...note, important: !note.important}

      noteService
         .update(id, changedNote)
         .then(response => {
            setNotes(notes.map(note=> note.id!==id? note : response))
         })
         .catch(error=>{
            alert(
               `the note '${note.content}' was already deleted from server`
            )
            setNotes(notes.filter(n=>n.id !== id))
         })

      
      /*axios.put(url, changedNote).then(response=>{
         console.log('response from axios.put: ', response)
         setNotes(notes.map(note=> note.id!==id? note : response.data))
      })*/
   }

   return (
     <div>
       <h1>Notes</h1>
       {/*<div>
         <button onClick={()=>setShowAll(!showAll)}>show {showAll ? 'important notes only': 'all'}</button>
       </div>*/}
         <ul>
            {notesToShow.map((note)=>
               <Note 
                  key={note.id} 
                  note={note}
                  toggleImportance = {()=>toggleImportanceOf(note.id)}   
               />
            )}
         </ul>
         <form onSubmit={addNote}>
            <input 
               value={newNote}
               onChange={handleChange}
               />
            <button type="submit">Save</button>

         </form>
     </div>
   )
 }

 export default App;