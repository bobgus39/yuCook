import { useState } from "react";
import "./App.css";
import API_KEY from "./helpers/useEnv";
console.log(API_KEY);
function App() {
  const [message, setMessage] = useState("");
  const [img, setImg] = useState(null);
  //const [match, setMatch] = useState();
  const [title, setTitle] = useState("");
  const [reply, setReply] = useState("");

  //const API_KEY = "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";
  const handleSendMessage = async () => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "Hello, how can I help you today?" },
              {
                role: "user",
                content: `genera una receta con los siguientes ingredientes ${message}  `,
              }, // Your user message
            ],
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setReply(data.choices[0].message.content);

      const titleReq = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              { role: "system", content: "Hello, how can I help you today?" },
              {
                role: "user",
                content: `resume la receta en una frase de 50 caracteres como maximo :  ${message}  `,
              }, // Your user message
            ],
          }),
        }
      );

      const titleimg = await titleReq.json();

      setTitle(titleimg.choices[0].message.content);
      console.log(title);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateImg = async () => {
    try {
      if (title) {
        const image = await fetch(
          "https://api.openai.com/v1/images/generations",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt: title,
              n: 1,
              size: "1024x1024",
            }),
          }
        );
        const img_url = await image.json();

        setImg(img_url.data[0].url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h2>¿Con qué ingredientes vas a cocinar?</h2>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <button onClick={handleGenerateImg}>generate img</button>
      {!reply && <div>loading...</div>}
      {reply && <div>Bot: {reply}</div>}
      {img && <img src={img} alt="imagen de la receta"></img>}
    </div>
  );
}

export default App;

/*
function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const sendMessageToModel = async (message) => {
    try {
      const response = await Axios.post(
        "https://api.openai.com/v1/engines/davinci/completions",
        {
          prompt: message,
          max_tokens: 5000, // Ajusta según tus necesidades
        },
        {
          headers: {
            Authorization:
              "Bearer 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", // Reemplaza con tu clave de API
          },
        }
      );

      const botResponse = response.data.choices[0].text;
      // Actualiza el estado del componente con la respuesta del modelo
      console.log(botResponse);
      setResponse(botResponse);
      // Puedes mostrarlo en el área de mensajes
    } catch (error) {
      console.error("Error al enviar mensaje al modelo:", error);
    }
  };

  return (
    <>
      <label>Pregunta</label>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => sendMessageToModel(message)}>Preguntar</button>

      <div>
        <strong>Respuesta del bot:</strong>
        <p>{response}</p>
      </div>
    </>
  );
}

export default App;
*/
