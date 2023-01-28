import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [technology, setTechnology] = useState("");
  const [result, setResult] = useState();
  const[loading,setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if(loading){
        return;
    }
    setLoading(true);  
    try {
      const response = await fetch("/api/interview-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ technology: technology }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setLoading(false);
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.replaceAll('\n', '<br />'));
      setLoading(false);
      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        
        <h3>Interview Questions !!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="technology"
            placeholder="Enter a technology"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
          />
          <input type="submit" value="Generate Questions" />
        </form>
        {loading && (
          <div>
            <h3>Looking for the best gift ideas 🎁 💡</h3>
            
          </div>
        )}
        <div
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        />       
      </main>
    </div>
  );
}
