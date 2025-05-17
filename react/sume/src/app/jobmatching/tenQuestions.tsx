import { Box, CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";

type TenQuestionsProps = {
  score: number[]; // Replace 'any' with a more specific type if possible
  setScore: React.Dispatch<React.SetStateAction<number[]>>; // Replace 'any' with a more specific type if possible
  jobDescription: string;
};

const TenQuestions = ({
  score,
  setScore,
  jobDescription,
}: TenQuestionsProps) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log("Generating rating questions...");
    fetch(`http://localhost:8080/api/analyzer/tenQuestions`, {
      method: "POST",
      body: JSON.stringify({ jobDescription: jobDescription }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error fetching data:", response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        console.log("Parsed data:", data);
        setQuestions(data);
      });
  }, [jobDescription]);

  useEffect(() => {
    const resume = localStorage.getItem("resume-text");
    fetch(`http://localhost:8080/api/analyzer/generate`, {
      method: "POST",
      body: JSON.stringify({ resume: resume, questions: questions }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error fetching data:", response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        console.log("Parsed data:", data);
        setScore(data);
      });
    console.log("Score:", score);
    setLoading(false);
  }, [questions]);

  return (
    <div className="flex flex-col p-6 justify-center items-center bg-gray-900 w-full text-white">
      <h4 className="text-4xl">How do we get the score?</h4>
      <p className="text-lg text-gray-300 mt-4">
        We generate 10 questions to get a better understanding of the job. Based
        on your resume, we will provide you with a score that reflects your fit
        for the job. We then average the scores and provide you with a final
        score out of 10.
      </p>
      {loading && <CircularProgress color="inherit" />}
      {!loading && (
        <div className="flex flex-col mt-8 w-full">
          {score.length === questions.length &&
            questions.map((question, index) => (
              <div key={index} className="flex flex-row gap-4">
                <div className="bg-gray-800 shadow-2xl rounded-3xl p-8 w-1/2  mt-4 flex flex-col">
                  <h2 className="font-bold text-xl">{question}</h2>
                </div>
                <div className="bg-gray-800 shadow-2xl rounded-3xl p-8 w-1/2 mt-4 flex flex-col">
                  <h2 className="font-bold text-xl">{score[index]}</h2>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TenQuestions;
