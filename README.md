# garlic-chicken-rice

## Alibaba Technologies Used:
1. Gwen -> Determine whether the job is suitable for the user, and provides a scoring
2. Vector DB -> To find the suitable job for the user, according to their resume
3. OSS -> For storing the resumes uploaded by the user

## Setup
1. Run ```git clone https://github.com/bonzonic/garlic-chicken-rice.git ```
2. Run ```cd react``` and ```npm i``` followed by ```npm run dev``` to start up the frontend
3. Run ```cd express``` and ```npm i``` followed by ```node server.js``` to start up the backend

This will not work if there are no API keys in the ```.env``` file!

## Problem
- Candidates have trouble finding jobs that are relevant to them.
- Candidates getting rejected because the resume submitted to employers does not conform to the requirements set for the employer.

## Solution
1. Provide a job analyzer to identify if the job is suitable for this candidate
2. Intelligently search the jobs based on the user's submitted resume

## Future Enhancements
1. Provide learning materials or courses to allow the candidate to upskill and stand out from the crowd. This also provides an additional source of income for the application, where we can earn referral fees from the learning platforms.
2. Allow employers to sponsor jobs. Making their jobs show up more often in candidate's web page.

![image](https://github.com/user-attachments/assets/50a00394-8697-45e1-af0d-33b44687c1b5)
