import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Science, Biotech, PsychologyAlt } from "@mui/icons-material";

const LoadingAnimation = () => {
  const [currentSubject, setCurrentSubject] = useState("physics");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const subjects = {
    physics: { icon: Science },
    chemistry: { icon: Biotech },
    math: { icon: PsychologyAlt },
  };

  const SubjectIcon = subjects[currentSubject].icon;

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(progressTimer);
          return 100;
        }
      });
    }, 50);

    const subjectTimer = setInterval(() => {
      setCurrentSubject((prevSubject) => {
        const subjectKeys = Object.keys(subjects);
        const nextSubjectIndex =
          (subjectKeys.indexOf(prevSubject) + 1) % subjectKeys.length;
        return subjectKeys[nextSubjectIndex];
      });
    }, 3000); // Change subject every 3 seconds

    return () => {
      clearInterval(progressTimer);
      clearInterval(subjectTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-4xl font-bold mb-4">Edugainer</div>
      <div className="text-xl mb-8">Empowering Education</div>
      <div className="w-64 mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-blue-700 dark:text-white">
            {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)}
          </span>
          <span className="text-sm font-medium text-blue-700 dark:text-white">{`${Math.round(
            loadingProgress
          )}%`}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      </div>
      <SubjectIcon className="w-12 h-12 text-blue-600" />
    </div>
  );
};

export default LoadingAnimation;
