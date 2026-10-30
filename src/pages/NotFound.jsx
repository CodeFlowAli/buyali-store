import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  useEffect(() => {
    document.title = "404 - Page Not Found | BuyAli";

    const setMeta = (name, content) => {
      let element = document.querySelector(
        `meta[name="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.appendChild(element);
      }

      element.content = content;
    };

    setMeta(
      "description",
      "The page you are looking for could not be found. Visit BuyAli to explore our products and shop online."
    );

    setMeta("robots", "noindex, follow");

    return () => {
      // No additional cleanup required.
    };
  }, []);

  return (
    <main className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>

      <Link to="/">Back to Home</Link>
    </main>
  );
}

export default NotFound;