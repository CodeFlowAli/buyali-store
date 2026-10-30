import "./Loader.css";

function Loader() {
  return (
    <div className="global-loader">
      <div className="loader-circle"></div>
      <p>Loading<span>...</span></p>
    </div>
  );
}

export default Loader;