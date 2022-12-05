import React from "react";
import { FaDollarSign, FaMoneyBill, FaTrash, FaEdit } from "react-icons/fa";
// import { useGlobalContext } from "./context";
import { useState, useEffect } from "react";

const getLocalStorage = () => {
  let expense = localStorage.getItem("expense");
  if (expense) {
    return JSON.parse(expense);
  } else {
    return [];
  }
};

const getBudget = () => {
  let budget = localStorage.getItem("budget");
  if (budget) {
    return JSON.parse(budget);
  } else {
    return 0;
  }
};

const Budget = ({ currency, showAlert }) => {
  // useStates
  const [budgetValue, setBudgetValue] = useState("");
  const [expenseDetails, setExpenseDetails] = useState("");
  const [expenseValue, setExpenseValue] = useState("");
  const [budget, setBudget] = useState(getBudget());
  const [expense, setExpense] = useState(getLocalStorage());
  const [exValue, setExValue] = useState(0);
  const [balance, setBalance] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  // end

  // submit functions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (budgetValue === "") {
      setBudget(0);
      showAlert(true, "danger", "enter budget");
    } else {
      setBudget(budgetValue);
      showAlert(true, "success", "budget added");
    }

    setBudgetValue("");
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!isEditing && expenseDetails && expenseValue) {
      const exItem = {
        id: new Date().getTime().toString(),
        expenseDetails,
        expenseValue,
      };
      showAlert(true, "success", "item added");
      setExpense([...expense, exItem]);
      setExpenseDetails("");
      setExpenseValue("");
    } else if (isEditing && expenseDetails && expenseValue) {
      setExpense(
        expense.map((item) => {
          if (item.id === editID) {
            return { ...item, expenseDetails, expenseValue };
          }
          return item;
        })
      );
      setEditID(null);
      setIsEditing(false);
      setExpenseDetails("");
      setExpenseValue("");
      showAlert(true, "success", "item edited");
    } else {
      showAlert(true, "danger", "enter a value");
    }
  };
  // end

  // delete function
  const handleDelete = (id) => {
    const filterItems = expense.filter((item) => item.id !== id);
    setExpense(filterItems);
    showAlert(true, "danger", "item deleted");
  };

  // useEffects

  useEffect(() => {
    const { totalEx, bal } = expense.reduce(
      (total, ex) => {
        const { expenseValue } = ex;

        total.totalEx += parseFloat(expenseValue);

        total.bal = parseFloat(budget) - total.totalEx;

        // console.log(total.totalEx);
        return total;
      },
      { totalEx: 0, bal: 0 }
    );
    setExValue(totalEx);
    setBalance(bal);
  }, [expense, budget]);

  useEffect(() => {
    localStorage.setItem("expense", JSON.stringify(expense));
  }, [expense]);

  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budget));
  }, [budget]);
  // end

  // clear function
  const clear = () => {
    setExpense([]);
    setBudget(0);
  };

  // edit function
  const editItem = (id) => {
    const currentItem = expense.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setExpenseDetails(currentItem.expenseDetails);
    setExpenseValue(currentItem.expenseValue);
  };

  return (
    <>
      <div className="input-container">
        {/* amount container */}
        <div className="amount-container">
          <form className="amount-form">
            <label htmlFor="amount">please enter your budget:</label>
            <input
              type="number"
              id="amount"
              placeholder="enter your amount"
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
            />
            <button type="submit" onClick={handleSubmit}>
              calculate
            </button>
          </form>
        </div>
        <div className="expense-container">
          <form className="expense-form">
            <div className="expense-detail-container">
              <label htmlFor="expense-detail">
                please enter your expense detail:
              </label>
              <input
                type="text"
                id="expense-detail"
                placeholder="enter your expense detail"
                value={expenseDetails}
                onChange={(e) => setExpenseDetails(e.target.value)}
              />
            </div>
            <div className="expense-amount-container">
              <label htmlFor="expense-amount">please enter your budget:</label>
              <input
                type="number"
                id="expense-amount"
                placeholder="enter your expense amount"
                value={expenseValue}
                onChange={(e) => setExpenseValue(e.target.value)}
              />
            </div>
            <button type="submit" onClick={handleExpenseSubmit}>
              add expense
            </button>
          </form>
        </div>
        {expense.length > 1 && (
          <button className="clear-btn" onClick={clear}>
            clear all
          </button>
        )}
      </div>
      <div className="display-container">
        <table className="budget-table">
          <tr>
            <td className="title">BUDGET</td>
            <td className="title">EXPENSE</td>
            <td className="title">BALANCE</td>
          </tr>
          <tr>
            <td className="icon">
              <FaDollarSign />
            </td>
            <td className="icon">
              <FaMoneyBill />
            </td>
            <td className="icon">
              <FaDollarSign />
            </td>
          </tr>
          <tr className="number">
            <td>
              {currency} {budget}
            </td>
            <td>
              {currency} {exValue}
            </td>
            <td>
              {currency} {balance}
            </td>
          </tr>
        </table>
        <div className="overflow">
          <table className="expense-table">
            <tr className="first">
              <td className="expense-title">expense title</td>
              <td className="expense-title">expense amount</td>
              <td className="expense-title" style={{ visibility: "hidden" }}>
                hello world
              </td>
            </tr>
            {expense.map((item, index) => {
              const { id, expenseDetails, expenseValue } = item;
              return (
                <tr className="next" key={index}>
                  <td>{expenseDetails}</td>
                  <td>
                    {currency} {expenseValue}
                  </td>
                  <td>
                    <button onClick={() => editItem(id)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </>
  );
};

export default Budget;
