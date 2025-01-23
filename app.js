const {log} = require('console')
const express = require('express')
const bodyParser = require('body-parser') 
const {default:mongoose} = require('mongoose')
const student = require('./model/student')

const app = express()

const PORT = 5000

mongoose.connect('mongodb://localhost:27017/studentDB')

app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine','ejs')


app.get('/', async (req,res)=>{
    const students = await student.find()
    res.render('index', {students})
})
  
app.post('/save', async(req,res)=>{
    const {rollNo, Name, degree, city} = req.body

    const students = new student({rollNo, Name, degree, city})

    await students.save()
    res.redirect('/')
})

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the URL
    const studentData = await student.findById(id); // Fetch the student data by ID
    res.render('edit', { student: studentData }); // Render the edit page with student data
});

// Route to handle form submission and update student data
app.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { rollNo, Name, degree, city } = req.body;
    await student.findByIdAndUpdate(id, { rollNo, Name, degree, city });
    res.redirect('/'); // Redirect back to the index page after updating
});

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await student.findByIdAndDelete(id);
    res.redirect('/');
});

app.listen(PORT,()=>{console.log(`server is Running on PORT : ${PORT}`)})
