import { use, useEffect, useState } from "react";

const TenQuestions = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [score, setScore] = useState<number[]>([]);

  useEffect(() => {
    console.log("Generating rating questions...");
    const jobDescription = `A typical McDonald's Crew Member job involves greeting customers, taking orders, preparing food, maintaining cleanliness, and ensuring the restaurant is well-stocked. Other responsibilities include serving customers efficiently, assisting with training new hires, and working as part of a team to meet sales goals. 
Key Responsibilities:
Customer Service: Greet customers with a smile, take accurate orders, and provide fast and friendly service. 
Food Preparation: Prepare various McDonald's food items according to standards, ensuring quality and consistency. 
Restaurant Cleanliness: Maintain a clean and organized restaurant, including cleaning work areas, restrooms, and dining areas. 
Inventory Management: Stock and manage inventory of food and supplies. 
Teamwork: Partner with other crew members and managers to meet shift goals and ensure smooth operations. 
Training: May assist in training new crew members and share knowledge. 
Sales Goals: Work within a team to achieve sales targets. 
Customer Experience: Ensure a positive and enjoyable dining experience for customers. `;

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
  }, []);

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
  }, [questions]);

  return (
    <div className="flex flex-col p-6 justify-center items-center bg-gray-900 w-full text-white">
      <h4 className="text-4xl">How do we get the scoring?</h4>
      <p className="text-lg text-gray-300 mt-4">
        We generate 10 questions to get a better understanding of the job. Based
        on your resume, we will provide you with a score that reflects your fit
        for the job. We then average the scores and provide you with a final
        score out of 10.
      </p>
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
    </div>
  );
};

export default TenQuestions;
