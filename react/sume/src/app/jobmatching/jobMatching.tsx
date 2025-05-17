import React from "react";

type JobCardProps = {
  companyDetails: string;
  jobTitle: string;
  description: string;
  url: string;
  onNext: () => void;
  score: number;
};

const JobCard: React.FC<JobCardProps> = ({
  companyDetails,
  jobTitle,
  description,
  url,
  score,
  onNext,
}) => {
  const filteredScore = score ? score : 0;

  return (
    <div className="bg-gray-900 shadow-2xl rounded-3xl px-8 pt-8 w-11/12 m-auto mt-4 flex flex-col">
      <div className="mb-4">
        <div className="flex flex-row justify-between gap-2 mb-4">
          <div>
            <h2 className="font-bold text-xl">{jobTitle}</h2>
            <div className="text-gray-300 mb-2 text-sm">{companyDetails}</div>
          </div>
          <div>
            <h2 className="font-bold text-xl">Score</h2>
            <div className="text-gray-300 mb-2 text-sm">
              {filteredScore} Out of 10
            </div>
          </div>
        </div>
        <hr className="border-gray-700 border-1 mb-4" />
        <div className="mb-4 text-gray-300">{description}</div>
        <div className="mb-4 text-gray-300"></div>
      </div>
      <div className="mt-auto flex flex-col">
        <div className="flex flex-row gap-2 mt-4 p-2 justify-between w-full">
          <button
            className="flex flex-row p-2 gap-2 w-full hover:bg-gray-800 hover:rounded-lg"
            onClick={onNext}
          >
            <a
              target="_blank"
              className="flex flex-row items-center p-2 gap-2 grow justify-center hover:cursor-pointer"
            >
              <p>Next Job</p>
            </a>
          </button>
          <hr className="border-gray-700 border-1 mx-2 my-auto h-8 self-stretch rotate-0 w-px" />
          <button className="flex flex-row p-2 gap-2 w-full hover:bg-gray-800 hover:rounded-lg">
            <a
              target="_blank"
              href={url}
              className="flex flex-row items-center p-2 gap-2 grow justify-center"
            >
              <p>Apply Now</p>
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
