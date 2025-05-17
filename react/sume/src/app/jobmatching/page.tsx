"use client"

import FilterListIcon from "@mui/icons-material/FilterList"; // <-- Add this import
import { useState, useEffect } from "react";
import JobCard from "./jobMatching";
import { TextField, Autocomplete, Chip, Button } from "@mui/material";
import { jobTypes, specialisation, states } from "./jobs";

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

  const handleApply = () => {
    console.log("hoe")
    fetch("http://localhost:8080/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "resumeText": "I like CS",
        "state": "Kuala Lumpur",
        "specialization": "Software Engineering",
        "jobType": " Full Time"
        // Add more fields as needed
      }),
    })
      .then((res) => res.json().matches)
      .then((data) => {
        console.log("Applied!", data);
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
    <div className="flex flex-col items-center justify-center h-full w-full">
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
      {jobs.length > 0 && currentJob ? (
        <div>
          <JobCard
            companyDetails={currentJob.companyDetails}
            jobTitle={currentJob.jobTitle}
            description={currentJob.description}
            url={currentJob.url}
            requirements={currentJob.requirements}
            onApprove={handleApprove}
            onNext={handleNext}
          />
          <button
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleApprove}
          >
            Apply
          </button>
        </div>
      ) : (
        <div class="h-full pt-10" > 
          <p>
            No filters applied.
          </p>
        </div>
      )}
    </div>
);
};

export default JobMatchingPage;