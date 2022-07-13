import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from './lottery';

class App extends React.Component {
  state = { manager: '', players: [], balance: '', value: '' };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);


    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    //update user about state
    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered.' })
  };

  onClick = async () => {

    const accounts = await web3.eth.getAccounts();
    
    this.setState({ message: 'waiting for the lottery to decide' })

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'Winner has been picked' })
  }

  render() {
    //console.log(web3.version);
    return (
      <div>
        <h1>Lottery Contract!</h1>
        <p> manager is: {this.state.manager}</p>
        <p> player's in lottery {this.state.players.length} </p>
        <p>Lottery Amount: {web3.utils.fromWei(this.state.balance, 'ether')} ether! </p>
      
        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Enter the lottery??</h4>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        
        <hr/>

        <h4>Pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr/>

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}
export default App;
