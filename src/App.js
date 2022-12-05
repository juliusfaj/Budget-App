import React from "react";
import { useState, useEffect } from "react";
import Budget from "./budget";
import Alert from "./alert";
// import { useGlobalContext } from "./context";

const getCurrency = () => {
  let getCurr = localStorage.getItem("currency");
  if (getCurr) {
    return getCurr;
  } else {
    getCurr = "$";
    return getCurr;
  }
};

const App = () => {
  const [currency, SetCurrency] = useState(getCurrency());
  const [val, setVal] = useState("$");

  const [alert, setAlert] = useState({
    status: false,
    type: "success",
    message: "item added",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    SetCurrency(val);
  };

  const showAlert = (status = false, type = "", message = "") => {
    setAlert({ status, type, message });
  };

  useEffect(() => {
    const setCurr = localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <>
      <h1 className="page-title">budget app</h1>
      <section className="section-center">
        <article className="budget-app">
          {alert.status && <Alert {...alert} showAlert={showAlert} />}
          <div className="currency">
            <form className="currency-form">
              <select
                name="currency"
                id="currency"
                value={val}
                onChange={(e) => setVal(e.target.value)}
              >
                <option value="$">$ dollar</option>
                <option value="#"># naira</option>
                <option value="€">€ euro</option>
                <option value="£">£ pound</option>
                <option value="¥">¥ yen</option>
              </select>
              <button type="submit" onClick={handleSubmit}>
                enter
              </button>
            </form>
          </div>
          <div className="budget-container">
            <Budget currency={currency} showAlert={showAlert} />
          </div>
        </article>
      </section>
      <p className="footer">@ funnso julius {new Date().getFullYear()}</p>
    </>
  );
};

export default App;
