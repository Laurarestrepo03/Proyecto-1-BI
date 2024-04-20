/* eslint-disable jsx-a11y/anchor-is-valid */
import './App.css';
import { Col, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { IoIosStar } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { LuInfo } from "react-icons/lu";

function App() {

  const [review, setReview] = useState("")
  const [predict, setPredict] = useState(false)
  const [stars, setStars] = useState(0)
  const [predictedReview, setPredictedReview] = useState("")
  const [showResults, setshowResults] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [keyWords, setKeyWords] = useState([])
 
  const handleReviewChange = ((e) => {
    setReview(e.target.value)
  });

  const handlePredict = ((e) => {
    if (review !== "") {
      setPredict(true)
      setShowLoading(true)
    }
    else {
      alert("Por favor llena el campo de texto")
    }
  });

  useEffect(() => {
    if (predict) {
        const PREDICT_URL = `https://fastapi-reviews-app.onrender.com/predict`;
        const WORDS_URL = `https://fastapi-reviews-app.onrender.com/words`;
        // Predict stars
        fetch(PREDICT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Review: review
        }),
        })
        .then(response => response.json())
        .then(data => {
          setPredict(false)
          console.log(data)
          setStars(data.prediction)
        })
        .catch(error => {
          console.error('Error fetching prediction:', error);
        });
        // Keywords
        fetch(WORDS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Review: review
          }),
          })
        .then(response => response.json())
        .then(data => {
          setShowLoading(false)
          console.log(data)
          setKeyWords(data.words)
          setPredictedReview(review)  
          setshowResults(true)
          setReview("")
        })
        .catch(error => {
          console.error('Error fetching words:', error);
        });
    }
  }, [predict, review]);

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  
  const makeBold = (text) => {
    const lowerCaseText = removeAccents(text.toLowerCase()); 
    const words = text.split(' ');
  
    const boldedText = words.map((word, index) => {
      const lowerCaseWord = removeAccents(word.toLowerCase()); 
      const isStartOfWord = keyWords.some(keyword => lowerCaseText.startsWith(removeAccents(keyword.toLowerCase()), lowerCaseText.indexOf(lowerCaseWord)));
      return isStartOfWord ? <strong key={index}>{word}</strong> : word;
    });
  
    return boldedText.reduce((prev, curr) => [prev, ' ', curr]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Turismo de los Alpes</h1>
      </header>
      <div className="Cols">
        <Col style={{marginLeft: "5vmin", marginTop: "3vmin"}}>
            <p>Con esta aplicación podrás predecir la calificación dada por usuarios en sus reseñas.</p>
            <p>Pasos: </p>
            <ol>
              <li>Ingresa una reseña en el campo de texto.</li>
              <li>Da click en el botón <strong>Predecir</strong>.</li>
              <li>¡Listo! Observa tus resultados a la derecha.</li>
            </ol>
            <h4>Reseña:</h4>
            <textarea value={review} onChange={handleReviewChange} className="form-control"></textarea>
            <div className="mt-3">
              <Button variant="primary" onClick={handlePredict}>Predecir</Button>
            </div>   
        </Col>
        <Col className="mt-3">
            {showLoading && (
              <div style={{textAlign: "center"}}>
                <img alt="loading" height="40" src="https://miro.medium.com/v2/resize:fit:679/1*ngNzwrRBDElDnf2CLF_Rbg.gif"></img>
              </div>
            )}
            {(showResults && !showLoading) && (
              <div className="mb-3" style={{marginRight:"3vmin"}}> 
                <h4 className="mb-2">Resultados:</h4>
                <div className="Flex-center mt-2">
                  <h5>Palabras clave:</h5>
                  <a  data-tooltip-id="info" 
                  data-tooltip-html="Las palabras resaltadas hacen referencia al top 300 <br/> de palabras clave del modelo de entrenamiento"> 
                    <LuInfo style={{ color:"#2196f3", marginLeft:"1vmin" }} ></LuInfo> 
                  </a>
                  <Tooltip id="info" place="right"></Tooltip>
                </div>
                <p className="mt-1">{makeBold(predictedReview)}</p>
                <h5 className="mt-2">Calificación:</h5>
                <div className="Flex-center mt-1">
                  {[...Array(5)].map((_, index) => (
                    <IoIosStar key={index} style={{ color: index < stars ? "gold" : "gray" }} size={30}/>
                  ))}
                  <strong className="Rating">{stars}/5</strong>
                </div>
              </div>
              )}
        </Col> 
      </div> 
    </div>
  );
}

export default App;
