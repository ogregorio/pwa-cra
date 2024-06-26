import './App.css';
import React, { useState } from 'react';
import { getExchangeRate } from './services/exchangeService';

const App = () => {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('BRL');
  const [currencyTo, setCurrencyTo] = useState('BRL');
  const [expenses, setExpenses] = useState([]);
  const [totalOrigin, setTotalOrigin] = useState(0);
  const [totalDestination, setTotalDestination] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddExpense = async () => {
    const exchangeRate = await getExchangeRate(currencyFrom, currencyTo);
    if (exchangeRate !== null) {
      const amountFloat = parseFloat(amount);
      const quantityFloat = parseFloat(quantity);
      const amountInDestination = amountFloat * exchangeRate;

      const newExpense = {
        description,
        quantity: quantityFloat,
        amount: amountFloat,
        currencyFrom,
        currencyTo,
        amountInDestination
      };

      if (editingIndex !== null) {
        setExpenses(prevExpenses => {
          const updatedExpenses = prevExpenses.map((expense, index) =>
            index === editingIndex ? newExpense : expense
          );

          updateTotals(updatedExpenses);

          return updatedExpenses;
        });
        setEditingIndex(null);
      } else {
        setExpenses(prevExpenses => {
          const updatedExpenses = [...prevExpenses, newExpense];

          updateTotals(updatedExpenses);

          return updatedExpenses;
        });
      }

      setDescription('');
      setQuantity('');
      setAmount('');
      setCurrencyFrom('BRL');
      setCurrencyTo('BRL');
    } else {
      alert('Erro ao buscar taxa de câmbio');
    }
  };

  const handleDeleteExpense = (index) => {
    setExpenses(prevExpenses => {
      const updatedExpenses = prevExpenses.filter((_, i) => i !== index);

      updateTotals(updatedExpenses);

      return updatedExpenses;
    });
  };

  const handleEditExpense = (index) => {
    const expense = expenses[index];
    setDescription(expense.description);
    setQuantity(expense.quantity);
    setAmount(expense.amount);
    setCurrencyFrom(expense.currencyFrom);
    setCurrencyTo(expense.currencyTo);
    setEditingIndex(index);
  };

  const updateTotals = (updatedExpenses) => {
    const updatedTotalOrigin = updatedExpenses.reduce((sum, expense) => sum + expense.amount * expense.quantity, 0);
    const updatedTotalDestination = updatedExpenses.reduce((sum, expense) => sum + expense.amountInDestination * expense.quantity, 0);

    setTotalOrigin(updatedTotalOrigin);
    setTotalDestination(updatedTotalDestination);
  };

  // Função para formatar a exibição de um produto
  const formatProduct = (product) => {
    const { description, quantity, amount, currencyFrom, currencyTo, amountInDestination } = product;
    const formattedAmountOrigin = `${(amount * quantity).toFixed(2)} ${currencyFrom}`;
    const formattedAmountDestiny = `${(amountInDestination * quantity).toFixed(2)} ${currencyTo}`;

    return `${description} (Qtd. ${quantity}): ${formattedAmountOrigin} => ${formattedAmountDestiny}`;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Gestão de Despesas em Viagens</h1>
      <div className="form-group row mt-4">
        <div className="col-md-4">
          <input
            type="text"
            id="expense-description"
            className="form-control"
            placeholder="Descrição do Item"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            id="expense-quantity"
            className="form-control"
            placeholder="Quantidade/Unidade"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            id="expense-amount"
            className="form-control"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            id="currency-from"
            className="form-control"
            value={currencyFrom}
            onChange={(e) => setCurrencyFrom(e.target.value)}
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            id="currency-to"
            className="form-control"
            value={currencyTo}
            onChange={(e) => setCurrencyTo(e.target.value)}
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
      <div className="text-center mt-4">
        <button id="add-expense" className="btn btn-primary" onClick={handleAddExpense}>
          {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
      <ul id="expense-list" className="list-group mt-4">
        {expenses.map((expense, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {formatProduct(expense)}
            <div>
              <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditExpense(index)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteExpense(index)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
      <div id="total" className="mt-4">
        <p>Total (Moeda de Origem): <span id="total-origin">{totalOrigin.toFixed(2)}</span></p>
        <p>Total (Moeda de Destino): <span id="total-destination">{totalDestination.toFixed(2)}</span></p>
      </div>
    </div>
  );
};

export default App;
