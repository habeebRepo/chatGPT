import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [priceMin, setPriceMin] = useState(25);
  const [priceMax, setPriceMax] = useState(100);
  const [product, setProduct] = useState("");
  const [result, setResult] = useState();

  const[loading,setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if(loading){
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/product-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceMin, priceMax, product }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setLoading(false);
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data.result);
      setResult(data.result.replaceAll('\n', '<br />'));
      setLoading(false);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>ChatGPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Gifts</h3>
        <form onSubmit={onSubmit}>
          

        <label>Products</label>
          <input
            type="text"
            name="products"
            placeholder="Enter the product you want to search"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />

          <label>Price from</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Enter the minimum price"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Price to</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Enter the maximum price"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          
          <input type="submit" value="Generate Products" />
        </form>
        <div
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        />
        {loading && (
          <div>
            <h3>Looking for the best products 💡</h3>
            
          </div>
        )}
      </main>
    </div>
  );
}
