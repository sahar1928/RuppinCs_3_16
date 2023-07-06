import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { JobContext } from "../../Context/JobContext";
import {skills} from "../../Data/JobsData"
import {URL} from "../../Data/URL"
import AccordionSection from "./AccordionSection";
import CompanyLocation from "../Location/CompanyLocation";
import { toast } from "react-toastify";

const SingleJobDetails = () => {
  const { job } = useContext(JobContext);
  const [currentJob, setCurrentJob] = useState(null);
  const [topCandidate, setTopCandidate] = useState(null);
  const [base64Photo, setBase64Photo] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const navigate = useNavigate();

  const fetchPhotoData = async (logo) => {
    if (logo) {
      const base64String = logo;
      const byteCharacters = atob(base64String);
      const byteArray = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const mimeTypeFunc = determineMimeType(byteArray);
      setMimeType(mimeTypeFunc);
      const base64 = btoa(String.fromCharCode(...byteArray));
      setBase64Photo(base64);
    }
  };

  const determineMimeType = (byteArray) => {
    const signature = byteArray
      .slice(0, 4)
      .map((byte) => byte.toString(16))
      .join("")
      .toUpperCase();
    if (signature === "89504E47") {
      return "image/png";
    } else if (signature === "FFD8FFDB" || signature === "FFD8FFE0") {
      return "image/jpeg";
    } else {
      // Default to JPEG if the signature doesn't match PNG or JPEG
      return "image/jpeg";
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      setCurrentJob(job);
      console.log(job);
  
      try {
        const response = await fetch(URL + `Match/MatchTopCandidatesToJob/${job.Id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to match candidates");
        }
  
        const data = await response.json();
        setTopCandidate(data);
        console.log(data);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };
  
    fetchJob();
  }, [job]);
  

  if (!currentJob) {
    return <div>Loading...</div>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <button className="back-button" onClick={handleGoBack}>
          X
        </button>
      <div className="jm-job-wrap pt-100 pb-60">
        <div className="row">
          <div className="col-xl-8 col-lg-8">
            <div className="jm-job-content-wrapp">
                <img
                      src={`data:image/jpeg;base64,${job.Company.Logo}`}
                      alt="Company Logo"
                    />
              <div className="jm-job-content-title-wrapper mb-35">
                <div className="jm-job-content-title-text-wrapp">
                  <div className="jm-job-content-title-text">
                    <div className="jm-job-content-title-img">
                      <img src="assets/img/job/meta.png" alt="img" />
                    </div>
                    <div className="jm-job-content-title-bottom">
                      <h4 className="jm-job-content-title">
                        {currentJob.JobTitle}
                      </h4>
                      <span className="jm-job-content-title-meta">
                        <i className="fa-thin fa-user"></i>{" "}
                        {currentJob.Vacancies || 0} Vacancies
                      </span>
                      <span className="jm-job-content-title-rating">
                        <span className="jm-job-rating-text">{5}</span>
                      </span>
                    </div>
                  </div>

                  <div className="jm-job-content-title-favour-icon">
                    <Link to="#">
                      <i className="fa-thin fa-heart"></i>
                    </Link>
                    <Link to="#">
                      <i className="fa-thin fa-gear"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="jm-job-content-bottom-info-wrapper mb-25">
                <div className="jm-job-content-bottom-info-single">
                  <label>Employee Type :</label>
                  <span>{currentJob.JobCategory}</span>
                </div>
                <div className="jm-job-content-bottom-info-single">
                  <label>Position :</label>
                  <span>{currentJob.JobType}</span>
                </div>
                <div className="jm-job-content-bottom-info-single">
                  <label>Offer Salary :</label>
                  <span>{currentJob.ExpectedSalary}</span>
                </div>
              </div>

              <div className="jm-job-content-informations-wrapper ">
                <AccordionSection />
                <div className="row align-items-center mb-15">
                  <div className="col-xl-7 col-lg-7 col-md-7">
                    <div className="jm-job-content-info-skill-meta text-center text-md-start mb-15">
                      {currentJob.SkillAndExperience && 
                        currentJob.SkillAndExperience.map((skill) => (
                          <React.Fragment key={skill.Id}>
                            <li><i className="fa-thin fa-check"></i> Understanding of key Design Principal.</li>
                            <span>{skills[skill.Skill].name}</span>
                            <label> Experience :</label>
                            <span>{skill.Years}</span>
                          </React.Fragment>
                        ))}
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-5 col-md-5">
                    <div className="jm-job-content-share text-center text-md-end mb-15">
                      <label>Share :</label>
                      <Link to="#">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                      <Link to="#">
                        <i className="fa-brands fa-twitter"></i>
                      </Link>
                      <Link to="#">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </Link>
                      <Link to="#">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4">
            <div className="jm-job-sidebar ml-40">
              <div className="jm-job-sidebar-widget mb-40">
                <div className="jm-job-sidebar-inner">
                  <h3 className="jm-job-sidebar-widget-title">Job Overview</h3>
                </div>
                <div className="jm-job-sidebar-inner-content">
                  <ul className="jm-job-sidebar-review-list mb-15">
                    <li>
                      <i className="fa-thin fa-house-blank"></i>{" "}
                      <span className="jm-job-review-label">Title :</span>{" "}
                      {currentJob.JobTitle}
                    </li>
                    <li>
                      <i className="fa-thin fa-location-crosshairs"></i>{" "}
                      <span className="jm-job-review-label">Location :</span>{" "}
                      {currentJob.Location}
                    </li>
                    <li>
                      <i className="fa-thin fa-sack-dollar"></i>{" "}
                      <span className="jm-job-review-label">Salary:</span>{" "}
                      {currentJob.ExpectedSalary}
                    </li>
                    <li>
                      <i className="fa-thin fa-graduation-cap"></i>{" "}
                      <span className="jm-job-review-label">
                        Email :
                      </span>{" "}
                      {currentJob.EmailUrl}
                    </li>
                    <li>
                      <i className="fa-thin fa-building"></i>{" "}
                      <span className="jm-job-review-label">Industry :</span>{" "}
                      {currentJob.JobCategory}
                    </li>
                  </ul>
                  <div className="jm-job-sidebar-overview-buttons">
                    <Link to="/postJobPage" className="jm-job-overview-btn">
                      Apply Now <i className="fa-thin fa-arrow-right-long"></i>
                    </Link>
                    <Link to="#" className="jm-job-overview-btn job-bookmark">
                      <i className="fa-thin fa-bookmark"></i> Add Bookmark
                    </Link>
                  </div>
                </div>
              </div>
              <div className="jm-job-sidebar-widget mb-40">
                <div className="jm-job-sidebar-inner">
                  <h3 className="jm-job-sidebar-widget-title">Job Location</h3>
                </div>
                <CompanyLocation selectedCity={currentJob.Location} />
              </div>
            </div>
          </div>
        </div>
        <button className="back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SingleJobDetails;
