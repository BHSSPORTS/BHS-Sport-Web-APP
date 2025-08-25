// BHS Sports Hub Users Database
// Add new users by copying the format below and adding them to the users array

const users = [
  {
    username: "AMM",
    passcode: "4723",
    name: "Aidan",
    surname: "Mullins"
  },
  {
    username: "BAS",
    passcode: "8154",
    name: "Ben",
    surname: "Smith"
  },
  {
    username: "JUN",
    passcode: "5362",
    name: "Joe",
    surname: "Unwin"
  },
  {
    username: "MKB",
    passcode: "2947",
    name: "Madelon",
    surname: "Burnett"
  },
  {
    username: "SLC",
    passcode: "6831",
    name: "Sarah",
    surname: "Clarke"
  },
  {
    username: "AJK",
    passcode: "7592",
    name: "Tony",
    surname: "King"
  },
  {
    username: "JEH",
    passcode: "4826",
    name: "Jonathan",
    surname: "Hinds"
  },
  {
    username: "ADP",
    passcode: "6394",
    name: "Anton",
    surname: "Pretorius"
  },
  {
    username: "TOK",
    passcode: "3918",
    name: "Tomas",
    surname: "O'Kelly"
  },
  {
    username: "TJB",
    passcode: "5741",
    name: "Thomas",
    surname: "Behan"
  },
  {
    username: "BAW",
    passcode: "8275",
    name: "Blanche",
    surname: "Wallace"
  }
];

// Export the users array so it can be imported in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = users;
} else {
  // For browser usage, make it available globally
  window.users = users;
}
