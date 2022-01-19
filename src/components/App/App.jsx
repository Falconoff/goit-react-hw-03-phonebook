import { Component } from 'react';
import { nanoid } from 'nanoid';

import Form from '../Form';
import Contacts from '../Contacts';
import Filter from '../Filter';

import { Container, TitleMain, TitleSecond } from './App.styled';

const LS_KEY = 'contacts';

class App extends Component {
  state = {
    contacts: [
      { id: '111', name: 'Michael Jackson', number: '111-11-11' },
      // { id: '222', name: 'Bob Marley', number: '222-22-22' },
      // { id: '333', name: 'Tina Turner', number: '333-33-33' },
      // { id: '444', name: 'ssv', number: '444-33-33' },
    ],
    filter: '',
  };

  formSubmitHandler = data => {
    // checking name for matches
    const { contacts } = this.state;
    const normalizedName = data.name.toLowerCase();
    const isFoundName = contacts.some(
      contact => contact.name.toLowerCase() === normalizedName,
    );

    if (isFoundName) {
      alert(`${data.name} is already in contacts.`);
      return;
    }

    // add new contact
    const newData = { id: nanoid(5), ...data };
    this.setState(prevState => {
      return {
        contacts: [...prevState.contacts, newData],
      };
    });
  };

  changeFilter = evt => {
    this.setState({ filter: evt.currentTarget.value });
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  // Кол-во записей в Телефонной книге изменилось!!!
  componentDidUpdate(prevProps, prevState) {
    console.log('prevState:', prevState);
    console.log('this.state', this.state);
    if (prevState.contacts.length !== this.state.contacts.length) {
      console.log(
        `Кол-во записей в state Телефонной книги изменилось!!! Было ${prevState.contacts.length}, стало ${this.state.contacts.length}`,
      );
      localStorage.setItem(LS_KEY, JSON.stringify(this.state.contacts));
    }
  }

  // Первый рендер Phonebook
  componentDidMount() {
    console.log('componentDidMount!!!');
    const contacts = localStorage.getItem(LS_KEY);
    const parsedContacts = JSON.parse(contacts);
    // console.log('contacts from localStorage:', contacts);
    console.log('parsed contacts from localStorage:', parsedContacts);

    if (parsedContacts !== null) {
      console.log(
        'number of parsed contacts from localStorage:',
        parsedContacts.length,
      );
    } else {
      console.log('Записей в localStorage нет!!!');
    }

    // если есть в локальном хранилище записи, записываем их в стейт
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  render() {
    // for filter
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );

    return (
      <Container>
        <TitleMain>Phonebook</TitleMain>
        <Form onSubmit={this.formSubmitHandler} />
        <TitleSecond>Contacts</TitleSecond>
        <Filter value={filter} onChange={this.changeFilter} />
        <Contacts arr={filteredContacts} onDelContact={this.deleteContact} />
      </Container>
    );
  }
}

export default App;
