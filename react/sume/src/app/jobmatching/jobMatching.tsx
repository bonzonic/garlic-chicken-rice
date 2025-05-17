import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

type JobCardProps = {
  companyDetails: string;
  jobTitle: string;
  description: string;
  requirements: string;
  url: string;
  onApprove: () => void;
  onNext: () => void;
};

const JobCard: React.FC<JobCardProps> = ({
  companyDetails,
  jobTitle,
  description,
  requirements,
  url,
  onApprove,
  onNext,
}) => {
  return (
    <Card
      sx={{
        margin: "auto",
        mt: 4,
        width: "800px",
        boxShadow: 3,
        backgroundColor: "#343d46",
        height: "80vh",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          <b> {jobTitle}</b>
        </Typography>
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          <b>Company Details</b>
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {companyDetails}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          <b> Job Description</b>
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="subtitle1" color="text.primary" gutterBottom>
          <b> Requirements</b>
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {requirements}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Button size="small" color="secondary" onClick={onNext}>
          Next Job
        </Button>
        <Button size="small" color="primary" onClick={onApprove}>
          Apply
        </Button>
      </CardActions>
      <CardContent sx={{ paddingBottom: "56px" }} />
    </Card>
  );
};

export default JobCard;
