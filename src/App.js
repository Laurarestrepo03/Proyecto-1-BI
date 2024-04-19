import './App.css';
import { Col, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { IoIosStar } from "react-icons/io";

function App() {

  const [review, setReview] = useState("")
  const [predict, setPredict] = useState(false)
  const [stars, setStars] = useState(0)
  const [predictedReview, setPredictedReview] = useState("")
  const [showResults, setshowResults] = useState(false)

  const handleReviewChange = ((e) => {
    setReview(e.target.value)
  });

  const handlePredict = ((e) => {
    if (review !== "") {
      setPredict(true)
    }
  });

  useEffect(() => {
    if (predict) {
        const URL = `https://jsonplaceholder.typicode.com/posts`;
        fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
          "Review": review
        }),
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setPredict(false)
          setshowResults(true)
          setPredictedReview(review)
          setReview("")
          setStars(Math.floor(Math.random() * 5) + 1) // FIX: set stars to data
        })
    }
  }, [predict, review]);

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
              <li>Da click en el botón <strong>Predecir</strong></li>
              <li>¡Listo! Observa rus resultados a la derecha</li>
            </ol>
            <h4>Reseña:</h4>
            <textarea value={review} onChange={handleReviewChange} class="form-control" 
                      style={{resize:"none", width:"90vmin", height:"20vmin"}}></textarea>
            <div style={{marginTop: "3vmin"}}>
              <Button variant="primary" onClick={handlePredict}>Predecir</Button>
            </div>   
        </Col>
        <Col style={{marginTop: "3vmin"}}>
            {showResults && (
              <div style={{marginBottom:"3vmin"}}> 
                <h4>Resultados:</h4>
                <h5 style={{color:"gray", marginTop:"2vmin"}}>Palabras clave:</h5>
                <p>{predictedReview}</p>
                <h5 style={{color:"gray", marginTop:"3vmin"}}>Calificación:</h5>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                  {[...Array(5)].map((_, index) => (
                    <IoIosStar key={index} style={{ color: index < stars ? 'gold' : 'gray' }} size={30}/>
                  ))}
                  <strong style={{marginLeft:"2vmin", fontSize:"3vmin"}}>{stars}/5</strong>
                </div>
              </div>
              )
            }
        </Col> 
      </div> 
    </div>
  );
}

export default App;
