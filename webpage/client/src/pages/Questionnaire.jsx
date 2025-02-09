/* eslint-disable no-undef */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import questions from "../assets/questions";

export default function Questionnaire() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});

  const onSubmit = async () => {
    try {
      const { data } = await axios.post("/preferences", { responses });
      if (data.error) {
        toast.error(data.error);
      } else {
        setResponses({});
        toast.success("Responses submitted!");
        navigate("/dashboard");
        
        // Communicate with extension
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          chrome.runtime.sendMessage(
            "obhfnegefpkpoicjhfafbibcocbakkoo",
            { 
              type: "QUESTIONNAIRE_COMPLETE",
              preferences: responses 
            },
            (response) => {
              console.log(response);
              if (response.status === "success") {
                navigate("/dashboard");
                // chrome.runtime.sendMessage(
                //   "obhfnegefpkpoicjhfafbibcocbakkoo",
                //   { type: "CLOSE_TAB" },
                //   (closeResponse) => {
                //     console.log(closeResponse);
                //   }
                // );
              }
            }
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setResponses(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          [value]: checked
        }
      }));
    } else {
      setResponses((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextQuestion = () => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.required && !isAnswered(currentQ)) {
      toast.error("This field is required");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onSubmit(responses);
    }
  };

  const isAnswered = (question) => {
    const response = responses[question.id];
    
    if (!response) return false;
    
    switch (question.type) {
      case 'checkbox':
        // At least one checkbox should be selected
        return Object.values(response).some(value => value === true);
      case 'text':
        return response.trim() !== '';
      case 'number':
        return response !== '' && !isNaN(response);
      case 'radio':
        return response !== undefined;
      default:
        return false;
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div>
      <h2>Questionnaire</h2>
      <p>
        {questions[currentQuestion].text}
        {questions[currentQuestion].required && <span style={{color: 'red'}}> *</span>}
      </p>
      {questions[currentQuestion].type === "radio" ? (
        questions[currentQuestion].options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={questions[currentQuestion].id}
              value={option}
              checked={responses[questions[currentQuestion].id] === option}
              onChange={handleChange}
            />
            {option}
          </label>
        ))
      ) : questions[currentQuestion].type === "checkbox" ? (
        questions[currentQuestion].options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              name={questions[currentQuestion].id}
              value={option}
              checked={responses[questions[currentQuestion].id]?.[option] || false}
              onChange={handleChange}
            />
            {option}
          </label>
        ))
      ) : (
        <input
          type={questions[currentQuestion].type}
          name={questions[currentQuestion].id}
          value={responses[questions[currentQuestion].id] || ""}
          onChange={handleChange}
        ></input>
      )}
      <button onClick={prevQuestion} disabled={currentQuestion === 0}>
        Back
      </button>
      <button onClick={nextQuestion}>
        {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
}
