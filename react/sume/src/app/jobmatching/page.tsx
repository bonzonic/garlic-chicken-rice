"use client";

import JobCard from "./jobMatching";
import { TextField, Autocomplete, Chip } from "@mui/material";
import { jobTypes, specialisation, states } from "./jobs";
import { useState } from "react";
import TenQuestions from "./tenQuestions";

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
      style={{ width: 500 }}
      renderInput={(params) => <TextField {...params} label={text} />}
    />
  );
};

interface Job {
  title: string;
  description: string;
  url: string;
}

const JobMatchingPage = () => {
  const handleApprove = () => {
    console.log("Approved!");
  };

  const handleNext = () => {
    console.log("Next job!");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-ufll w-full mb-10">
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <FilterComponent stringArray={specialisation} text="Specialisation" />
          <FilterComponent stringArray={states} text="State" />
          <FilterComponent stringArray={jobTypes} text="Job Type" />
        </div>
        <JobCard
          companyDetails="meow"
          jobTitle="Frontend Developer"
          description="Work with React and TypeScript to build UI components."
          url="https://example.com/job/frontend-developer"
          requirements="help"
          onApprove={handleApprove}
          onNext={handleNext}
        />
      </div>
      <TenQuestions />
    </>
  );
};

export default JobMatchingPage;
