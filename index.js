const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()

app.use(express.static('dist'))

app.use(cors())

app.use(express.json())

const Note = require('./models/note.js')

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/notes',(request,response)=>{
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })

  app.get('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }
  })

  app.delete('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note=>note.id)) : 0
    return maxId + 1
  }

  app.post('/api/notes', (request, response) => {
    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error:'content missing'
        })
    }

    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    }
    notes = notes.concat(note)
    response.json(note)
  })

  app.put('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    let noteindex = notes.findIndex(note => note.id === id)
    if (noteindex!=-1) {
      const body = request.body
      
      if(!body.content){
        return response.status(400).json({
            error:'content missing'
        })
      } 
      console.log(body)
      notes[noteindex] = {
        id: id,
        content: body.content,
        important: body.important || false
      }
      response.json(notes[noteindex])
      response.status(204).end()
    }
    else {
      response.status(404).end()
  }
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

