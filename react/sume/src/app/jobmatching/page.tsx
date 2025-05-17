"use client"

import FilterListIcon from "@mui/icons-material/FilterList"; // <-- Add this import
import { useState, useEffect } from "react";
import JobCard from "./jobMatching";
import { TextField, Autocomplete, Chip, Button } from "@mui/material";
import { jobTypes, specialisation, states } from "./jobs";
import TenQuestions from "./tenQuestions";

const description_length = 200
const FilterComponent = ({
  stringArray,
  text,
}: {
  stringArray: string[];
  text: string;
}) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Autocomplete
      multiple
      id="fixed-tags-demo"
      value={value}
      onChange={(event, newValue) => {
        setValue((prev) => newValue);
      }}
      options={stringArray}
      renderValue={(values, getItemProps) =>
        values.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index });
          return (
            <Chip
              key={key}
              label={option}
              {...itemProps}
              disabled={stringArray.includes(option)}
            />
          );
        })
      }
      style={{ width: 400 }}
      renderInput={(params) => <TextField {...params} label={text} />}
    />
  );
};

interface Job {
  companyDetails: string;
  jobTitle: string;
  description: string;
  url: string;
  requirements: string;
}

const JobMatchingPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [applying, setApplying] = useState(false)
  const handleApply = () => {
    setJobs([])
    setApplying(true)
    const resumeText = localStorage.getItem("resume-text");
    fetch("http://localhost:8080/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "resumeText": resumeText,
        "state": null,
        "specialisation": null,
        "jobType": null
        // Add more fields as needed
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Applied!", data);
        setJobs(data.matches)
        setApplying(false)
        // Optionally show a success message
      })
      .catch((err) => console.error("Failed to apply for job:", err));
  };


  const handleApprove = () => {
    console.log("Approved!");
  };

  const handleNext = () => {
    setCurrentJobIndex((prev) => (prev + 1) % jobs.length);
    console.log("Next job!");
  };

  const currentJob = jobs[currentJobIndex];


  return (
    <div className="flex flex-col items-center justify-center w-full h-full">

      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <FilterComponent stringArray={specialisation} text="Specialisation" />
        <FilterComponent stringArray={states} text="State" />
        <FilterComponent stringArray={jobTypes} text="Job Type" />
        <Button
          variant="contained"
          color="primary"
          onClick={handleApply}
          sx={{ textTransform: "none" }}
          startIcon={<FilterListIcon />}
        >
          Apply Filter
        </Button>
      </div>



      {jobs.length > 0 && 
        <div className="h-full w-full my-10 max-w-[800px]">

          <JobCard
            companyDetails={currentJob.metadata.company}
            jobTitle={currentJob.metadata.title}
            description={
              currentJob.metadata.job_description.length > description_length
              ? currentJob.metadata.job_description.slice(0, description_length) + "..."
              : currentJob.metadata.job_description
            }
            url={currentJob.metadata.job_url}
            onApprove={handleApprove}
            onNext={handleNext}
          />
          <TenQuestions />
        </div>
      }
      {jobs.length == 0 && !applying &&
        <div class="h-full pt-10" > 
            <p>
              No jobs searched yet
            </p>
          </div>
      }
      {jobs.length == 0 && applying &&
        <div class="h-full pt-10" > 
            <p>
              Loading matching jobs...
            </p>
          </div>
      }
    </div>
);
};

export default JobMatchingPage;