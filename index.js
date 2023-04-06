
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const {Configuration, OpenAIApi} = require('openai')
require('dotenv').config();

const API_KEY = process.env.OPENAI_API_KEY
const PORT = process.env.PORT || 3001
const COR_URL = process.env.COR_URL
  

const config = new Configuration({
    apiKey: API_KEY
})
const openai = new OpenAIApi(config)
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: COR_URL
  }));

app.post('/chat', async (req,res) =>{
    const {name,
        portfolio,
        yearsOfExperience,
        jobTitle,
        jobDescription,
        skills
    } = req.body;
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        max_tokens: 1024,
        temperature:0,
        prompt: `
        
        Given the following information, please generate a job proposal for ${name}:
  
        - Portfolio: ${portfolio}
        - Years of experience: ${yearsOfExperience}
        - Job title: ${jobTitle}
        - Job description: ${jobDescription}
        - skill: ${skills}
  
        The job proposal should be written in a professional tone and highlight the candidate's skills and experience. Use the following formula:
  
        1- Greetings——————

            For example, To whom it may concern, Hello!,——————– 
        2- Restating Employer Project———————

        I understand you are looking for supplements/dietary/vitamin logo design. I also understand that you have an in house graphic designer so you expect top quality logo design from the selected freelancer.———————
        3- Introduce yourself———————

        I own a small design agency and have been doing creative designing for US businesses since 1999. My profile here on (marketplace website name) speaks volumes about my service and commitment to my clients.———————-
        4- What can "I" do for the employer?———————-

        I can create a state of art, eye catchy logo design within 3 business days. I offer unlimited revisions, rest assured you will get all source code that is editable, and printable. I will also provide unlimited revisions of the logo till you are 100% satisfied.———————
        5- Portfolio——————-

        You can watch my diversified portfolio at (Link)
        6- Ask a question related to the job——————-

        analyze the job description and ask a question related to job if you cant find any skip it
        7- Bid Closing——————-

        Looking forward to your response and doing business with you.
        
        ------
        GENERATED PROPOSAL:
      `

    })
    res.send(completion.data.choices[0].text);
})
const port = PORT
app.listen(port,() => {
  console.log(`server listening on port ${port}`)
})
