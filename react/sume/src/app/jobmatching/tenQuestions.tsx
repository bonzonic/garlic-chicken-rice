import { Box, CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";

type TenQuestionsProps = {
  score: number[];
  setScore: React.Dispatch<React.SetStateAction<number[]>>;
  jobDescription: string;
};

interface Course {
  name: string;
  link: string;
}

const TenQuestions = ({
  score,
  setScore,
  jobDescription,
}: TenQuestionsProps) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [coursera, setCoursera] = useState<Course[]>([]);
  const [courseraLoading, setCourseraLoading] = useState(false);

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
          throw new Error("Error fetching data: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Questions received:", data);
        setQuestions(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [jobDescription]);

  useEffect(() => {
    if (questions.length === 0) return;

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
          throw new Error("Error fetching data: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Scores received:", data);
        setScore(data);
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  }, [questions]);

  useEffect(() => {
    if (score.length === 0 || questions.length === 0) return;
    
    setCourseraLoading(true);
    fetch(`http://localhost:8080/api/analyzer/upskill`, {
      method: "POST",
      body: JSON.stringify({ questions: questions, score: score }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching course data: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Coursera courses received:", data);
        setCoursera(data);
      })
      .catch((error) => console.error("Error fetching courses:", error))
      .finally(() => setCourseraLoading(false));
  }, [score, questions]);

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
                <div className="bg-gray-800 shadow-2xl rounded-3xl p-8 w-1/2 mt-4 flex flex-col">
                  <h2 className="font-bold text-xl">{question}</h2>
                </div>
                <div className="bg-gray-800 shadow-2xl rounded-3xl p-8 w-1/2 mt-4 flex flex-col">
                  <h2 className="font-bold text-xl">{score[index]}</h2>
                </div>
              </div>
            ))}
          
          <div className="bg-gray-800 shadow-2xl rounded-3xl p-8 w-full mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Recommended Courses</h2>
            {courseraLoading && <CircularProgress color="inherit" size={24} />}
            {!courseraLoading && coursera.length > 0 ? (
              <ul className="space-y-4">
                {coursera.map((course, index) => (
                  <li key={index} className="bg-gray-700 p-4 rounded-lg">
                    <a 
                      href={course.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 text-lg font-medium hover:underline"
                    >
                      {course.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              !courseraLoading && <p className="text-gray-400">No course recommendations available yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenQuestions;