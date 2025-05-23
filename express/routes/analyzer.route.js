const express = require("express");
const fs = require("fs");
const path = require("path");
const OSS = require("ali-oss");
const router = express.Router();
const OpenAI = require("openai");
const pdfParse = require("pdf-parse");

// Configure your OSS client
const client = new OSS({
  region: process.env.ALI_OSS_REGION,
  accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET,
  bucket: process.env.ALI_OSS_BUCKET,
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // 'uploads/' is the folder to store files

router.post("/test", async (req, res) => {
  try {
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tenQuestions", async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const generateRatingQuestions = async (jobDescription) => {
      try {
        console.log("jobDescription", jobDescription);
        const openai = new OpenAI({
          apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "",
          baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
        });

        const completion = await openai.chat.completions.create({
          model: "qwen-plus",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: `Job Description:${jobDescription}
                Based on this job description, can you generate 10 rating-scale questions (scored 1–10) that I can use to compare a candidate's resume to the role requirements? Please return the questions as an array of strings. Do not add any additional explanation or text.
                For example:
                [
                "Rate the candidate's mathematical, statistical, or data science background (1–10).",
                "How strong is the candidate's experience with Large Language Models (LLMs) and prompt engineering techniques? (1–10)",
                "Evaluate the candidate's demonstrated knowledge of Generative AI (GenAI) technologies and frameworks (1–10).",
                "Assess the candidate's ability to design, develop, and optimize high-quality prompts for GenAI applications (1–10).",
                "Rate the candidate's experience in systematically evaluating prompts or LLMs across different use cases (1–10).",
                "How well does the resume indicate implementation experience with LLM agents or Retrieval-Augmented Generation (RAG)? (1–10)",
                "Rate the candidate's collaboration experience with Data Scientists and Machine Learning Engineers on AI projects (1–10).",
                "Evaluate whether the candidate has proposed or researched methodologies that leverage GenAI for business impact (1–10).",
                "Assess the candidate's proficiency in Python and coding practices specific to GenAI, including prompt libraries and template reusability (1–10).",
                "Rate the candidate's ability to communicate GenAI capabilities, strengths, and weaknesses to stakeholders (1–10)."
                ]`,
            },
          ],
        });
        const questions = JSON.parse(completion.choices[0].message.content);
        return questions;
      } catch (error) {
        console.log(`Error message: ${error}`);
        console.log(
          "For more information, see: https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code"
        );
        throw error;
      }
    };
    res.json(await generateRatingQuestions(jobDescription));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upskill", async (req, res) => {
  const { questions, score } = req.body;

  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "",
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Given a list of questions and a list of scores, provide me 3 coursera courses (name and the link) that can help the candidate improve their skills. The scores are based on the questions, where 1 indicates the lowest level of competence or experience, and 10 indicates the highest level.
            
          Questions:

            ${questions}

            Scores:

            ${score}

            Provide 
            only an array of courses, like this example:
            [
              {
                "name": "Course 1",
                "link": "https://www.coursera.org/course1"
              },
              {
                "name": "Course 2",
                "link": "https://www.coursera.org/course2"
              },
              {
                "name": "Course 3",
                "link": "https://www.coursera.org/course3"
              }
            ]`,
        },
      ],
    });

    // Parse the response content as JSON
    const scores = JSON.parse(completion.choices[0].message.content);
    res.json(scores);
  } catch (error) {
    console.log(`Error message: ${error}`);
    console.log(
      "For more information, see: https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code"
    );
    throw error; // Re-throw the error so the caller can handle it if needed
  }
});



router.post("/generate", async (req, res) => {
  const { resume, questions } = req.body;

  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "",
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    });

    const questionsString = questions.join("\n");

    const completion = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Given a resume and a list of questions, evaluate the candidate based on the information provided in the resume. Return an array of numerical scores (1-10) corresponding to each question, where 1 indicates the lowest level of competence or experience, and 10 indicates the highest level.

            Resume:

            ${resume}

            Questions:

            ${questionsString}

            Provide only an array of scores, like this example:
            [8,7,7,6,6,5,7,6,8,6]`,
        },
      ],
    });

    // Parse the response content as JSON
    const scores = JSON.parse(completion.choices[0].message.content);
    res.json(scores);
  } catch (error) {
    console.log(`Error message: ${error}`);
    console.log(
      "For more information, see: https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code"
    );
    throw error; // Re-throw the error so the caller can handle it if needed
  }
});


router.post("/summarize", async (req, res) => {
  const { description } = req.body;

  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "",
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Given a job description from a job post, summarize it. Job description: ${description}`
        },
      ],
    });

    // Parse the response content as JSON
    const scores = JSON.parse(completion.choices[0].message.content);
    console.log("scores", scores);  
    res.json(completion);
  } catch (error) {
    console.log(`Error message: ${error}`);
    console.log(
      "For more information, see: https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code"
    );
    throw error; // Re-throw the error so the caller can handle it if needed
  }
});


router.post("/upload/:username", upload.single("file"), async (req, res) => {
  const username = req.params.username;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to OSS
    const ossPath = `${username}/${req.file.originalname}`;
    const result = await client.put(ossPath, req.file.path);

    // Read the uploaded PDF file
    const dataBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);

    // Optionally delete the local file after upload
    fs.unlinkSync(req.file.path);

    res.json({
      message: "File uploaded to OSS!",
      url: result.url,
      file: req.file,
      pdfData: pdfData.text,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
